import React from 'react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const AddToCart = ({ id, handleCartUpdate, POST_OPTIONS }) => {
  const handleAddToCart = async (e) => {
    e.preventDefault();

    const endpoint = '/product/cart/add/';

    try {
      const response = await fetch(API_BASE_URL + endpoint, {
        ...POST_OPTIONS,
        body: JSON.stringify({ id: id }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error('Failed to add to cart');
      }
    } catch (error) {
      console.error('Error adding comment:', error);
      setErrorMessage('Error adding comment. Please try again later...');
    }

    handleCartUpdate();
  };

  return (
    <div className="card-cart-parent">
      <div className="cart-cart shadow">
        <form onSubmit={handleAddToCart}>
          <button className={'inline-font'} type="submit">
            დაამატე კალათაში
          </button>
        </form>
      </div>
      <div className="cart-buy shadow">
        <form onSubmit={handleAddToCart}>
          <button className={'inline-font'} type="submit">
            იყიდე ახლავე
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddToCart;
