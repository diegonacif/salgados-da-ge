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

  useEffect(() => {
    const stockAssados = stockRaw?.filter(stock => stock.type === "assado");
    const stockFritos = stockRaw?.filter(stock => stock.type === "frito");
    const stockPaes = stockRaw?.filter(stock => stock.type === "pao");
    setAssadosArray(stockAssados);
    setFritosArray(stockFritos);
    setPaesArray(stockPaes);
  }, [firestoreLoading, stockRaw])

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
                  <h4>{assado.label}</h4>
                  <p>{assado.description}</p>
                </div>
                <div className="product-price">
                  <span>R$ 4,00</span>
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
          fritosArray?.map((assado, index) => (
            <div className="product-card" key={`${assado.label}-${index}`}>
              <div className="text-content">
                <div className="product-text">
                  <h4>{assado.label}</h4>
                  <p>{assado.description}</p>
                </div>
                <div className="product-price">
                  <span>R$ 4,00</span>
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
          paesArray?.map((assado, index) => (
            <div className="product-card" key={`${assado.label}-${index}`}>
              <div className="text-content">
                <div className="product-text">
                  <h4>{assado.label}</h4>
                  <p>{assado.description}</p>
                </div>
                <div className="product-price">
                  <span>R$ 4,00</span>
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
