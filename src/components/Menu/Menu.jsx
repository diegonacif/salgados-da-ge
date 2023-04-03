import { useEffect, useState } from 'react';
import { Header } from '../Header/Header';
import imgTemp from '../../assets/bread.png';
import { collection } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { useCollection } from 'react-firebase-hooks/firestore';

export const Menu = () => {
  const stockCollectionRef = collection(db, 'stock');
  const [firestoreLoading, setFirestoreLoading] = useState(true);
  const [assadosArray, setAssadosArray] = useState([]);
  const [fritosArray, setFritosArray] = useState([]);
  const [paesArray, setPaesArray] = useState([]);

  // Firestore loading
  const [value, loading, error] = useCollection(stockCollectionRef,
    { snapshotListenOptions: { includeMetadataChanges: true } }
  );
  useEffect(() => {
    setFirestoreLoading(loading);
  }, [loading])

  return (
    <>
    <Header />
    <div className="menu-container">
      <h3 id="section-title">Salgados Assados</h3>
      <section>
        <div className="product-card">
          <div className="text-content">
            <div className="product-text">
              <h4>Salgado de Frango</h4>
              <p>Salgado assado com recheio de frango com cheddar, gostoso pra caramba, preciso dele.</p>
            </div>
            <div className="product-price">
              <span>R$ 4,00</span>
            </div>
          </div>
          <div className="product-image-wrapper">
            <img src={imgTemp} alt="" />
          </div>
        </div>
        <div className="product-card">
          <div className="text-content">
            <div className="product-text">
              <h4>Salgado de Frango</h4>
              <p>Salgado assado com recheio de frango com cheddar, gostoso pra caramba, preciso dele.</p>
            </div>
            <div className="product-price">
              <span>R$ 4,00</span>
            </div>
          </div>
          <div className="product-image-wrapper">
            <img src={imgTemp} alt="" />
          </div>
        </div>
        <div className="product-card">
          <div className="text-content">
            <div className="product-text">
              <h4>Salgado de Frango</h4>
              <p>Salgado assado com recheio de frango com cheddar, gostoso pra caramba, preciso dele.</p>
            </div>
            <div className="product-price">
              <span>R$ 4,00</span>
            </div>
          </div>
          <div className="product-image-wrapper">
            <img src={imgTemp} alt="" />
          </div>
        </div>
      </section>

      <h3 id="section-title">Salgados Fritos</h3>
      <section>
        <div className="product-card">
          <div className="text-content">
            <div className="product-text">
              <h4>Salgado de Frango</h4>
              <p>Salgado assado com recheio de frango com cheddar, gostoso pra caramba, preciso dele.</p>
            </div>
            <div className="product-price">
              <span>R$ 4,00</span>
            </div>
          </div>
          <div className="product-image-wrapper">
            <img src={imgTemp} alt="" />
          </div>
        </div>
        <div className="product-card">
          <div className="text-content">
            <div className="product-text">
              <h4>Salgado de Frango</h4>
              <p>Salgado assado com recheio de frango com cheddar, gostoso pra caramba, preciso dele.</p>
            </div>
            <div className="product-price">
              <span>R$ 4,00</span>
            </div>
          </div>
          <div className="product-image-wrapper">
            <img src={imgTemp} alt="" />
          </div>
        </div>
        <div className="product-card">
          <div className="text-content">
            <div className="product-text">
              <h4>Salgado de Frango</h4>
              <p>Salgado assado com recheio de frango com cheddar, gostoso pra caramba, preciso dele.</p>
            </div>
            <div className="product-price">
              <span>R$ 4,00</span>
            </div>
          </div>
          <div className="product-image-wrapper">
            <img src={imgTemp} alt="" />
          </div>
        </div>
      </section>

      <h3 id="section-title">Pães</h3>
      <section>
        <div className="product-card">
          <div className="text-content">
            <div className="product-text">
              <h4>Pão de Cebola</h4>
              <p>Salgado assado com recheio de frango com cheddar, gostoso pra caramba, preciso dele.</p>
            </div>
            <div className="product-price">
              <span>R$ 4,00</span>
            </div>
          </div>
          <div className="product-image-wrapper">
            <img src={imgTemp} alt="" />
          </div>
        </div>
      </section>
    </div>
    </>
  )
}
