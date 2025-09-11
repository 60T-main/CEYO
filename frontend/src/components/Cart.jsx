import React from 'react';

const Cart = ({ overlayState, setOverlayState, onOverlayClose }) => {
  let cartIcon = null;
  if (!overlayState || overlayState === 'none') {
    cartIcon = (
      <img
        onClick={() => {
          setOverlayState('cart');
        }}
        className="w-5"
        src="/public/cart.svg"
        alt="cart"
      />
    );
  }

  return <div className="cart-div">{cartIcon}</div>;
};

export default Cart;
