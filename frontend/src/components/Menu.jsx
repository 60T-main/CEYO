import React from 'react';
import { useEffect, useState } from 'react';

const Menu = ({ setMenuActive, onMenuClose, menuActive }) => {
  return (
    <>
      {menuActive ? (
        <img
          onClick={() => {
            onMenuClose();
          }}
          className="w-5"
          src="/public/menu2.svg"
          alt="Menu2"
        />
      ) : (
        <img
          onClick={() => {
            setMenuActive(true);
          }}
          className="icon menu"
          src="/public/menu.svg"
          alt="Menu"
        />
      )}
    </>
  );
};

export default Menu;
