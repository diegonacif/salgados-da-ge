import { useContext } from 'react';
import titleMiniGe from '../../assets/salgados-mini-ge.png';
import smoke from '../../assets/smoke.png';
import { AuthGoogleContext } from '../../contexts/AuthGoogleProvider';
import { useWindowSize } from 'usehooks-ts'
import { House, IdentificationCard, ShoppingCart, SignOut, User } from '@phosphor-icons/react';

import '../../App.scss';
import { SalesContext } from '../../contexts/SalesProvider';
import { useLocation, useNavigate } from 'react-router-dom';
import { UserDataContext } from '../../contexts/UserDataProvider';
import { UpdateProductsContext } from '../../contexts/UpdateProductsProvider';

export const Header = ({currentPage, setIsCartOpen}) => {
  const { isSignedIn, isLoading, handleGoogleSignOut, user } = useContext(AuthGoogleContext);
  const {
    cart, setCart
  } = useContext(SalesContext);

  const { setAlreadyRegistered } = useContext(UserDataContext);

  const navigate = useNavigate();
  const windowSize = useWindowSize();
  const { pathname } = useLocation();

  const logOut = () => {
    return (
      setAlreadyRegistered(false),
      setCart([]),
      handleGoogleSignOut()
    )
  }

  // Clear UpdateProductId on rendering
  const { setUpdateProductId, refreshHandler } = useContext(UpdateProductsContext)
  const toHomeLink = () => {
    setUpdateProductId("");
    setCart([]);
    navigate("/");
  }
  
  return (
    <div className="header-container">

      <div className="title-wrapper">
        <img src={titleMiniGe} alt="Boneca Mini Gê" id="titleMiniGe" />
        <h1 onClick={() => toHomeLink()}>Salgados da Gê</h1>
        {
          pathname === "/user-data" ?
            isSignedIn ?
            <SignOut 
              size={windowSize.width > 450 ? 32 : 28} 
              weight="duotone" 
              id="logout-button" 
              onClick={() => logOut()}
            /> :
            <User 
              size={windowSize.width > 450 ? 32 : 28} 
              weight="duotone" 
              id="logout-button" 
              onClick={() => navigate("/login")}
            /> :
          null
        }
        {
          pathname === "/login" ?
          <House 
            size={32} 
            weight="duotone" 
            id="logout-button"
            onClick={() => navigate("/")}
          /> :
          null
        }
        {
          pathname === "/" ?
            isSignedIn ?
            <IdentificationCard 
              size={windowSize.width > 450 ? 32 : 28} 
              weight="duotone" 
              id="logout-button" 
              onClick={() => navigate("/user-data")}
            /> :
            <User 
              size={windowSize.width > 450 ? 32 : 28} 
              weight="duotone" 
              id="logout-button" 
              onClick={() => navigate("/login")}
            /> :
          null
        }
      </div>
      {
        pathname === "/" &&
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
