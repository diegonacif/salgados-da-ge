import React, { useContext, useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom';
import { table } from '../../assets/table';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { UpdateProductsContext } from '../../contexts/UpdateProductsProvider';
import { useNavigate } from 'react-router-dom';
import '../../App.scss';

export const SalesTable = () => {
  const salesCollectionRef = collection(db, 'vendas');
  const [salesRaw, setSalesRaw] = useState();
  const { setUpdateProductId, refreshHandler } = useContext(UpdateProductsContext)

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
    <div className="sales-table-container">
      <span onClick={() => handleNewSale()}>Nova venda</span>
      <table>
        <thead>
          <tr>
            <th>Bloco</th>
            <th>Apartamento</th>
            <th>Misto</th>
            <th>Frango</th>
            <th>Salsicha</th>
            <th>Pão</th>
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
                <td>
                  {
                    sale?.cart.filter((product) =>  product.product === "Misto").length === 0 ?
                    0 :
                    sale?.cart.filter((product) =>  product.product === "Misto")[0].quantity
                  }
                </td>
                <td>
                  {
                    sale?.cart.filter((product) =>  product.product === "Frango").length === 0 ?
                    0 :
                    sale?.cart.filter((product) =>  product.product === "Frango")[0].quantity
                  }
                </td>
                <td>
                  {
                    sale?.cart.filter((product) =>  product.product === "Salsicha").length === 0 ?
                    0 :
                    sale?.cart.filter((product) =>  product.product === "Salsicha")[0].quantity
                  }
                </td>
                <td>
                  {
                    sale?.cart.filter((product) =>  product.product === "Cebola").length === 0 ?
                    0 :
                    sale?.cart.filter((product) =>  product.product === "Cebola")[0].quantity
                  }
                </td>
                <td>{sale?.payment}</td>
                <td>{sale?.status}</td>
                <td>
                  {`${toDateTime(sale.date.seconds).getDate()}/${toDateTime(sale.date.seconds).getMonth() + 1}/${toDateTime(sale.date.seconds).getFullYear()}`}
                </td>
                <td>{sale?.preco}</td>
              </tr>
            ))
          }
        </tbody>
      </table>
    </div>
  )
}
