import React from 'react';


import { Link } from "react-router-dom";

const AllProducts = ({ products,  ProductComponent }) => {
    return (
    <>
          <section className="card-section">
            <h2>All Products</h2>
          <div className="card-div">
            {products.map((product) => (
              <div key={product.product_id} className="card">
                
                <Link to={`/product/${product.product_id}`}
                  style={{ textDecoration: "none", color: "inherit" }}>
                  
                <ProductComponent product={product} />
                </Link>
              </div>
            ))}
          </div>
        
          </section>
    </>
    )
};
    
export default AllProducts;






