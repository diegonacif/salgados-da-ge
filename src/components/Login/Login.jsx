import { useEffect } from 'react';
import { Header } from '../Header/Header';
import { AiFillGoogleCircle } from 'react-icons/ai';
import bgVideo from "../../assets/making-bread.mp4";
import '../../App.scss';

export const Login = () => {

  return (
    <>
      <Header />
      <div className="login-container">
        <div id="background-image"></div>
        <div id="white-mirror"></div>
        <div className="login-wrapper">
          <h4>Faça login com sua conta Google</h4>
          <button>
            <AiFillGoogleCircle size={"24px"}/>
            <span>Continuar com Google</span>
          </button>
        </div>
      </div>
    </>
  )
}
