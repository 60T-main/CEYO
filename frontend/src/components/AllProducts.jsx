import React from 'react';

const AllProducts = ({ products,  ProductComponent, handleCartUpdate }) => {
    return (
    <>
          <section className="card-section">
            <h2>All Products</h2>
          <div className="card-div">
            {products.map((product) => (
              <div key={product.product_id} className="card">
                
                <ProductComponent product={product} handleCartUpdate={handleCartUpdate} />
              </div>
            ))}
          </div>
        
          </section>
    </>
    )
};
    
export default AllProducts;






