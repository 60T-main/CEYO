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
                onClick={() => {
                  onFilter({ category: category.id });
                  onOverlayClose('menu');
                }}
                key={category.id}
                className="parent_category"
                to={`/product`}
              >
                <h3 className="inline-font !font-bold" key={category.id}>
                  {category.name}
                </h3>
                <i className="bi bi-arrow-right-circle"></i>
              </Link>
            )
        )}
        <Link
          onClick={() => {
            onFilter();
            onOverlayClose('menu');
          }}
          className="parent_category"
          to={`/product`}
        >
          <h3 className="inline-font !font-bold">ყველა ფეხსაცმელი</h3>
          <i className="bi bi-arrow-right-circle"></i>
        </Link>
      </div>
    </div>
  );
};

export default MenuOverlay;
