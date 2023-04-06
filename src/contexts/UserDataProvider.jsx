import { collection, getDocs } from 'firebase/firestore';
import React, { createContext, useContext, useEffect, useState } from 'react'

export const UserDataContext = createContext();

export const UserDataProvider = ({ children }) => {
  const [users, setUsers] = useState({})
  const [alreadyRegistered, setAlreadyRegistered] = useState(false)

  return (
    <UserDataContext.Provider value={{
      alreadyRegistered, setAlreadyRegistered,
      users, setUsers
    }}>
      {children}
    </UserDataContext.Provider>
  )
}
