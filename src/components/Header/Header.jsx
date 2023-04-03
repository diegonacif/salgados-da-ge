import { useContext } from 'react';
import titleMiniGe from '../../assets/salgados-mini-ge.png';
import smoke from '../../assets/smoke.png';
import { AuthGoogleContext } from '../../contexts/AuthGoogleProvider';
import { useWindowSize } from 'usehooks-ts'
import { SignOut } from '@phosphor-icons/react';

import '../../App.scss';

export const Header = () => {
  const { isSignedIn, isLoading, handleGoogleSignOut, user } = useContext(AuthGoogleContext);
  // const { width, height } = useWindowSize();

  return (
    <div className="header-container">
      <div className="title-wrapper">
        <img src={titleMiniGe} alt="Boneca Mini Gê" id="titleMiniGe" />
        <h1>Salgados da Gê</h1>
        {
          isSignedIn && 
          <SignOut 
            size={32} 
            weight="duotone" 
            id="logout-button" 
            onClick={() => handleGoogleSignOut()}
          />
        }
      </div>
      <div className="smoke-wrapper">
        <img className="smoke" src={smoke} alt="smoke" />
      </div>
      <div className="smoke-wrapper">
        <img className="smoke2" src={smoke} alt="smoke" />
      </div>
      <div className="smoke-wrapper">
        <img className="smoke3" src={smoke} alt="smoke" />
      </div>
    </div>
  )
}
