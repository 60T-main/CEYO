import React from 'react';
import { Link } from 'react-router-dom';

const MenuOverlay = ({
  overlayState,
  overlayClosing,
  categoriesList,
  onOverlayClose,
  onFilter,
}) => {
  return (
    <div
      className={`${overlayClosing ? 'animate-slide-up' : 'animate-slide-down'} ${
        overlayState ? 'menu-active' : 'hidden'
      }`}
    >
      <div className="category-content-parent">
        {categoriesList.map((category) => (
          <Link
            key={category.category_id}
            onClick={() => {
              onFilter({ category: category.name });
              onOverlayClose('menu');
            }}
            to={`/product`}
          >
            <h3 key={category.category_id}>{category.name}</h3>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default MenuOverlay;
