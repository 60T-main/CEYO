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
  SearchInput,
}) => {
  return (
    <div
      className={`${overlayClosing ? 'animate-slide-right' : 'animate-slide-left'} ${
        overlayState ? 'search-active' : 'hidden'
      }`}
    >
      <div className="search-content-parent">
        <SearchInput searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
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
