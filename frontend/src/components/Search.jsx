import React from 'react';
const Search = ({searchTerm, setSearchTerm}) => {
    return ( 
                <div className="search">
            <div className="search-bar">
                <img className="icon search" src="./public/search-icon.svg" alt="" />
                        <input
                            className="search-input hidden"
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