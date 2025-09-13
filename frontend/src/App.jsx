import { useEffect, useState } from 'react';
import './style.css';

import Home from './components/Home.jsx';
import HeroBanner from './components/HeroBanner.jsx';
import InfoSection from './components/InfoSection.jsx';
import Product from './components/Product.jsx';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import Filter from './components/Filter.jsx';
import AllProducts from './components/AllProducts.jsx';
import NewProducts from './components/NewProducts.jsx';
import SearchResults from './components/SearchResults.jsx';
import ProductDetail from './components/ProductDetail.jsx';
import Menu from './components/Menu.jsx';
import MenuOverlay from './components/MenuOverlay.jsx';
import Cart from './components/Cart.jsx';
import CartOverlay from './components/CartOverlay.jsx';
import Search from './components/Search.jsx';
import SearchOverlay from './components/SearchOverlay.jsx';
import SearchInput from './components/SearchInput.jsx';

import { useDebounce } from 'use-debounce';
import { useLocation, BrowserRouter as Router, Routes, Route } from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const GET_OPTIONS = {
  method: 'GET',
  credentials: 'include',
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
};

function App() {
  const location = useLocation();

  // Products State
  const [productList, setProductList] = useState([]);

  // Date Ordered Products State
  const [dateOrderedProducts, setDateOrderedProducts] = useState([]);

  // Cart State
  const [cart, setCart] = useState([]);

  // Search State
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm] = useDebounce(searchTerm, 500);

  // Categories List State
  const [categoriesList, setCategoriesList] = useState([]);

  // Overlay States: 'menu', 'search', 'cart' or null
  const [overlayState, setOverlayState] = useState('none');
  const [overlayClosing, setOverlayClosing] = useState(null);

  // Header Animation State
  const [headerAnimate, setHeaderAnimate] = useState('none');

  // Error State
  const [errorMessage, setErrorMessage] = useState('');

  // Functions
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

      if (filters.price_ascending) {
        setDateOrderedProducts(data);
        console.log('price_ascending triggered: ', filters.price_ascending);
      } else {
        setProductList(data);
      }
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
    !filter.category && (filter.category = '');
    !filter.min_price && (filter.min_price = '');
    !filter.max_price && (filter.max_price = '');
    !filter.search && (filter.search = '');

    console.log(
      'onFilter running',
      'search:',
      filter.search,
      filter.category,
      filter.min_price,
      filter.max_price
    );

    fetchProducts({
      search: filter.search,
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
    fetchProducts({ price_ascending: 'true' });
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
  }, [overlayState]);

  return (
    <main>
      {/* Menu Overlay */}
      {overlayState == 'menu' && (
        <MenuOverlay
          overlayClosing={overlayClosing}
          overlayState={overlayState}
          categoriesList={categoriesList}
          onFilter={onFilter}
          onOverlayClose={onOverlayClose}
        />
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
          SearchInput={SearchInput}
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
          onFilter={onFilter}
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
        {location.pathname !== '/product' && location.pathname !== '/product/' && (
          <Search
            overlayState={overlayState}
            setOverlayState={setOverlayState}
            overlayClosing={overlayClosing}
            setOverlayClosing={setOverlayClosing}
            onOverlayClose={onOverlayClose}
          />
        )}

        <Cart
          overlayState={overlayState}
          setOverlayState={setOverlayState}
          overlayClosing={overlayClosing}
          setOverlayClosing={setOverlayClosing}
          onOverlayClose={onOverlayClose}
        />
      </Header>

      <Routes>
        <Route
          path="/"
          element={
            <Home
              HeroBanner={HeroBanner}
              dateOrderedProducts={dateOrderedProducts}
              Product={Product}
              handleCartUpdate={handleCartUpdate}
            >
              <NewProducts
                Product={Product}
                dateOrderedProducts={dateOrderedProducts}
                handleCartUpdate={handleCartUpdate}
              />
              <InfoSection />
            </Home>
          }
        />
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
        <Route
          path="/product"
          element={
            <AllProducts
              ProductComponent={Product}
              handleCartUpdate={handleCartUpdate}
              productList={productList}
            >
              <SearchInput searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
              <Filter
                categoriesList={categoriesList}
                onFilter={onFilter}
                debouncedSearchTerm={debouncedSearchTerm}
              />
            </AllProducts>
          }
        />
      </Routes>

      <Footer />
    </main>
  );
}

export default App;
