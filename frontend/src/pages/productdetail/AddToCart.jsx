import React from 'react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

import { useErrorContext } from '@/hooks/ErrorStates';
import { usePageContext } from '@/hooks/PageStates';
import { useProductContext } from '../../hooks/ProductStates';
import { useApi } from '@/services/api';

const AddToCart = ({ id, handleCartUpdate, POST_OPTIONS }) => {
  const { addToCartLoading } = usePageContext();
  const { handleAddToCart } = useApi();

  return (
    <div className="card-cart-parent">
      <form onSubmit={(e) => handleAddToCart(e, true, id)} className="cart-form">
        <div className="cart-buy shadow button-animation">
          <button className={'inline-font w-full'} type="submit">
            {addToCartLoading ? <span className="loader add-to-cart" /> : 'იყიდე ახლავე'}
          </button>
        </div>
      </form>
      <form onSubmit={(e) => handleAddToCart(e, false, id)} className="cart-form">
        <div className="cart-cart shadow">
          <button className={'inline-font w-full'} type="submit">
            {addToCartLoading ? <span className="loader add-to-cart" /> : 'დაამატე კალათაში'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddToCart;
