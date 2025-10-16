import React, { useEffect } from 'react';

import { useProductContext } from '../hooks/ProductStates.jsx';
import { usePageContext } from '../hooks/PageStates.jsx';

const AllProducts = ({
  Product,
  handleCartUpdate,
  children,
  onOverlayClose,
  OrderOverlay,
  onFilter,
  CardSkeleton,
}) => {
  const { productList } = useProductContext();
  const {
    setOverlayState,
    overlayState,
    overlayClosing,
    currentPage,
    postsPerPage,
    setCurrentPage,
    isLoading,
  } = usePageContext();

  const cardCount = 20;

  const lastPostIndex = currentPage * postsPerPage;
  const firstPostIndex = lastPostIndex - postsPerPage;

  const paginated_list = productList.slice(firstPostIndex, lastPostIndex);

  const pages_num = Math.ceil(productList.length / postsPerPage);

  const handleOrderButton = async () => {
    overlayState === 'order' ? onOverlayClose('order') : setOverlayState('order');
  };
  return (
    <>
      <section className={`products-section`}>
        {/* Filter Overlay */}
        {overlayState == 'filter' && (
          <div
            className={`${overlayClosing ? 'animate-slide-left-2' : 'animate-slide-right-2'} ${
              overlayState ? 'filter-active' : 'hidden'
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              onClick={() => {
                onOverlayClose('true');
              }}
              class="bi bi-x-lg icon close"
              viewBox="0 0 16 16"
            >
              <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z" />
            </svg>
            <div className="filter-overlay-parent">{children}</div>
          </div>
        )}

        <div className={overlayState === 'order' ? '' : 'hidden'}>
          <OrderOverlay onFilter={onFilter} />
        </div>

        <div className={`all-products-content ${overlayState === 'filter' ? 'blurred' : ''}`}>
          <div className="page-title">
            <h2>კატალოგი</h2>
          </div>
          <div className="filter-order-parent">
            <button
              onClick={() => {
                setOverlayState('filter');
              }}
              className="filter-button"
            >
              გაფილტვრა
            </button>
            <button
              className="order-button"
              onClick={() => {
                handleOrderButton();
              }}
            >
              დალაგება
            </button>
          </div>
          <div className="cards-parent-all">
            {isLoading
              ? [...Array(cardCount)].map((_, i) => <CardSkeleton variant={'products'} key={i} />)
              : paginated_list.map((product) => (
                  <Product
                    key={product.id}
                    product={product}
                    handleCartUpdate={handleCartUpdate}
                    variant="all-products"
                  />
                ))}
          </div>
          <div className="pages-parent">
            <div className="pages">
              {!(currentPage === 1) && (
                <>
                  {!(currentPage === 2) && (
                    <div className="last-page">
                      <p
                        onClick={() => {
                          setCurrentPage(1);
                        }}
                        key={1}
                      >
                        {'<<'}
                      </p>
                    </div>
                  )}
                  <div className="prev-page">
                    <p
                      onClick={() => {
                        setCurrentPage(currentPage - 1);
                      }}
                      key={currentPage}
                    >
                      {currentPage - 1}
                    </p>
                  </div>
                </>
              )}

              <div className="current-page">
                <p>{currentPage}</p>
              </div>

              {!(currentPage === pages_num) && (
                <>
                  <div className="next-page">
                    <p
                      onClick={() => {
                        setCurrentPage(currentPage + 1);
                      }}
                      key={currentPage}
                    >
                      {currentPage + 1}
                    </p>
                  </div>
                  {!(currentPage === pages_num - 1) && (
                    <div className="last-page">
                      <p
                        onClick={() => {
                          setCurrentPage(pages_num);
                        }}
                        key={pages_num}
                      >
                        {'>>'}
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default AllProducts;
