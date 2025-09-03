import { useEffect, useState } from 'react';
import './App.css'

import Product from './components/Product.jsx';



const API_BASE_URL = 'http://localhost:8000';

const API_OPTIONS = {
  method: 'GET',
}

function App() {

  const [productList, setProductList] = useState([]);

  const [errorMessage, setErrorMessage] = useState('');

  
  const fetchProducts = async () => {
    

    try {

      const endpoint = '/product/'; 
      
      const response = await fetch(API_BASE_URL + endpoint, API_OPTIONS);

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
      fetchProducts();
  }, []);

  return ( 
    <main>
          <header className="header">
            <img className="logo" src="./ceyo-logo.avif" alt="Ceyo Logo"/>
          </header>
      

          <section className="card-section">
            <h2>All Products</h2>
            <ul className="card-ul">
              {productList.map((product) => (
                <Product key={product.product_id} product={product} />
              ))}
            </ul>
          </section>
    </main>
   );
}

export default App
