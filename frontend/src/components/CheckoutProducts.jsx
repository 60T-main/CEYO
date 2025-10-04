import React from 'react';
import { useState, useEffect } from 'react';

import { usePageContext } from '../hooks/PageStates';

const CheckoutProducts = ({ onOverlayClose, children }) => {
  const { setOverlayState, overlayState } = usePageContext();
  const [showItems, setShowItems] = useState(false);

  useEffect(() => {
    if (overlayState === 'checkout') {
      const timer = setTimeout(() => setShowItems(true), 100);
      return () => clearTimeout(timer);
    } else {
      setShowItems(false);
    }
  }, [overlayState]);

  const handleOverlayButton = async () => {
    overlayState === 'checkout' ? onOverlayClose('checkout') : setOverlayState('checkout');
    console.log(overlayState);
  };
  return (
    <div className={`checkout-items-parent${overlayState === 'checkout' ? ' open' : ''}`}>
      <div className="checkout-items-header-absolute">
        <div className="checkout-items-header">
          <div className="checkout-items-title">
            <i className="bi bi-bag-check text-lg"></i>
            <p>შეკვეთის დეტალები</p>
          </div>
          <div
            className="checkout-items-close"
            onClick={() => {
              handleOverlayButton();
            }}
          >
            <p>დახურვა</p>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center">
        {overlayState === 'checkout' && showItems && [...Array(10)].map(() => <div>123</div>)}
      </div>

      {children}
    </div>
  );
};

export default CheckoutProducts;
