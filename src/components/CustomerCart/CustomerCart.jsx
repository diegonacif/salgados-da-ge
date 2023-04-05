import React from 'react'
import '../../App.scss';

export const CustomerCart = () => {
  return (
    <div className="customer-cart-container">
      <h5 id="customer-cart-title">Seu pedido</h5>
      <div className="cart-section">
        <span>1x jujuba de baunilha</span>
        <span>3x maços de malboro</span>
        <span>10x garrafas de cana</span>
        <span>1x jujuba de baunilha</span>
        <span>3x maços de malboro</span>
        <span>10x garrafas de cana</span>
        <span>1x jujuba de baunilha</span>
        <span>3x maços de malboro</span>
        <span>10x garrafas de cana</span>
        <span>1x jujuba de baunilha</span>
        <span>3x maços de malboro</span>
        <span>10x garrafas de cana</span>
        <span>1x jujuba de baunilha</span>
        {/* <span>1x jujuba de baunilha</span>
        <span>3x maços de malboro</span>
        <span>10x garrafas de cana</span>
        <span>1x jujuba de baunilha</span>
        <span>3x maços de malboro</span>
        <span>10x garrafas de cana</span>
        <span>1x jujuba de baunilha</span>
        <span>3x maços de malboro</span>
        <span>10x garrafas de cana</span>
        <span>1x jujuba de baunilha</span> */}
        
      </div>
      <div className="cart-total-row">
        <span>Total</span>
        <span>R$ 353,69</span>
      </div>
      <button>Finalizar pedido</button>
    </div>
  )
}
