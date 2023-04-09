import { useContext } from 'react';
import titleMiniGe from '../../assets/salgados-mini-ge.png';
import smoke from '../../assets/smoke.png';
import { AuthGoogleContext } from '../../contexts/AuthGoogleProvider';
import { useWindowSize } from 'usehooks-ts'
import { ShoppingCart, SignOut } from '@phosphor-icons/react';

import '../../App.scss';
import { SalesContext } from '../../contexts/SalesProvider';

export const Header = ({currentPage, setIsCartOpen}) => {
  const { isSignedIn, isLoading, handleGoogleSignOut, user } = useContext(AuthGoogleContext);
  const {
    cart,
  } = useContext(SalesContext);

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
      {
        currentPage === "menu" &&
        <div 
          className={cart?.length !== 0 ? "cart-button-show" : "cart-button-hide"} 
          id="cart-button"
        >
          <div id="cart-counter">
            {
              cart?.length !== 0 &&
              <span>{cart?.length}</span>
            }
          </div>
          <ShoppingCart 
            size={36} 
            weight="duotone" 
            onClick={() => setIsCartOpen(true)}
          />
        </div>
      }
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
