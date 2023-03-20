import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { collection, doc, getDocs, setDoc, updateDoc } from "firebase/firestore";
import '../../App.scss';
import { db } from '../../services/firebase';

export const NewSale = () => {
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

  console.log(watch());

  const [cart, setCart] = useState([
    {
      quantity: 3,
      product: 'Misto',
    },
    {
      quantity: 2,
      product: 'Frango',
    },
    {
      quantity: 1,
      product: 'Salsicha',
    }
  ]);

  // Create sale data
  async function registerSale() {
    const docRef = doc(db, "nova-venda", "01");

    return await setDoc(docRef, {
      block: watch("block"),
      apartment: watch("apartment"),
      payment: watch("payment"),
      status: watch("status"),
    })
    .then(
      console.log("Registered"),
    )
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
                <span>{product.quantity} x </span>
                <span>{product.product}</span>
              </div>
            )
          })
        }
        
        <div className="cart-row">
          <input type="number" />
          <select name="product-type" id="" >
            <option value="" disabled>Produto</option>
            <option value="Misto">Misto</option>
            <option value="Frango">Frango</option>
            <option value="Salsicha">Salsicha</option>
            <option value="Cebola">Pão de Cebola</option>
          </select>
        </div>
      </div>
      <button onClick={() => registerSale()}>Salvar</button>
      {/* <span>*Preço*</span> */}
    </div>
  )
}
