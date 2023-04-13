import { collection, getDocs } from 'firebase/firestore';
import React, { createContext, useContext, useEffect, useState } from 'react'
import { useCollection } from 'react-firebase-hooks/firestore';
import { db } from '../services/firebase';
import { AuthGoogleContext } from './AuthGoogleProvider';

export const UserDataContext = createContext();

export const UserDataProvider = ({ children }) => {
  const usersCollectionRef = collection(db, "users");
  const [firestoreLoading, setFirestoreLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [currentUserData, setCurrentUserData] = useState([]);
  const [alreadyRegistered, setAlreadyRegistered] = useState(false);
  const [userAccess, setUserAccess] = useState(1);

  const { userId, userPhotoUrl } = useContext(AuthGoogleContext);

  // console.log(users?.filter(user => user.id === userId));

   // Firestore loading
  const [value, loading, error] = useCollection(usersCollectionRef,
    { snapshotListenOptions: { includeMetadataChanges: true } }
  );
  useEffect(() => {
    setFirestoreLoading(loading);
  }, [loading])

  // Current User Data
  useEffect(() => {
    setCurrentUserData(users?.filter(user => user.id === userId))
  }, [users, firestoreLoading, loading])

  // User Access
  useEffect(() => {
    setUserAccess(currentUserData[0]?.access);
  }, [users, firestoreLoading, loading])

  const IdsArray = firestoreLoading ? null : users?.map(user => user.id)

 

  useEffect(() => {
    if(firestoreLoading) {
      return;
    } else {
      const handleAlreadyExists = () => {
        setAlreadyRegistered(IdsArray?.includes(userId))
      }
      handleAlreadyExists();
    }
  }, [IdsArray, firestoreLoading])

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
      users, setUsers,
      firestoreLoading,
      usersCollectionRef,
      userAccess,
      currentUserData
    }}>
      {children}
    </UserDataContext.Provider>
  )
}
