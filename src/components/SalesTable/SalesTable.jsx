import React, { useContext, useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom';
import { table } from '../../assets/table';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { UpdateProductsContext } from '../../contexts/UpdateProductsProvider';
import { useNavigate } from 'react-router-dom';
import { Header } from '../Header/Header';
import { SalesContext } from '../../contexts/SalesProvider';
import '../../App.scss';

export const SalesTable = () => {
  const salesCollectionRef = collection(db, 'vendas');
  const [salesRaw, setSalesRaw] = useState();
  const { setUpdateProductId, refreshHandler } = useContext(UpdateProductsContext)
  const { refreshForNewSale } = useContext(SalesContext)

  const navigate = useNavigate();

  // Sales Data
  useEffect(() => {
    const getSalesData = async () => {
      const data = await getDocs(salesCollectionRef);
      setSalesRaw(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    }
    getSalesData();
  }, [])

  function handleNewSale() {
    sessionStorage.clear();
    setUpdateProductId('');
    refreshForNewSale();
    navigate("/new-sale")
  }

  function handleUpdateSale(id) {
    setUpdateProductId(id);
    navigate("/new-sale")
  }

  function toDateTime(secs) {
    return new Date(secs * 1000);
  }


  return (
    <>
      <Header />
      <div className="sales-table-container">
        <div className="link-buttons">
          <button onClick={() => navigate("/stock")}>Estoque</button>
          <button onClick={() => handleNewSale()}>Nova venda</button>
        </div>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Bloco</th>
                <th>Apartamento</th>
                <th>Pagamento</th>
                <th>Status</th>
                <th>Data</th>
                <th>Preço</th>
              </tr>
            </thead>
            <tbody>
              { 
                salesRaw?.map((sale, index) => (
                  <tr key={index}>
                    <td onClick={() => handleUpdateSale(sale.id)}>{sale?.block}</td>
                    <td>{sale?.apartment}</td>
                    <td>{sale?.payment}</td>
                    <td className={
                      sale?.status === "Novo Pedido" ? "status-red" :
                      sale?.status === "Saindo" ? "status-blue" :
                      sale?.status === "Entregue" ? "status-green" :
                      null
                    }>
                      {sale?.status}
                    </td>
                    <td>
                      {`${toDateTime(sale.date.seconds).getDate() < 10 ? '0' : ''}${toDateTime(sale.date.seconds).getDate()}/${toDateTime(sale.date.seconds).getMonth() + 1 < 10 ? '0' : ''}${toDateTime(sale.date.seconds).getMonth() + 1}/${toDateTime(sale.date.seconds).getFullYear()}`}
                    </td>
                    <td>R$ {sale?.price},00</td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}
