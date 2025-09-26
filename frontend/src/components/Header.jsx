import React from 'react';
import { Link } from 'react-router-dom';

const Header = ({
  children,
  MenuComponent,
  setOverlayState,
  overlayState,
  onOverlayClose,
  headerAnimate,
  categoriesList,
  onFilter,
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
        {categoriesList.map((category) => (
          <Link
            key={category.category_id}
            onClick={() => {
              onFilter({ category: category.name });
              onOverlayClose('menu');
            }}
            to={`/product`}
          >
            <p
              className={'inline-font category-desktop animate-slide-left'}
              key={category.category_id}
            >
              {category.name}
            </p>
          </Link>
        ))}
      </div>
      <div className="header-children">{children}</div>
    </header>
  );
};

export default Header;
