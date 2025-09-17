import React from 'react';
import { useEffect, useState } from 'react';

const Menu = ({ setOverlayState, onOverlayClose, overlayState }) => {
  return (
    <>
      {overlayState !== 'filter' &&
      overlayState !== 'none' &&
      overlayState !== null &&
      overlayState !== 'order' &&
      overlayState !== 'order-close' ? (
        <img
          onClick={() => {
            onOverlayClose('true');
          }}
          className="icon close"
          src="/public/menu2.svg"
          alt="Menu2"
        />
      ) : (
        <img
          onClick={() => {
            setOverlayState('menu');
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
