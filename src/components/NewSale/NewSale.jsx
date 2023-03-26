import { useCallback, useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { collection, deleteDoc, doc, getDocs, setDoc, updateDoc } from "firebase/firestore";
import { db } from '../../services/firebase';
import { useNavigate, useBeforeUnload } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { UpdateProductsContext } from '../../contexts/UpdateProductsProvider';
import { Header } from '../Header/Header';
import TextField from '@mui/material/TextField';
import CssBaseline from '@mui/material/CssBaseline';

import '../../App.scss';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';

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
  // console.log(cart);

  // Handling Price
  const [price, setPrice] = useState(0);

  useEffect(() => {
    const arrAssado = cart?.filter((data) => (data.type === 'assado'));
    const arrFrito = cart?.filter((data) => (data.type === 'frito'));
    const arrPao = cart?.filter((data) => (data.type === 'pao'));

    const assadoSum = arrAssado?.map((data) => data.quantity).reduce((a, b) => a + b, 0);
    const fritoSum = arrFrito?.map((data) => data.quantity).reduce((a, b) => a + b, 0);
    const paoSum = arrPao?.map((data) => data.quantity).reduce((a, b) => a + b, 0);

    const assadoPrice = ((assadoSum % 3) * 4) + ((((assadoSum - (assadoSum % 3)) / 3) * 10))
    const fritoPrice = ((fritoSum % 2) * 3) + ((((fritoSum - (fritoSum % 2)) / 2) * 5))
    const paoPrice = paoSum * 1

    // console.log(fritoPrice);

    setPrice(
      assadoPrice + paoPrice + fritoPrice
    )

  }, [watch("cart-product"), cart])

  // Handling Type
  const [type, setType] = useState('');
  useEffect(() => {
    if(['Misto', 'Frango', 'Salsicha'].includes(watch("cart-product"))) {
      setType('assado');
    } else if(['Enroladinho', 'Coxinha', 'Torta'].includes(watch("cart-product"))) {
      setType('frito');
    } else if(['Cebola'].includes(watch("cart-product"))) {
      setType('pao');
    } else (
      null
    )
  }, [watch("cart-product")])

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
      price: price
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
      price: price
    })
    .then(
      console.log("Sale successfully updated"),
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
    setCart(current => [...current, {
      quantity: Number(watch("cart-quantity")),
      product: watch("cart-product"),
      type: type,
    }]);
    
    setTimeout(() => {
      setValue("cart-quantity", 1);
      setValue("cart-product", '');
    }, 25);
  }

  // Delete product from cart
  function handleDeleteCartProduct(product) {
    const productIndex = cart.indexOf(product);
    const newCart = structuredClone(cart);
    newCart.splice(productIndex, 1);
    setCart(newCart);
    // console.log(cart);
  };


  return (
    <>
      <CssBaseline />
      <Header />
      <div className="new-sale-container">
        <div className="main-info">
          <div className="input-row">
            <label htmlFor="block">Bloco</label>
            <input type="text" id="block" {...register("block")} />
          </div>
          <div className="input-row">
            <label htmlFor="block">Apartamento</label>
            <input type="text" {...register("apartment")} />
          </div>
          <div className="input-row">
            <label htmlFor="block">Forma de pagamento</label>
            <select name="payment" id="payment" {...register("payment")}>
              <option value="" disabled>Selecione...</option>
              <option value="Dinheiro">Dinheiro</option>
              <option value="Pix">Pix</option>
              <option value="Cartão">Cartão</option>
            </select>
          </div>
          <div className="input-row">
            <label htmlFor="block">Status</label>
            <select name="status" id="status" {...register("status")}>
              <option value="Novo Pedido">Novo Pedido</option>
              <option value="Saindo">Saindo</option>
              <option value="Entregue">Entregue</option>
            </select>
          </div>
          {/* <span>*Data*</span> */}
        </div>
        <div className="cart-wrapper">
          {
            cart?.map((product, index) => {
              return (
                <div className="cart-row" key={index}>
                  <span>{product.quantity} x</span>
                  <span>&nbsp;{product.product === "Cebola" && "Pão de "}{product.product}</span>
                  <button onClick={() => handleDeleteCartProduct(product, index)} className="cart-delete-button">-</button>
                </div>
              )
            })
          }
          
          <div className="cart-row" id="cart-input">
            <input type="number" defaultValue={1} {...register("cart-quantity")} />
            <select name="product-type" id="" defaultValue={''} {...register("cart-product")} >
              <option value="" disabled>Produto</option>
              <option value="Misto">Misto</option>
              <option value="Frango">Frango</option>
              <option value="Salsicha">Salsicha</option>
              <option value="Enroladinho">Enroladinho</option>
              <option value="Coxinha">Coxinha</option>
              <option value="Torta">Torta</option>
              <option value="Cebola">Pão de Cebola</option>
            </select>
            <button onClick={() => handleNewCartProduct()}>+</button>
          </div>
          <span id="cart-total-price">R$ {price}</span>
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
    </>
  )
}
