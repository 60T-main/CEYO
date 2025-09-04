import React from 'react';
const Search = ({categoryFilter, setCategoryFilter}) => {
    return ( 
                <div className="search">
                    <div className="search-bar">
                        <input
                            className="search-input"
                            type="text"
                            placeholder="Search"
                            value={searchTerm}
                            onChange={(event) => {
                                setSearchTerm(event.target.value)
                            }}
                        />
                    </div>
                </div>
     );
}
 
export default Search;