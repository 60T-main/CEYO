import { useEffect, useState } from 'react';
import './style.css';

import Home from './components/Home.jsx';
import HeroBanner from './components/HeroBanner.jsx';
import Menu from './components/Menu.jsx';
import Product from './components/Product.jsx';
import Header from './components/Header.jsx';
import Filter from './components/Filter.jsx';
import AllProducts from './components/AllProducts.jsx';
import SearchResults from './components/SearchResults.jsx';
import ProductDetail from './components/ProductDetail.jsx';
import Cart from './components/Cart.jsx';
import CartOverlay from './components/CartOverlay.jsx';
import Search from './components/Search.jsx';
import SearchOverlay from './components/SearchOverlay.jsx';

import { useDebounce } from 'use-debounce';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const GET_OPTIONS = {
  method: 'GET',
  credentials: 'include',
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
};

function App() {
  // Products State
  const [productList, setProductList] = useState([]);

  // Cart State
  const [cart, setCart] = useState([]);

  // Search State
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm] = useDebounce(searchTerm, 500);

  // Categories State
  const [categoriesList, setCategoriesList] = useState([]);

  // Overlay States: 'menu', 'search', 'cart' or null
  const [overlayState, setOverlayState] = useState('none');
  const [overlayClosing, setOverlayClosing] = useState(null);

  // Header Animation State

  const [headerAnimate, setHeaderAnimate] = useState('none');

  // Error State
  const [errorMessage, setErrorMessage] = useState('');

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
      setErrorMessage('Error fetching products. Please try again later...');
    }
  };

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
      setErrorMessage('Error fetching categories. Please try again later...');
    }
  };

  // Functions

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
      setErrorMessage('Error fetching categories. Please try again later...');
    }
  };

  const handleCartUpdate = async () => {
    await fetchCart();
  };

  const onFilter = async (filter = {}) => {
    fetchProducts({
      category: filter.category,
      min_price: filter.min_price,
      max_price: filter.max_price,
    });
  };

  const handleRemoveFromCart = async (id, e) => {
    e.preventDefault();

    const response = await fetch(`${API_BASE_URL}/product/cart/delete`, {
      method: 'DELETE',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: id }),
    });
    const data = await response.json();

    handleCartUpdate();
  };

  const onOverlayClose = async (overlay) => {
    console.log(`${overlay} closing initiated`);

    setOverlayClosing(overlay);

    setTimeout(() => {
      setOverlayState(null);
      setOverlayClosing(null);
    }, 300);
  };

  // UseEffects

  useEffect(() => {
    fetchProducts({ search: debouncedSearchTerm });
  }, [debouncedSearchTerm]);

  useEffect(() => {
    fetchCategories();
    fetchCart();
  }, []);

  useEffect(() => {
    console.log('Cart updated:', cart);
  }, [cart]);

  useEffect(() => {
    const overlays = ['menu', 'search', 'cart'];

    if (overlayState === 'none') {
      setHeaderAnimate('none');
    } else if (overlays.includes(overlayState)) {
      setHeaderAnimate('left');
    } else {
      setHeaderAnimate('right');
    }

    console.log('headerAnimate:', headerAnimate);
    console.log('overlayState:', overlayState);
  }, [overlayState]);

  return (
    <main>
      {overlayState == 'menu' && (
        <div
          className={`${overlayClosing ? 'animate-slide-up' : 'animate-slide-down'} ${
            overlayState ? 'menu-active' : 'hidden'
          }`}
        >
          {/* Menu Content */}
        </div>
      )}

      {/* Search Overlay */}
      {overlayState == 'search' && (
        <SearchOverlay
          searchTerm={searchTerm}
          debouncedSearchTerm={debouncedSearchTerm}
          setSearchTerm={setSearchTerm}
          overlayClosing={overlayClosing}
          overlayState={overlayState}
          SearchResults={SearchResults}
          products={productList}
          ProductComponent={Product}
          handleCartUpdate={handleCartUpdate}
        />
      )}

      {/* Cart Overlay */}
      {overlayState == 'cart' && (
        <CartOverlay
          cart={cart}
          handleCartUpdate={handleCartUpdate}
          handleRemoveFromCart={handleRemoveFromCart}
          overlayClosing={overlayClosing}
          overlayState={overlayState}
        />
      )}

      <Header
        categoriesList={categoriesList}
        setCategoriesList={setCategoriesList}
        MenuComponent={Menu}
        setOverlayState={setOverlayState}
        overlayState={overlayState}
        onOverlayClose={onOverlayClose}
        headerAnimate={headerAnimate}
      >
        <Search
          overlayState={overlayState}
          setOverlayState={setOverlayState}
          overlayClosing={overlayClosing}
          setOverlayClosing={setOverlayClosing}
          onOverlayClose={onOverlayClose}
        />
        <Cart
          overlayState={overlayState}
          setOverlayState={setOverlayState}
          overlayClosing={overlayClosing}
          setOverlayClosing={setOverlayClosing}
          onOverlayClose={onOverlayClose}
        />
      </Header>

      <Routes>
        <Route path="/" element={<Home HeroBanner={HeroBanner} />} />
        <Route
          path="/product/:id"
          element={
            <ProductDetail
              API_BASE_URL={API_BASE_URL}
              ProductComponent={Product}
              handleCartUpdate={handleCartUpdate}
            />
          }
        />
      </Routes>
    </main>
  );
}

export default App;
