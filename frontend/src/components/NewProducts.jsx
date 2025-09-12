import React from 'react';

const NewProducts = ({ Product, dateOrderedProducts, handleCartUpdate, closeAllOverlays }) => {
  return (
    <>
      <section className="new-products-section">
        <div className="new-products-title">
          <h2>ახალი კოლექცია</h2>
        </div>
        <div className="new-products-categories">ქალები . კაცები . ბავშვები</div>
        <div className="new-products">
          {dateOrderedProducts.map((product) => (
            <Product
              product={product}
              handleCartUpdate={handleCartUpdate}
              closeAllOverlays={closeAllOverlays}
            />
          ))}
        </div>
      </section>
    </>
  );
};

export default NewProducts;
