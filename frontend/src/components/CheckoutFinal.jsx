import React, { useState } from 'react';

const CheckoutPayment = ({ onNavigateBtnClick }) => {
  const [selected, setSelected] = useState('card');

  return (
    <div className="checkout-delivery-parent">
      <div className="checkout-delivery-header ">
        <div className="checkout-delivery-title">
          <i className="bi bi-credit-card"></i>
          <p>გადახდის მეთოდი</p>
        </div>
      </div>
      შეკვეთის დადასტურება
    </div>
  );
};

export default CheckoutPayment;
