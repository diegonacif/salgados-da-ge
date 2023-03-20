import React from 'react'
import { Link } from 'react-router-dom';
import { table } from '../../assets/table';
import '../../App.scss';

export const SalesTable = () => {
  return (
    <div className="sales-table-container">
      <Link to="/new-sale">Nova venda</Link>
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
            table.map((entrance, index) => (
              <tr key={index}>
                <td>{entrance.bloco}</td>
                <td>{entrance.apartamento}</td>
                <td>{entrance.misto}</td>
                <td>{entrance.frango}</td>
                <td>{entrance.salsicha}</td>
                <td>{entrance.pao}</td>
                <td>{entrance.pagamento}</td>
                <td>{entrance.status}</td>
                <td>{entrance.data}</td>
                <td>{entrance.preco}</td>
              </tr>
            ))
          }
        </tbody>
      </table>
    </div>
  )
}
