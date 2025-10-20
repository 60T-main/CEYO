import React from 'react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

import { useErrorContext } from '@/hooks/ErrorStates';

const AddToCart = ({
  id,
  handleCartUpdate,
  POST_OPTIONS,
  selectedColor,
  selectedSize,
  handleCheckoutNavigate,
}) => {
  const { setErrorMessage } = useErrorContext();

  const handleAddToCart = async (e, buyNow) => {
    e.preventDefault();

    if (!(selectedColor && selectedSize) && !id) {
      setErrorMessage('გთხოვთ აირჩიეთ ფერი და ზომა');
    } else {
      const endpoint = '/product/cart/add/';

      try {
        const response = await fetch(API_BASE_URL + endpoint, {
          ...POST_OPTIONS,
          body: JSON.stringify({ id: id }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error('Failed to add to cart:', data);
        }

        buyNow && handleCheckoutNavigate();
      } catch (error) {
        console.error('Error adding to cart:', error);
        setErrorMessage('Error adding to cart. Please try again later...');
      } finally {
        handleCartUpdate();
      }
    }
  };

  return (
    <div className="card-cart-parent">
      <form onSubmit={(e) => handleAddToCart(e, true)} className="cart-form">
        <div className="cart-buy shadow button-animation">
          <button className={'inline-font w-full'} type="submit">
            იყიდე ახლავე
          </button>
        </div>
      </form>
      <form onSubmit={handleAddToCart} className="cart-form">
        <div className="cart-cart shadow">
          <button className={'inline-font w-full'} type="submit">
            დაამატე კალათაში
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddToCart;
