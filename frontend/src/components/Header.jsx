import React from 'react';
import Search from './Search.jsx';
import { useLocation } from "react-router-dom";

const Header = ({ children, MenuComponent, setMenuActive, onMenuClose,menuActive }) => {
    
    const location = useLocation();

    const isProductDetail = location.pathname.startsWith("/product/");



    return (
        <header className="header" style={{ transform: "translate(0px, 0px)" }}>

            <MenuComponent
                setMenuActive={setMenuActive}
                onMenuClose={onMenuClose}
                menuActive = {menuActive}
            ></MenuComponent>

            <div className='logo-div'>
                <a href="./"><img className="logo" src="/logo.png" alt="Ceyo Logo" /></a>
            </div>

            <div className='header-children'>
                {children}
            </div>
        </header>
    )
};
 
export default Header;