import React from 'react';
import AddToCart from './AddToCart.jsx';

import { Link } from 'react-router-dom';

const Product = ({
  product: { id, name, description, category, price, images },
  handleCartUpdate,
  closeAllOverlays,
}) => {
  return (
    <>
      <Link
        onClick={() => closeAllOverlays()}
        to={`/product/${id}`}
        style={{ textDecoration: 'none', color: 'inherit' }}
      >
        <li className="card">
          <img className="product-img" src="/no-img.jpg" alt={name} />
          <div>
            <h3>{name}</h3>
          </div>
          <div className="content">
            <p>{description}</p>
            <p>{category}</p>
            <p>${price}</p>
            <p>${id}</p>
          </div>
        </li>
      </Link>

      <AddToCart id={id} handleCartUpdate={handleCartUpdate} />
    </>
  );
};

export default Product;
