import React from 'react';

const SearchOverlay = ({
  debouncedSearchTerm,
  searchTerm,
  setSearchTerm,
  searchClosing,
  searchActive,
  SearchResults,
  products,
  handleCartUpdateproducts,
  ProductComponent,
  handleCartUpdate,
  closeAllOverlays,
}) => {
  return (
    <div
      className={`${searchClosing ? 'animate-slide-right' : 'animate-slide-left'} ${
        searchActive ? 'search-active' : 'hidden'
      }`}
    >
      <div className="search-content-parent">
        <div className="search-parent">
          <div className="search-input-div">
            <input
              className="search-input"
              type="text"
              placeholder="ძებნა"
              value={searchTerm}
              onChange={(event) => {
                setSearchTerm(event.target.value);
              }}
            />
          </div>
        </div>
        {debouncedSearchTerm.length > 0 ? (
          <SearchResults
            products={products}
            ProductComponent={ProductComponent}
            handleCartUpdate={handleCartUpdate}
            closeAllOverlays={closeAllOverlays}
          />
        ) : (
          'nothing'
        )}
      </div>
    </div>
  );
};

export default SearchOverlay;
