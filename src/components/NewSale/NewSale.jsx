import { useCallback, useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { collection, deleteDoc, doc, getDocs, setDoc, updateDoc } from "firebase/firestore";
import { db } from '../../services/firebase';
import { useNavigate, useBeforeUnload } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { UpdateProductsContext } from '../../contexts/UpdateProductsProvider';

import '../../App.scss';

export const NewSale = () => {
  const date = new Date();
  const navigate = useNavigate();
  const { setUpdateProductId, updateProductId, saleRaw, firestoreLoading, refreshHandler } = useContext(UpdateProductsContext);
  const salesCollectionRef = collection(db, 'vendas');

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

  // Loading products editing
  useEffect(() => {
    if(firestoreLoading === true || updateProductId === '') {
      return;
    } else {
      const sale = saleRaw[0];
      // console.log(saleRaw)
      setValue("block", sale?.block);
      setValue("apartment", sale?.apartment);
      setValue("payment", sale?.payment);
      setValue("status", sale?.status);
      setCart(sale?.cart);
    }
  }, [firestoreLoading, saleRaw])

  // Create sale
  async function registerSale() {
    const uuid = uuidv4();
    const docRef = doc(db, "vendas", uuid);

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
      navigate("/")
    )
  }

  // Update sale
  async function updateSale() {
    const docRef = doc(db, "vendas", updateProductId);

    return await setDoc(docRef, {
      block: watch("block"),
      apartment: watch("apartment"),
      payment: watch("payment"),
      status: watch("status"),
      date: saleRaw[0].date,
      cart: cart,
    })
    .then(
      console.log("New sale successfully registered"),
      refreshHandler(),
      navigate("/")
    )
  }

  // Delete sale
  async function deleteSale() {

    await deleteDoc(doc(salesCollectionRef, updateProductId))
    .then(
      console.log("Sale successfully deleted"),
      refreshHandler(),
      navigate("/")
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
          cart?.map((product, index) => {
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
      {
        updateProductId ?
        <>
          <button onClick={() => updateSale()}>Atualizar</button> 
          <button onClick={() => deleteSale()}>Deletar</button>
        </> :
        <button onClick={() => registerSale()}>Salvar</button>
      }
      {/* <span>*Preço*</span> */}
    </div>
  )
}
