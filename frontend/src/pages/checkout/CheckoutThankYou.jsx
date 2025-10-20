import React, { useState, useEffect } from 'react';

import { useProductContext } from '@/hooks/ProductStates';

const CheckoutThankYou = () => {
  const user = 'info';
  const domain = 'ceyo';
  const tld = 'com';
  const [email, setEmail] = useState(`${user}@${domain}.${tld}`);

  return (
    <div className="checkout-thankyou-parent">
      <div className="check-icon-div">
        <i class="bi bi-check-circle-fill"></i>
      </div>

      <h2>
        თქვენი შეკვეთა <span className="text-[var(--color-primary-blue)]">დადასტურებულია!</span>
      </h2>
      <p>📦 მალე მიიღებთ შეკვეთის ნომერს ელ-ფოსტაზე.</p>
      <p>
        🚚 მიწოდების დეტალების დასადასტურებლად, კურიერი დაგიკავშირდებათ თქვენ მიერ მითითებულ
        ტელეფონის ნომერზე.
      </p>
      <p>📞 თუ გსურთ შეცვალოთ ტელეფონის ნომერი ან გაქვთ შეკითხვები, დაგვიკავშირდით:</p>

      <div className="contact-details">
        {user && domain && tld ? (
          <div className="flex justify-center gap-3">
            <div className="flex justify-center items-center gap-1">
              <i class="bi bi-send text-sm"></i>
              <span className="font-bold flex">ელ-ფოსტა:</span>
            </div>
            <a href={`mailto:${email}`}>
              {user}@{domain}.{tld}
            </a>
          </div>
        ) : (
          ''
        )}
      </div>
    </div>
  );
};

export default CheckoutThankYou;
