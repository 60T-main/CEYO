import React from 'react';

import { useProductContext } from '../hooks/ProductStates';

const SearchOverlay = () => {
  const { searchTerm, setSearchTerm } = useProductContext();

  return (
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
  );
};

export default SearchOverlay;
