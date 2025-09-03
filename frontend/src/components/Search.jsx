import React from 'react';
const Search = ({searchTerm, setSearchTerm}) => {
    return ( 
                <div className="search">
                    <div className="search-bar">
                        <img className="search-icon" src="search.svg" alt="search" />
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