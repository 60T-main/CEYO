import React from 'react';
import { usePageContext } from '../../hooks/PageStates.jsx';
import { useProductContext } from '../../hooks/ProductStates.jsx';

const Cart = () => {
  let cartIcon = null;
  const { overlayState, setOverlayState } = usePageContext();
  const { cart } = useProductContext();
  if (
    !overlayState ||
    overlayState === 'none' ||
    overlayState === 'filter' ||
    overlayState === 'filter-close' ||
    overlayState === 'category' ||
    overlayState === 'category-close' ||
    overlayState === 'order' ||
    overlayState === 'order-close' ||
    overlayState === 'checkout-close' ||
    overlayState === 'checkout'
  ) {
    cartIcon = (
      <div
        onClick={() => {
          setOverlayState('cart');
        }}
        className="cursor-pointer"
      >
        <i className="bi bi-bag icon cart"></i>

        {cart.cart_items && cart.total_items > 0 && (
          <div className="cart-number">{cart.total_items}</div>
        )}
      </div>
    );
  }

  return (
    <div
      className={`cart-div ${
        !overlayState ||
        overlayState === 'none' ||
        overlayState === 'filter' ||
        overlayState === 'filter-close' ||
        overlayState === 'category' ||
        overlayState === 'category-close' ||
        overlayState === 'order' ||
        overlayState === 'order-close' ||
        overlayState === 'checkout-close' ||
        overlayState === 'checkout'
          ? 'show'
          : 'hide'
      }`}
    >
      {cartIcon}
    </div>
  );
};

export default Cart;
