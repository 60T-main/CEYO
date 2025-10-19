import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { usePageContext } from '../hooks/PageStates.jsx';
import { useProductContext } from '../hooks/ProductStates.jsx';

const Header = ({ children, MenuComponent, onOverlayClose, onFilter }) => {
  const { overlayState, setOverlayState, headerAnimate, overlayClosing } = usePageContext();
  const { categoriesList } = useProductContext();
  const [showItems, setShowItems] = useState(false);

  const parentCattegories = ['ქალი', 'კაცი', 'ბავშვი'];

  const [mouseLeftOverlay, setMouseLeftOverlay] = useState(false);
  const [mouseLeftName, setMouseLeftName] = useState(false);

  useEffect(() => {
    mouseLeftOverlay && mouseLeftName && onOverlayClose('category');
    console.log(mouseLeftOverlay, mouseLeftName);
  }, [mouseLeftOverlay, mouseLeftName]);

  useEffect(() => {
    if (overlayState === 'category') {
      const timer = setTimeout(() => setShowItems(true), 50);
      return () => clearTimeout(timer);
    } else {
      setShowItems(false);
    }
  }, [overlayState]);

  return (
    <>
      <header
        className={`header ${overlayState === 'category' ? '!rounded-b-none' : ''} ${
          overlayState === 'filter' ? 'blurred' : ''
        }`}
      >
        <MenuComponent
          setOverlayState={setOverlayState}
          onOverlayClose={onOverlayClose}
          overlayState={overlayState}
        />
        <div
          className={`logo-div ${
            !headerAnimate
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
        <div className="category-desktop-parent">
          {categoriesList.map(
            (category) =>
              parentCattegories.includes(category.name) && (
                <Link
                  onMouseEnter={() => {
                    setOverlayState('category');
                    setMouseLeftName(false);
                  }}
                  onMouseLeave={() => {
                    setMouseLeftName(true);
                  }}
                  key={category.id}
                  onClick={() => {
                    onFilter({ category: category.id });
                    onOverlayClose('menu');
                  }}
                  to={`/product`}
                >
                  <p
                    className={'inline-font category-desktop animate-slide-left'}
                    key={category.id}
                  >
                    {category.name}
                  </p>
                </Link>
              )
          )}
        </div>
        <div className="header-children">{children}</div>
        <div
          onMouseEnter={() => {
            setOverlayState('category');
            setMouseLeftOverlay(false);
          }}
          onMouseLeave={() => {
            setMouseLeftOverlay(true);
          }}
          className={`${overlayClosing ? 'slide-up-category' : 'slide-down-category'} ${
            overlayState === 'category' ? 'header-category-overlay' : 'hidden'
          }`}
        >
          {showItems && <div>sub-categories</div>}
        </div>
      </header>
    </>
  );
};

export default Header;
