import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { useProductContext } from '../hooks/ProductStates';
import { useApi } from '../services/api';
const CartOverlay = ({ overlayState, overlayClosing, onOverlayClose }) => {
  const { cart } = useProductContext();
  const { handleRemoveFromCart } = useApi();
  const navigate = useNavigate();

  const handleCheckoutNavigate = () => {
    onOverlayClose(true);
    navigate('/checkout');
  };

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
          {cart.cart_items && cart.cart_items.length > 0 ? (
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
            ))
          ) : (
            <p className={'cart-empty'}>კალათა ცარიელია</p>
          )}
        </div>
        {cart.cart_items && cart.cart_items.length > 0 && (
          <div className="cart-purchase-div">
            <button
              className="cart-purchase-btn inline-font"
              onClick={() => {
                handleCheckoutNavigate();
              }}
            >
              შეკვეთის გაფორმება <i class="bi bi-arrow-right"></i>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartOverlay;
