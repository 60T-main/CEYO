import React, { useEffect, useRef } from 'react';

import { useProductContext } from '@/hooks/ProductStates.jsx';
import { usePageContext } from '@/hooks/PageStates.jsx';
import { useApi } from '../../services/api'; 

const AllProducts = ({
  Product,
  handleCartUpdate,
  children,
  onOverlayClose,
  OrderOverlay,
  onFilter,
  CardSkeleton,
}) => {
  const { productList, priceState, nameState, productsRaw } = useProductContext();
  const {
    setOverlayState,
    overlayState,
    overlayClosing,
    currentPage,
    postsPerPage,
    isLoading,
  } = usePageContext();

  const {fetchProducts} = useApi()

  const overlayRef = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (overlayRef.current && !overlayRef.current.contains(event.target)) {
        onOverlayClose('filter');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const cardCount = 21;

  const handleOrderButton = async () => {
    overlayState === 'order' ? onOverlayClose('order') : setOverlayState('order');
  };


const handleFetchProducts = async (filters = {}, pageUrl = null) => {
  await fetchProducts(filters, pageUrl); 
};


const handleNextNavigate = (pageTo) => {
    if (pageTo === "next") {
      if (productsRaw && productsRaw.next) {
      handleFetchProducts({}, productsRaw.next)}
    } else {
      if (productsRaw && productsRaw.previous) {
      handleFetchProducts({}, productsRaw.previous)}
    }
    
  }


  return (
    <>
      <section className={`products-section`}>
        {/* Filter Overlay */}
        {overlayState == 'filter' && (
          <div
            className={`${overlayClosing ? 'animate-slide-left-2' : 'animate-slide-right-2'} ${
              overlayState ? 'filter-active' : 'hidden'
            }`}
            ref={overlayRef}
          >
            <div
              onClick={() => {
                onOverlayClose('filter');
              }}
              className="close filter"
            >
              დახურვა
            </div>
            <div className="filter-overlay-parent">{children}</div>
          </div>
        )}

        <div className={overlayState === 'order' ? '' : 'hidden'}>
          <OrderOverlay onFilter={onFilter} />
        </div>

        <div className={`all-products-content ${overlayState === 'filter' ? 'blurred' : ''}`}>
          <div className="page-title inline-font">
            <h2>კატალოგი</h2>
          </div>
          <div className="filter-order-parent">
            <p
              onClick={() => {
                setOverlayState('filter');
              }}
              className="filter-p"
            >
              <i className="bi bi-funnel-fill"></i>
              გაფილტვრა
            </p>
            <p
              className="order-p"
              onClick={() => {
                handleOrderButton();
              }}
            >
              {priceState || nameState ? (
                nameState == 'descensing' || priceState == 'descensing' ? (
                  <i className="bi bi-sort-down"></i>
                ) : nameState == 'ascending' || priceState == 'ascending' ? (
                  <i className="bi bi-sort-up"></i>
                ) : (
                  <i className="bi bi-sort-down"></i>
                )
              ) : (
                <i className="bi bi-sort-down"></i>
              )}
              დალაგება
            </p>
          </div>
          <div className="cards-parent-all">
            {isLoading
              ? [...Array(cardCount)].map((_, i) => <CardSkeleton variant={'products'} key={i} />)
              : productList.map((product) => (
                  <Product
                    key={product.id}
                    product={product}
                    handleCartUpdate={handleCartUpdate}
                    variant="all-products"
                  />
                ))}
          </div>
          <div className="pages-parent">
            {productsRaw && productsRaw.previous ? 
                  <div className='next-page cursor-pointer' onClick={()=>{handleNextNavigate("previous")}}>PREVIOUS</div>
             : ''}
          {productsRaw && productsRaw.next ? 
                <div className='next-page cursor-pointer' onClick={()=>{handleNextNavigate("next")}}>NEXT</div>
           : ''}
           </div>
          
        </div>
      </section>
    </>
  );
}

export default AllProducts;
