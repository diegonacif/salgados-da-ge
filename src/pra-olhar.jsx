import { collection, doc, getDocs, setDoc, updateDoc } from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import { AuthGoogleContext } from "../../contexts/AuthGoogleProvider";
import { db, storage } from '../../services/firebase';
import { useCollection } from 'react-firebase-hooks/firestore';
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useForm } from 'react-hook-form';
import { Header } from '../../components/Header/Header';

import "../../css/App.css";

export const PraOlhar = () => {
  const usersCollectionRef = collection(db, "users");
  const [users, setUsers] = useState({})
  const [alreadyRegistered, setAlreadyRegistered] = useState(false)
  const [firestoreLoading, setFirestoreLoading] = useState(true);
  const { userId, userPhotoUrl } = useContext(AuthGoogleContext);
  const [refresh, setRefresh] = useState(false);

  const IdsArray = firestoreLoading ? [] : users?.map((user) => user.id)

  const [imageUpload, setImageUpload] = useState(null);
  const [imageUrl, setImageUrl] = useState("");

  // Upload image
  useEffect(() => {
    if (imageUpload == null) return;
    const imageRef = ref(storage, `${userId}/vehiclePicture`);
    uploadBytes(imageRef, imageUpload).then((snapshot) => {
      getDownloadURL(snapshot.ref).then((url) => {
        setImageUrl(url);
      });
    })
  }, [imageUpload])

  // Load image
  useEffect(() => {
    const currentId = IdsArray?.indexOf(userId)
    setImageUrl(users[currentId]?.imgUrl)
  }, [firestoreLoading])

  // Hook Form Controller
  const {
    watch,
    register,
    setValue,
    getValues
  } = useForm({
    mode: "all",
    defaultValues: {
      vehicleSize: "",
    }
  });
  
  // Firestore loading
  const [value, loading, error] = useCollection(usersCollectionRef,
    { snapshotListenOptions: { includeMetadataChanges: true } }
  );
  useEffect(() => {
    setFirestoreLoading(loading);
  }, [loading])

  // Users Data
  useEffect(() => {
    const getUsers = async () => {
      const data = await getDocs(usersCollectionRef);
      setUsers(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    }
    getUsers();
    
  }, [refresh])

   // Already Exists ?
  useEffect(() => {
    if(firestoreLoading) {
      return;
    } else {
      const handleAlreadyExists = () => {
        setAlreadyRegistered(IdsArray.includes(userId))
      }
      handleAlreadyExists();
    }
  }, [IdsArray])

  // Create user data
  async function registerUser() {
    const docRef = doc(db, "users", userId);

    return await setDoc(docRef, {
      displayName: watch("displayName"),
      phone: watch("phoneNumber"),
      size: watch("vehicleSize"),
      isCovered: watch("covered"),
      location: watch("location"),
      additionalInfo: watch("additionalInfo") === undefined ? "" : watch("additionalInfo"),
      profileImgUrl: userPhotoUrl,
      imgUrl: imageUrl ? imageUrl : "" ,
    })
    .then(
      setRefresh((current) => !current),
      console.log("Registered"),
      setTimeout(() => {
        window.location.replace("/")
      }, 600)
    )
  }

  // Update user data
  async function updateUser() {
    const docRef = doc(db, "users", userId);

    return await updateDoc(docRef, {
      displayName: watch("displayName"),
      phone: watch("phoneNumber"),
      size: watch("vehicleSize"),
      isCovered: watch("covered"),
      location: watch("location"),
      additionalInfo: watch("additionalInfo"),
      profileImgUrl: userPhotoUrl,
      imgUrl: imageUrl ? imageUrl : "",
    })
    .then(
      setRefresh((current) => !current),
      console.log("Updated"),
      setTimeout(() => {
        window.location.replace("/")
      }, 600)
    )
  }

  // Get Data from current user
  
  useEffect(() => {
    async function getCurrentData() {
      const currentId = await IdsArray?.indexOf(userId)
      // console.log(users[currentId])
      setValue("displayName", users[currentId]?.displayName)
      setValue("phoneNumber", users[currentId]?.phone)
      setValue("vehicleSize", users[currentId]?.size)
      setValue("covered", users[currentId]?.isCovered)
      setValue("location", users[currentId]?.location)
      setValue("additionalInfo", users[currentId]?.additionalInfo)
    }
    getCurrentData();
  }, [firestoreLoading])

  // Validation
  const [isButtonActive, setIsButtonActive] = useState(false);
  useEffect(() => {
    if (
      watch("displayName") === "" || watch("displayName") === undefined || 
      watch("phoneNumber") === "" || watch("phoneNumber") === undefined || 
      watch("vehicleSize") === "" || watch("vehicleSize") === undefined ||
      watch("covered") === "" ||  watch("covered") === undefined ||
      watch("location") === "" || watch("location") === undefined
    ) {
      setIsButtonActive(false)
    } else {
      setIsButtonActive(true)
    }
  }, [watch()])

  // console.log(watch("additionalInfo"));
  console.log(isButtonActive);


  return (
    <div className="management-container">
      <Header />
      { 
        firestoreLoading ?
        <span>Loading</span> :
        alreadyRegistered ?
        <div className="management-content">
          <h3>Dados do seu anúncio</h3>
          <input 
            type="text" 
            placeholder="nome..." 
            {...register("displayName")}
          />
          <input 
            type="text" 
            placeholder="telefone..." 
            {...register("phoneNumber")}
          />
          {/* <input 
            type="text" 
            placeholder="tamanho do veículo..." 
            {...register("vehicleSize")}
          /> */}
          <select 
            name="vehicleSize" 
            id="vehicleSize"
            {...register("vehicleSize")}
          >
            <option value="" disabled>Selecione</option>
            <option value="Veículo pequeno">Veículo pequeno</option>
            <option value="Veículo médio">Veículo médio</option>
            <option value="Veículo grande">Veículo grande</option>
          </select>
          {/* <input 
            type="text" 
            placeholder="coberto..." 
            {...register("covered")}
          /> */}
          <select 
            name="covered" 
            id="covered"
            {...register("covered")}
          >
            <option value="" disabled>Selecione</option>
            <option value="Não coberto">Não coberto</option>
            <option value="Coberto">Coberto</option>
          </select>
          <input 
            type="text" 
            placeholder="cidade / estado..." 
            {...register("location")}
          />
          <textarea 
            placeholder="informações adicionais..." 
            {...register("additionalInfo")}
          />

          <div className="image-input-wrapper">
            <input
              type="file"
              onChange={(event) => {
                setImageUpload(event.target.files[0]);
              }}
            />
            {/* <button onClick={uploadFile}>Enviar</button> */}
          </div>
          <img src={imageUrl} alt="" />
          
          {/* <button onClick={() => updateUser()}>Feito</button> */}
          <button 
            onClick={() => updateUser()}
            disabled={isButtonActive ? "" : "disabled"}
          >
            Feito
          </button>
        </div> :
        <div className="management-content">
          <input 
            type="text" 
            placeholder="Nome..." 
            {...register("displayName")}
          />
          <input 
            type="text" 
            placeholder="Telefone..." 
            {...register("phoneNumber")}
          />
          <select 
            name="vehicleSize" 
            id="vehicleSize"
            {...register("vehicleSize")}
            className={ watch("vehicleSize") === "" || watch("vehicleSize") === undefined ? "blank-select" : "black-select" }
          >
            <option value="" disabled>Tamanho do veículo...</option>
            <option value="Veículo pequeno">Veículo pequeno</option>
            <option value="Veículo médio">Veículo médio</option>
            <option value="Veículo grande">Veículo grande</option>
          </select>
          <select 
            name="covered" 
            id="covered"
            {...register("covered")}
            className={ watch("covered") === "" || watch("covered") === undefined ? "blank-select" : "black-select" }
          >
            <option value="" disabled>Cobertura...</option>
            <option value="Não coberto">Não coberto</option>
            <option value="Coberto">Coberto</option>
          </select>
          <input 
            type="text" 
            placeholder="Cidade / estado..." 
            {...register("location")}
          />
          <textarea 
            placeholder="informações adicionais..." 
            {...register("additionalInfo")}
          />

          <div className="image-input-wrapper">
            <input
              type="file"
              onChange={(event) => {
                setImageUpload(event.target.files[0]);
              }}
            />
            {/* <button onClick={uploadFile}>Enviar</button> */}
          </div>
          <img src={imageUrl} alt="" />
          
          <button 
            onClick={() => registerUser()}
            disabled={isButtonActive ? "" : "disabled"}
          >
            Feito
          </button>
        </div>
      }
    </div>
  )
}