import React from 'react';
import AddToCart from './AddToCart.jsx';

import { Link } from 'react-router-dom';

const Product = ({
  product: { id, name, category, price, images },
  handleCartUpdate,
  closeAllOverlays,
  API_BASE_URL,
  POST_OPTIONS,
  variant,
}) => {
  return (
    <>
      {variant === 'home' && (
        <Link
          to={`/product/${id}`}
          style={{ textDecoration: 'none', color: 'inherit' }}
          className="card-parent-home"
        >
          <div className="card-img-parent-home">
            <img src={images[0] ? `${images[0]}` : '/public/no-img.jpg'} alt="no image" />
          </div>
          <div className="card-content-parent-home ">
            <p className={'card-title-home'}>{name}</p>
            <p className={'card-price-home shadow'}>{price}₾</p>
          </div>
        </Link>
      )}

      {variant === 'product-detail' && (
        <div
          to={`/product/${id}`}
          style={{ textDecoration: 'none', color: 'inherit' }}
          className="card-parent"
        >
          <div className="card-img-parent">
            <img src={images ? `${images[0]}` : '/public/no-img.jpg'} alt="no image" />
          </div>
          <div className="card-content-parent ">
            <h3 className={'card-title'}>{name}</h3>
            <p className={'card-price shadow'}>{price}₾</p>
            <AddToCart
              id={id}
              handleCartUpdate={handleCartUpdate}
              API_BASE_URL={API_BASE_URL}
              POST_OPTIONS={POST_OPTIONS}
            />
          </div>
        </div>
      )}
      {variant === 'all-products' && (
        <Link
          to={`/product/${id}`}
          style={{ textDecoration: 'none', color: 'inherit' }}
          className="card-parent-all"
        >
          <div className="card-img-parent-all">
            <img src={images ? `${images[0]}` : '/public/no-img.jpg'} alt="no image" />
          </div>
          <div className="card-content-parent-all ">
            <h4 className={'card-title-all'}>{name}</h4>
            <p className={'card-price-all'}>{price}₾</p>
          </div>
        </Link>
      )}
      {variant === 'search' && (
        <Link
          onClick={() => closeAllOverlays()}
          to={`/product/${id}`}
          style={{ textDecoration: 'none', color: 'inherit' }}
          className="card-parent-all"
        >
          <div className="card-img-parent-all">
            <img src={images ? `${images[0]}` : '/public/no-img.jpg'} alt="no image" />
          </div>
          <div className="card-content-parent-all ">
            <h4 className={'card-title-all'}>{name}</h4>
            <p className={'card-price-all'}>{price}₾</p>
          </div>
        </Link>
      )}
    </>
  );
};

export default Product;
