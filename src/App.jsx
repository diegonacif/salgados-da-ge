import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { Header } from './components/Header/Header';
import { NewSale } from './components/NewSale/NewSale'
import { SalesTable } from './components/SalesTable/SalesTable'
import './App.scss'
import 'react-toastify/dist/ReactToastify.css';

export const App = () => {

  return (
    <div className="App">
      <Header />
      <SalesTable />
      
    </div>
  )
}

