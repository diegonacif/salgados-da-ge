import { getDocs } from "firebase/firestore";
import { useContext, useEffect, useState } from "react"
import { Navigate, Outlet } from "react-router-dom";
import { AuthGoogleContext } from "./contexts/AuthGoogleProvider"
import { UserDataContext } from "./contexts/UserDataProvider";

export const RestrictRoutes = () => {
  
  // ACCESS LEVELS
  // ADMIN = 0
  // CUSTOMER = 1

  const { isSignedIn, isLoading } = useContext(AuthGoogleContext);
  const { userAccess, firestoreLoading } = useContext(UserDataContext);
  
  return (
    isLoading || firestoreLoading ?
    console.log("Loading...") :
    isSignedIn && userAccess === 0 ? <Outlet /> : <Navigate to="/" />
  ) 
}