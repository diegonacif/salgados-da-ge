import { useContext } from 'react';
import { SalesContext } from '../../contexts/SalesProvider';
import { MapPin, MinusCircle, Money } from '@phosphor-icons/react';
import { UserDataContext } from '../../contexts/UserDataProvider';
import '../../App.scss';

export const CustomerCart = ({ setIsCartOpen }) => {
  const {
    cart,
    price,
    handleDeleteCartProduct,
    registerSale,
    newSalePayment, setNewSalePayment,
  } = useContext(SalesContext);

  const {
    alreadyRegistered, setAlreadyRegistered,
    users, setUsers
  } = useContext(UserDataContext);

  const handleRegisterSale = () => {
    registerSale("customerMode");
    setTimeout(() => {
      setIsCartOpen(false)
    }, 50);
  }

  // console.log(alreadyRegistered);

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
      <div className="cart-total-row">
        <span>Total</span>
        <span>R$ {price},00</span>
      </div>
      <button onClick={() => handleRegisterSale()}>Finalizar pedido</button>
    </div>
  )
}
