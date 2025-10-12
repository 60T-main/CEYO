import React, { useState } from 'react';

import { useProductContext } from '../hooks/ProductStates';
import { useApi } from '../services/api';

const CheckoutPayment = ({ onNavigateBtnClick }) => {
  const [selected, setSelected] = useState('card');

  const { form, cart } = useProductContext();

  const { POST_OPTIONS, API_BASE_URL } = useApi();

  const onOrderSubmit = async () => {
    let products = {};

    cart.cart_items.map((item) => {
      products[item.id] = item.quantity;
    });

    const endpoint = '/orders/';
    try {
      const response = await fetch(API_BASE_URL + endpoint, {
        ...POST_OPTIONS,
        body: JSON.stringify({
          products: products,
          total_amount: cart.total_price,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error);
      }

      const data = await response.json();

      if (data.Response === 'False') {
        setErrorMessage(data.error || 'Failed to create order');
        return;
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="checkout-delivery-parent">
      <div className="checkout-delivery-header ">
        <div className="checkout-delivery-title">
          <i class="bi bi-box-seam"></i>
          <p>შეკვეთის დადასტურება</p>
        </div>
      </div>
      <div className="checkout-final-delivery-parent">
        <div className="checkout-final-delivery-title">
          <i class="bi bi-pin-map-fill"></i>
          <p>მიწოდების ინფორმაცია</p>
        </div>
        <div className="checkout-final-delivery-content-parent">
          <div className="checkout-final-delivery-content">
            <i class="bi bi-person"></i>
            <div className="checkout-final-delivery-names">
              <p>სახელი</p>
              <p>{form.full_name}</p>
            </div>
          </div>
          <div className="checkout-final-delivery-content">
            <i class="bi bi-buildings"></i>
            <div className="checkout-final-delivery-names">
              <p>ქალაქი</p>
              <p>{form.city}</p>
            </div>
          </div>
          <div className="checkout-final-delivery-content">
            <i class="bi bi-house"></i>
            <div className="checkout-final-delivery-names">
              <p>ქუჩა</p>
              <p>{form.address_line1}</p>
            </div>
          </div>
          <div className="checkout-final-delivery-content">
            <i class="bi bi-phone"></i>
            <div className="checkout-final-delivery-names">
              <p>ტელეფონი</p>
              <p>{form.phone}</p>
            </div>
          </div>
          <div className="checkout-final-delivery-content">
            <i class="bi bi-phone"></i>
            <div className="checkout-final-delivery-names">
              <p>ფოსტა</p>
              <p>{form.email}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="checkout-final-payment-parent">
        <div className="checkout-final-payment-title">
          <i class="bi bi-credit-card-2-back-fill"></i>
          <p>გადახდის მეთოდი</p>
        </div>
        <div className="checkout-final-payment-content">
          <i class="bi bi-credit-card-2-back-fill"></i>
          <p>ნაღდი ანგარიშწორებით</p>
        </div>
      </div>
      <div className="checkout-final-sum-parent">
        <div className="checkout-final-sum-title">
          <i class="bi bi-box-seam-fill"></i>
          <p>შეკვეთის დეტალები</p>
        </div>
        <div className="checkout-final-items-total">
          <div className="products-sum">
            <p>პროდუქტების ჯამი</p>
            <p>... ₾</p>
          </div>
          <div className="checkout-final-delivery">
            <p>მიწოდება</p>
            <p>... ₾</p>
          </div>
          <div className="checkout-final-total">
            <p>ჯამური ღირებულება</p>
            <p>... ₾</p>
          </div>
        </div>
      </div>
      <div className="checkout-final-buttons">
        <div className="checkout-final-buy">
          <button
            onClick={() => {
              onOrderSubmit();
            }}
            type="button"
            className="checkout-payment-btn full"
          >
            შეკვეთის დადასტურება
          </button>
        </div>
        <div className="checkout-final-back">
          <button
            onClick={() => {
              onNavigateBtnClick('payment');
            }}
            type="button"
            className="checkout-back-btn full"
          >
            უკან
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPayment;
