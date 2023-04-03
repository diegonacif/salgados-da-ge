import { useContext, useEffect, useState } from 'react';
import { Header } from '../Header/Header';
import imgTemp from '../../assets/bread.png';
import { collection } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { useCollection } from 'react-firebase-hooks/firestore';
import { StockSumContext } from '../../contexts/StockSumProvider';

export const Menu = () => {
  const stockCollectionRef = collection(db, 'stock');
  const [firestoreLoading, setFirestoreLoading] = useState(true);
  const [assadosArray, setAssadosArray] = useState([]);
  const [fritosArray, setFritosArray] = useState([]);
  const [paesArray, setPaesArray] = useState([]);

  console.log(assadosArray);

  // Firestore loading
  const [value, loading, error] = useCollection(stockCollectionRef,
    { snapshotListenOptions: { includeMetadataChanges: true } }
  );
  useEffect(() => {
    setFirestoreLoading(loading);
  }, [loading])

  const {
    stockRaw
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

  return (
    <>
    <Header />
    <div className="menu-container">
      <h3 id="section-title">Salgados Assados</h3>
      <section>
        {
          assadosArray?.map((assado, index) => (
            <div className="product-card" key={`${assado.label}-${index}`}>
              <div className="text-content">
                <div className="product-text">
                  {/* <h4>{assado.label}</h4> */}
                  <p>{assado.description}</p>
                </div>
                <div className="product-price">
                  <span>{`R$ ${typePrice(assado.type)}`}</span>
                </div>
              </div>
              <div className="product-image-wrapper">
                <img src={imgTemp} alt="" />
              </div>
            </div>
          ))
        }
      </section>

      <h3 id="section-title">Salgados Fritos</h3>
      <section>
        {
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
                <img src={imgTemp} alt="" />
              </div>
            </div>
          ))
        }
      </section>

      <h3 id="section-title">Pães</h3>
      <section>
        {
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
                <img src={imgTemp} alt="" />
              </div>
            </div>
          ))
        }
      </section>
    </div>
    </>
  )
}
