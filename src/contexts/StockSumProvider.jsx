import { collection, getDocs } from 'firebase/firestore';
import React, { createContext, useEffect, useState } from 'react'
import { useCollection } from 'react-firebase-hooks/firestore';
import { db } from '../services/firebase';

export const StockSumContext = createContext();

export const StockSumProvider = ({ children }) => {
  const salesCollectionRef = collection(db, 'vendas');
  const stockCollectionRef = collection(db, 'stock');
  const [stockRaw, setStockRaw] = useState();
  const [salesRaw, setSalesRaw] = useState();
  const [carts, setCarts] = useState([]);
  const [firestoreLoading, setFirestoreLoading] = useState(true);
  const [refresh, setRefresh] = useState(false);

  console.log(stockRaw);

  const [mistoSum, setMistoSum] = useState(0);
  const [frangoSum, setFrangoSum] = useState(0);
  const [salsichaSum, setSalsichaSum] = useState(0);
  const [enroladinhoSum, setEnroladinhoSum] = useState(0);
  const [coxinhaSum, setCoxinhaSum] = useState(0);
  const [tortaSum, setTortaSum] = useState(0);
  const [cebolaSum, setCebolaSum] = useState(0);

  const [mistoStock, setMistoStock] = useState(0);
  const [frangoStock, setFrangoStock] = useState(0);
  const [salsichaStock, setSalsichaStock] = useState(0);
  const [enroladinhoStock, setEnroladinhoStock] = useState(0);
  const [coxinhaStock, setCoxinhaStock] = useState(0);
  const [tortaStock, setTortaStock] = useState(0);
  const [cebolaStock, setCebolaStock] = useState(0);

  // console.log({mistoSum: mistoSum, mistoStock: mistoStock})

   // Firestore loading
  const [value, loading, error] = useCollection(stockCollectionRef,
    { snapshotListenOptions: { includeMetadataChanges: true } }
  );
  useEffect(() => {
    setFirestoreLoading(loading);
  }, [loading])

  // Load production values
  useEffect(() => {
    const getSalesData = async () => {
      const data = await getDocs(stockCollectionRef);
      const raw = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
      setStockRaw(raw);
    }
    getSalesData();
  }, [refresh, firestoreLoading])

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

      setMistoStock(misto[0]?.quantity);
      setFrangoStock(frango[0]?.quantity);
      setSalsichaStock(salsicha[0]?.quantity);
      setEnroladinhoStock(enroladinho[0]?.quantity);
      setCoxinhaStock(coxinha[0]?.quantity);
      setTortaStock(torta[0]?.quantity);
      setCebolaStock(cebola[0]?.quantity);
    }
  }, [stockRaw, firestoreLoading, refresh])

  // Sales Data
  useEffect(() => {
    const getSalesData = async () => {
      const data = await getDocs(salesCollectionRef);
      setSalesRaw(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };
    getSalesData();
  }, [stockRaw, firestoreLoading, refresh])

   // Load Carts Data
  useEffect(() => {
    setCarts([]);
    const getCarts = () => {
      salesRaw?.map((sale, index) => 
        setCarts(current => current.concat(sale.cart))
      )
    }
    getCarts();
  }, [salesRaw, firestoreLoading, refresh])

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
  }, [carts, firestoreLoading, refresh])

  function handleRefresh() {
    setRefresh(current => !current);
  }


  return (
    <StockSumContext.Provider value={{
    mistoSum, setMistoSum,
    frangoSum, setFrangoSum,
    salsichaSum, setSalsichaSum,
    enroladinhoSum, setEnroladinhoSum,
    coxinhaSum, setCoxinhaSum,
    tortaSum, setTortaSum,
    cebolaSum, setCebolaSum,
    mistoStock, setMistoStock,
    frangoStock, setFrangoStock,
    salsichaStock, setSalsichaStock,
    enroladinhoStock, setEnroladinhoStock,
    coxinhaStock, setCoxinhaStock,
    tortaStock, setTortaStock,
    cebolaStock, setCebolaStock,
    handleRefresh, refresh,
    stockRaw, setStockRaw
    }}>
      {children}
    </StockSumContext.Provider>
  )
}
