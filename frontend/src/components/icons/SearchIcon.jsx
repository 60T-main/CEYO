import React from 'react';

import { usePageContext } from '../../hooks/PageStates.jsx';

const Search = () => {
  let searchIcon = null;
  const { overlayState, setOverlayState } = usePageContext();

  if (
    !overlayState ||
    overlayState === 'none' ||
    overlayState === 'order' ||
    overlayState === 'order-close' ||
    overlayState === 'checkout' ||
    overlayState === 'filter' ||
    overlayState === 'filter-close' ||
    overlayState === 'category' ||
    overlayState === 'category-close' ||
    overlayState === 'checkout-close'
  ) {
    searchIcon = (
      <i
        onClick={() => {
          setOverlayState('search');
        }}
        className="bi bi-search icon search cursor-pointer"
      ></i>
    );
  }

  return (
    <div
      className={`search-div ${
        !overlayState ||
        overlayState === 'none' ||
        overlayState === 'order' ||
        overlayState === 'order-close' ||
        overlayState === 'checkout' ||
        overlayState === 'filter' ||
        overlayState === 'filter-close' ||
        overlayState === 'category' ||
        overlayState === 'category-close' ||
        overlayState === 'checkout-close'
          ? 'show'
          : 'hide'
      }`}
    >
      <div className="search-bar">{searchIcon}</div>
    </div>
  );
};

export default Search;
