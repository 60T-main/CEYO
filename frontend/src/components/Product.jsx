import React, { useEffect, useState } from 'react';

import AddToCart from '@/pages/productdetail/AddToCart.jsx';

import { Link } from 'react-router-dom';

import { usePageContext } from '@/hooks/PageStates.jsx';
import { useProductContext } from '@/hooks/ProductStates.jsx';

import CardSkeleton from '@/skeletons/CardSkeleton.jsx';

const Product = ({
  product: { id, name, category, product_variants, images },
  variant,
  handleCartUpdate,
  API_BASE_URL,
  POST_OPTIONS,
  handleCheckoutNavigate,
  onCartError,
}) => {
  const { isLoading } = usePageContext();
const { existingSizes, setExistingSizes, selectedColor, setSelectedColor, selectedSize, setSelectedSize } = useProductContext();

  const [colors, setColors] = useState([]);
  const [sizes, setSizes] = useState([]);
  
  const [shopSizes, setShopSizes] = useState([]);
  

  const [variantId, setVariantId] = useState(null);

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

  // Check if attribute exists
  const checkAttribute = (attr) => {
    const attributesArr = [];
    if (!Array.isArray(product_variants)) return false;
    product_variants.forEach((variant) => {
      if (Array.isArray(variant.attributes)) {
        variant.attributes.forEach((attribute) => {
          if (attribute.name === attr) attributesArr.push(attribute.name);
        });
      }
    });
    return attributesArr.includes(attr);
  };

  // Check what sizes exist with selected color
  const checkSizes = (color) => {
    if (!Array.isArray(product_variants)) return false;
    const variants = [];
    product_variants.forEach((variant) => {
      variant.attributes.forEach((attr) => {
        attr.value === color && variants.push(variant);
      });
    });
    const sizes = [];
    variants.forEach((variant) => {
      if (variant.rest_main > 0) 
      {variant.attributes.forEach((attr) => {
        attr.name === 'ზომა' && (
          sizes.push(attr.value)
        )
      })} 
    });
    return sizes;
  };


  const checkVariant = () => {
    if (existingSizes && !existingSizes.includes(selectedSize)) {
      setSelectedSize(null);
      setVariantId(null);
    } else if (existingSizes && existingSizes.includes(selectedSize)) {
      product_variants.forEach((variant) => {
        let color = '';
        let size = '';
        variant.attributes.forEach((attr) => {
          if (attr.name === 'ფერი') color = attr.value;
          if (attr.name === 'ზომა') size = attr.value;
        });
        if (color === selectedColor && size === selectedSize) {
          setVariantId(variant.variant_id);
        }
      });
    }
  };

const checkRestShop = (color) => {
  const sizes = [];
  if (!Array.isArray(product_variants)) return;
  product_variants.forEach((variant) => {
    if (!variant || !Array.isArray(variant.attributes)) return;
    let colorMatch = false;
    let sizeValue = null;
    variant.attributes.forEach((attr) => {
      if (attr.name === 'ფერი' && attr.value === color) {
        colorMatch = true;
      }
      if (attr.name === 'ზომა') {
        sizeValue = attr.value;
        
      }
    });
    if (colorMatch && variant.stock_shop > 0 && sizeValue) {
      sizes.push({"rest" : variant.stock_shop, "size" : sizeValue});
      
    }
  });
  setShopSizes(sizes);
};

  useEffect(() => {
    handleVariants();
  }, [product_variants]);

  useEffect(() => {
    setExistingSizes(checkSizes(selectedColor));
  }, [selectedColor]);

  useEffect(() => {
    checkVariant();
  }, [existingSizes, selectedSize]);
  
  // useEffect(() => {
  //   console.log(shopSizes)
  // }, [shopSizes]);

  
  

  return (
    <>
      {variant === 'home' &&
        (images && images[0] && images[0].images[0] ? (
          <Link
            to={`/product/${id}`}
            style={{ textDecoration: 'none', color: 'inherit' }}
            className="card-parent-home"
          >
            <div className="card-img-parent-home">
              <img
                src={
                  images && images[0] && images[0].images[0] ? images[0].images[0] : '/no-img.jpg'
                }
                alt="no image"
              />
            </div>
            <div className="card-content-parent-home">
              {colors.length > 0 && (
                <p className="card-content-color inline-font">
                  <i className="bi bi-palette"></i> +{colors.length} ფერი
                </p>
              )}
              <div className="title-price-div">
                <p className={'card-title-home'}>{name}</p>
                <p className={'card-price-home'}>
                  {product_variants && product_variants[0] && product_variants[0].price}₾
                </p>
              </div>
            </div>
          </Link>
        ) : (
          ''
        ))} 
            
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
            <img
              src={
                Array.isArray(images)
                  ? selectedColor
                    ? (() => {
                        const found = images.find((image) => image.color === selectedColor);
                        return found && Array.isArray(found.images) && found.images[0]
                          ? found.images[0]
                          : '/no-img.jpg';
                      })()
                    : images[0] && Array.isArray(images[0].images) && images[0].images[0]
                      ? images[0].images[0]
                      : '/no-img.jpg'
                  : '/no-img.jpg'
              }
              alt="no image"
            />
            </div>
            <div className="card-content-parent ">
              <h3 className={'card-title'}>{name}</h3>
              <p className={'card-price shadow'}>
                {product_variants && product_variants[0] && product_variants[0].price}₾
              </p>
              <div className="attributes">
                {checkAttribute('ფერი') ? (
                  <div className="colors-parent">
                    <p className="colors-title">
                      აირჩიეთ ფერი: <span className="text-[var(--color-primary-red)]">*</span>
                    </p>
                    <div className="colors">
                      {colors.map((color, idx) => (
                        <label className={`color ${selectedColor === color && 'active'}`} key={idx}>
                          <input
                            type="radio"
                            name="color"
                            value={color}
                            checked={selectedColor === color}
                            onChange={() => {
                              setSelectedColor(color);
                              checkRestShop(color)
                            }}
                          />
                          {color}
                        </label>
                      ))}
                    </div>
                  </div>
                ) : (
                  ''
                )}
                {checkAttribute('ზომა') && selectedColor ? (
                  <div className="sizes-parent">
                    <p className="sizes-title">
                      აირჩიეთ ზომა: <span className="text-[var(--color-primary-red)]">*</span>
                    </p>
                    <div className="sizes">
                      {sizes.map((size, idx) => (
                        <label
                          className={`size ${selectedSize === size ? 'active' : ''} ${
                            existingSizes && !existingSizes.includes(size) ? 'disabled' : ''
                          }`}
                          key={idx}
                        >
                          <input
                            type="radio"
                            name="size"
                            value={size}
                            checked={selectedSize === size}
                            onChange={() => {
                              setSelectedSize(size);
                            }}
                            disabled={existingSizes && !existingSizes.includes(size)}
                          />
                          {size}
                          {existingSizes && !existingSizes.includes(size) ? (
                            <span className="absolute h-[140%] border-1 rotate-45 bottom-0 left-0 origin-bottom-left"></span>
                          ) : (
                            ''
                          )}
                        </label>
                      ))}
                    </div>
                  </div>
                ) : (
                  ''
                )}
              </div>

              <AddToCart
                id={variantId}
                handleCartUpdate={handleCartUpdate}
                API_BASE_URL={API_BASE_URL}
                POST_OPTIONS={POST_OPTIONS}
                selectedColor={selectedColor}
                selectedSize={selectedSize}
                checkVariant={checkVariant}
                handleCheckoutNavigate={handleCheckoutNavigate}
                onCartError={onCartError}
              />

              {selectedColor && shopSizes ?
                <div className='shop-rest'>
                <p className='font-bold text-[var(--color-primary-blue)]'>ხელმისაწვდომი ზომები თბილისი ცენტრალის მაღაზიაში:</p> 
                <div className='shop-sizes'>
                  {shopSizes.map((sizeObj)=>(
                    <div className='flex flex-col'>
                    <p className='text-center'>{sizeObj.size}</p>
                    <p className='text-center text-[9px]'>{sizeObj.rest} in stock</p>
                    </div>
                  ))
                  }
                </div>
                  <img src="/logo-central-ge.svg" alt="central logo" />
                <p className='mt-2 font-bold'><span className='text-[var(--color-primary-blue)]'>მისამართი:</span>სადგურის მოედანი #2, სავაჭრო ცენტრი "თბილისი ცენტრალი"</p> 
              </div> : ''}
            </div>
          </div>
        ))}
      {variant === 'all-products' && (
        (images && images[0] && images[0].images[0] ? (
        <Link
          to={`/product/${id}`}
          style={{ textDecoration: 'none', color: 'inherit' }}
          className="card-parent-all"
        >
          <div className="card-img-parent-all">
            <img
              src={images && images[0] && images[0].images[0] ? images[0].images[0] : '/no-img.jpg'}
              alt="no image"
            />
          </div>
          <div className="card-content-parent-all ">
            {colors.length > 0 && (
              <p className="card-content-color-all inline-font">
                <i className="bi bi-palette"></i> +{colors.length} ფერი
              </p>
            )}
            <h4 className={'card-title-all'}>{name}</h4>
            <p className={'card-price-all'}>
              {product_variants && product_variants[0] && product_variants[0].price}₾
            </p>
          </div>
        </Link>
        ) : (
          ''
        )))}
      {variant === 'search' && (
        <Link
          onClick={() => closeAllOverlays()}
          to={`/product/${id}`}
          style={{ textDecoration: 'none', color: 'inherit' }}
          className="card-parent-all"
        >
          <div className="card-img-parent-all">
            <img
              src={images && images[0] && images[0].images[0] ? images[0].images[0] : '/no-img.jpg'}
              alt="no image"
            />
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
