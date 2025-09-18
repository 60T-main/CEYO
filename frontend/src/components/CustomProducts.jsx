import React, { useEffect } from 'react';

const CustomProducts = ({
  Product,
  currentProduct,
  customProductsList,
  handleCartUpdate,
  closeAllOverlays,
  API_BASE_URL,
  variant,
}) => {
  let CustomProducts = customProductsList.slice(0, 12);

  variant === 'recent' &&
    (CustomProducts = CustomProducts.filter((product) => product.id !== currentProduct.id));

  return (
    <>
      <section className="new-products-section">
        <div className="new-products-title">
          <h2 className="inline-font">
            {variant === 'new' ? 'ახალი კოლექცია' : variant === 'recent' ? 'ბოლოს ნანახი' : ''}
          </h2>
          {variant === 'new' && (
            <p className="inline-font absolute insetx-0 mt-12  text-xxs">→ ყველას ნახვა</p>
          )}
        </div>
        <div className="new-products">
          {CustomProducts.map((product) => (
            <Product
              key={product.id}
              product={product}
              currentProduct={currentProduct}
              handleCartUpdate={handleCartUpdate}
              closeAllOverlays={closeAllOverlays}
              API_BASE_URL={API_BASE_URL}
              variant="home"
            />
          ))}
        </div>
      </section>
    </>
  );
};

export default CustomProducts;
