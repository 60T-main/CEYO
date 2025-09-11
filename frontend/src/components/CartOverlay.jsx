import React from 'react';
const CartOverlay = ({
  cart,
  handleCartUpdate,
  handleRemoveFromCart,
  overlayState,
  overlayClosing,
}) => {
  return (
    <div
      className={`${overlayClosing ? 'animate-slide-right' : 'animate-slide-left'} ${
        overlayState ? 'cart-active' : 'hidden'
      }`}
    >
      <div className="cart-parent">
        <div className="cart-title-div">
          <h2 className="inline-font">კალათა</h2>
        </div>
        <div className="cart-items-parent">
          {cart.cart_items &&
            cart.cart_items.map((cart_item) => (
              <div className="cart-item" key={cart_item.id}>
                <h3 style={{ fontSize: 16 }}>{cart_item.name}</h3>
                <h4 style={{ fontSize: 16 }}>GEL {cart_item.unit_price}</h4>
                <h4 style={{ fontSize: 16 }}>{cart_item.quantity}x</h4>
                <h3 style={{ fontSize: 16 }}>GEL {cart_item.subtotal}</h3>
                <button
                  onClick={(e) => {
                    handleRemoveFromCart(cart_item.id, e);
                  }}
                  className="cursor-pointer w-20 h-10 text-red-600 border-2 rounded-3xl flex items-center justify-center font-bold"
                >
                  Remove
                </button>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default CartOverlay;
