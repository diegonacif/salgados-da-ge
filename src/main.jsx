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
import { SalesTable } from './components/SalesTable/SalesTable';
import { Stock } from './components/Stock/Stock';
import { UserData } from './components/UserData/UserData';
import { AuthGoogleProvider } from './contexts/AuthGoogleProvider';
import { SalesProvider } from './contexts/SalesProvider';
import { StockSumProvider } from './contexts/StockSumProvider';
import { ToastifyProvider } from './contexts/ToastifyProvider';
import { UpdateProductsProvider } from './contexts/UpdateProductsProvider';
import { UserDataProvider } from './contexts/UserDataProvider';
import { PrivateRoutes } from './PrivateRoutes';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthGoogleProvider>
      <UpdateProductsProvider>
      <StockSumProvider>
      <ToastifyProvider>
      <BrowserRouter>
        <UserDataProvider>
        <SalesProvider>
          <Routes>
            <Route path="/" element={<Menu />} />
            <Route path="login" element={<Login />} />
            <Route element={<PrivateRoutes />}>
              <Route path="sales-table" element={<SalesTable />} />
              <Route path="new-sale" element={<NewSale />} />
              <Route path="stock" element={<Stock />} />
              <Route path="user-data" element={<UserData />} />
            </Route>
          </Routes>
        </SalesProvider>
        </UserDataProvider>
      </BrowserRouter>
      </ToastifyProvider>
      </StockSumProvider>
      </UpdateProductsProvider>
    </AuthGoogleProvider>
  </React.StrictMode>,
)
