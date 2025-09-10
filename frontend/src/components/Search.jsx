import React from 'react';
const Search = ({ setSearchActive, searchActive, onSearchClose, AllProducts }) => {
  return (
    <div className="search">
      <div className="search-bar">
        {searchActive ? (
          <img
            onClick={() => {
              onSearchClose();
            }}
            className="w-5"
            src="/public/menu2.svg"
            alt="Menu2"
          />
        ) : (
          <img
            className="icon search"
            src="/public/search-icon.svg"
            alt="search"
            onClick={() => {
              setSearchActive(true);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default Search;
