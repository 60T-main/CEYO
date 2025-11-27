import { useEffect, useState } from 'react';
import './style.css';

import 'bootstrap-icons/font/bootstrap-icons.css';

import { SkeletonTheme } from 'react-loading-skeleton';

import CardSkeleton from './skeletons/CardSkeleton.jsx';

import 'react-loading-skeleton/dist/skeleton.css';

import { useNavigate } from 'react-router-dom';

// Page Imports
import Home from './pages/home/Home.jsx';
import ProductDetail from './pages/productdetail/ProductDetail.jsx';
import AllProducts from './pages/allproducts/AllProducts.jsx';
import ProfilePage from './pages/profile/ProfilePage.jsx';
import Checkout from './pages/checkout/Checkout.jsx';

// Component Imports
import HeroBanner from './pages/home/HeroBanner.jsx';
import InfoSection from './pages/home/InfoSection.jsx';
import Product from './components/Product.jsx';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import SearchResults from './components/SearchResults.jsx';
import Menu from './components/icons/MenuIcon.jsx';
import Cart from './components/icons/CartIcon.jsx';
import Search from './components/icons/SearchIcon.jsx';
import SearchInput from './components/SearchInput.jsx';
import User from './components/icons/UserIcon.jsx';
import LogIn from './pages/profile/LogIn.jsx';
import CustomProducts from './components/CustomProducts.jsx';

// Overlay Imports
import FilterOverlay from './overlays/FilterOverlay.jsx';
import OrderOverlay from './overlays/OrderOverlay.jsx';
import MenuOverlay from './overlays/MenuOverlay.jsx';
import CartOverlay from './overlays/CartOverlay.jsx';
import SearchOverlay from './overlays/SearchOverlay.jsx';

// Hook Imports
import { useProductContext } from './hooks/ProductStates.jsx';
import { usePageContext } from './hooks/PageStates.jsx';
import ScrollToTop from './hooks/ScrollToTop.jsx';

// API imports
import { useApi } from './services/api.jsx';
// Option Imports
import { GET_OPTIONS, POST_OPTIONS, PUT_OPTIONS } from './services/api.jsx';

import { useLocation, BrowserRouter as Router, Routes, Route } from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function App() {
  const location = useLocation();

  const { fetchCategories, fetchCart, fetchProducts, getUserInfo, handleCartUpdate } = useApi();

  // States
  const { productList, categoriesList, searchTerm, setSearchTerm, debouncedSearchTerm } =
    useProductContext();
  const {
    overlayState,
    setOverlayState,
    overlayClosing,
    setOverlayClosing,
    setHeaderAnimate,
    isLoading,
    setIsLoading,
  } = usePageContext();

  // Screen Size State
  const MOBILE_BREAKPOINT = 768;
  const [isMobile, setIsMobile] = useState(window.innerWidth < MOBILE_BREAKPOINT);

  const onFilter = async (filter = {}) => {
    const expectedKeys = ['category', 'min_price', 'max_price', 'search', 'order_by', 'page'];

    expectedKeys.forEach((key) => {
      if (!filter[key]) {
        filter[key] = '';
      }
    });

    fetchProducts({
      search: filter.search,
      category: filter.category,
      min_price: filter.min_price,
      max_price: filter.max_price,
      order_by: filter.order_by,
      page: filter.page
    });
  };

  const onOverlayClose = async (overlay) => {
    setOverlayClosing(overlay);

    if (overlay === 'order') {
      setOverlayState('order-close');
      setOverlayClosing(null);
    } else if (overlay === 'checkout') {
      setOverlayState('checkout-close');
      setOverlayClosing(null);
    } else if (overlay === 'cart') {
      setOverlayState('cart-close');
      setOverlayClosing(null);
    } else if (overlay === 'category') {
      setOverlayState('category-close');
      setOverlayClosing(null);
    } else if (overlay === 'filter') {
      setTimeout(() => {
        setOverlayState('filter-close');
        setOverlayClosing(null);
      }, 200);
    } else {
      setTimeout(() => {
        setOverlayState(null);
        setOverlayClosing(null);
      }, 200);
    }
  };

  // UseEffects

  useEffect(() => {
    fetchProducts({ search: debouncedSearchTerm });
  }, [debouncedSearchTerm]);

  useEffect(() => {
    fetchCategories();
    fetchCart();
    getUserInfo();

    return () => {
      setIsLoading(false);
    };
  }, []);

  // Header Logo Animations
  useEffect(() => {
    const overlays = ['menu', 'cart', 'search'];
    const NoAnimation = [
      'order-close',
      'order',
      'checkout',
      'checkout-close',
      'filter',
      'filter-close',
      'category',
      'category-close',
    ];
    if (overlays.includes(overlayState)) {
      setHeaderAnimate('left');
      document.body.style.overflow = 'hidden';
    } else if (NoAnimation.includes(overlayState)) {
      if (overlayState === 'checkout' || overlayState === 'checkout-close') {
        document.body.style.overflow = 'auto';
      }

      setHeaderAnimate(null);
    } else if (!overlayState) {
      setHeaderAnimate('right');
      document.body.style.overflow = 'auto';
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
            handleCartUpdate={handleCartUpdate}
            overlayState={overlayState}
            onFilter={onFilter}
            overlayClosing={overlayClosing}
            onOverlayClose={onOverlayClose}
            useNavigate={useNavigate}
          />
        )}
        <Header MenuComponent={Menu} onOverlayClose={onOverlayClose} onFilter={onFilter}>
          <Search />
          <Cart />
          <User overlayState={overlayState} />
        </Header>
        <Routes>
          <Route
            path="/"
            element={
              <Home HeroBanner={HeroBanner}>
                <CustomProducts
                  Product={Product}
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
                overlayState={overlayState}
                onOverlayClose={onOverlayClose}
                OrderOverlay={OrderOverlay}
                onFilter={onFilter}
                CardSkeleton={CardSkeleton}
                isLoading={isLoading}
              >
                <FilterOverlay onFilter={onFilter} debouncedSearchTerm={debouncedSearchTerm} onOverlayClose ={onOverlayClose } />
              </AllProducts>
            }
          />
          <Route
            path="/profile"
            element={
              <ProfilePage
                PUT_OPTIONS={PUT_OPTIONS}
                POST_OPTIONS={POST_OPTIONS}
                API_BASE_URL={API_BASE_URL}
                LogIn={LogIn}
              ></ProfilePage>
            }
          />
          <Route
            path="/checkout"
            element={
              <Checkout
                onOverlayClose={onOverlayClose}
                overlayState={overlayState}
                setOverlayState={setOverlayState}
                setOverlayClosing={setOverlayClosing}
                API_BASE_URL={API_BASE_URL}
              ></Checkout>
            }
          />
        </Routes>
        <Footer />
      </SkeletonTheme>
    </main>
  );
}

export default App;
