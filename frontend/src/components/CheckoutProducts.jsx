import React from 'react';
import { useState, useEffect } from 'react';

import { usePageContext } from '../hooks/PageStates';
import { useProductContext } from '../hooks/ProductStates';
import Checkout from '../pages/Checkout';

const CheckoutProducts = ({ onOverlayClose, children }) => {
  const { setOverlayState, overlayState, isLoading } = usePageContext();
  const { cart, deliveryCost } = useProductContext();
  const [showItems, setShowItems] = useState(false);

  useEffect(() => {
    setOverlayState('checkout');
  }, []);

  useEffect(() => {
    if (overlayState === 'checkout') {
      const timer = setTimeout(() => setShowItems(true), 50);
      return () => clearTimeout(timer);
    } else {
      setShowItems(false);
    }
  }, [overlayState]);

  const handleOverlayButton = async () => {
    overlayState === 'checkout' ? onOverlayClose('checkout') : setOverlayState('checkout');
  };
  return (
    <div className={`checkout-items-parent${overlayState === 'checkout' ? ' open' : ''}`}>
      <div className="checkout-items-header-absolute">
        <div className={`checkout-items-header ${overlayState === 'checkout' ? 'open' : ''}`}>
          <div className="checkout-items-title">
            <i className="bi bi-bag-check text-lg"></i>
            <p>შეკვეთის დეტალები</p>
          </div>
          <div
            className="checkout-items-close"
            onClick={() => {
              handleOverlayButton();
            }}
          >
            <p>{overlayState === 'checkout' ? 'დახურვა' : 'ნახვა'}</p>
          </div>
        </div>
      </div>
      <div className="checkout-items">
        {isLoading ? (
          <span className="loader products" />
        ) : (
          overlayState === 'checkout' &&
          showItems &&
          (cart.cart_items ? (
            cart.cart_items.map((cart_item) => (
              <div className="checkout-item" key={cart_item.id}>
                <div className="checkout-img">
                  <img src={cart_item.images[0]} />
                </div>
                <div className="checkout-item-details">
                  <p>{cart_item.name}</p>
                  <p>
                    ფერი: {cart_item.color} • ზომა: {cart_item.size}
                  </p>
                </div>
                <p className="product-quantity">რაოდენობა: {cart_item.quantity}</p>
              </div>
            ))
          ) : (
            <p className={'text-sm !text-white'}>კალათა ცარიელია</p>
          ))
        )}
      </div>
      {overlayState === 'checkout' && showItems && (
        <div className="checkout-items-total">
          <div className="products-sum">
            <p>პროდუქტების ჯამი</p>
            <p>{cart.total_price && cart.total_price} ₾</p>
          </div>
          <div className="products-delivery">
            <p>მიწოდება</p>
            <p className={deliveryCost ? '' : 'text-sm'}>
              {deliveryCost ? `${deliveryCost} ₾` : 'აირჩიეთ ქალაქი'}
            </p>
          </div>
          <div className="products-total">
            <p>ჯამური ღირებულება</p>
            <p>
              {deliveryCost && cart.total_price
                ? cart.total_price + deliveryCost
                : cart.total_price}{' '}
              ₾
            </p>
          </div>
        </div>
      )}

      {children}
    </div>
  );
};

export default CheckoutProducts;
