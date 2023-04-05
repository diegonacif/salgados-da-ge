
export const ProductHandler = ({ currentProduct, pricer }) => {

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
          <button>-</button>
          <input type="number" />
          <button>+</button>
        </div>
        <button id="add-button">
          Adicionar
        </button>
      </div>
    </div>
  )
}
