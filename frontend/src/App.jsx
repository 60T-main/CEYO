import { useEffect, useState } from 'react';
import './style.css';

import Home from './components/Home.jsx';
import HeroBanner from './components/HeroBanner.jsx';
import Menu from './components/Menu.jsx';
import Product from './components/Product.jsx';
import Header from './components/Header.jsx';
import Filter from './components/Filter.jsx';
import Cart from './components/Cart.jsx';
import AllProducts from './components/AllProducts.jsx';
import SearchResults from './components/SearchResults.jsx';
import ProductDetail from './components/ProductDetail.jsx';
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

  // Menu State
  const [menuActive, setMenuActive] = useState(false);
  const [menuClosing, setMenuClosing] = useState(false);

  // Search Page State
  const [searchActive, setSearchActive] = useState(false);
  const [searchClosing, setSearchClosing] = useState(false);

  // Search Page State
  const [cartActive, setCartActive] = useState(false);
  const [cartClosing, setCartClosing] = useState(false);

  // Error State
  const [errorMessage, setErrorMessage] = useState('');

  // Search State
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm] = useDebounce(searchTerm, 500);

  // Categories State
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

  const onMenuClose = async () => {
    console.log('menu closing initiated');

    setMenuClosing(true);

    setTimeout(() => {
      setMenuActive(false);
      setMenuClosing(false);
    }, 300);
  };

  const onSearchClose = async () => {
    console.log('search closing initiated');

    setSearchClosing(true);

    setTimeout(() => {
      setSearchActive(false);
      setSearchClosing(false);
    }, 300);
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

  const onCartClose = async () => {
    console.log('cart closing initiated');

    setCartClosing(true);

    setTimeout(() => {
      setCartActive(false);
      setCartClosing(false);
    }, 300);
  };

  const closeAllOverlays = async () => {
    onCartClose();
    onSearchClose();
    onMenuClose();
  };

  // UseEffects

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
      <div
        className={`${menuClosing ? 'animate-slide-up' : 'animate-slide-down'} ${
          menuActive ? 'menu-active' : 'hidden'
        }`}
      >
        {/* Menu Content */}
      </div>

      <SearchOverlay
        searchTerm={searchTerm}
        debouncedSearchTerm={debouncedSearchTerm}
        setSearchTerm={setSearchTerm}
        searchClosing={searchClosing}
        searchActive={searchActive}
        SearchResults={SearchResults}
        products={productList}
        ProductComponent={Product}
        handleCartUpdate={handleCartUpdate}
        closeAllOverlays={closeAllOverlays}
      />

      <div
        className={`${cartClosing ? 'animate-slide-right' : 'animate-slide-left'} ${
          cartActive ? 'cart-active' : 'hidden'
        }`}
      >
        {/* Cart Content */}
      </div>

      {/* CART */}
      <div className="hidden">
        {cart.cart_items && cart.cart_items.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'row', gap: '1rem', marginLeft: '2rem' }}>
            <div>Cart: </div>
            <div>{cart.total_items}</div>
            <div>${cart.total_price}</div>
            <div>
              {cart.cart_items.map((item) => (
                <div
                  className="cartItem"
                  style={{ display: 'flex', justifyContent: 'right' }}
                  key={item.id}
                >
                  <div>
                    {item.name} {item.quantity} $ {item.subtotal}
                  </div>
                  <button
                    onClick={(e) => handleRemoveFromCart(item.id, e)}
                    style={{ color: 'red', cursor: 'pointer', marginLeft: '1rem' }}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div style={{ color: 'red' }}>cart is empty</div>
        )}
      </div>

      <Header
        categoriesList={categoriesList}
        setCategoriesList={setCategoriesList}
        MenuComponent={Menu}
        setMenuActive={setMenuActive}
        onMenuClose={onMenuClose}
        menuActive={menuActive}
      >
        <Search
          searchActive={searchActive}
          setSearchActive={setSearchActive}
          searchClosing={searchClosing}
          setSearchClosing={setSearchClosing}
          onSearchClose={onSearchClose}
        />
        <Cart
          cartActive={cartActive}
          setCartActive={setCartActive}
          cartClosing={cartClosing}
          setCartClosing={setCartClosing}
          onCartClose={onCartClose}
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
