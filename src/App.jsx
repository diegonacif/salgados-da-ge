import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { Header } from './components/Header/Header';
import { NewSale } from './components/NewSale/NewSale'
import { SalesTable } from './components/SalesTable/SalesTable'
import './App.scss'
import 'rodal/lib/rodal.css';
import 'react-toastify/dist/ReactToastify.css';
import { Login } from './components/Login/Login';
import { UserData } from './components/UserData/UserData';

export const App = () => {
  const [alreadyRegistered, setAlreadyRegistered] = useState(false)

  return (
    <div className="App">
      <Login />
      <UserData 
        alreadyRegistered={alreadyRegistered}
        setAlreadyRegistered={setAlreadyRegistered}
      />
      <Header />
      <SalesTable />
      <NewSale />
    </div>
  )
}

