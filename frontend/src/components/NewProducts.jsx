import React from 'react';

const NewProducts = ({ Product, dateOrderedProducts, handleCartUpdate, closeAllOverlays }) => {
  return (
    <>
      <section className="new-products-section">
        <div className="new-products-title">
          <h2 className="inline-font">ახალი კოლექცია</h2>
        </div>
        <div className="new-products">
          {dateOrderedProducts.map((product) => (
            <Product
              key={product.id}
              product={product}
              handleCartUpdate={handleCartUpdate}
              closeAllOverlays={closeAllOverlays}
              variant="home"
            />
          ))}
        </div>
      </section>
    </>
  );
};

export default NewProducts;
