import { useEffect, useState } from 'react';
import './App.css'


import AllProducts from './components/AllProducts.jsx';
import Product from './components/Product.jsx';
import Header from './components/header.jsx'
import ProductDetail from './components/ProductDetail.jsx';

import { useDebounce } from "use-debounce";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";


const API_BASE_URL = 'http://localhost:8000';

function App() {

  const [productList, setProductList] = useState([]);

  const [errorMessage, setErrorMessage] = useState('');
  
  
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm] = useDebounce(searchTerm, 500);

  const [filterCategory, setFilterCategory] = useState('');
  const [debouncedfilterCategory] = useDebounce(filterCategory, 500);

  
  const fetchProducts = async (filters = {}) => {

    const params = new URLSearchParams(filters).toString();
    const endpoint = `/product/?${params}`;

    try {
      const response = await fetch(API_BASE_URL + endpoint);

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


  useEffect(() => {
      fetchProducts({ search: debouncedSearchTerm, category: debouncedfilterCategory });
  }, [debouncedSearchTerm]);


  return ( 
    <main>
      <Header
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      ></Header>

      <Routes>
        <Route path="/" element={<AllProducts
          products={productList}
          ProductComponent={Product}
        />} />
          <Route path="/product/:id" element={<ProductDetail
            API_BASE_URL={API_BASE_URL}
          ProductComponent={Product}/>} />
      </Routes>

      </main>
   );
}

export default App
