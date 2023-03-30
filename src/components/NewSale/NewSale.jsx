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
import { StockSumContext } from '../../contexts/StockSumProvider';

export const NewSale = () => {
  const date = new Date();
  const navigate = useNavigate();
  const { setUpdateProductId, updateProductId, saleRaw, firestoreLoading, refreshHandler } = useContext(UpdateProductsContext);
  const salesCollectionRef = collection(db, 'vendas');
  const stockCollectionRef = collection(db, 'stock');
  const { notifySuccess, notifyError } = useContext(ToastifyContext); // Toastify Context
  const {
    mistoSum, setMistoSum,
    frangoSum, setFrangoSum,
    salsichaSum, setSalsichaSum,
    enroladinhoSum, setEnroladinhoSum,
    coxinhaSum, setCoxinhaSum,
    tortaSum, setTortaSum,
    cebolaSum, setCebolaSum,
    mistoStock,
    frangoStock,
    salsichaStock,
    enroladinhoStock,
    coxinhaStock,
    tortaStock,
    cebolaStock,
    handleRefresh, refresh,
  } = useContext(StockSumContext);

  

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

  // Load Old Cart
  const oldCart = saleRaw[0]?.cart;
  const [oldMisto, setOldMisto] = useState(0);
  const [oldFrango, setOldFrango] = useState(0);
  const [oldSalsicha, setOldSalsicha] = useState(0);
  const [oldEnroladinho, setOldEnroladinho] = useState(0);
  const [oldCoxinha, setOldCoxinha] = useState(0);
  const [oldTorta, setOldTorta] = useState(0);
  const [oldCebola, setOldCebola] = useState(0);

  console.log(oldMisto);

  useEffect(() => {
    setOldMisto(oldCart?.filter((data) => (data.product === "Misto"))?.map((data) => data.quantity).reduce((a, b) => a + b, 0));
    setOldFrango(oldCart?.filter((data) => (data.product === "Frango"))?.map((data) => data.quantity).reduce((a, b) => a + b, 0));
    setOldSalsicha(oldCart?.filter((data) => (data.product === "Salsicha"))?.map((data) => data.quantity).reduce((a, b) => a + b, 0));
    setOldEnroladinho(oldCart?.filter((data) => (data.product === "Enroladinho"))?.map((data) => data.quantity).reduce((a, b) => a + b, 0));
    setOldCoxinha(oldCart?.filter((data) => (data.product === "Coxinha"))?.map((data) => data.quantity).reduce((a, b) => a + b, 0));
    setOldTorta(oldCart?.filter((data) => (data.product === "Torta"))?.map((data) => data.quantity).reduce((a, b) => a + b, 0));
    setOldCebola(oldCart?.filter((data) => (data.product === "Cebola"))?.map((data) => data.quantity).reduce((a, b) => a + b, 0));
  }, [saleRaw])
  

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

  // Load Stock quantities
  const [stockRaw, setStockRaw] = useState();
  useEffect(() => {
    const getSalesData = async () => {
      const data = await getDocs(stockCollectionRef);
      const raw = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
      setStockRaw(raw);
    }
    getSalesData();
  }, [watch("cart-product"), watch("cart-quantity")])

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

    const sumMistoCart = cart?.filter((data) => (data.product === "Misto"))?.map((data) => data.quantity).reduce((a, b) => a + b, 0);
    const sumFrangoCart = cart?.filter((data) => (data.product === "Frango")).map((data) => data.quantity).reduce((a, b) => a + b, 0);
    const sumSalsichaCart = cart?.filter((data) => (data.product === "Salsicha")).map((data) => data.quantity).reduce((a, b) => a + b, 0);
    const sumEnroladinhoCart = cart?.filter((data) => (data.product === "Enroladinho")).map((data) => data.quantity).reduce((a, b) => a + b, 0);
    const sumCoxinhaCart = cart?.filter((data) => (data.product === "Coxinha")).map((data) => data.quantity).reduce((a, b) => a + b, 0);
    const sumTortaCart = cart?.filter((data) => (data.product === "Torta")).map((data) => data.quantity).reduce((a, b) => a + b, 0);
    const sumCebolaCart = cart?.filter((data) => (data.product === "Cebola")).map((data) => data.quantity).reduce((a, b) => a + b, 0);

    console.log({mistoStock: mistoStock, sumMistoCart: sumMistoCart, mistoSum: mistoSum});

    if(mistoStock < (sumMistoCart + mistoSum)) {
      return notifyError(`Você tem ${mistoStock - mistoSum} Mistos em estoque!`);
    } else if(frangoStock < (sumFrangoCart + frangoSum)) {
      return notifyError(`Você tem ${frangoStock - frangoSum} Frangos em estoque!`);
    } else if(salsichaStock < (sumSalsichaCart + salsichaSum)) {
      return notifyError(`Você tem ${salsichaStock - salsichaSum} Salsichas em estoque!`);
    } else if(enroladinhoStock < (sumEnroladinhoCart + enroladinhoSum)) {
      return notifyError(`Você tem ${enroladinhoStock - enroladinhoSum} Enroladinhos em estoque!`);
    } else if(coxinhaStock < (sumCoxinhaCart + coxinhaSum)) {
      return notifyError(`Você tem ${coxinhaStock - coxinhaSum} Coxinhas em estoque!`);
    } else if(tortaStock < (sumTortaCart + tortaSum)) {
      return notifyError(`Você tem ${tortaStock - tortaSum} Tortas em estoque!`);
    } else if(cebolaStock < (sumCebolaCart + cebolaSum)) {
      return notifyError(`Você tem ${cebolaStock - cebolaSum} Pães de Cebola em estoque!`);
    } else {
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
        handleRefresh(),
        navigate("/"),
        notifySuccess("Venda registrada!"),
      )
    }
  }

  // console.log({mistoSum: mistoSum, mistoStock: mistoStock})

  // Update sale
  async function updateSale() {
    const sumMistoCart = cart?.filter((data) => (data.product === "Misto"))?.map((data) => data.quantity).reduce((a, b) => a + b, 0);
    const sumFrangoCart = cart?.filter((data) => (data.product === "Frango")).map((data) => data.quantity).reduce((a, b) => a + b, 0);
    const sumSalsichaCart = cart?.filter((data) => (data.product === "Salsicha")).map((data) => data.quantity).reduce((a, b) => a + b, 0);
    const sumEnroladinhoCart = cart?.filter((data) => (data.product === "Enroladinho")).map((data) => data.quantity).reduce((a, b) => a + b, 0);
    const sumCoxinhaCart = cart?.filter((data) => (data.product === "Coxinha")).map((data) => data.quantity).reduce((a, b) => a + b, 0);
    const sumTortaCart = cart?.filter((data) => (data.product === "Torta")).map((data) => data.quantity).reduce((a, b) => a + b, 0);
    const sumCebolaCart = cart?.filter((data) => (data.product === "Cebola")).map((data) => data.quantity).reduce((a, b) => a + b, 0);

    console.log({mistoStock: mistoStock, sumMistoCart: sumMistoCart, mistoSum: mistoSum});
    
    if(mistoStock < (sumMistoCart + mistoSum - oldMisto)) {
      return notifyError(`Você tem ${mistoStock - mistoSum} Mistos em estoque!`)
    } else if(frangoStock < (sumFrangoCart + frangoSum - oldFrango)) {
      return notifyError(`Você tem ${frangoStock - frangoSum} Frangos em estoque!`)
    } else if(salsichaStock < (sumSalsichaCart + salsichaSum - oldSalsicha)) {
      return notifyError(`Você tem ${salsichaStock - salsichaSum} Salsichas em estoque!`)
    } else if(enroladinhoStock < (sumEnroladinhoCart + enroladinhoSum - oldEnroladinho)) {
      return notifyError(`Você tem ${enroladinhoStock - enroladinhoSum} Enroladinhos em estoque!`)
    } else if(coxinhaStock < (sumCoxinhaCart + coxinhaSum - oldCoxinha)) {
      return notifyError(`Você tem ${coxinhaStock - coxinhaSum} Coxinhas em estoque!`)
    } else if(tortaStock < (sumTortaCart + tortaSum - oldTorta)) {
      return notifyError(`Você tem ${tortaStock - tortaSum} Tortas em estoque!`)
    } else if(cebolaStock < (sumCebolaCart + cebolaSum - oldCebola)) {
      return notifyError(`Você tem ${cebolaStock - cebolaSum} Pães de Cebola em estoque!`)
    } else {
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
        handleRefresh(),
        navigate("/"),
        notifySuccess("Venda atualizada!")
      )
    }
  }

  // Delete sale
  async function deleteSale() {
    await deleteDoc(doc(salesCollectionRef, updateProductId))
    .then(
      console.log("Sale successfully deleted"),
      refreshHandler(),
      handleRefresh(),
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
    
    setTimeout(() => {
      setValue("cart-quantity", 1);
      setValue("cart-product", '');
      handleRefresh();
    }, 25);
  }

  // Delete product from cart
  function handleDeleteCartProduct(product) {
    const productIndex = cart.indexOf(product);
    const newCart = structuredClone(cart);
    newCart.splice(productIndex, 1);
    handleRefresh();
    setCart(newCart);
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
