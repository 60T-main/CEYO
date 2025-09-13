import React from 'react';
import AddToCart from './AddToCart.jsx';

import { Link } from 'react-router-dom';

const Product = ({
  product: { id, name, category, price, images },
  handleCartUpdate,
  closeAllOverlays,
  variant,
}) => {
  return (
    <>
      {variant === 'home' && (
        <Link
          onClick={() => closeAllOverlays()}
          to={`/product/${id}`}
          style={{ textDecoration: 'none', color: 'inherit' }}
          className="card-parent-home"
        >
          <div className="card-img-parent-home">
            <img
              src={images[0] ? `http://127.0.0.1:8000/${images[0]}` : '/public/no-img.jpg'}
              alt="no image"
            />
          </div>
          <div className="card-content-parent-home ">
            <p className={'card-title-home'}>{name}</p>
            <p className={'card-price-home shadow'}>{price}₾</p>
          </div>
        </Link>
      )}

      {variant === 'product-detail' && (
        <Link
          onClick={() => closeAllOverlays()}
          to={`/product/${id}`}
          style={{ textDecoration: 'none', color: 'inherit' }}
          className="card-parent"
        >
          <div className="card-img-parent">
            <img
              src={images ? `http://127.0.0.1:8000/${images[0]}` : '/public/no-img.jpg'}
              alt="no image"
            />
          </div>
          <div className="card-content-parent ">
            <h3 className={'card-title'}>{name}</h3>
            <p className={'card-price shadow'}>{price}₾</p>
            <AddToCart id={id} handleCartUpdate={handleCartUpdate} />
          </div>
        </Link>
      )}
    </>
  );
};

export default Product;
