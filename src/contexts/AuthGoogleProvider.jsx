import { createContext, useEffect, useState } from "react";
import { GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, getAuth } from 'firebase/auth'
import { auth, db } from '../services/firebase';
import { collection, getDocs, setDoc, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { UserDataContext } from "./UserDataProvider";

const provider = new GoogleAuthProvider();

export const AuthGoogleContext = createContext({});

export const AuthGoogleProvider = ({ children }) => {
  const [user, setUser] = useState({});
  const [users, setUsers] = useState({});
  const [userId, setUserId] = useState("");
  const [userPhotoUrl, setUserPhotoUrl] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  const [isSignedIn, setIsSignedIn] = useState(false);

  const usersCollectionRef = collection(db, "users");
  
  const [userState, loading, error] = useAuthState(auth);

  onAuthStateChanged(auth, (currentUser) => {
    if (loading) {
      console.log("loading user state")
      setIsLoading(true);
    } else {
      setUser(currentUser);
      setIsSignedIn(!!currentUser);
      setUserId(userState?.uid)
      setIsLoading(false);
    }
  })

  // useEffect(() => {
  //   const loadStoreAuth = () => {
  //     const sessionToken = sessionStorage.getItem("@AuthFirebase:token")
  //     const sessionUser = sessionStorage.getItem("@AuthFirebase:user")

  //     if (sessionToken && sessionUser) {
  //       setUser(sessionUser);
  //     }
  //   };
  //   loadStoreAuth();
  // })
  
  async function handleGoogleSignIn() {

    await signInWithPopup(auth, provider)
    .then((result) => {
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      const user = result.user;
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      const email = error.email;
      const credential = GoogleAuthProvider.credentialFromError(error);
    });
  }

  function handleGoogleSignOut() {
    sessionStorage.clear();
    signOut(auth).then(() => console.log("sign out sucessfully"));
  }

  // Current user created on database
  

  // Current user Photo URL
  useEffect(() => {
    setUserPhotoUrl(user?.photoURL);
  }, [user])

  return (
    <AuthGoogleContext.Provider value={{ 
      handleGoogleSignIn, 
      handleGoogleSignOut,
      isLoading,
      isSignedIn,
      userId,
      signed: !!user, 
      user,
      userPhotoUrl
    }}>
      {children}
    </AuthGoogleContext.Provider>
  )
}