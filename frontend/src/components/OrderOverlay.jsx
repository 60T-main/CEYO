import React from 'react';
import { useEffect, useState } from 'react';

const OrderOverlay = ({ onFilter }) => {
  const [priceState, setPriceState] = useState(null);
  const [nameState, setNameState] = useState(null);

  const handleOrder = async (orderBy) => {
    if (orderBy === 'price') {
      if (!priceState || priceState === 'ascending') {
        setPriceState('descending');
        setNameState(null);
        onFilter({ price_descending: 'true' });
      } else if (priceState === 'descending') {
        setPriceState('ascending');
        setNameState(null);
        onFilter({ price_ascending: 'true' });
      }
    } else if (orderBy === 'name') {
      if (!nameState || nameState === 'ascending') {
        setNameState('descending');
        setPriceState(null);
        onFilter({ price_descending: 'true' });
      } else if (nameState === 'descending') {
        setNameState('ascending');
        setPriceState(null);
        onFilter({ nameState: 'true' });
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
          >
            სახელით {!priceState && nameState && (nameState === 'ascending' ? '↑' : '↓')}
          </button>
        </div>
        <div className="by-price-div">
          <button
            onClick={() => {
              handleOrder('price');
            }}
          >
            ფასით {priceState && !nameState && (priceState === 'ascending' ? '↑' : '↓')}
          </button>
        </div>
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
