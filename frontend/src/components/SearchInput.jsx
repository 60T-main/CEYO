import React from 'react';

const SearchOverlay = ({ searchTerm, setSearchTerm }) => {
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
