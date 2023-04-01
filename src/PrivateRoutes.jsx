import { useContext } from "react"
import { Navigate, Outlet } from "react-router-dom";
import { AuthGoogleContext } from "./contexts/AuthGoogleProvider"

export const PrivateRoutes = () => {
  const { isSignedIn, isLoading } = useContext(AuthGoogleContext);
  
  return isLoading ?
  console.log("Loading Auth Data...") :
  isSignedIn ? <Outlet /> : <Navigate to="/" />;
}