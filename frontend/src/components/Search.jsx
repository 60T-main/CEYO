import React from 'react';
const Search = ({ overlayState, setOverlayState }) => {
  let searchIcon = null;
  if (!overlayState || overlayState === 'none') {
    searchIcon = (
      <i
        onClick={() => {
          setOverlayState('search');
        }}
        class="bi bi-search icon search"
      ></i>
    );
  }

  return (
    <div className="search">
      <div className="search-bar">{searchIcon}</div>
    </div>
  );
};

export default Search;
