import { useContext, useEffect, useState } from 'react';
import { Header } from '../Header/Header';
import imgTemp from '../../assets/bread.png';
import { collection } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { useCollection } from 'react-firebase-hooks/firestore';
import { StockSumContext } from '../../contexts/StockSumProvider';
import loadingGif from '../../assets/load-orange-2.gif';

import '../../App.scss';
import Rodal from 'rodal';
import { ShoppingCart } from '@phosphor-icons/react';

export const Menu = () => {
  const stockCollectionRef = collection(db, 'stock');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [assadosArray, setAssadosArray] = useState([]);
  const [fritosArray, setFritosArray] = useState([]);
  const [paesArray, setPaesArray] = useState([]);

  // console.log(assadosArray);

  // // Firestore loading
  // const [value, loading, error] = useCollection(stockCollectionRef,
  //   { snapshotListenOptions: { includeMetadataChanges: true } }
  // );
  // useEffect(() => {
  //   setFirestoreLoading(loading);
  // }, [loading])

  const {
    stockRaw,
    firestoreLoading
  } = useContext(StockSumContext);

  // Loading stock products by type
  useEffect(() => {
    const stockAssados = stockRaw?.filter(stock => stock.type === "assado");
    const stockFritos = stockRaw?.filter(stock => stock.type === "frito");
    const stockPaes = stockRaw?.filter(stock => stock.type === "pao");
    setAssadosArray(stockAssados);
    setFritosArray(stockFritos);
    setPaesArray(stockPaes);
  }, [firestoreLoading, stockRaw])


  // Pricing by type
  const typePrice = (type) => {
    if(type === 'assado') {
      return '4,00'
    } else if (type === 'frito') {
      return '3,00'
    } else if (type === 'pao') {
      return '1,00'
    }
  }

  const modalCustomStyles = {
    height: '100vh',
    width: '400px',
  }

  return (
    <>
    <Header />
    <div className="menu-container">
      <h3 id="section-title">Salgados Assados</h3>
      <section>
        { 
          firestoreLoading ?
          <img src={loadingGif} alt="loading gif" className="loading-gif" /> :
          assadosArray?.map((assado, index) => (
            <div className="product-card" key={`${assado.label}-${index}`}>
              <div className="text-content">
                <div className="product-text">
                  <h4>{assado.label}</h4>
                  <p>{assado.description}</p>
                </div>
                <div className="product-price">
                  <span>{`R$ ${typePrice(assado.type)}`}</span>
                </div>
              </div>
              <div className="product-image-wrapper">
                <img src={imgTemp} alt="" loading="lazy" />
              </div>
            </div>
          ))
        }
      </section>

      <h3 id="section-title">Salgados Fritos</h3>
      <section>
        {
          firestoreLoading ?
          <img src={loadingGif} alt="loading gif" className="loading-gif" /> :
          fritosArray?.map((frito, index) => (
            <div className="product-card" key={`${frito.label}-${index}`}>
              <div className="text-content">
                <div className="product-text">
                  <h4>{frito.label}</h4>
                  <p>{frito.description}</p>
                </div>
                <div className="product-price">
                  <span>{`R$ ${typePrice(frito.type)}`}</span>
                </div>
              </div>
              <div className="product-image-wrapper">
                <img src={imgTemp} alt="" loading="lazy" />
              </div>
            </div>
          ))
        }
      </section>

      <h3 id="section-title">Pães</h3>
      <section>
        {
          firestoreLoading ?
          <img src={loadingGif} alt="loading gif" className="loading-gif" /> :
          paesArray?.map((pao, index) => (
            <div className="product-card" key={`${pao.label}-${index}`}>
              <div className="text-content">
                <div className="product-text">
                  <h4>{pao.label}</h4>
                  <p>{pao.description}</p>
                </div>
                <div className="product-price">
                  <span>{`R$ ${typePrice(pao.type)}`}</span>
                </div>
              </div>
              <div className="product-image-wrapper">
                <img src={imgTemp} alt="" loading="lazy" />
              </div>
            </div>
          ))
        }
      </section>
      <ShoppingCart 
        size={36} 
        weight="bold" 
        id="cart-button" 
        onClick={() => setIsCartOpen(true)}
      />
      <Rodal
        visible={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        className='rodal-container'
        id='rodal-cart'
        animation='slideRight'
        duration={400}
        showMask={true}
        closeMaskOnClick={true}
        showCloseButton={false}
        closeOnEsc={true}
        customStyles={modalCustomStyles}
      >
        <h1>teste</h1>
      </Rodal>
    </div>
    </>
  )
}
