import React, { useEffect, useState } from 'react';

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

  const [colors, setColors] = useState([]);
  const [sizes, setSizes] = useState([]);

  const handleVariants = () => {
    if (!Array.isArray(product_variants)) return;
    const colorsArr = [];
    const sizesArr = [];
    product_variants.forEach((variant) => {
      if (Array.isArray(variant.attributes)) {
        variant.attributes.forEach((attribute) => {
          if (attribute.name === 'ფერი') colorsArr.push(attribute.value);
          if (attribute.name === 'ზომა') sizesArr.push(attribute.value);
        });
      }
    });
    const uniqueColors = Array.from(new Set(colorsArr));
    const uniqueSizes = Array.from(new Set(sizesArr));
    setColors(uniqueColors);
    setSizes(uniqueSizes);
  };

  useEffect(() => {
    handleVariants();
  }, []);

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
          <div className="card-content-parent-home">
            {colors.length > 0 && (
              <p className="card-content-color inline-font">
                <i class="bi bi-palette"></i> +{colors.length} ფერი
              </p>
            )}
            <p className={'card-title-home'}>{name}</p>
            <p className={'card-price-home'}>
              {product_variants && product_variants[0] && product_variants[0].price}₾
            </p>
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
              <p className={'card-price shadow'}>
                {product_variants && product_variants[0] && product_variants[0].price}₾
              </p>
              {sizes.map((size, idx) => (
                <p key={idx}>{size}</p>
              ))}
              {colors.map((color, idx) => (
                <p key={idx}>{color}</p>
              ))}
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
            {colors.length > 0 && (
              <p className="card-content-color-all inline-font">
                <i class="bi bi-palette"></i> +{colors.length} ფერი
              </p>
            )}
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
            <p className={'card-price-all'}>
              {product_variants && product_variants[0] && product_variants[0].price}₾
            </p>
          </div>
        </Link>
      )}
    </>
  );
};

export default Product;
