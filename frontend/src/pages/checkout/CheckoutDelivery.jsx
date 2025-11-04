import React from 'react';
import { useState, useEffect } from 'react';

import { useApi } from '@/services/api.jsx';
import { useErrorContext } from '@/hooks/ErrorStates.jsx';
import { usePageContext } from '@/hooks/PageStates.jsx';
import { useProductContext } from '@/hooks/ProductStates.jsx';

const CheckoutDelivery = ({ onNavigateBtnClick }) => {
  const { API_BASE_URL, GET_OPTIONS, PUT_OPTIONS } = useApi();

  const { errorMessage, setErrorMessage } = useErrorContext();
  const { isLoading, setIsLoading } = usePageContext();
  const { form, setForm, setDeliveryCost } = useProductContext();

  const [oldForm, setOldForm] = useState(null);

  const [touched, setTouched] = useState({});
  const [messege, setMessege] = useState(null);

  useEffect(() => {
    getAddress();
  }, []);

  useEffect(() => {
    if (form.city === 'თბილისი') {
      setDeliveryCost(5);
    } else if (!form.city) {
      setDeliveryCost(null);
    } else {
      setDeliveryCost(10);
    }
  }, [form.city]);

  const isEqual = () => {
    if (form && oldForm) {
      if (JSON.stringify(form) === JSON.stringify(oldForm)) {
        return true;
      } else {
        return false;
      }
    }
  };

  const isValid = () => {
    if (emailInvalid || phoneInvalid || cityInvalid || nameInvalid || addressInvalid) {
      return false;
    } else {
      return true;
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((t) => ({ ...t, [name]: true }));
  };

  const handleAddressSubmit = async () => {
    if (!isValid()) {
      document.getElementById('checkout-delivery-parent').scrollIntoView();
      setErrorMessage('გთხოვთ შეავსოთ სავალდებულო ველები.');
      return;
    }

    if (isEqual()) {
      onNavigateBtnClick('payment');
      return;
    }

    setIsLoading(true);
    const endpoint = '/customer/address/';
    try {
      const response = await fetch(API_BASE_URL + endpoint, {
        ...PUT_OPTIONS,
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error);
      }

      const data = await response.json();

      if (data.Response === 'False') {
        setErrorMessage(data.error || 'Failed to edit user address');
        return;
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
      onNavigateBtnClick('payment');
    }
  };

  const getAddress = async () => {
    const endpoint = '/customer/address/';
    try {
      const response = await fetch(API_BASE_URL + endpoint, GET_OPTIONS);

      if (!response.ok) {
        throw new Error(data.error);
      }

      const data = await response.json();

      setOldForm({
        full_name: data.full_name || '',
        city: data.city || '',
        address_line1: data.address_line1 || '',
        address_line2: data.address_line2 || '',
        email: data.email || '',
        phone: data.phone || '',
      });

      setForm({
        full_name: data.full_name || '',
        city: data.city || '',
        address_line1: data.address_line1 || '',
        address_line2: data.address_line2 || '',
        email: data.email || '',
        phone: data.phone || '',
      });

      if (data.Response === 'False') {
        setErrorMessage(data.error || 'Failed to get address data');
        return;
      }
    } catch (error) {
      console.error(error);
    }
  };

  const emailInvalid =
    touched.email && !form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);
  const phoneInvalid = touched.phone && !form.phone && !/^\+?\d{7,15}$/.test(form.phone);
  const cityInvalid = touched.city && !form.city;
  const nameInvalid = touched.full_name && !form.full_name;
  const addressInvalid = touched.address_line1 && !form.address_line1;

  return (
    <div id="checkout-delivery-parent" className="checkout-delivery-parent">
      <div className={`checkout-delivery-header`}>
        <div className="checkout-delivery-title">
          <i className="bi bi-pin-map"></i>
          <p>მიწოდების ინფორმაცია</p>
        </div>
      </div>
      <div className="checkout-delivery-content">
        <div className="checkout-fill-out">
          <p>მიუთითეთ მისამართი</p>
        </div>
        <div className="checkout-delivery-div">
          <form className="checkout-delivery-form">
            <label className="checkout-delivery-label">
              <p className="flex gap-1">
                სახელი და გვარი <span className="text-[var(--color-primary-red)]">*</span>
              </p>
              <input
                type="text"
                id="full_name"
                name="full_name"
                className={`checkout-delivery-input    ${
                  nameInvalid
                    ? 'border-red-500 ring-2 ring-red-400 focus:ring-red-400 focus:border-red-500'
                    : 'border-gray-300'
                }`}
                placeholder="მაგ: გიორგი ნადირაძე"
                value={form.full_name}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {nameInvalid && (
                <p className="text-[10px] text-red-600 font-medium absolute">
                  შეიყვანეთ სახელი და გვარი.
                </p>
              )}
            </label>
            <label className="checkout-delivery-label">
              <p className="flex gap-1">
                ქალაქი <span className="text-[var(--color-primary-red)]">*</span>
              </p>
              <select
                id="city"
                name="city"
                className={`checkout-delivery-dropdown ${
                  !form.city && 'text-[var(--color-secondary-font)]'
                } ${
                  cityInvalid
                    ? 'border-red-500 ring-2 ring-red-400 focus:ring-red-400 focus:border-red-500'
                    : 'border-gray-300'
                }`}
                placeholder="მაგ: თბილისი"
                value={form.city}
                onChange={handleChange}
                onBlur={handleBlur}
              >
                <option value="" disabled defaultValue>
                  აირჩიეთ ქალაქი
                </option>
                <option value="თბილისი">თბილისი</option>
                <option value="ბათუმი">ბათუმი</option>
                <option value="ქუთაისი">ქუთაისი</option>
                <option value="რუსთავი">რუსთავი</option>
                <option value="გორი">გორი</option>
                <option value="ზუგდიდი">ზუგდიდი</option>
                <option value="ფოთი">ფოთი</option>
                <option value="თელავი">თელავი</option>
                <option value="სხვა">სხვა</option>
              </select>
              {cityInvalid && (
                <p className="text-[10px] text-red-600 font-medium absolute">აირჩიეთ ქალაქი.</p>
              )}
            </label>
            <label className="checkout-delivery-label">
              <p className="flex gap-1">
                მისამართი <span className="text-[var(--color-primary-red)]">*</span>
              </p>
              <input
                type="text"
                id="address_line1"
                name="address_line1"
                className={`checkout-delivery-input ${
                  addressInvalid
                    ? 'border-red-500 ring-2 ring-red-400 focus:ring-red-400 focus:border-red-500'
                    : 'border-gray-300'
                }`}
                placeholder="მაგ: პეკინის 12"
                value={form.address_line1}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {addressInvalid && (
                <p className="text-[10px] text-red-600 font-medium absolute">
                  შეიყვანეთ მისამართი.
                </p>
              )}
            </label>
            <label className="checkout-delivery-label">
              <p className="flex gap-1">
                ტელეფონის ნომერი <span className="text-[var(--color-primary-red)]">*</span>
              </p>
              <input
                type="text"
                id="phone"
                name="phone"
                className={`checkout-delivery-input ${
                  phoneInvalid
                    ? 'border-red-500 ring-2 ring-red-400 focus:ring-red-400 focus:border-red-500'
                    : 'border-gray-300'
                }`}
                placeholder="მაგ: 555 12 34 56"
                value={form.phone}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {phoneInvalid && (
                <p className="text-[10px] text-red-600 font-medium absolute">
                  შეიყვანეთ ვალიდური ტელეფონის ნომერი.
                </p>
              )}
            </label>
            <label className="checkout-delivery-label">
              <p className="flex gap-1">
                ელ-ფოსტა <span className="text-[var(--color-primary-red)]">*</span>
              </p>
              <input
                type="email"
                id="email"
                name="email"
                className={`checkout-delivery-input ${
                  emailInvalid
                    ? 'border-red-500 ring-2 ring-red-400 focus:ring-red-400 focus:border-red-500'
                    : 'border-gray-300'
                }`}
                placeholder="მაგ: name@gmail.com"
                value={form.email}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {emailInvalid && (
                <p className="text-[10px] text-red-600 font-medium absolute">
                  შეიყვანეთ ვალიდური ელფოსტა.
                </p>
              )}
            </label>
            <label className="checkout-delivery-label">
              <p>დამატებითი ინფორმაცია (არასავალდებულო)</p>
              <textarea
                id="address_line2"
                name="address_line2"
                className="checkout-delivery-input-text"
                placeholder="სართული, ბინის ნომერი, კოდი და სხვა"
                value={form.address_line2}
                onChange={handleChange}
                onBlur={handleBlur}
              ></textarea>
            </label>
            <div className="checkout-delivery-btn-div">
              <button
                onClick={() => {
                  handleAddressSubmit();
                }}
                type="button"
                className="checkout-delivery-btn"
                disabled={isLoading}
              >
                {isLoading ? <span className="loader"></span> : 'გაგრძელება'}
              </button>
            </div>
          </form>
          {errorMessage && <p className="text-red-500">{errorMessage}</p>}
        </div>
      </div>
    </div>
  );
};

export default CheckoutDelivery;
