import React from 'react';

const SearchResults = ({ products, ProductComponent, handleCartUpdate, closeAllOverlays }) => {
  return (
    <div className="search-result-parent">
      <div className="search-result">
        <div className="results-parent">
          {products.map((product) => (
            <div key={product.id} className="card">
              <ProductComponent
                product={product}
                handleCartUpdate={handleCartUpdate}
                closeAllOverlays={closeAllOverlays}
                variant={'search'}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchResults;
