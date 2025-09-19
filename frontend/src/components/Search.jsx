import React from 'react';
const Search = ({ overlayState, setOverlayState }) => {
  let searchIcon = null;
  if (!overlayState || overlayState === 'none') {
    searchIcon = (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        onClick={() => {
          setOverlayState('search');
        }}
        fill="currentColor"
        class="bi bi-search icon search"
        viewBox="0 0 16 16"
      >
        <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
      </svg>
    );
  }

  return (
    <div className="search">
      <div className="search-bar">{searchIcon}</div>
    </div>
  );
};

export default Search;
