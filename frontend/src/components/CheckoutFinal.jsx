import React, { useEffect, useState } from 'react';

import { useProductContext } from '../hooks/ProductStates';
import { usePageContext } from '../hooks/PageStates';
import { useApi } from '../services/api';

const CheckoutFinal = ({ onNavigateBtnClick }) => {
  const { form, cart, deliveryCost, selectedPayment } = useProductContext();
  const { setIsLoading, isLoading } = usePageContext();

  const { POST_OPTIONS, API_BASE_URL } = useApi();

  const onOrderSubmit = async () => {
    setIsLoading(true);

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
          delivery_cost: deliveryCost ? deliveryCost : 0,
          total_amount:
            deliveryCost && cart.total_price ? cart.total_price + deliveryCost : cart.total_price,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error);
      }

      const data = await response.json();

      onNavigateBtnClick('thankyou');

      if (data.Response === 'False') {
        setErrorMessage(data.error || 'Failed to create order');
        return;
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="checkout-delivery-parent">
      <div className="checkout-delivery-header ">
        <div className="checkout-delivery-title">
          <i className="bi bi-box-seam"></i>
          <p>შეკვეთის დადასტურება</p>
        </div>
      </div>
      <div className="checkout-final-delivery-parent">
        <div className="checkout-final-delivery-title">
          <i className="bi bi-pin-map-fill"></i>
          <p>მიწოდების ინფორმაცია</p>
        </div>
        <div className="checkout-final-delivery-content-parent">
          <div className="checkout-final-delivery-content">
            <i className="bi bi-person"></i>
            <div className="checkout-final-delivery-names">
              <p>სახელი</p>
              <p>{form.full_name}</p>
            </div>
          </div>
          <div className="checkout-final-delivery-content">
            <i className="bi bi-buildings"></i>
            <div className="checkout-final-delivery-names">
              <p>ქალაქი</p>
              <p>{form.city}</p>
            </div>
          </div>
          <div className="checkout-final-delivery-content">
            <i className="bi bi-house"></i>
            <div className="checkout-final-delivery-names">
              <p>ქუჩა</p>
              <p>{form.address_line1}</p>
            </div>
          </div>
          <div className="checkout-final-delivery-content">
            <i className="bi bi-phone"></i>
            <div className="checkout-final-delivery-names">
              <p>ტელეფონი</p>
              <p>{form.phone}</p>
            </div>
          </div>
          <div className="checkout-final-delivery-content">
            <i className="bi bi-phone"></i>
            <div className="checkout-final-delivery-names">
              <p>ელ-ფოსტა</p>
              <p>{form.email}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="checkout-final-payment-parent">
        <div className="checkout-final-payment-title">
          <i className="bi bi-credit-card-fill"></i>
          <p>გადახდის მეთოდი</p>
        </div>
        <div className="checkout-final-payment-content">
          {selectedPayment === 'cash' && (
            <>
              <i className="bi bi-cash"></i>
              <p>
                ნაღდი ანგარიშწორებით <br />
                <span className="!text-xs !text-[var(--color-secondary-font)] font-normal">
                  კურიერთან
                </span>
              </p>
            </>
          )}
          {selectedPayment === 'bank' && (
            <>
              <i className="bi bi-credit-card"></i>
              <p>ბარათით გადახდა</p>
            </>
          )}
        </div>
      </div>
      <div className="checkout-final-sum-parent">
        <div className="checkout-final-sum-title">
          <i className="bi bi-box-seam-fill"></i>
          <p>შეკვეთის დეტალები</p>
        </div>
        <div className="checkout-final-items-total">
          <div className="products-sum">
            <p>პროდუქტების ჯამი</p>
            <p>{cart.total_price} ₾</p>
          </div>
          <div className="checkout-final-delivery">
            <p>მიწოდება</p>
            <p>{deliveryCost ? `${deliveryCost} ₾` : 'აირჩიეთ ქალაქი'}</p>
          </div>
          <div className="checkout-final-total">
            <p>ჯამური ღირებულება</p>
            <p>
              {deliveryCost && cart.total_price
                ? `${deliveryCost + cart.total_price} ₾`
                : cart.total_price}
            </p>
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
            className="checkout-payment-btn full button-animation"
          >
            {isLoading ? (
              <span className="loader"></span>
            ) : (
              <>
                <i className="bi bi-check-square"></i>
                <span className="ml-2">შეკვეთის დადასტურება</span>
              </>
            )}
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

export default CheckoutFinal;
