import React from 'react';
import Search from './Search.jsx';
import { useState } from 'react';

const Header = ({
  children,
  MenuComponent,
  setOverlayState,
  overlayState,
  onOverlayClose,
  headerAnimate,
}) => {
  return (
    <header className="header">
      <MenuComponent
        setOverlayState={setOverlayState}
        onOverlayClose={onOverlayClose}
        overlayState={overlayState}
      />
      <div
        className={`logo-div ${
          headerAnimate === 'none'
            ? ''
            : headerAnimate === 'left'
            ? 'logo-animation-left'
            : 'logo-animation-right'
        }`}
      >
        <a href="../">
          <img className="logo" src="/logo.png" alt="Ceyo Logo" />
        </a>
      </div>
      <div className="header-children">{children}</div>
    </header>
  );
};

export default Header;
