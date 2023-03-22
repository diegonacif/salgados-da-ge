import { collection, getDocs } from 'firebase/firestore';
import React, { createContext, useContext, useEffect, useState } from 'react'
import { db } from '../services/firebase';
import { useSessionStorage } from 'usehooks-ts'
import { useCollection } from 'react-firebase-hooks/firestore';

export const UpdateProductsContext = createContext();

export const UpdateProductsProvider = ({ children }) => {
  const [updateProductId, setUpdateProductId] = useSessionStorage('product-id', '');
  const [saleRaw, setSaleRaw] = useState([]);
  const [firestoreLoading, setFirestoreLoading] = useState(true);
  const [refresh, setRefresh] = useState(false);
  const salesCollectionRef = collection(db, 'vendas');

  // console.log({updateProductId: updateProductId, saleRaw: saleRaw, refresh: refresh})
  console.log(saleRaw[0]);


  // Sale Data
  useEffect(() => {
    const getSalesData = async () => {
      const data = await getDocs(salesCollectionRef);
      const raw = data.docs.map((doc) => ({ ...doc.data(), id: doc.id })).filter(data => data.id === updateProductId);
      setSaleRaw(raw);
    }
    getSalesData();
  }, [updateProductId, refresh])

  // Firestore loading
  const [value, loading, error] = useCollection(salesCollectionRef,
    { snapshotListenOptions: { includeMetadataChanges: true } }
  );
  useEffect(() => {
    setFirestoreLoading(loading);
  }, [loading])

  // Refresh handler
  function refreshHandler() {
    setRefresh(current => !current);
  }

  return (
    <UpdateProductsContext.Provider value={{
      updateProductId,
      setUpdateProductId,
      saleRaw,
      firestoreLoading,
      refreshHandler
    }}>
      {children}
    </UpdateProductsContext.Provider>
  )
}
