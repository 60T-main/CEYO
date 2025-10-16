import React, { useState } from 'react';

import { useProductContext } from '../hooks/ProductStates';

const CheckoutPayment = ({ onNavigateBtnClick }) => {
  const { selectedPayment, setSelectedPayment } = useProductContext();

  return (
    <div className="checkout-delivery-parent">
      <div className="checkout-delivery-header ">
        <div className="checkout-delivery-title">
          <i className="bi bi-credit-card"></i>
          <p>გადახდის მეთოდი</p>
        </div>
      </div>
      <div className="checkout-payment-content">
        <form className="flex flex-col gap-3 mt-6">
          <label
            className={`!flex items-center gap-3 p-4 rounded-3xl border-2 shadow-sm cursor-pointer transition-all focus-within:ring-2 focus-within:ring-yellow-400 
              ${
                selectedPayment === 'cash'
                  ? 'border-yellow-400 bg-yellow-100 bg-opacity-40'
                  : 'border-gray-200 bg-white'
              }`}
          >
            <input
              type="radio"
              name="payment"
              value="cash"
              className="accent-yellow-500"
              checked={selectedPayment === 'cash'}
              onChange={() => setSelectedPayment('cash')}
            />
            <span className="flex items-center gap-2 text-[var(--color-primary-font)] text-sm font-medium text-nowrap">
              <i className="bi bi-cash"></i>
              ნაღდით კურიერთან
            </span>
          </label>
          <label
            className={`!flex items-center gap-3 p-4 rounded-3xl border-2 shadow-sm cursor-pointer transition-all focus-within:ring-2 focus-within:ring-blue-300 
              ${
                selectedPayment === 'bank'
                  ? 'border-blue-400 bg-blue-100 bg-opacity-30'
                  : 'border-gray-200 bg-white'
              }`}
          >
            <input
              type="radio"
              name="payment"
              value="bank"
              className="accent-blue-500 "
              checked={selectedPayment === 'bank'}
              onChange={() => setSelectedPayment('bank')}
            />
            <span className="flex items-center gap-2 text-[var(--color-primary-font)] text-sm font-medium text-nowrap">
              <i className="bi bi-credit-card"></i>
              ბარათით გადახდა
            </span>
          </label>
        </form>
      </div>
      <div className="checkout-buttons-div">
        <button
          onClick={() => {
            onNavigateBtnClick('delivery');
          }}
          type="button"
          className="checkout-back-btn"
        >
          უკან
        </button>
        <button
          onClick={() => {
            onNavigateBtnClick('final');
          }}
          type="button"
          className="checkout-payment-btn"
        >
          გაგრძელება
        </button>
      </div>
    </div>
  );
};

export default CheckoutPayment;
