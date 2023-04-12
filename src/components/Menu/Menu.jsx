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
import { CustomerCart } from '../CustomerCart/CustomerCart';
import { ProductHandler } from '../ProductHandler/ProductHandler';
import { Footer } from '../Footer/Footer';

export const Menu = () => {
  const stockCollectionRef = collection(db, 'stock');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isDishHandlerOpen, setIsDishHandlerOpen] = useState(false);
  const [assadosArray, setAssadosArray] = useState([]);
  const [fritosArray, setFritosArray] = useState([]);
  const [paesArray, setPaesArray] = useState([]);

  const [currentProductHandle, setCurrentProductHandle] = useState()

  const {
    mistoStock, mistoSum,
    frangoStock, frangoSum,
    salsichaStock, salsichaSum,
    enroladinhoStock, enroladinhoSum,
    coxinhaStock, coxinhaSum,
    tortaStock, tortaSum,
    cebolaStock, cebolaSum,
    stockRaw,
    firestoreLoading
  } = useContext(StockSumContext);
  // console.log(mistoStock);

  
 

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

  // Product Handler Modal Opening
  const productHandlerModal = (product) => {
    setCurrentProductHandle(product)
    setIsDishHandlerOpen(true)
  }

  const modalCustomStyles = {
    height: '100vh',
    width: '400px',
    maxWidth: '100vw'
  }

  const modalProductHandlerStyles = {
    height: 'max-content',
    width: '400px',
    maxWidth: '90vw'
  }

  // Salgados Images Object
  const salgadosImages = (salgado) => {
    return `/src/assets/salgados/${salgado}.png`
  }

  // mistoSum

  const remainingStock = (salgado) => {
    if(salgado === 'misto') {
      return mistoSum
    } else if (salgado === 'frango') {
      return frangoSum
    } else if (salgado === 'salsicha') {
      return salsichaSum
    } else if (salgado === 'enroladinho') {
      return enroladinhoSum
    } else if (salgado === 'coxinha') {
      return coxinhaSum
    } else if (salgado === 'torta') {
      return tortaSum
    } else if (salgado === 'cebola') {
      return cebolaSum
    } else {
      console.log('error in remainingStock')
    }
  }

  return (
    <>
    <Header 
      currentPage="menu"
      setIsCartOpen={setIsCartOpen}
    />
    <div className="menu-container">
      <h3 id="section-title">Pães</h3>
      <section>
        {
          firestoreLoading ?
          <img src={loadingGif} alt="loading gif" className="loading-gif" /> :
          paesArray?.map((pao, index) => (
            <div 
              className={pao.quantity - remainingStock(pao.id) > 0 ? "product-card" : "product-card out-of-stock"}  
              key={`${pao.label}-${index}`}
              onClick={() => pao.quantity - remainingStock(pao.id) > 0 && productHandlerModal(pao)}
            >
              <div className="text-content">
                <div className="product-text">
                  <h4>{pao.label}</h4>
                  <p>{pao.description}</p>
                </div>
                <div className="product-price">
                {
                  pao.quantity - remainingStock(pao.id) > 0 ?
                  <span>{`R$ ${typePrice(pao.type)}`}</span> :
                  <span id="out-of-stock-text">Indisponível</span>
                }
                </div>
              </div>
              <div className="product-image-wrapper" id={`${pao?.id}`}>
                {/* <img src={salgadosImages(pao.id)} alt="" /> */}
              </div>
            </div>
          ))
        }
      </section>

      <h3 id="section-title">Salgados Assados</h3>
      <section>
        { 
          firestoreLoading ?
          <img src={loadingGif} alt="loading gif" className="loading-gif" /> :
          assadosArray?.map((assado, index) => (
            <div 
              className={assado.quantity - remainingStock(assado.id) > 0 ? "product-card" : "product-card out-of-stock"} 
              key={`${assado.label}-${index}`}
              onClick={() => assado.quantity - remainingStock(assado.id) > 0 && productHandlerModal(assado)}
            >
              <div className="text-content">
                <div className="product-text">
                  <h4>{assado.label}</h4>
                  <p>{assado.description}</p>
                </div>
                <div className="product-price">
                  {
                    assado.quantity - remainingStock(assado.id) > 0 ?
                    <span>{`R$ ${typePrice(assado.type)}`}</span> :
                    <span id="out-of-stock-text">Indisponível</span>
                  }
                </div>
              </div>
              <div className="product-image-wrapper" id={`${assado?.id}`}>
                {/* <img src={salgadosImages(assado.id)} alt="" /> */}
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
            <div 
              className={frito.quantity - remainingStock(frito.id) > 0 ? "product-card" : "product-card out-of-stock"} 
              key={`${frito.label}-${index}`}
              onClick={() => frito.quantity - remainingStock(frito.id) > 0 && productHandlerModal(frito)}
            >
              <div className="text-content">
                <div className="product-text">
                  <h4>{frito.label}</h4>
                  <p>{frito.description}</p>
                </div>
                <div className="product-price">
                {
                  frito.quantity - remainingStock(frito.id) > 0 ?
                  <span>{`R$ ${typePrice(frito.type)}`}</span> :
                  <span id="out-of-stock-text">Indisponível</span>
                }
                </div>
              </div>
              <div className="product-image-wrapper" id={`${frito?.id}`}>
                {/* <img src={salgadosImages(frito.id)} alt="" /> */}
              </div>
            </div>
          ))
        }
      </section>

      
      {/* <ShoppingCart 
        size={36} 
        weight="duotone" 
        id="cart-button" 
        onClick={() => setIsCartOpen(true)}
      /> */}
      <Rodal
        visible={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        className='rodal-cart-container'
        id='rodal-cart'
        animation='slideRight'
        duration={400}
        showMask={true}
        closeMaskOnClick={true}
        showCloseButton={true}
        closeOnEsc={true}
        customStyles={modalCustomStyles}
      >
        <CustomerCart setIsCartOpen={setIsCartOpen} />
      </Rodal>

      <Rodal
        visible={isDishHandlerOpen}
        onClose={() => setIsDishHandlerOpen(false)}
        className='rodal-product-handler'
        id='rodal-handler'
        animation='zoom'
        duration={300}
        showMask={true}
        closeMaskOnClick={true}
        showCloseButton={true}
        closeOnEsc={true}
        customStyles={modalProductHandlerStyles}
      >
        <ProductHandler 
          currentProduct={currentProductHandle} 
          pricer={typePrice} 
          setIsDishHandlerOpen={setIsDishHandlerOpen}
        />
      </Rodal>
    </div>
    <Footer />
    </>
  )
}
