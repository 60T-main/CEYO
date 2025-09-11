import React from 'react';

const SearchOverlay = ({
  debouncedSearchTerm,
  searchTerm,
  setSearchTerm,
  SearchResults,
  products,
  ProductComponent,
  handleCartUpdate,
  overlayClosing,
  overlayState,
}) => {
  return (
    <div
      className={`${overlayClosing ? 'animate-slide-right' : 'animate-slide-left'} ${
        overlayState ? 'search-active' : 'hidden'
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
          />
        ) : (
          ''
        )}
      </div>
    </div>
  );
};

export default SearchOverlay;
