import { useContext } from 'react';
import { SalesContext } from '../../contexts/SalesProvider';
import { MinusCircle } from '@phosphor-icons/react';
import '../../App.scss';

export const CustomerCart = () => {
  const {
    cart,
    price,
    handleDeleteCartProduct
  } = useContext(SalesContext);

  // console.log(cart);

  return (
    <div className="customer-cart-container">
      <h5 id="customer-cart-title">Seu pedido</h5>
      <div className="cart-section">
        { 
          cart.length === 0 ?
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
      <div className="cart-total-row">
        <span>Total</span>
        <span>R$ {price},00</span>
      </div>
      <button>Finalizar pedido</button>
    </div>
  )
}
