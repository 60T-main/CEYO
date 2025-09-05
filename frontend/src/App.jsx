import { useEffect, useState } from 'react';
import './App.css'


import AllProducts from './components/AllProducts.jsx';
import Product from './components/Product.jsx';
import Header from './components/Header.jsx'
import Filter from './components/Filter.jsx'
import ProductDetail from './components/ProductDetail.jsx';

import { useDebounce } from "use-debounce";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";


const API_BASE_URL = 'http://localhost:8000';

function App() {

  const [productList, setProductList] = useState([]);

  const [errorMessage, setErrorMessage] = useState('');
  
  
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm] = useDebounce(searchTerm, 500);

  const [categoriesList, setCategoriesList] = useState([]);


  
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

  const fetchCategories = async () => {
    const endpoint = `/product/categories/`;

     try {
      const response = await fetch(API_BASE_URL + endpoint);

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
  
  const onFilter = async (filter = {} ) => {

      fetchProducts({ category: filter.category, min_price: filter.min_price, max_price: filter.max_price })

      console.log(filter);
      
    

  }


  useEffect(() => {
      fetchProducts({ search: debouncedSearchTerm });
  }, [debouncedSearchTerm]);

    useEffect(() => {
      fetchCategories();
  }, []);

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
</Header>

      <Routes>
        <Route path="/" element={<AllProducts
          products={productList}
          ProductComponent={Product}
        />} />
        <Route path="/product/:id" element={<ProductDetail
          API_BASE_URL={API_BASE_URL}
          ProductComponent={Product}
        />} />
      </Routes>

    </main>
   );
}

export default App
