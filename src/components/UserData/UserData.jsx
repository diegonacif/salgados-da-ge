import React, { useContext, useEffect, useState } from 'react'
import { collection, doc, getDocs, setDoc } from 'firebase/firestore';
import { useCollection } from 'react-firebase-hooks/firestore';
import { AuthGoogleContext } from '../../contexts/AuthGoogleProvider';
import { db } from '../../services/firebase';
import { useForm } from 'react-hook-form';
import { Header } from '../Header/Header';
import { UserDataContext } from '../../contexts/UserDataProvider';
import { ToastifyContext } from '../../contexts/ToastifyProvider';
import { ArrowCircleLeft } from '@phosphor-icons/react';
import { useNavigate } from 'react-router-dom';

export const UserData = () => {
  const usersCollectionRef = collection(db, "users");
  const { userId, userPhotoUrl } = useContext(AuthGoogleContext);
  const { notifySuccess, notifyError } = useContext(ToastifyContext); // Toastify Context
  const {
    alreadyRegistered, setAlreadyRegistered,
    users, setUsers,
    firestoreLoading,
    // userAccess,
    // currentUserData
  } = useContext(UserDataContext);
  const [refresh, setRefresh] = useState(false);

  const navigate = useNavigate();

  const [currentUserData, setCurrentUserData] = useState([]);
  const [userAccess, setUserAccess] = useState(1);

  console.log(userAccess);

  // Current User Data
  useEffect(() => {
    setCurrentUserData(users?.filter(user => user.id === userId))
  }, [users, firestoreLoading])

  // User Access
  useEffect(() => {
    setUserAccess(currentUserData[0]?.access);
  }, [users, firestoreLoading, currentUserData])

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

  // console.log(userAccess);

  // Loading data if already exists 
  useEffect(() => {
    if(alreadyRegistered === true) {
      return (
        setValue("userName", currentUserData[0]?.name),
        setValue("userPhone", currentUserData[0]?.phone),
        setValue("userBlock", currentUserData[0]?.block),
        setValue("userApartment", currentUserData[0]?.apartment)
      )
    } else {
      return console.log("não está registrado")
    }
  }, [firestoreLoading, alreadyRegistered, currentUserData, users, userAccess])

  // Create user data
  async function registerUser() {
    const docRef = doc(db, "users", userId);

    return await setDoc(docRef, {
      name: watch("userName"),
      phone: watch("userPhone"),
      block: watch("userBlock"),
      apartment: watch("userApartment"),
      access: userAccess === 0 || userAccess === 1 ? userAccess : 1,
    })
    .then(
      setRefresh((current) => !current),
      console.log("Registered"),
      setTimeout(() => {
        window.location.replace("/")
      }, 600)
    )
  }

  // Inputs validation
  const [isButtonActive, setIsButtonActive] = useState(false);
  useEffect(() => {
    if(watch("userName")?.length < 4 || 
    watch("userPhone")?.length < 9 || 
    watch("userBlock")?.length < 2 || 
    watch("userApartment")?.length < 3) {
      setIsButtonActive(false);
    } else {
      setIsButtonActive(true);
    }
  }, [watch("userName"), watch("userPhone"), watch("userBlock"), watch("userApartment"), users])

  return (
    <>
      <Header />
      <div className="user-data-container">
        <div className="back-button-wrapper">
          <ArrowCircleLeft 
            size={34} 
            weight="duotone" 
            id="go-back-button" 
            onClick={() => navigate("/")}
          />
        </div>
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

          <button 
            className={`register-button ${!isButtonActive && 'disabled-button'}`}
            onClick={() => 
              !isButtonActive ?
              notifyError("Preencha os dados") :
              registerUser()
            } 
          >
            Tudo pronto!
          </button>
        </div>
      </div>
    </>
  )
}
