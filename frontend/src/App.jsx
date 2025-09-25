import { useEffect, useState } from 'react';
import './style.css';

import 'bootstrap-icons/font/bootstrap-icons.css';

import { SkeletonTheme } from 'react-loading-skeleton';

import CardSkeleton from './components/CardSkeleton.jsx';

import 'react-loading-skeleton/dist/skeleton.css';

import Home from './components/Home.jsx';
import HeroBanner from './components/HeroBanner.jsx';
import InfoSection from './components/InfoSection.jsx';
import Product from './components/Product.jsx';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import FilterOverlay from './components/FilterOverlay.jsx';
import OrderOverlay from './components/OrderOverlay.jsx';

import AllProducts from './components/AllProducts.jsx';
import NewProducts from './components/CustomProducts.jsx';
import SearchResults from './components/SearchResults.jsx';
import ProductDetail from './components/ProductDetail.jsx';
import Menu from './components/Menu.jsx';
import MenuOverlay from './components/MenuOverlay.jsx';
import Cart from './components/Cart.jsx';
import CartOverlay from './components/CartOverlay.jsx';
import Search from './components/Search.jsx';
import SearchOverlay from './components/SearchOverlay.jsx';
import SearchInput from './components/SearchInput.jsx';
import User from './components/User.jsx';
import ProfilePage from './components/ProfilePage.jsx';
import LogIn from './components/LogIn.jsx';

import ScrollToTop from './components/ScrollToTop';

import { useDebounce } from 'use-debounce';
import { useLocation, BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CustomProducts from './components/CustomProducts.jsx';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const GET_OPTIONS = {
  method: 'GET',
  credentials: 'include',
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
};

const POST_OPTIONS = {
  method: 'POST',
  credentials: 'include',
  headers: { 'Content-Type': 'application/json' },
};
const PUT_OPTIONS = {
  method: 'PUT',
  credentials: 'include',
  headers: { 'Content-Type': 'application/json' },
};

const DELETE_OPTIONS = {
  method: 'DELETE',
  credentials: 'include',
  headers: { 'Content-Type': 'application/json' },
};

function App() {
  const location = useLocation();

  // Screen Size State
  const MOBILE_BREAKPOINT = 768;
  const [isMobile, setIsMobile] = useState(window.innerWidth < MOBILE_BREAKPOINT);

  // Products State
  const [productList, setProductList] = useState([]);

  // Recent Products State
  const [recentProductList, setRecentProductList] = useState([]);

  // Date Ordered Products State
  const [dateOrderedProducts, setDateOrderedProducts] = useState([]);

  // Cart State
  const [cart, setCart] = useState([]);

  // Search State
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm] = useDebounce(searchTerm, 500);

  // Categories List State
  const [categoriesList, setCategoriesList] = useState([]);

  // Overlay States: 'menu', 'search', 'cart', 'filter', 'order', 'none' or null
  const [overlayState, setOverlayState] = useState('none');
  const [overlayClosing, setOverlayClosing] = useState(null);

  // Header Animation State
  const [headerAnimate, setHeaderAnimate] = useState(null);

  // Loading State
  const [isLoading, setIsLoading] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage, setPostsPerPage] = useState(4);

  // User States
  const [loggedIn, setLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState('');

  // Error State
  const [errorMessage, setErrorMessage] = useState('');

  // Functions

  // Keep reference to last in-flight products fetch to avoid race conditions resetting isLoading
  const fetchProducts = async (filters = {}) => {
    setIsLoading(true);

    const params = new URLSearchParams(filters).toString();
    const endpoint = `/product/?${params}`;

    try {
      const response = await fetch(API_BASE_URL + endpoint, { ...GET_OPTIONS });

      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }

      const data = await response.json();

      if (data.Response === 'False') {
        setErrorMessage(data.Error || 'Failed to fetch products');
        setProductList([]);
        return;
      }

      if (filters.order_by === 'last_modified') {
        setDateOrderedProducts(data);

        console.log('date_descending triggered: ', filters.order_by);
      } else {
        setProductList(data);

        console.log('productList updated:', filters);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setErrorMessage('Error fetching products. Please try again later...');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRecentProducts = async () => {
    const endpoint = `/product/recents`;
    setIsLoading(true);

    try {
      const response = await fetch(API_BASE_URL + endpoint, GET_OPTIONS);

      if (!response.ok) {
        throw new Error('Failed to fetch recent products');
      }

      const data = await response.json();

      if (data.Response === 'False') {
        setErrorMessage(data.Error || 'Failed to fetch recent products');
        setRecentProductList([]);
        return;
      }

      setRecentProductList(data);
    } catch (error) {
      console.error('Error fetching recent products:', error);
      setErrorMessage('Error fetching recent products. Please try again later...');
    } finally {
      // Ensure loading state is always cleared, even when early returns occur above
      setIsLoading(false);
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
    const expectedKeys = ['category', 'min_price', 'max_price', 'search', 'order_by'];

    expectedKeys.forEach((key) => {
      if (!filter[key]) {
        filter[key] = '';
      }
    });

    console.log(
      'onFilter running',
      'search:',
      filter.search,
      filter.category,
      filter.min_price,
      filter.max_price,
      filter.order_by
    );

    fetchProducts({
      search: filter.search,
      category: filter.category,
      min_price: filter.min_price,
      max_price: filter.max_price,
      order_by: filter.order_by,
    });
  };

  const handleRemoveFromCart = async (id, e) => {
    e.preventDefault();

    const endpoint = '/product/cart/delete/';

    try {
      const response = await fetch(API_BASE_URL + endpoint, {
        ...DELETE_OPTIONS,
        body: JSON.stringify({ id: id }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error('Failed to add to cart');
      }

      handleCartUpdate();
    } catch (error) {
      console.error('Error adding comment:', error);
      setErrorMessage('Error adding comment. Please try again later...');
    }
  };

  // PROFILE/LOGIN/REGISTER/LOGOUT

  const checkIfLogedIn = async () => {
    const endpoint = '/customer/status/';
    try {
      const response = await fetch(API_BASE_URL + endpoint, GET_OPTIONS);
      const data = await response.json();
      if (!response.ok) {
        throw new Error('Failed to get login status');
      }
      setLoggedIn(!!data.loggedIn);
      return !!data.loggedIn;
    } catch (error) {
      console.error('Error getting login status:', error);
      setErrorMessage('Error getting login status. Please try again later...');
      setLoggedIn(false);
      return false;
    }
  };

  const getUserInfo = async () => {
    const userEndpoint = '/customer/user/';
    const isLogged = await checkIfLogedIn();
    if (!isLogged) {
      setUserInfo(null);
      return null;
    }
    try {
      const response = await fetch(API_BASE_URL + userEndpoint, GET_OPTIONS);
      const data = await response.json();
      if (!response.ok) {
        throw new Error('Failed to get user info');
      }
      setUserInfo(data);
      return data;
    } catch (error) {
      console.error('Error getting user info:', error);
      setErrorMessage('Error getting user info. Please try again later...');
      setUserInfo(null);
      return null;
    }
  };

  const onOverlayClose = async (overlay) => {
    console.log('onOverlayClose activated:', overlay);

    setOverlayClosing(overlay);

    if (overlay === 'order') {
      setOverlayState('order-close');
      setOverlayClosing(null);
    } else {
      setTimeout(() => {
        setOverlayState(null);
        setOverlayClosing(null);
      }, 300);
    }
  };

  // UseEffects

  useEffect(() => {
    fetchProducts({ search: debouncedSearchTerm });
  }, [debouncedSearchTerm]);

  useEffect(() => {
    fetchCategories();
    fetchCart();
    fetchProducts({ order_by: 'last_modified' });
    getUserInfo();

    return () => {
      // Abort any in-flight products request on unmount
      if (fetchProducts.lastController) {
        fetchProducts.lastController.abort();
      }
      setIsLoading(false);
    };
  }, []);

  useEffect(() => {
    console.log('overlay state:', overlayState);
    const overlays = ['menu', 'cart', 'search', 'filter'];
    if (overlays.includes(overlayState)) {
      setHeaderAnimate('left');
    } else if (overlayState === 'order-close' || overlayState === 'order') {
      setHeaderAnimate(null);
    } else if (!overlayState) {
      setHeaderAnimate('right');
    }
  }, [overlayState]);

  useEffect(() => {
    const handleResize = () => {
      const mobileNow = window.innerWidth < MOBILE_BREAKPOINT;
      setIsMobile(mobileNow);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    console.log(isMobile ? 'Switched to mobile' : 'Switched to desktop');
    setHeaderAnimate(null);
  }, [isMobile]);

  useEffect(() => {
    console.log('headerAnimate:', headerAnimate);
  }, [headerAnimate]);

  useEffect(() => {
    console.log('Cart updated:', cart);
  }, [cart]);

  // Safety: if products list updates but isLoading somehow stayed true, clear it
  useEffect(() => {
    if (productList.length && isLoading) {
      setIsLoading(false);
    }
  }, [productList]);

  return (
    <main className="app-root">
      <SkeletonTheme baseColor="#bebebeff" highlightColor="#E6E9ED">
        <ScrollToTop />
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
            isLoading={isLoading}
            CardSkeleton={CardSkeleton}
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
          onFilter={onFilter}
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
            cart={cart}
          />
          <User overlayState={overlayState} />
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
                <CustomProducts
                  Product={Product}
                  customProductsList={dateOrderedProducts}
                  handleCartUpdate={handleCartUpdate}
                  API_BASE_URL={API_BASE_URL}
                  CardSkeleton={CardSkeleton}
                  variant="new"
                  isLoading={isLoading}
                ></CustomProducts>
                <InfoSection />
              </Home>
            }
          />
          <Route
            path="/product/:id"
            element={
              <ProductDetail
                API_BASE_URL={API_BASE_URL}
                GET_OPTIONS={GET_OPTIONS}
                POST_OPTIONS={POST_OPTIONS}
                ProductComponent={Product}
                handleCartUpdate={handleCartUpdate}
                fetchRecentProducts={fetchRecentProducts}
                recentProductList={recentProductList}
                NewProducts={NewProducts}
                isLoading={isLoading}
                CardSkeleton={CardSkeleton}
              ></ProductDetail>
            }
          />
          <Route
            path="/product"
            element={
              <AllProducts
                Product={Product}
                handleCartUpdate={handleCartUpdate}
                productList={productList}
                setOverlayState={setOverlayState}
                setOverlayClosing={setOverlayClosing}
                overlayState={overlayState}
                overlayClosing={overlayClosing}
                onOverlayClose={onOverlayClose}
                OrderOverlay={OrderOverlay}
                onFilter={onFilter}
                CardSkeleton={CardSkeleton}
                isLoading={isLoading}
                postsPerPage={postsPerPage}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
              >
                <SearchInput searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
                <FilterOverlay
                  categoriesList={categoriesList}
                  onFilter={onFilter}
                  debouncedSearchTerm={debouncedSearchTerm}
                />
              </AllProducts>
            }
          />
          <Route
            path="/profile"
            element={
              <ProfilePage
                loggedIn={loggedIn}
                getUserInfo={getUserInfo}
                userInfo={userInfo}
                checkIfLogedIn={checkIfLogedIn}
                PUT_OPTIONS={PUT_OPTIONS}
                POST_OPTIONS={POST_OPTIONS}
                API_BASE_URL={API_BASE_URL}
                LogIn={LogIn}
              ></ProfilePage>
            }
          />
        </Routes>
        <Footer />
      </SkeletonTheme>
    </main>
  );
}

export default App;
