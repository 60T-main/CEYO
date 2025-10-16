import React, { useEffect } from 'react';

import AddToCart from './AddToCart.jsx';
import ScrollToTop from '../hooks/ScrollToTop.jsx';

import { Link } from 'react-router-dom';

import { usePageContext } from '../hooks/PageStates.jsx';

import CardSkeleton from '../skeletons/CardSkeleton.jsx';

const Product = ({
  product: { id, name, category, product_variants, images },
  variant,
  handleCartUpdate,
  API_BASE_URL,
  POST_OPTIONS,
}) => {
  const { isLoading } = usePageContext();

  useEffect(() => {
    console.log('loading:', isLoading);
  }, [isLoading]);
  return (
    <>
      {variant === 'home' && (
        <Link
          to={`/product/${id}`}
          style={{ textDecoration: 'none', color: 'inherit' }}
          className="card-parent-home"
        >
          <div className="card-img-parent-home">
            <img src={images && images[0] ? images[0] : '/no-img.jpg'} alt="no image" />
          </div>
          <div className="card-content-parent-home ">
            <p className={'card-title-home'}>{name}</p>
            <p className={'card-price-home'}>{product_variants && product_variants[0] && product_variants[0].price}₾</p>
          </div>
        </Link>
      )}

      {variant === 'product-detail' &&
        (isLoading ? (
          <CardSkeleton variant="product-detail" />
        ) : (
          <div
            to={`/product/${id}`}
            style={{ textDecoration: 'none', color: 'inherit' }}
            className="card-parent"
          >
            <div className="card-img-parent">
              <img src={images && images[0] ? `${images[0]}` : '/no-img.jpg'} alt="no image" />
            </div>
            <div className="card-content-parent ">
              <h3 className={'card-title'}>{name}</h3>
              <p className={'card-price shadow'}>{product_variants && product_variants[0] && product_variants[0].price}₾</p>
              <AddToCart
                id={id}
                handleCartUpdate={handleCartUpdate}
                API_BASE_URL={API_BASE_URL}
                POST_OPTIONS={POST_OPTIONS}
              />
            </div>
          </div>
        ))}
      {variant === 'all-products' && (
        <Link
          to={`/product/${id}`}
          style={{ textDecoration: 'none', color: 'inherit' }}
          className="card-parent-all"
        >
          <div className="card-img-parent-all">
            <img src={images && images[0] ? `${images[0]}` : '/no-img.jpg'} alt="no image" />
          </div>
          <div className="card-content-parent-all ">
            <h4 className={'card-title-all'}>{name}</h4>
            <p className={'card-price-all'}>
              {product_variants && product_variants[0] && product_variants[0].price}₾
            </p>
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
            <img src={images && images[0] ? `${images[0]}` : '/no-img.jpg'} alt="no image" />
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
