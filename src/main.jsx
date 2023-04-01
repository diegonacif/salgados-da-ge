import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import { App } from './App'
import { Login } from './components/Login/Login';
import { NewSale } from './components/NewSale/NewSale';
import { Stock } from './components/Stock/Stock';
import { StockSumProvider } from './contexts/StockSumProvider';
import { ToastifyProvider } from './contexts/ToastifyProvider';
import { UpdateProductsProvider } from './contexts/UpdateProductsProvider';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <UpdateProductsProvider>
    <StockSumProvider>
    <ToastifyProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/new-sale" element={<NewSale />} />
          <Route path="/stock" element={<Stock />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </ToastifyProvider>
    </StockSumProvider>
    </UpdateProductsProvider>
  </React.StrictMode>,
)
