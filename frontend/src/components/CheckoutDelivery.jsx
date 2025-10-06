import React from 'react';
import { useState, useEffect } from 'react';

const CheckoutDelivery = ({}) => {
  return (
    <div className="checkout-delivery-parent">
      <div className={`checkout-delivery-header`}>
        <div className="checkout-delivery-title">
          <i class="bi bi-pin-map"></i>
          <p>მიწოდების ინფორმაცია</p>
        </div>
      </div>
      <div className="checkout-delivery-content">
        <div className="checkout-fill-out">
          <p>მიუთითეთ მისამართი</p>
        </div>
        <div className="checkout-delivery-div">
          <form className="checkout-delivery-form">
            <label className="checkout-delivery-label">
              <p className="flex gap-1">
                სახელი და გვარი <p className="text-[var(--color-primary-red)]">*</p>
              </p>
              <input
                type="text"
                className="checkout-delivery-input"
                placeholder="მაგ: ბუსა ნადირაძე"
              />
            </label>
            <label className="checkout-delivery-label">
              <p className="flex gap-1">
                ქალაქი <p className="text-[var(--color-primary-red)]">*</p>
              </p>
              <input type="text" className="checkout-delivery-input" placeholder="მაგ: თბილისი" />
            </label>
            <label className="checkout-delivery-label">
              <p className="flex gap-1">
                ქუჩა და ნომერი <p className="text-[var(--color-primary-red)]">*</p>
              </p>
              <input
                type="text"
                className="checkout-delivery-input"
                placeholder="მაგ: პეკინის 12"
              />
            </label>
            <label className="checkout-delivery-label">
              <p className="flex gap-1">
                ტელეფონის ნომერი <p className="text-[var(--color-primary-red)]">*</p>
              </p>
              <input
                type="text"
                className="checkout-delivery-input"
                placeholder="მაგ: 555 12 34 56"
              />
            </label>
            <label className="checkout-delivery-label">
              <p className="flex gap-1">
                ელ-ფოსტა <p className="text-[var(--color-primary-red)]">*</p>
              </p>
              <input
                type="email"
                className="checkout-delivery-input"
                placeholder="მაგ: name@gmail.com"
              />
            </label>
            <label className="checkout-delivery-label">
              <p>დამატებითი ინფორმაცია (არასავალდებულო)</p>
              <textarea
                className="checkout-delivery-input-text"
                placeholder="სართული, ბინის ნომერი, კოდი და სხვა"
              ></textarea>
            </label>
            <button type="button" className="checkout-delivery-btn">
              შეკვეთის გაფორმება
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CheckoutDelivery;
