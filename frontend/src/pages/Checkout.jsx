import React from 'react';

const Checkout = ({}) => {
  return (
    <div className="checkout-parent">
      <div className="checkout-title-div">
        <h2 className="infline-font ">შეკვეთის გაფორმება</h2>
        <p className="infline-font ">თქვენი შეკვეთა თითქმის მზადაა</p>
      </div>

      <div className="checkout-items-parent">
        <div className="checkout-items-header">
          <div className="checkout-items-title">
            <p>შეკვეთის დეტალები</p>
          </div>
          <div className="checkout-items-title">
            <p>დახურვა</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
