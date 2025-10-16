import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

const MenuOverlay = ({
  overlayState,
  overlayClosing,
  categoriesList,
  onOverlayClose,
  onFilter,
}) => {
  const parentCattegories = ['ქალი', 'კაცი', 'ბავშვი'];
  return (
    <div
      className={`${overlayClosing ? 'animate-slide-up' : 'animate-slide-down'} ${
        overlayState ? 'menu-active' : 'hidden'
      }`}
    >
      <div className="category-content-parent">
        {categoriesList.map(
          (category) =>
            parentCattegories.includes(category.name) && (
              <Link
                key={category.id}
                onClick={() => {
                  onFilter({ category: category.name });
                  onOverlayClose('menu');
                }}
                to={`/product`}
              >
                <h3 key={category.id}>{category.name}</h3>
              </Link>
            )
        )}
      </div>
    </div>
  );
};

export default MenuOverlay;
