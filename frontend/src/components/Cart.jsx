import React from 'react';

const Cart = ({ overlayState, setOverlayState }) => {
  let cartIcon = null;
  if (
    !overlayState ||
    overlayState === 'none' ||
    overlayState === 'order' ||
    overlayState === 'order-close'
  ) {
    cartIcon = (
      <i
        onClick={() => {
          setOverlayState('cart');
        }}
        class="bi bi-bag icon cart"
      ></i>
    );
  }

  return <div className="cart-div">{cartIcon}</div>;
};

export default Cart;
