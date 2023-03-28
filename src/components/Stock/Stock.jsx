import { collection, getDocs } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { db } from '../../services/firebase';
import { Header } from '../Header/Header';
import { BiEdit, BiSend } from 'react-icons/bi';

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

  const [editProductionStatus, setEditProductionStatus] = useState(false);

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

  // Handle production status
  function handleProductionStatus() {
    setEditProductionStatus(current => !current)
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
                  editProductionStatus ?
                  <>
                    <input type="number" />
                    <BiSend size={24} onClick={() => handleProductionStatus()} />
                  </> :
                  <>
                    <span>50</span>
                    <BiEdit size={24} onClick={() => handleProductionStatus()} />
                  </>
                }
              </div>
            </div>
            <div className="remain-row">
              <label htmlFor="remain-number">Estoque</label>
              <span>88</span>
            </div>
          </div>

          {/* Frango */}
          <div className="stock-row">
            <span id="product-title">Frango</span>
            <div className="production-row">
              <label htmlFor="production-number">Produzidos</label>
              <div className="production-inner">
                {
                  editProductionStatus ?
                  <>
                    <input type="number" />
                    <BiSend size={24} onClick={() => handleProductionStatus()} />
                  </> :
                  <>
                    <span>50</span>
                    <BiEdit size={24} onClick={() => handleProductionStatus()} />
                  </>
                }
              </div>
            </div>
            <div className="remain-row">
              <label htmlFor="remain-number">Estoque</label>
              <span>88</span>
            </div>
          </div>

          {/* Salsicha */}
          <div className="stock-row">
            <span id="product-title">Salsicha</span>
            <div className="production-row">
              <label htmlFor="production-number">Produzidos</label>
              <div className="production-inner">
                {
                  editProductionStatus ?
                  <>
                    <input type="number" />
                    <BiSend size={24} onClick={() => handleProductionStatus()} />
                  </> :
                  <>
                    <span>50</span>
                    <BiEdit size={24} onClick={() => handleProductionStatus()} />
                  </>
                }
              </div>
            </div>
            <div className="remain-row">
              <label htmlFor="remain-number">Estoque</label>
              <span>88</span>
            </div>
          </div>

          {/* Enroladinho */}
          <div className="stock-row">
            <span id="product-title">Enroladinho</span>
            <div className="production-row">
              <label htmlFor="production-number">Produzidos</label>
              <div className="production-inner">
                {
                  editProductionStatus ?
                  <>
                    <input type="number" />
                    <BiSend size={24} onClick={() => handleProductionStatus()} />
                  </> :
                  <>
                    <span>50</span>
                    <BiEdit size={24} onClick={() => handleProductionStatus()} />
                  </>
                }
              </div>
            </div>
            <div className="remain-row">
              <label htmlFor="remain-number">Estoque</label>
              <span>88</span>
            </div>
          </div>

          {/* Coxinha */}
          <div className="stock-row">
            <span id="product-title">Coxinha</span>
            <div className="production-row">
              <label htmlFor="production-number">Produzidos</label>
              <div className="production-inner">
                {
                  editProductionStatus ?
                  <>
                    <input type="number" />
                    <BiSend size={24} onClick={() => handleProductionStatus()} />
                  </> :
                  <>
                    <span>50</span>
                    <BiEdit size={24} onClick={() => handleProductionStatus()} />
                  </>
                }
              </div>
            </div>
            <div className="remain-row">
              <label htmlFor="remain-number">Estoque</label>
              <span>88</span>
            </div>
          </div>

          {/* Torta */}
          <div className="stock-row">
            <span id="product-title">Torta</span>
            <div className="production-row">
              <label htmlFor="production-number">Produzidos</label>
              <div className="production-inner">
                {
                  editProductionStatus ?
                  <>
                    <input type="number" />
                    <BiSend size={24} onClick={() => handleProductionStatus()} />
                  </> :
                  <>
                    <span>50</span>
                    <BiEdit size={24} onClick={() => handleProductionStatus()} />
                  </>
                }
              </div>
            </div>
            <div className="remain-row">
              <label htmlFor="remain-number">Estoque</label>
              <span>88</span>
            </div>
          </div>

          {/* Pão de Cebola */}
          <div className="stock-row">
            <span id="product-title">Pão de Cebola</span>
            <div className="production-row">
              <label htmlFor="production-number">Produzidos</label>
              <div className="production-inner">
                {
                  editProductionStatus ?
                  <>
                    <input type="number" />
                    <BiSend size={24} onClick={() => handleProductionStatus()} />
                  </> :
                  <>
                    <span>50</span>
                    <BiEdit size={24} onClick={() => handleProductionStatus()} />
                  </>
                }
              </div>
            </div>
            <div className="remain-row">
              <label htmlFor="remain-number">Estoque</label>
              <span>88</span>
            </div>
          </div>
        </div>

      </div>
    </>
  )
}
