import React from 'react';
import Search from './Search.jsx';
import { useLocation } from "react-router-dom";

const Header = ({ searchTerm, setSearchTerm }) => {
    
    const location = useLocation();

    const isProductDetail = location.pathname.startsWith("/product/");



    return (
        <header className="header">
            <img className="logo" src="/ceyo-logo.avif" alt="Ceyo Logo" />

            {!isProductDetail && (
                <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
            )}

        </header>
    )
};
 
export default Header;