import { collection, getDocs } from 'firebase/firestore';
import React, { createContext, useContext, useEffect, useState } from 'react'
import { db } from '../services/firebase';

export const UserDataContext = createContext();

export const UserDataProvider = ({ children }) => {
  const usersCollectionRef = collection(db, "users");
  const [users, setUsers] = useState({})
  const [alreadyRegistered, setAlreadyRegistered] = useState(false)

  // Users Data
  useEffect(() => {
    const getUsers = async () => {
      const data = await getDocs(usersCollectionRef);
      setUsers(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    }
    getUsers();
  }, [])

  return (
    <UserDataContext.Provider value={{
      alreadyRegistered, setAlreadyRegistered,
      users, setUsers
    }}>
      {children}
    </UserDataContext.Provider>
  )
}
