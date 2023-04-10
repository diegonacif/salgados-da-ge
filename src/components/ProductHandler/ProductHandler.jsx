import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthGoogleContext } from "../../contexts/AuthGoogleProvider";
import { SalesContext } from "../../contexts/SalesProvider";
import { UserDataContext } from "../../contexts/UserDataProvider";

export const ProductHandler = ({ currentProduct, pricer, setIsDishHandlerOpen }) => {

  const {
    newSaleCartQuantity, setNewSaleCartQuantity,
    newSaleCartProduct, setNewSaleCartProduct,
    handleNewCartProduct
  } = useContext(SalesContext);

  const {
    alreadyRegistered, setAlreadyRegistered,
    users, setUsers
  } = useContext(UserDataContext);

  const {
    isSignedIn
  } = useContext(AuthGoogleContext);

  const navigate = useNavigate();

  useEffect(() => {
    setNewSaleCartQuantity(1);
    setNewSaleCartProduct(currentProduct?.label);
  }, [currentProduct])
  
  const handleQuantityChange = (operation) => {
      operation === "plus" ?
      setNewSaleCartQuantity(current => current + 1) :
      operation === "minus" ?
      setNewSaleCartQuantity(current => current > 1 ? current - 1 : current) :
      null;
  }

  const promotionNotice = () => {
    if(currentProduct?.type === 'assado') {
      return 'Comprando 3 unidades, pague apenas 10 reais!';
    } else if (currentProduct?.type === 'frito') {
      return 'Comprando 2 unidades, pague apenas 5 reais!';
    } else if (currentProduct?.type === 'pao') {
      return null;
    }
  };

  const handleAddCartProduct = () => {
    if(!isSignedIn) {
      navigate("/login");
    } else if (!alreadyRegistered) {
      navigate("/user-data");
    } else {
      handleNewCartProduct();
      setTimeout(() => {
        setIsDishHandlerOpen(false);
      }, 50);
    }
  }

  return (
    <div className="product-handler-container">
      <div className="product-image" id={`${currentProduct?.id}`}></div>
      <h4>{currentProduct?.label}</h4>
      <p>{currentProduct?.description}</p>
      <span id="unitary-price">{`R$ ${pricer(currentProduct?.type)}`}</span>
      <span id="promotion-notice">{promotionNotice()}</span>
      <div className="add-row">
        <div className="input-wrapper">
          <button onClick={() => handleQuantityChange("minus")}>-</button>
          <input 
            type="number" 
            value={newSaleCartQuantity}
            readOnly
            disabled
          />
          <button onClick={() => handleQuantityChange("plus")}>+</button>
        </div>
        <button 
          id="add-button"
          onClick={() => handleAddCartProduct(currentProduct?.label)}
        >
          Adicionar
        </button>
      </div>
    </div>
  )
}
