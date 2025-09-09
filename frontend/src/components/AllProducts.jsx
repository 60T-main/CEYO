import React from 'react';

const AllProducts = ({ products,  ProductComponent, handleCartUpdate }) => {
    return (
    <>
          <section className="card-section">
            <h2>ყველა ფეხსაცმელი</h2>
          <div className="card-div">
            {products.map((product) => (
              <div key={product.id} className="card">
                
                <ProductComponent product={product} handleCartUpdate={handleCartUpdate} />
              </div>
            ))}
          </div>
        
          </section>
    </>
    )
};
    
export default AllProducts;






