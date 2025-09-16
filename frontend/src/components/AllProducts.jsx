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
}) => {
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
            <img
              onClick={() => {
                onOverlayClose('true');
              }}
              className="w-5"
              src="/public/menu2.svg"
              alt="Menu2"
            />
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
            {productList.map((product) => (
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
