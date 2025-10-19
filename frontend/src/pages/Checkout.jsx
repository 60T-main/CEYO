import React from 'react';

import CheckoutProducts from '../components/CheckoutProducts';
import CheckoutDelivery from '../components/CheckoutDelivery';
import CheckoutPayment from '../components/CheckoutPayment';
import CheckoutFinal from '../components/CheckoutFinal';
import CheckoutThankYou from '../components/CheckoutThankYou';
import { usePageContext } from '../hooks/PageStates';

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
