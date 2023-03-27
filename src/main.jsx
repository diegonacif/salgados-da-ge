import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import { App } from './App'
import { NewSale } from './components/NewSale/NewSale';
import { Stock } from './components/Stock/Stock';
import { UpdateProductsProvider } from './contexts/UpdateProductsProvider';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <UpdateProductsProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/new-sale" element={<NewSale />} />
          <Route path="/stock" element={<Stock />} />
        </Routes>
      </BrowserRouter>
    </UpdateProductsProvider>
  </React.StrictMode>,
)
