import React from 'react';

const NewProducts = ({ Product, dateOrderedProducts, handleCartUpdate, closeAllOverlays }) => {
  const newProducts = dateOrderedProducts.slice(0, 12);
  return (
    <>
      <section className="new-products-section">
        <div className="new-products-title">
          <h2 className="inline-font">ახალი კოლექცია</h2>
          <p className="inline-font absolute insetx-0 mt-12  text-xxs">→ ყველას ნახვა</p>
        </div>
        <div className="new-products">
          {newProducts.map((product) => (
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
