import React, { useContext, useEffect, useState } from 'react'
import { collection, doc, getDocs, setDoc } from 'firebase/firestore';
import { useCollection } from 'react-firebase-hooks/firestore';
import { AuthGoogleContext } from '../../contexts/AuthGoogleProvider';
import { db } from '../../services/firebase';
import { useForm } from 'react-hook-form';
import { Header } from '../Header/Header';

export const UserData = () => {
  const usersCollectionRef = collection(db, "users");
  const [users, setUsers] = useState({})
  const [alreadyRegistered, setAlreadyRegistered] = useState(false)
  const [firestoreLoading, setFirestoreLoading] = useState(true);
  const { userId, userPhotoUrl } = useContext(AuthGoogleContext);
  const [refresh, setRefresh] = useState(false);

  const IdsArray = firestoreLoading ? [] : users?.map((user) => user.id)

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
      name: watch("userName"),
      phone: watch("userPhone"),
      block: watch("userBlock"),
      apartment: watch("userApartment"),
    })
    .then(
      setRefresh((current) => !current),
      console.log("Registered"),
      setTimeout(() => {
        window.location.replace("/")
      }, 600)
    )
  }

  return (
    <>
      <Header />
      <div className="user-data-container">
        <div className="input-row">
          <label htmlFor="name">Nome</label>
          <input type="text" name="name" {...register("userName")}/>
        </div>
        <div className="input-row">
          <label htmlFor="phone">Telefone</label>
          <input type="text" name="phone" {...register("userPhone")}/>
        </div>
        <div className="input-row">
          <label htmlFor="block">Bloco</label>
          <input type="text" name="block" {...register("userBlock")}/>
        </div>
        <div className="input-row">
          <label htmlFor="apartment">Apartamento</label>
          <input type="text" name="apartment" {...register("userApartment")}/>
        </div>
        <div className="button-wrapper">

          <button onClick={() => registerUser()} className="register-button">Tudo pronto!</button>
        </div>
      </div>
    </>
  )
}
