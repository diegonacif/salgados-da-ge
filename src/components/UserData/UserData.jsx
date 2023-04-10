import React, { useContext, useEffect, useState } from 'react'
import { collection, doc, getDocs, setDoc } from 'firebase/firestore';
import { useCollection } from 'react-firebase-hooks/firestore';
import { AuthGoogleContext } from '../../contexts/AuthGoogleProvider';
import { db } from '../../services/firebase';
import { useForm } from 'react-hook-form';
import { Header } from '../Header/Header';
import { UserDataContext } from '../../contexts/UserDataProvider';

export const UserData = () => {
  const usersCollectionRef = collection(db, "users");
  const { userId, userPhotoUrl } = useContext(AuthGoogleContext);
  const {
    alreadyRegistered, setAlreadyRegistered,
    users, setUsers,
    firestoreLoading
  } = useContext(UserDataContext);
  const [refresh, setRefresh] = useState(false);

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

  // Loading data if already exists 
  useEffect(() => {
    if(alreadyRegistered === true) {
      return (
        setValue("userName", users[0]?.name),
        setValue("userPhone", users[0]?.phone),
        setValue("userBlock", users[0]?.block),
        setValue("userApartment", users[0]?.apartment)
      )
    } else {
      return console.log("não está registrado")
    }
  }, [firestoreLoading, alreadyRegistered, users])

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
        {
          alreadyRegistered ?
          <h4 id="confirm-data">Confirme seus dados</h4> :
          <h4 id="confirm-data">Insira seus dados</h4>
        }
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
