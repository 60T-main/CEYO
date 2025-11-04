import React, { useState, useContext, createContext } from 'react';

export const ErrorContext = createContext();

export const ErrorProvider = ({ children }) => {
  const [errorMessage, setErrorMessage] = useState('');
  const [errorMessageCart, setErrorMessageCart] = useState('');

  return (
    <ErrorContext.Provider
      value={{
        errorMessage,
        setErrorMessage,
        errorMessageCart,
        setErrorMessageCart,
      }}
    >
      {children}
    </ErrorContext.Provider>
  );
};

export const useErrorContext = () => useContext(ErrorContext);
