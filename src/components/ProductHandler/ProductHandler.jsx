import { useEffect, useState } from "react";

export const ProductHandler = ({ currentProduct, pricer }) => {

  const [productQuantity, setProductQuantity] = useState(1);

  useEffect(() => {
    setProductQuantity(1)
  }, [currentProduct])
  
  const handleQuantityChange = (operation) => {
      operation === "plus" ?
      setProductQuantity(current => current + 1) :
      operation === "minus" ?
      setProductQuantity(current => current > 1 ? current - 1 : current) :
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
            value={productQuantity}
            onChange={(e) => setProductQuantity(e.target.value)}
            readOnly
            disabled
          />
          <button onClick={() => handleQuantityChange("plus")}>+</button>
        </div>
        <button id="add-button">
          Adicionar
        </button>
      </div>
    </div>
  )
}
