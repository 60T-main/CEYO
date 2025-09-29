import React, { createContext, useContext, useState } from 'react';
import { useDebounce } from 'use-debounce';

const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  // All Products State
  const [productList, setProductList] = useState([]);
  // Recent Products State
  const [recentProductList, setRecentProductList] = useState([]);
  // Date Ordered Products State
  const [dateOrderedProducts, setDateOrderedProducts] = useState([]);
  // Categories List
  const [categoriesList, setCategoriesList] = useState([]);
  // Cart List
  const [cart, setCart] = useState([]);
  // Search State
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm] = useDebounce(searchTerm, 500);

  return (
    <ProductContext.Provider
      value={{
        productList,
        setProductList,
        recentProductList,
        setRecentProductList,
        dateOrderedProducts,
        setDateOrderedProducts,
        categoriesList,
        setCategoriesList,
        cart,
        setCart,
        searchTerm,
        setSearchTerm,
        debouncedSearchTerm,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProductContext = () => useContext(ProductContext);
