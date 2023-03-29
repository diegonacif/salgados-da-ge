import { createContext, useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export const ToastifyContext = createContext();

export const ToastifyProvider = ({ children }) => {

  const notifySuccess = (message) => toast.success(message);
  const notifyError = (message) => toast.error(message);

  return (
    <ToastifyContext.Provider value={{ 
      notifySuccess,
      notifyError
    }}>
      {children}
      <ToastContainer 
        position="bottom-right"
        autoClose={4000}
        // autoClose={false}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </ToastifyContext.Provider>
  )
}