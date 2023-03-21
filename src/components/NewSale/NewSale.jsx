import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { collection, doc, getDocs, setDoc, updateDoc } from "firebase/firestore";
import '../../App.scss';
import { db } from '../../services/firebase';

export const NewSale = () => {
  const date = new Date();

  // Hook Form Controller
  const {
    watch,
    register,
    setValue,
    getValues
  } = useForm({
    mode: "all",
    defaultValues: {
      payment: "",
    }
  });

  const [cart, setCart] = useState([]);

  // Create sale data
  async function registerSale() {
    const docRef = doc(db, "vendas", "01");

    return await setDoc(docRef, {
      block: watch("block"),
      apartment: watch("apartment"),
      payment: watch("payment"),
      status: watch("status"),
      date: date,
      cart: cart,
    })
    .then(
      console.log("New sale successfully registered"),
    )
  }

  // Add product to cart
  function handleNewCartProduct() {
    setCart(current => [...current, {quantity: Number(watch("cart-quantity")), product: watch("cart-product")}])
  }

  return (
    <div className="new-sale-container">
      <div className="main-info">
        <input type="text" id="block" placeholder="Bloco" {...register("block")} />
        <input type="text" placeholder="Apartamento" {...register("apartment")} />
        <select name="payment" id="payment" {...register("payment")}>
          <option value="" disabled>Forma de pagamento...</option>
          <option value="Dinheiro">Dinheiro</option>
          <option value="Pix">Pix</option>
          <option value="Cartão">Cartão</option>
        </select>
        <select name="status" id="status" {...register("status")}>
          <option value="Novo Pedido">Novo Pedido</option>
          <option value="Saindo">Saindo</option>
          <option value="Novo Pedido">Entregue</option>
        </select>
        <span>*Data*</span>
      </div>
      <div className="cart-wrapper">
        {
          cart.map((product, index) => {
            return (
              <div className="cart-row" key={index}>
                <span>{product.quantity} x</span>
                <span>&nbsp;{product.product}</span>
              </div>
            )
          })
        }
        
        <div className="cart-row">
          <input type="number" defaultValue={1} {...register("cart-quantity")} />
          <select name="product-type" id="" {...register("cart-product")} >
            <option value="" disabled>Produto</option>
            <option value="Misto">Misto</option>
            <option value="Frango">Frango</option>
            <option value="Salsicha">Salsicha</option>
            <option value="Cebola">Pão de Cebola</option>
          </select>
          <button onClick={() => handleNewCartProduct()}>+</button>
        </div>
      </div>
      <button onClick={() => registerSale()}>Salvar</button>
      {/* <span>*Preço*</span> */}
    </div>
  )
}
