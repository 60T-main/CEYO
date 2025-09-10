import React from 'react';

const Cart = ({ cartActive, setCartActive, onCartClose }) => {
  return (
    <div className="cart-div">
      {cartActive ? (
        <img
          onClick={() => {
            onCartClose();
          }}
          className="w-5"
          src="/public/menu2.svg"
          alt="Menu2"
        />
      ) : (
        <img
          className="icon cart"
          src="/public/cart.svg"
          alt="cart icon"
          onClick={() => {
            setCartActive(true);
          }}
        />
      )}
    </div>
  );
};

export default Cart;
