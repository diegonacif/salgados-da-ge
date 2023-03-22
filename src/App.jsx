import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './App.scss'
import { NewSale } from './components/NewSale/NewSale'
import { SalesTable } from './components/SalesTable/SalesTable'

export const App = () => {
  return (
    <div className="App">
      <SalesTable />
    </div>
  )
}

