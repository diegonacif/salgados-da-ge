import { useCallback, useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { collection, deleteDoc, doc, getDocs, setDoc, updateDoc } from "firebase/firestore";
import { db } from '../../services/firebase';
import { useNavigate, useBeforeUnload } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { UpdateProductsContext } from '../../contexts/UpdateProductsProvider';
import { Header } from '../Header/Header';
import { Export, FloppyDisk, HandCoins, MinusCircle, PlusCircle, Trash } from '@phosphor-icons/react';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { ToastifyContext } from '../../contexts/ToastifyProvider';

import '../../App.scss';

export const NewSale = () => {
  const date = new Date();
  const navigate = useNavigate();
  const { setUpdateProductId, updateProductId, saleRaw, firestoreLoading, refreshHandler } = useContext(UpdateProductsContext);
  const salesCollectionRef = collection(db, 'vendas');
  const { notifySuccess, notifyError } = useContext(ToastifyContext); // Toastify Context

  // Yup Resolver
  const saleSchema = yup.object({
    apartment: yup.string().required("Insira o número do apartamento").min(3, "Número inválido"),
    block: yup.string().required("Insira o número do bloco"),
    payment: yup.string().required("Insira o método de pagamento"),
  }).required()

  // Hook Form Controller
  const {
    watch,
    register,
    setValue,
    getValues,
    trigger,
    formState: { errors, isValid }
  } = useForm({
    mode: "all",
    resolver: yupResolver(saleSchema),
    defaultValues: {
      payment: "",
      discount: 0
    }
  });


  console.log(watch());

  const [cart, setCart] = useState([]);

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
      (assadoPrice + paoPrice + fritoPrice) - Number(watch("discount"))
    )

  }, [watch("cart-product"), cart, watch("discount")])

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
      setValue("discount", sale?.discount);
      setCart(sale?.cart);
      setTimeout(() => {
        trigger();
      }, 100);
    }
  }, [firestoreLoading, saleRaw])

  // Register sale
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
      price: price,
      discount: watch("discount")
    })
    .then(
      console.log("New sale successfully registered"),
      navigate("/"),
      notifySuccess("Venda registrada!"),
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
      price: price,
      discount: watch("discount")
    })
    .then(
      console.log("Sale successfully updated"),
      refreshHandler(),
      navigate("/"),
      notifySuccess("Venda atualizada!")
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

  // Handle Delete sale
  function handleDeleteSale() {
    confirm("Tem certeza que deseja deletar a venda ?") === true &&
    deleteSale()
    notifySuccess("Venda excluída!")
  }

  // Add product to cart
  function handleNewCartProduct() {
    setCart(current => [...current, {
      quantity: Number(watch("cart-quantity")),
      product: watch("cart-product"),
      type: type,
    }]);

    notifySuccess("Produto adicionado");
    
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

  // Handling Discount Show
  const [discountShow, setDiscountShow] = useState(false);

  // Is plus button disabled
  const [isPlusButtonDisabled, setIsPlusButtonDisabled] = useState(true);
  useEffect(() => {
    watch("cart-product") === "" || watch("cart-quantity") < 1 ?
    setIsPlusButtonDisabled(true) :
    setIsPlusButtonDisabled(false);
  }, [watch("cart-product"), watch("cart-quantity")]);

  return (
    <>
      <Header />
      <div className="new-sale-container">
        <div className="main-info">
          <div className="input-row">
            <label htmlFor="block">Bloco</label>
            <input type="text" id="block" {...register("block")} />
            <span id="error-alert-message">{errors?.block?.message}</span>
          </div>
          <div className={`input-row ${errors.apartment}`}>
            <label htmlFor="block">Apartamento</label>
            <input type="text" {...register("apartment")} />
            <span id="error-alert-message">{errors?.apartment?.message}</span>
          </div>
          <div className="input-row">
            <label htmlFor="block">Forma de pagamento</label>
            <select name="payment" id="payment" {...register("payment")}>
              <option value="" disabled>Selecione...</option>
              <option value="Dinheiro">Dinheiro</option>
              <option value="Pix">Pix</option>
              <option value="Cartão">Cartão</option>
            </select>
            <span id="error-alert-message">{errors?.payment?.message}</span>
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
          <div className="input-row buttons-wrapper">
            {
              updateProductId ?
              <>
                <button 
                  className={`update-button ${!isValid && 'disabled-button'}`}
                  onClick={() => updateSale()}
                >
                  <span>Atualizar</span>
                  <Export size={24} weight="duotone" />
                </button>
                {/* <button id="update-button" onClick={() => updateSale()}>Atualizar</button>  */}
                <div id="delete-button" onClick={() => handleDeleteSale()}>
                  <span>Deletar</span>
                  <Trash size={24} weight="duotone" />
                </div>
                {/* <button id="delete-button" onClick={() => deleteSale()}>Deletar</button> */}
              </> :
              <button 
                className={`register-button ${!isValid && 'disabled-button'}`}
                onClick={() => 
                  !isValid ?
                  notifyError("Preencha os dados") :
                  registerSale()
                }
              >
                <span>Salvar</span>
                <FloppyDisk size={24} weight="duotone" />
              </button>
              // <button id="register-button" onClick={() => registerSale()}>Salvar</button>
            }
          </div>
        </div>
        <div className="cart-wrapper">
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
            <PlusCircle 
              size={32} 
              weight={isPlusButtonDisabled ? "duotone" : "fill"}
              onClick={() => 
                isPlusButtonDisabled ?
                notifyError("insira um produto") :
                handleNewCartProduct()
              } 
            />
            {/* {
              isPlusButtonDisabled ?
              <PlusCircle size={32} weight="duotone" onClick={() => alert("insira um produto")} /> :
              <PlusCircle size={32} weight="fill" onClick={() => handleNewCartProduct()} />
            } */}
          </div>
          <div className="price-wrapper">
            {
              discountShow &&
              <div className="input-row" id="discount-wrapper">
                <label htmlFor="discount">Desconto</label>
                <span id="currency-label">R$</span>
                <input type="number" id="discount" name="discount" {...register("discount")} />
              </div>
            }
            <div className="price-row">
              <span id="cart-total-price">Total: R$ {price}</span>
              <HandCoins size={24} weight={discountShow ? "fill" : "duotone"} onClick={() => setDiscountShow(current => !current)} />
            </div>
          </div>
          {
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
      </div>
    </>
  )
}
