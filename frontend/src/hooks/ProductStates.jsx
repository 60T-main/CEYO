import React, { createContext, useContext, useState } from 'react';
import { useDebounce } from 'use-debounce';

const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  // All Products State
  const [productList, setProductList] = useState([]);
  // All Products State
  const [productDetail, setProductDetail] = useState([]);
  // Recent Products State
  const [recentProductList, setRecentProductList] = useState(null);
  // Date Ordered Products State
  const [dateOrderedProducts, setDateOrderedProducts] = useState([]);
  // Categories List
  const [categoriesList, setCategoriesList] = useState([]);
  // Cart List
  const [cart, setCart] = useState([]);
  // Search State
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm] = useDebounce(searchTerm, 500);

  // Delivery Cost State
  const [deliveryCost, setDeliveryCost] = useState(null);

  // Payment Method State
  const [selectedPayment, setSelectedPayment] = useState('cash');

  // Product order states (by price and name)
  const [priceState, setPriceState] = useState(null);
  const [nameState, setNameState] = useState(null);

  // Filter States
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [chosenCategory, setChosenCategory] = useState('');
  const [chosenSubCategory, setChosenSubCategory] = useState('');

  // Address Form

  const [form, setForm] = useState({
    full_name: '',
    city: '',
    address_line1: '',
    address_line2: '',
    email: '',
    phone: '',
  });

  return (
    <ProductContext.Provider
      value={{
        productList,
        setProductList,
        productDetail,
        setProductDetail,
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
        form,
        setForm,
        deliveryCost,
        setDeliveryCost,
        selectedPayment,
        setSelectedPayment,
        priceState,
        setPriceState,
        nameState,
        setNameState,
        minPrice,
        setMinPrice,
        maxPrice,
        setMaxPrice,
        chosenCategory,
        setChosenCategory,
        chosenSubCategory,
        setChosenSubCategory,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProductContext = () => useContext(ProductContext);
