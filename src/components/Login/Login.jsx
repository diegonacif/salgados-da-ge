import { Header } from '../Header/Header';
import { AiFillGoogleCircle } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';
import { AuthGoogleContext } from '../../contexts/AuthGoogleProvider';
import { useContext, useEffect } from 'react';
import '../../App.scss';

export const Login = () => {
  const { 
    handleGoogleSignIn, 
    handleGoogleSignOut, 
    isSignedIn,
    signed, 
    user 
  } = useContext(AuthGoogleContext);

  const navigate = useNavigate();

  // console.log(user);

  // Back to main page when logged in
  useEffect(() => {
    isSignedIn ? navigate("/management") : null;
  }, [isSignedIn])

  async function loginGoogle() {
    await handleGoogleSignIn();
  }

  async function logoutGoogle() {
    await handleGoogleSignOut();
  }

  return (
    <>
      <Header />
      <div className="login-container">
        <div id="background-image"></div>
        <div id="white-mirror"></div>
        <div className="login-wrapper">
          <h4>Faça login com sua conta Google</h4>
          <button onClick={() => loginGoogle()}>
            <AiFillGoogleCircle size={"24px"}/>
            <span>Continuar com Google</span>
          </button>
        </div>
      </div>
    </>
  )
}
