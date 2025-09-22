import React from 'react';

const AllProducts = ({
  productList,
  Product,
  handleCartUpdate,
  setOverlayState,
  overlayState,
  children,
  overlayClosing,
  onOverlayClose,
  OrderOverlay,
  onFilter,
  CardSkeleton,
  isLoading,
}) => {
  const cardCount = 10;

  console.log('loading:', isLoading);

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
            <h2>ფეხსაცმელი</h2>
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
              : productList.map((product) => (
                  <Product
                    key={product.id}
                    product={product}
                    handleCartUpdate={handleCartUpdate}
                    variant="all-products"
                  />
                ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default AllProducts;
