import { collection, getDocs } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { db } from '../../services/firebase';
import { Header } from '../Header/Header';

import '../../App.scss';

export const Stock = () => {
  const salesCollectionRef = collection(db, 'vendas');
  const [salesRaw, setSalesRaw] = useState();
  const [carts, setCarts] = useState([]);
  
  const [mistoSum, setMistoSum] = useState(0);
  const [frangoSum, setFrangoSum] = useState(0);
  const [salsichaSum, setSalsichaSum] = useState(0);
  const [enroladinhoSum, setEnroladinhoSum] = useState(0);
  const [coxinhaSum, setCoxinhaSum] = useState(0);
  const [tortaSum, setTortaSum] = useState(0);
  const [cebolaSum, setCebolaSum] = useState(0);

  console.log({
    misto: mistoSum,
    frango: frangoSum,
    salsicha: salsichaSum,
    enroladinho: enroladinhoSum,
    coxinha: coxinhaSum,
    torta: tortaSum,
    cebola: cebolaSum,
  })

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

  return (
    <>
      <Header />
      <div className="stock-container">
        <span>Misto: {mistoSum}</span>
        <span>frango: {frangoSum}</span>
        <span>salsicha: {salsichaSum}</span>
        <span>enroladinho: {enroladinhoSum}</span>
        <span>coxinha: {coxinhaSum}</span>
        <span>torta: {tortaSum}</span>
        <span>cebola: {cebolaSum}</span>
      </div>
    </>
  )
}
