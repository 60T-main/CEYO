import { useEffect, useState } from 'react';
import './App.css'


import AllProducts from './components/AllProducts.jsx';
import Product from './components/Product.jsx';
import Header from './components/Header.jsx'
import Filter from './components/Filter.jsx'
import Cart from './components/Cart.jsx'
import ProductDetail from './components/ProductDetail.jsx';

import { useDebounce } from "use-debounce";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";


const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const GET_OPTIONS = {
  method: 'GET',
  credentials: 'include',
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
};



function App() {

  const [productList, setProductList] = useState([]);
  
  const [cart, setCart] = useState([]);


  const [errorMessage, setErrorMessage] = useState('');
  
  
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm] = useDebounce(searchTerm, 500);

  const [categoriesList, setCategoriesList] = useState([]);


  
  const fetchProducts = async (filters = {}) => {
    

    const params = new URLSearchParams(filters).toString();
    const endpoint = `/product/?${params}`;

    try {
      const response = await fetch(API_BASE_URL + endpoint, GET_OPTIONS);

      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
    
      const data = await response.json();

      if (data.Response === 'False') {
        setErrorMessage(data.Error || 'Failed to fetch products');
        setProductList([]);
        return;
      }

      setProductList(data);

    
    } catch (error) {
      console.error('Error fetching products:', error);
      setErrorMessage('Error fetching products. Please try again later...')
    } 

  }

  const fetchCategories = async () => {
    const endpoint = `/product/categories/`;

     try {
      const response = await fetch(API_BASE_URL + endpoint, GET_OPTIONS);

      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }
    
      const data = await response.json();

      if (data.Response === 'False') {
        setErrorMessage(data.Error || 'Failed to fetch categories');
        setCategoriesList([]);
        return;
      }

       setCategoriesList(data);
    
    } catch (error) {
      console.error('Error fetching categories:', error);
      setErrorMessage('Error fetching categories. Please try again later...')
    } 
  }

  const fetchCart = async () => {
    const endpoint = `/product/cart/`;

     try {
      const response = await fetch(API_BASE_URL + endpoint, GET_OPTIONS);

      if (!response.ok) {
        throw new Error('Failed to fetch cart');
      }
    
      const data = await response.json();

      if (data.Response === 'False') {
        setErrorMessage(data.Error || 'Failed to fetch cart');
        setCart([]);
        return;
      }

       setCart(data);
       
    
    } catch (error) {
      console.error('Error fetching categories:', error);
      setErrorMessage('Error fetching categories. Please try again later...')
    } 
  }
  
  const handleCartUpdate = async () => {
    await fetchCart(); 
};


  
  const onFilter = async (filter = {} ) => {

      fetchProducts({ category: filter.category, min_price: filter.min_price, max_price: filter.max_price })

      
  
  }


  useEffect(() => {
      fetchProducts({ search: debouncedSearchTerm });
      
  }, [debouncedSearchTerm]);

    useEffect(() => {
      fetchCategories();
    }, []);
  
    useEffect(() => {
      fetchCart();
    }, []);
  
  useEffect(() => {
  console.log('Cart updated:', cart);
}, [cart]);

  return ( 
    <main>
<Header
  searchTerm={searchTerm}
  setSearchTerm={setSearchTerm}
  categoriesList={categoriesList}
  setCategoriesList={setCategoriesList}
>
  <Filter
          categoriesList={categoriesList}
          onFilter = {onFilter}
        />
        
        <Cart
          cart={cart}
          setCart={setCart}
          handleCartUpdate= {handleCartUpdate}
        />

</Header>

      <Routes>
        <Route path="/" element={<AllProducts
          products={productList}
          ProductComponent={Product}
          handleCartUpdate = {handleCartUpdate}
        />} />
        <Route path="/product/:id" element={<ProductDetail
          API_BASE_URL={API_BASE_URL}
          ProductComponent={Product}
          handleCartUpdate = {handleCartUpdate}
        />} />
      </Routes>

    </main>
   );
}

export default App
