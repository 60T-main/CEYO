import React from 'react';
const Search = ({ overlayState, setOverlayState }) => {
  let searchIcon = null;
  if (!overlayState || overlayState === 'none') {
    searchIcon = (
      <img
        onClick={() => {
          setOverlayState('search');
        }}
        className="w-5"
        src="/public/search.svg"
        alt="search"
      />
    );
  }

  return (
    <div className="search">
      <div className="search-bar">{searchIcon}</div>
    </div>
  );
};

export default Search;
