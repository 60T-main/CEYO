import React from 'react';

const AllProducts = ({ products, ProductComponent, handleCartUpdate }) => {
  return (
    <>
      <section className="card-section">
        <div className="card-div">
          {products.map((product) => (
            <div key={product.id} className="card">
              <ProductComponent product={product} handleCartUpdate={handleCartUpdate} />
            </div>
          ))}
        </div>
      </section>
    </>
  );
};

export default AllProducts;
