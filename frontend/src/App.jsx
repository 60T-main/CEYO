import { useEffect, useState } from 'react';
import './style.css';

import 'bootstrap-icons/font/bootstrap-icons.css';

import { SkeletonTheme } from 'react-loading-skeleton';

import CardSkeleton from './skeletons/CardSkeleton.jsx';

import 'react-loading-skeleton/dist/skeleton.css';

// Page Imports
import Home from './pages/Home.jsx';
import ProductDetail from './pages/ProductDetail.jsx';
import AllProducts from './pages/AllProducts.jsx';
import ProfilePage from './pages/ProfilePage.jsx';

// Component Imports
import HeroBanner from './components/HeroBanner.jsx';
import InfoSection from './components/InfoSection.jsx';
import Product from './components/Product.jsx';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import SearchResults from './components/SearchResults.jsx';
import Menu from './components/icons/MenuIcon.jsx';
import Cart from './components/icons/CartIcon.jsx';
import Search from './components/icons/SearchIcon.jsx';
import SearchInput from './components/SearchInput.jsx';
import User from './components/icons/UserIcon.jsx';
import LogIn from './components/LogIn.jsx';
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

import { useLocation, BrowserRouter as Router, Routes, Route } from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function App() {
  const location = useLocation();

  // States

  const { debouncedSearchTerm, productList } = useProductContext();
  const { overlayState } = usePageContext();

  // Screen Size State
  const MOBILE_BREAKPOINT = 768;
  const [isMobile, setIsMobile] = useState(window.innerWidth < MOBILE_BREAKPOINT);

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

    fetchProducts({
      search: filter.search,
      category: filter.category,
      min_price: filter.min_price,
      max_price: filter.max_price,
      order_by: filter.order_by,
    });
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
      setIsLoading(false);
    };
  }, []);

  useEffect(() => {
    console.log('overlay state:', overlayState);
    const overlays = ['menu', 'cart', 'search', 'filter'];
    if (overlays.includes(overlayState)) {
      setHeaderAnimate('left');
      document.body.style.overflow = 'hidden';
    } else if (overlayState === 'order-close' || overlayState === 'order') {
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
          MenuComponent={Menu}
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
