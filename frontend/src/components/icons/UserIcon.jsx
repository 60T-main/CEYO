import React from 'react';
import { useNavigate } from 'react-router-dom';

const User = ({ overlayState }) => {
  const navigate = useNavigate();

  const handleUserNavigate = () => {
    navigate('/profile');
  };

  let userIcon = null;
  if (
    !overlayState ||
    overlayState === 'none' ||
    overlayState === 'order' ||
    overlayState === 'checkout' ||
    overlayState === 'checkout-close' ||
    overlayState === 'order-close'
  ) {
    userIcon = (
      <div className="user-parent">
        <i
          onClick={() => {
            handleUserNavigate();
          }}
          className="bi bi-person icon user cursor-pointer"
        ></i>
      </div>
    );
  }

  return (
    <div
      className={`user-div ${
        !overlayState ||
        overlayState === 'none' ||
        overlayState === 'order' ||
        overlayState === 'checkout' ||
        overlayState === 'checkout-close' ||
        overlayState === 'order-close'
          ? 'show'
          : 'hide'
      }`}
    >
      {userIcon}
    </div>
  );
};

export default User;
