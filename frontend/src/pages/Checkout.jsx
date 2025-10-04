import React from 'react';

import CheckoutProducts from '../components/CheckoutProducts';
import CheckoutProductsOverlay from '../overlays/CheckoutProductsOverlay';

const Checkout = ({ onOverlayClose, setOverlayState, setOverlayClosing, overlayState }) => {
  return (
    <div className="checkout-parent">
      <div className="checkout-title-div">
        <h2 className="infline-font ">შეკვეთის გაფორმება</h2>
        <p className="infline-font ">თქვენი შეკვეთა თითქმის მზადაა</p>
      </div>
      <CheckoutProductsOverlay>
        <CheckoutProducts
          onOverlayClose={onOverlayClose}
          setOverlayState={setOverlayState}
          setOverlayClosing={setOverlayClosing}
        />
      </CheckoutProductsOverlay>
    </div>
  );
};

export default Checkout;
