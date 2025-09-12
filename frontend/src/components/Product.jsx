import React from 'react';
import AddToCart from './AddToCart.jsx';
import { useLocation } from 'react-router-dom';

import { Link } from 'react-router-dom';

const Product = ({
  product: { id, name, category, price, images },
  handleCartUpdate,
  closeAllOverlays,
}) => {
  const location = useLocation();
  return (
    <>
      <Link
        onClick={() => closeAllOverlays()}
        to={`/product/${id}`}
        style={{ textDecoration: 'none', color: 'inherit' }}
        className="card-parent"
      >
        <div className="card-img-parent">
          <img src="/public/no-img.jpg" alt="no image" />
        </div>
        <div className="card-content-parent">
          <h3 className={'card-title'}>{name}</h3>
          <p className={'card-price'}>{price}₾</p>
          {location.pathname !== '/' && <AddToCart id={id} handleCartUpdate={handleCartUpdate} />}
        </div>
      </Link>
    </>
  );
};

export default Product;
