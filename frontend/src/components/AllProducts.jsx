import React from 'react';

const AllProducts = ({ productList, ProductComponent, handleCartUpdate, children }) => {
  return (
    <>
      <section className="products-section">
        <div className="page-title">
          <h2>ფეხსაცმელი</h2>
        </div>
        <div className="filter-parent">{children}</div>
        <div className="card-div">
          {productList.map((product) => (
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
