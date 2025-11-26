import React, { useEffect } from 'react';

import { useProductContext } from '@/hooks/ProductStates';
import { usePageContext } from '@/hooks/PageStates';
import { useApi } from '@/services/api';
const CartOverlay = ({ overlayState, overlayClosing, onOverlayClose, handleCheckoutNavigate }) => {
  const { cart } = useProductContext();
  const { isLoading } = usePageContext();
  const { handleRemoveFromCart, handleAddToCart } = useApi();

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
            cart.cart_items
              .sort((a, b) => a.id - b.id)
              .map((cart_item) => (
                <div className="cart-item" key={cart_item.id}>
                  <img
                    className="cart-item-img"
                    src={cart_item.images ? cart_item.images[0] : '/public/no-img.jpg'}
                    alt=""
                  />

                  <div className="cart-item-content">
                    <div className="title-color-size-div">
                      <p className="item-title">{cart_item.name}</p>
                      <div className="color-size-div">
                        <p className="item-color">{cart_item.attributes.ფერი}</p>
                        <p className="item-color">•</p>
                        <p className="item-size">{cart_item.attributes.ზომა}</p>
                      </div>
                    </div>
                    <div className="price-quantity-div">
                      <p>{cart_item.unit_price} ₾</p>
                    </div>
                    <div className="cart-item-buttons">
                      {isLoading ? (
                        <span className="loader cart" />
                      ) : (
                        <>
                          <button
                            onClick={(e) => {
                              handleRemoveFromCart(e, cart_item.id);
                            }}
                          >
                            <i className="bi bi-dash-circle"></i>
                          </button>
                          <p>{cart_item.quantity}</p>
                          <button
                            onClick={(e) => {
                              handleAddToCart(e, false, cart_item.id);
                            }}
                          >
                            <i className="bi bi-plus-circle"></i>
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                  <p className="item-subtotal">{cart_item.subtotal} ₾</p>
                </div>
              ))
          ) : (
            <p className={'cart-empty'}>კალათა ცარიელია</p>
          )}
        </div>
        {cart.cart_items && cart.cart_items.length > 0 && (
          <div className="cart-buttons-div">
            <div className="cart-purchase-div">
              <button
                className="cart-purchase-btn inline-font"
                onClick={() => {
                  handleCheckoutNavigate();
                }}
              >
                შეკვეთის გაფორმება &nbsp;<i class="bi bi-arrow-right"></i>
              </button>
            </div>
            <div className="cart-close-div">
              <button
                className="cart-purchase-btn inline-font"
                onClick={() => {
                  onOverlayClose('true');
                }}
              >
                დახურვა
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartOverlay;
