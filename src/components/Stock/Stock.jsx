import { collection, doc, getDocs, setDoc } from 'firebase/firestore';
import { useContext, useEffect, useState } from 'react';
import { db } from '../../services/firebase';
import { Header } from '../Header/Header';
import { BiEdit, BiSend } from 'react-icons/bi';
import { useForm } from 'react-hook-form';
import { UpdateProductsContext } from '../../contexts/UpdateProductsProvider';

import '../../App.scss';
import { useCollection } from 'react-firebase-hooks/firestore';

export const Stock = () => {
  const [stockRefresh, setStockRefresh] = useState(false);
  const salesCollectionRef = collection(db, 'vendas');
  const stockCollectionRef = collection(db, 'stock');
  const [salesRaw, setSalesRaw] = useState();
  const [stockRaw, setStockRaw] = useState();
  const [carts, setCarts] = useState([]);
  const [firestoreLoading, setFirestoreLoading] = useState(true);

  // Firestore loading
  const [value, loading, error] = useCollection(stockCollectionRef,
    { snapshotListenOptions: { includeMetadataChanges: true } }
  );
  useEffect(() => {
    setFirestoreLoading(loading);
  }, [loading])

  
  // Hook Form Controller
  const {
    watch,
    register,
    setValue,
    getValues
  } = useForm({
    mode: "all",
    defaultValues: {
      misto: 0,
      frango: 0,
      salsicha: 0,
      enroladinho: 0,
      coxinha: 0,
      torta: 0,
      cebola: 0
    }
  });

  
  const [mistoSum, setMistoSum] = useState(0);
  const [frangoSum, setFrangoSum] = useState(0);
  const [salsichaSum, setSalsichaSum] = useState(0);
  const [enroladinhoSum, setEnroladinhoSum] = useState(0);
  const [coxinhaSum, setCoxinhaSum] = useState(0);
  const [tortaSum, setTortaSum] = useState(0);
  const [cebolaSum, setCebolaSum] = useState(0);

  const [editMistoProductionStatus, setEditMistoProductionStatus] = useState(false);
  const [editFrangoProductionStatus, setEditFrangoProductionStatus] = useState(false);
  const [editSalsichaProductionStatus, setEditSalsichaProductionStatus] = useState(false);
  const [editEnroladinhoProductionStatus, setEditEnroladinhoProductionStatus] = useState(false);
  const [editCoxinhaProductionStatus, setEditCoxinhaProductionStatus] = useState(false);
  const [editTortaProductionStatus, setEditTortaProductionStatus] = useState(false);
  const [editCebolaProductionStatus, setEditCebolaProductionStatus] = useState(false);

  // console.log({
  //   misto: mistoSum,
  //   frango: frangoSum,
  //   salsicha: salsichaSum,
  //   enroladinho: enroladinhoSum,
  //   coxinha: coxinhaSum,
  //   torta: tortaSum,
  //   cebola: cebolaSum,
  // })

  // Sales Data
  useEffect(() => {
    const getSalesData = async () => {
      const data = await getDocs(salesCollectionRef);
      setSalesRaw(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };
    getSalesData();
  }, [])

  // Load Carts Data
  useEffect(() => {
    setCarts([]);
    const getCarts = () => {
      salesRaw?.map((sale, index) => 
        setCarts(current => current.concat(sale.cart))
      )
    }
    getCarts();
  }, [salesRaw])

  // Sum of each product
  useEffect(() => {
    const arrMisto = carts?.filter((data) => (data.product === "Misto"));
    const arrFrango = carts?.filter((data) => (data.product === "Frango"));
    const arrSalsicha = carts?.filter((data) => (data.product === "Salsicha"));
    const arrEnroladinho = carts?.filter((data) => (data.product === "Enroladinho"));
    const arrCoxinha = carts?.filter((data) => (data.product === "Coxinha"));
    const arrTorta = carts?.filter((data) => (data.product === "Torta"));
    const arrCebola = carts?.filter((data) => (data.product === "Cebola"));

    setMistoSum(arrMisto?.map((data) => data.quantity).reduce((a, b) => a + b, 0));
    setFrangoSum(arrFrango?.map((data) => data.quantity).reduce((a, b) => a + b, 0));
    setSalsichaSum(arrSalsicha?.map((data) => data.quantity).reduce((a, b) => a + b, 0));
    setEnroladinhoSum(arrEnroladinho?.map((data) => data.quantity).reduce((a, b) => a + b, 0));
    setCoxinhaSum(arrCoxinha?.map((data) => data.quantity).reduce((a, b) => a + b, 0));
    setTortaSum(arrTorta?.map((data) => data.quantity).reduce((a, b) => a + b, 0));
    setCebolaSum(arrCebola?.map((data) => data.quantity).reduce((a, b) => a + b, 0));
  }, [carts])

  // Handle production status
  function handleProductionStatus(product) {
    product === "misto" ?
    setEditMistoProductionStatus(current => !current) :
    product === "frango" ?
    setEditFrangoProductionStatus(current => !current) :
    product === "salsicha" ?
    setEditSalsichaProductionStatus(current => !current) :
    product === "enroladinho" ?
    setEditEnroladinhoProductionStatus(current => !current) :
    product === "coxinha" ?
    setEditCoxinhaProductionStatus(current => !current) :
    product === "torta" ?
    setEditTortaProductionStatus(current => !current) :
    product === "cebola" ?
    setEditCebolaProductionStatus(current => !current) :
    null
  }

  // Update production values
  async function updateProduction(product) {
    const docRef = doc(db, "stock", product);

    return await setDoc(docRef, 
      product === "misto" ?
      {quantity: Number(watch("misto"))} :
      product === "frango" ?
      {quantity: Number(watch("frango"))} :
      product === "salsicha" ?
      {quantity: Number(watch("salsicha"))} :
      product === "enroladinho" ?
      {quantity: Number(watch("enroladinho"))} :
      product === "coxinha" ?
      {quantity: Number(watch("coxinha"))} :
      product === "torta" ?
      {quantity: Number(watch("torta"))} :
      product === "cebola" ?
      {quantity: Number(watch("cebola"))} :
      null
    )
    .then(
      console.log("Stock successfully updated"),
      handleProductionStatus(product),
      handleStockRefresh()
    )
  }

  // Load production values
  useEffect(() => {
    const getSalesData = async () => {
      const data = await getDocs(stockCollectionRef);
      const raw = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
      setStockRaw(raw);
    }
    getSalesData();
  }, [stockRefresh])

  // Updating production values
  useEffect(() => {
    if(firestoreLoading === true) {
      return;
    } else {
      const misto = stockRaw?.filter(data => data.id === "misto");
      const frango = stockRaw?.filter(data => data.id === "frango");
      const salsicha = stockRaw?.filter(data => data.id === "salsicha");
      const enroladinho = stockRaw?.filter(data => data.id === "enroladinho");
      const coxinha = stockRaw?.filter(data => data.id === "coxinha");
      const torta = stockRaw?.filter(data => data.id === "torta");
      const cebola = stockRaw?.filter(data => data.id === "cebola");
  
      setValue("misto", misto[0]?.quantity);
      setValue("frango", frango[0]?.quantity);
      setValue("salsicha", salsicha[0]?.quantity);
      setValue("enroladinho", enroladinho[0]?.quantity);
      setValue("coxinha", coxinha[0]?.quantity);
      setValue("torta", torta[0]?.quantity);
      setValue("cebola", cebola[0]?.quantity);
    }
  }, [stockRaw, stockRefresh, firestoreLoading])


  function handleStockRefresh() {
    setStockRefresh(current => !current);
  }


  return (
    <>
      <Header />
      <div className="stock-container">
        <div className="stock-wrapper">
          {/* Misto */}
          <div className="stock-row">
            <span id="product-title">Misto</span>
            <div className="production-row">
              <label htmlFor="production-number">Produzidos</label>
              <div className="production-inner">
                {
                  editMistoProductionStatus ?
                  <>
                    <input type="number" {...register("misto")} />
                    <BiSend size={24} onClick={() => updateProduction("misto")} />
                  </> :
                  <>
                    <span>{watch("misto")}</span>
                    <BiEdit size={24} onClick={() => handleProductionStatus("misto")} />
                  </>
                }
              </div>
            </div>
            <div className="remain-row">
              <label htmlFor="remain-number">Estoque</label>
              <span>{getValues("misto") - mistoSum}</span>
            </div>
          </div>

          {/* Frango */}
          <div className="stock-row">
            <span id="product-title">Frango</span>
            <div className="production-row">
              <label htmlFor="production-number">Produzidos</label>
              <div className="production-inner">
                {
                  editFrangoProductionStatus ?
                  <>
                    <input type="number" {...register("frango")}/>
                    <BiSend size={24} onClick={() => updateProduction("frango")} />
                  </> :
                  <>
                    <span>{watch("frango")}</span>
                    <BiEdit size={24} onClick={() => handleProductionStatus("frango")} />
                  </>
                }
              </div>
            </div>
            <div className="remain-row">
              <label htmlFor="remain-number">Estoque</label>
              <span>{getValues("frango") - frangoSum}</span>
            </div>
          </div>

          {/* Salsicha */}
          <div className="stock-row">
            <span id="product-title">Salsicha</span>
            <div className="production-row">
              <label htmlFor="production-number">Produzidos</label>
              <div className="production-inner">
                {
                  editSalsichaProductionStatus ?
                  <>
                    <input type="number" {...register("salsicha")} />
                    <BiSend size={24} onClick={() => updateProduction("salsicha")} />
                  </> :
                  <>
                    <span>{watch("salsicha")}</span>
                    <BiEdit size={24} onClick={() => handleProductionStatus("salsicha")} />
                  </>
                }
              </div>
            </div>
            <div className="remain-row">
              <label htmlFor="remain-number">Estoque</label>
              <span>{getValues("salsicha") - salsichaSum}</span>
            </div>
          </div>

          {/* Enroladinho */}
          <div className="stock-row">
            <span id="product-title">Enroladinho</span>
            <div className="production-row">
              <label htmlFor="production-number">Produzidos</label>
              <div className="production-inner">
                {
                  editEnroladinhoProductionStatus ?
                  <>
                    <input type="number" {...register("enroladinho")}/>
                    <BiSend size={24} onClick={() => updateProduction("enroladinho")} />
                  </> :
                  <>
                    <span>{watch("enroladinho")}</span>
                    <BiEdit size={24} onClick={() => handleProductionStatus("enroladinho")} />
                  </>
                }
              </div>
            </div>
            <div className="remain-row">
              <label htmlFor="remain-number">Estoque</label>
              <span>{getValues("enroladinho") - enroladinhoSum}</span>
            </div>
          </div>

          {/* Coxinha */}
          <div className="stock-row">
            <span id="product-title">Coxinha</span>
            <div className="production-row">
              <label htmlFor="production-number">Produzidos</label>
              <div className="production-inner">
                {
                  editCoxinhaProductionStatus ?
                  <>
                    <input type="number" {...register("coxinha")}/>
                    <BiSend size={24} onClick={() => updateProduction("coxinha")} />
                  </> :
                  <>
                    <span>{watch("coxinha")}</span>
                    <BiEdit size={24} onClick={() => handleProductionStatus("coxinha")} />
                  </>
                }
              </div>
            </div>
            <div className="remain-row">
              <label htmlFor="remain-number">Estoque</label>
              <span>{getValues("coxinha") - coxinhaSum}</span>
            </div>
          </div>

          {/* Torta */}
          <div className="stock-row">
            <span id="product-title">Torta</span>
            <div className="production-row">
              <label htmlFor="production-number">Produzidos</label>
              <div className="production-inner">
                {
                  editTortaProductionStatus ?
                  <>
                    <input type="number" {...register("torta")} />
                    <BiSend size={24} onClick={() => updateProduction("torta")} />
                  </> :
                  <>
                    <span>{watch("torta")}</span>
                    <BiEdit size={24} onClick={() => handleProductionStatus("torta")} />
                  </>
                }
              </div>
            </div>
            <div className="remain-row">
              <label htmlFor="remain-number">Estoque</label>
              <span>{getValues("torta") - tortaSum}</span>
            </div>
          </div>

          {/* Pão de Cebola */}
          <div className="stock-row">
            <span id="product-title">Pão de Cebola</span>
            <div className="production-row">
              <label htmlFor="production-number">Produzidos</label>
              <div className="production-inner">
                {
                  editCebolaProductionStatus ?
                  <>
                    <input type="number" {...register("cebola")} />
                    <BiSend size={24} onClick={() => updateProduction("cebola")} />
                  </> :
                  <>
                    <span>{watch("cebola")}</span>
                    <BiEdit size={24} onClick={() => handleProductionStatus("cebola")} />
                  </>
                }
              </div>
            </div>
            <div className="remain-row">
              <label htmlFor="remain-number">Estoque</label>
              <span>{getValues("cebola") - cebolaSum}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
