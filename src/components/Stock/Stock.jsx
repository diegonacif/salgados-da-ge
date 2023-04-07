import { collection, doc, getDocs, setDoc } from 'firebase/firestore';
import { useContext, useEffect, useState } from 'react';
import { db } from '../../services/firebase';
import { Header } from '../Header/Header';
import { BiEdit, BiSend } from 'react-icons/bi';
import { useForm } from 'react-hook-form';
import { UpdateProductsContext } from '../../contexts/UpdateProductsProvider';

import { useCollection } from 'react-firebase-hooks/firestore';
import { ToastifyContext } from '../../contexts/ToastifyProvider';
import '../../App.scss';
import { StockSumContext } from '../../contexts/StockSumProvider';

export const Stock = () => {

  const [currentMisto, setCurrentMisto] = useState({});
  const [currentFrango, setCurrentFrango] = useState({});
  const [currentSalsicha, setCurrentSalsicha] = useState({});
  const [currentEnroladinho, setCurrentEnroladinho] = useState({});
  const [currentCoxinha, setCurrentCoxinha] = useState({});
  const [currentTorta, setCurrentTorta] = useState({});
  const [currentCebola, setCurrentCebola] = useState({});

  console.log(currentMisto);
  
  const stockCollectionRef = collection(db, 'stock');
  
  // const [stockRaw, setStockRaw] = useState();
  const [firestoreLoading, setFirestoreLoading] = useState(true);
  const { notifySuccess, notifyError } = useContext(ToastifyContext); // Toastify Context
  const {
    mistoSum, setMistoSum,
    frangoSum, setFrangoSum,
    salsichaSum, setSalsichaSum,
    enroladinhoSum, setEnroladinhoSum,
    coxinhaSum, setCoxinhaSum,
    tortaSum, setTortaSum,
    cebolaSum, setCebolaSum,
    handleRefresh, refresh,
    stockRaw, setStockRaw
  } = useContext(StockSumContext);

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
    console.log(product);

    return await setDoc(docRef, 
      product === "misto" ?
      {
        quantity: Number(watch("misto")),
        label: currentMisto?.label,
        description: currentMisto?.description,
        type: currentMisto?.type
      } :
      product === "frango" ?
      {
        quantity: Number(watch("frango")),
        label: currentFrango?.label,
        description: currentFrango?.description,
        type: currentFrango?.type
      } :
      product === "salsicha" ?
      {
        quantity: Number(watch("salsicha")),
        label: currentSalsicha?.label,
        description: currentSalsicha?.description,
        type: currentSalsicha?.type
      } :
      product === "enroladinho" ?
      {
        quantity: Number(watch("enroladinho")),
        label: currentEnroladinho?.label,
        description: currentEnroladinho?.description,
        type: currentEnroladinho?.type
      } :
      product === "coxinha" ?
      {
        quantity: Number(watch("coxinha")),
        label: currentCoxinha?.label,
        description: currentCoxinha?.description,
        type: currentCoxinha?.type
      } :
      product === "torta" ?
      {
        quantity: Number(watch("torta")),
        label: currentTorta?.label,
        description: currentTorta?.description,
        type: currentTorta?.type
      } :
      product === "cebola" ?
      {
        quantity: Number(watch("cebola")),
        label: currentCebola?.label,
        description: currentCebola?.description,
        type: currentCebola?.type
      } :
      null
    )
    .then(
      console.log("Stock successfully updated"),
      handleProductionStatus(product),
      notifySuccess("Produção atualizada!"),
      handleRefresh()
    )
  }

  

  // Updating inputs values
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
      
      setCurrentMisto(misto[0]);
      setCurrentFrango(frango[0]);
      setCurrentSalsicha(salsicha[0]);
      setCurrentEnroladinho(enroladinho[0]);
      setCurrentCoxinha(coxinha[0]);
      setCurrentTorta(torta[0]);
      setCurrentCebola(cebola[0]);

      setValue("misto", misto[0]?.quantity);
      setValue("frango", frango[0]?.quantity);
      setValue("salsicha", salsicha[0]?.quantity);
      setValue("enroladinho", enroladinho[0]?.quantity);
      setValue("coxinha", coxinha[0]?.quantity);
      setValue("torta", torta[0].quantity);
      setValue("cebola", cebola[0]?.quantity);
    }
  }, [stockRaw, refresh, firestoreLoading])

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
