import React from 'react';

const Cart = ({ overlayState, setOverlayState, cart }) => {
  let cartIcon = null;
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
        <i class="bi bi-bag icon cart"></i>

        {cart.cart_items && cart.total_items > 0 && (
          <div className="text-xs flex justify-center items-center rounded-3xl w-4 h-4 bg-[#ed1a2d] text-white absolute top-2 left-11">
            {cart.total_items}
          </div>
        )}
      </div>
    );
  }

  return <div className="cart-div">{cartIcon}</div>;
};

export default Cart;
