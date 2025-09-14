import React from 'react';
import { useEffect, useState } from 'react';

const OrderOverlay = ({}) => {
  return (
    <div className="order-parent">
      <div className="order-content">
        <div className="by-name-div">
          <button>სახელით</button>
        </div>
        <div className="by-price-div">
          <button>ფასით</button>
        </div>
        <div className="clear-div">
          <button>გასუფთავება</button>
        </div>
      </div>
    </div>
  );
};

export default OrderOverlay;
