import React from 'react';

import CheckoutProducts from './CheckoutProducts';
import CheckoutDelivery from './CheckoutDelivery';
import CheckoutPayment from './CheckoutPayment';
import CheckoutFinal from './CheckoutFinal';
import CheckoutThankYou from './CheckoutThankYou';
import { usePageContext } from '@/hooks/PageStates';

const Checkout = ({ onOverlayClose, setOverlayState, setOverlayClosing, overlayState }) => {
  const { checkoutPageState, setCheckoutPageState } = usePageContext();

  const onNavigateBtnClick = (state) => {
    setCheckoutPageState(state);
    onOverlayClose('checkout');
  };

  return (
    <div className="checkout-parent">
      {!(checkoutPageState === 'thankyou') && (
        <>
          <div className="checkout-title-div">
            <h2 className="infline-font ">შეკვეთის გაფორმება</h2>
            <p className="infline-font ">თქვენი შეკვეთა თითქმის მზადაა</p>
          </div>
          <CheckoutProducts
            onOverlayClose={onOverlayClose}
            setOverlayState={setOverlayState}
            setOverlayClosing={setOverlayClosing}
          />
        </>
      )}

      {checkoutPageState === 'delivery' && (
        <CheckoutDelivery onNavigateBtnClick={onNavigateBtnClick} />
      )}
      {checkoutPageState === 'payment' && (
        <CheckoutPayment onNavigateBtnClick={onNavigateBtnClick} />
      )}
      {checkoutPageState === 'final' && <CheckoutFinal onNavigateBtnClick={onNavigateBtnClick} />}
      {checkoutPageState === 'thankyou' && <CheckoutThankYou />}
    </div>
  );
};

export default Checkout;
