import { collection, deleteDoc, doc, getDocs, setDoc } from "firebase/firestore";
import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../services/firebase";
import { StockSumContext } from "./StockSumProvider";
import { ToastifyContext } from "./ToastifyProvider";
import { UpdateProductsContext } from "./UpdateProductsProvider";
import { v4 as uuidv4 } from 'uuid';

export const SalesContext = createContext();

export const SalesProvider = ({ children }) => {

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

  const [cart, setCart] = useState([]);

  // NewSale component input data
  const [newSaleBlock, setNewSaleBlock] = useState('');
  const [newSaleApartment, setNewSaleApartment] = useState('');
  const [newSalePayment, setNewSalePayment] = useState('');
  const [newSaleStatus, setNewSaleStatus] = useState('');
  const [newSaleCartQuantity, setNewSaleCartQuantity] = useState('');
  const [newSaleCartProduct, setNewSaleCartProduct] = useState('');
  const [newSaleDiscount, setNewSaleDiscount] = useState('');

  // Refresh new sale
  const refreshForNewSale = () => {
    setNewSaleBlock("");
    setNewSaleApartment("");
    setNewSalePayment("");
    setNewSaleStatus("Novo Pedido");
    setNewSaleCartQuantity("1");
    setNewSaleCartProduct("");
    setNewSaleDiscount("0");
    setCart([]);
  }

  // Load Old Cart
  const oldCart = saleRaw[0]?.cart;
  const [oldMisto, setOldMisto] = useState(0);
  const [oldFrango, setOldFrango] = useState(0);
  const [oldSalsicha, setOldSalsicha] = useState(0);
  const [oldEnroladinho, setOldEnroladinho] = useState(0);
  const [oldCoxinha, setOldCoxinha] = useState(0);
  const [oldTorta, setOldTorta] = useState(0);
  const [oldCebola, setOldCebola] = useState(0);

  useEffect(() => {
    setOldMisto(oldCart?.filter((data) => (data.product === "Misto"))?.map((data) => data.quantity).reduce((a, b) => a + b, 0));
    setOldFrango(oldCart?.filter((data) => (data.product === "Frango"))?.map((data) => data.quantity).reduce((a, b) => a + b, 0));
    setOldSalsicha(oldCart?.filter((data) => (data.product === "Salsicha"))?.map((data) => data.quantity).reduce((a, b) => a + b, 0));
    setOldEnroladinho(oldCart?.filter((data) => (data.product === "Enroladinho"))?.map((data) => data.quantity).reduce((a, b) => a + b, 0));
    setOldCoxinha(oldCart?.filter((data) => (data.product === "Coxinha"))?.map((data) => data.quantity).reduce((a, b) => a + b, 0));
    setOldTorta(oldCart?.filter((data) => (data.product === "Torta"))?.map((data) => data.quantity).reduce((a, b) => a + b, 0));
    setOldCebola(oldCart?.filter((data) => (data.product === "Cebola"))?.map((data) => data.quantity).reduce((a, b) => a + b, 0));
  }, [saleRaw])


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
      (assadoPrice + paoPrice + fritoPrice) - Number(newSaleDiscount)
    )

  }, [newSaleCartProduct, cart, newSaleDiscount])

  // Handling Type
  const [type, setType] = useState('');
  useEffect(() => {
    if(['Misto', 'Frango', 'Salsicha'].includes(newSaleCartProduct)) {
      setType('assado');
    } else if(['Enroladinho', 'Coxinha', 'Torta'].includes(newSaleCartProduct)) {
      setType('frito');
    } else if(['Cebola'].includes(newSaleCartProduct)) {
      setType('pao');
    } else (
      null
    )
  }, [newSaleCartProduct])

  // Load Stock quantities
  const [stockRaw, setStockRaw] = useState();
  useEffect(() => {
    const getSalesData = async () => {
      const data = await getDocs(stockCollectionRef);
      const raw = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
      setStockRaw(raw);
    }
    getSalesData();
  }, [newSaleCartProduct, newSaleCartQuantity])

  // Loading products editing
  useEffect(() => {
    if(firestoreLoading === true || updateProductId === '') {
      return;
    } else {
      const sale = saleRaw[0];
      // console.log(saleRaw)
      setNewSaleBlock(sale?.block);
      setNewSaleApartment(sale?.apartment);
      setNewSalePayment(sale?.payment);
      setNewSaleStatus(sale?.status);
      setNewSaleDiscount(sale?.discount);
      setCart(sale?.cart);
      // setTimeout(() => {
      //   trigger();
      // }, 100);
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
        block: newSaleBlock,
        apartment: newSaleApartment,
        payment: newSalePayment,
        status: newSaleStatus,
        date: date,
        cart: cart,
        price: price,
        discount: newSaleDiscount
      })
      .then(
        console.log("New sale successfully registered"),
        handleRefresh(),
        navigate("/sales-table"),
        notifySuccess("Venda registrada!"),
      )
    }
  }

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
        block: newSaleBlock,
        apartment: newSaleApartment,
        payment: newSalePayment,
        status:newSaleStatus,
        date: saleRaw[0].date,
        cart: cart,
        price: price,
        discount: newSaleDiscount
      })
      .then(
        console.log("Sale successfully updated"),
        refreshHandler(),
        handleRefresh(),
        navigate("/sales-table"),
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
      navigate("/sales-table")
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
      quantity: Number(newSaleCartQuantity),
      product: newSaleCartProduct,
      type: type,
    }]);
    
    setTimeout(() => {
      setNewSaleCartQuantity(1);
      setNewSaleCartProduct('');
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

  // console.log({
  //   block: newSaleBlock,
  //   apartment: newSaleApartment,
  //   payment: newSalePayment,
  //   status:newSaleStatus,
  //   date: saleRaw[0]?.date,
  //   cart: cart,
  //   price: price,
  //   discount: newSaleDiscount
  // })

  return (
    <SalesContext.Provider value={{ 
      newSaleBlock, setNewSaleBlock,
      newSaleApartment, setNewSaleApartment,
      newSalePayment, setNewSalePayment,
      newSaleStatus, setNewSaleStatus,
      newSaleCartQuantity, setNewSaleCartQuantity,
      newSaleCartProduct, setNewSaleCartProduct,
      newSaleDiscount, setNewSaleDiscount,
      refreshForNewSale,
      stockRaw,
      price,
      type,
      cart,

      registerSale,
      updateSale,
      handleDeleteSale,
      handleNewCartProduct,
      handleDeleteCartProduct

    }}>
      {children}
    </SalesContext.Provider>
  )
}