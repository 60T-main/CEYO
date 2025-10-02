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
    overlayState === 'order' ||
    overlayState === 'order-close'
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

  return <div className="cart-div">{cartIcon}</div>;
};

export default Cart;
