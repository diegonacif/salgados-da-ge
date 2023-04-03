import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import { App } from './App'
import { Login } from './components/Login/Login';
import { Menu } from './components/Menu/Menu';
import { NewSale } from './components/NewSale/NewSale';
import { Stock } from './components/Stock/Stock';
import { UserData } from './components/UserData/UserData';
import { AuthGoogleProvider } from './contexts/AuthGoogleProvider';
import { StockSumProvider } from './contexts/StockSumProvider';
import { ToastifyProvider } from './contexts/ToastifyProvider';
import { UpdateProductsProvider } from './contexts/UpdateProductsProvider';
import { PrivateRoutes } from './PrivateRoutes';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthGoogleProvider>
      <UpdateProductsProvider>
      <StockSumProvider>
      <ToastifyProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Menu />} />
            <Route element={<PrivateRoutes />}>
              <Route path="/management" element={<App />} />
              <Route path="/new-sale" element={<NewSale />} />
              <Route path="/stock" element={<Stock />} />
              <Route path="/user-data" element={<UserData />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ToastifyProvider>
      </StockSumProvider>
      </UpdateProductsProvider>
    </AuthGoogleProvider>
  </React.StrictMode>,
)
