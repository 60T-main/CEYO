import React from 'react';
import { useEffect, useState } from 'react';

import { useProductContext } from '../hooks/ProductStates';

const OrderOverlay = ({ onFilter }) => {

  const {priceState, setPriceState, nameState,setNameState} = useProductContext();


  const handleOrder = async (orderBy) => {
    if (orderBy === 'price') {
      if (!priceState || priceState === 'descending') {
        setPriceState('ascending');
        setNameState(null);
        onFilter({ order_by: 'price' });
      } else if (priceState === 'ascending') {
        setPriceState('descending');
        setNameState(null);
        onFilter({ order_by: '-price' });
      }
    } else if (orderBy === 'name') {
      if (!nameState || nameState === 'descending') {
        setNameState('ascending');
        setPriceState(null);
        onFilter({ order_by: 'name' });
      } else if (nameState === 'ascending') {
        setNameState('descending');
        setPriceState(null);
        onFilter({ order_by: '-name' });
      }
    }
  };

  const handleClear = async () => {
    setPriceState(null);
    setNameState(null);
    onFilter();
  };

  return (
    <div className="order-parent">
      <div className="order-content">
        <div className="by-name-div">
          <button
            onClick={() => {
              handleOrder('name');
            }}
            className={nameState && 'font-bold'}
          >
            სახელით {!priceState && nameState && (nameState === 'ascending' ? <i class="bi bi-sort-alpha-up"></i>
 : <i class="bi bi-sort-alpha-down"></i>
)} 
          </button>
        </div>
          <hr className='separator'/>
        <div className="by-price-div">
          <button
            onClick={() => {
              handleOrder('price');
            }}
            className={priceState && 'font-bold'}
          >
             ფასით{priceState && !nameState && (priceState === 'ascending' ? <i class="bi bi-sort-numeric-up"></i> : <i class="bi bi-sort-numeric-down"></i>)} 
          </button>
        </div>
        <hr className='separator'/>
        <div className="clear-div">
          <button
            onClick={() => {
              handleClear();
            }}
          >
            გასუფთავება
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderOverlay;
