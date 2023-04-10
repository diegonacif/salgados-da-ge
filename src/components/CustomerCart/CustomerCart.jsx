import { useContext, useEffect, useState } from 'react';
import { SalesContext } from '../../contexts/SalesProvider';
import { Article, MapPin, MinusCircle, Money } from '@phosphor-icons/react';
import { UserDataContext } from '../../contexts/UserDataProvider';
import '../../App.scss';
import { ToastifyContext } from '../../contexts/ToastifyProvider';

export const CustomerCart = ({ setIsCartOpen }) => {
  const {
    cart,
    price,
    handleDeleteCartProduct,
    registerSale,
    newSalePayment, setNewSalePayment,
    newSaleObs, setNewSaleObs,
  } = useContext(SalesContext);

  console.log(newSaleObs);

  const {
    alreadyRegistered, setAlreadyRegistered,
    users, setUsers
  } = useContext(UserDataContext);

  const { notifySuccess, notifyError } = useContext(ToastifyContext); // Toastify Context

  const handleRegisterSale = () => {
    registerSale("customerMode");
    setTimeout(() => {
      setIsCartOpen(false)
    }, 50);
  }

  // Inputs validation
  const [isButtonActive, setIsButtonActive] = useState(false);
  useEffect(() => {
    if(cart.length === 0 || newSalePayment === "") {
      setIsButtonActive(false);
    } else {
      setIsButtonActive(true);
    }
  }, [cart, newSalePayment]);

  // console.log({
  //   cart: cart.length,
  //   newSalePayment: newSalePayment,
  // });

  return (
    <div className="customer-cart-container">
      <h5 id="customer-cart-title">Seu pedido</h5>
      <div className="address-wrapper">
        <div className="address-row">
          <MapPin size={24} weight="duotone" />
          <h4>Entregar em:</h4>
        </div>
        <span>Bloco: {users[0]?.block}</span>
        <span>Apartamento: {users[0]?.apartment}</span>
      </div>
      <div className="cart-section">
        { 
          cart?.length === 0 ?
          <>
          <span>Seu carrinho está vazio! =/</span>
          </> :
          cart?.map((product, index) => {
            return (
              <div className="cart-row cart-product" key={index}>
                <span>{product.quantity} x</span>
                <span>&nbsp;{product.product === "Cebola" && "Pão de "}{product.product}</span>
                <MinusCircle size={28} weight="fill" onClick={() => handleDeleteCartProduct(product, index)} className="cart-delete-button" />
              </div>
            )
          })
        }
      </div>
      <div className="payment-wrapper">
        <Money size={24} weight="duotone" />
        <label htmlFor="block">Forma de pagamento:</label>
        <select 
          name="payment" 
          id="payment" 
          value={newSalePayment} 
          onChange={(e) => setNewSalePayment(e.target.value)}
        >
          <option value="" disabled>Selecione...</option>
          <option value="Dinheiro">Dinheiro</option>
          <option value="Pix">Pix</option>
          <option value="Cartão">Cartão</option>
        </select>
      </div>
      <div className="obs-wrapper">
        <Article size={24} weight="duotone" />
        <label id="obs-label" htmlFor="obs">Observações:</label>
        <textarea 
          name="obs" 
          id="obs" 
          rows="2" 
          placeholder="Opcional"
          value={newSaleObs}
          onChange={(e) => setNewSaleObs(e.target.value)}
        ></textarea>
      </div>
      <div className="cart-total-row">
        <span>Total</span>
        <span>R$ {price},00</span>
      </div>
      <button 
        className={`register-button ${!isButtonActive && 'disabled-button'}`}
        onClick={() => 
          !isButtonActive ?
          notifyError("Carrinho vazio ou forma de pagamento pendente") :
          handleRegisterSale()
        }
      >
        Finalizar pedido
      </button>
    </div>
  )
}
