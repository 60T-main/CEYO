import React, { useState } from 'react';

const LogIn = ({ POST_OPTIONS, API_BASE_URL }) => {
  const [form, setForm] = useState({
    username: '',
    password: '',
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleLogIn = async () => {
    const endpoint = '/customer/login/';
    try {
      const response = await fetch(API_BASE_URL + endpoint, {
        ...POST_OPTIONS,
        body: JSON.stringify(form),
        headers: {
          ...(POST_OPTIONS.headers || {}),
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to edit user data');
      }

      const data = await response.json();

      window.location.reload();

      if (data.Response === 'False') {
        setErrorMessage(data.Error || 'Failed to edit user data');
        return;
      }
    } catch (error) {
      console.error('Error editing user details:', error);
      setErrorMessage('Error editing user details. Please try again later...');
    }
  };

  return (
    <section className="mt-30 px-5 lg:px-[var(--padding-x-large)] flex flex-col gap-10 items-center min-h-[60vh]">
      <div className="flex flex-col gap-2 max-w-xl w-full">
        <h2 className="text-xl font-bold text-[var(--color-primary-blue)]">შესვლა</h2>
        <p className="text-xs md:text-sm text-[var(--color-secondary-font)]">
          გთხოვთ შეიყვანოთ თქვენი მონაცემები სისტემაში შესასვლელად.
        </p>
      </div>

      <form className="bg-white rounded-2xl shadow-sm p-5 md:p-8 flex flex-col gap-6 max-w-xl w-full">
        {/* Username or Email */}
        <div className="flex flex-col gap-1">
          <label
            htmlFor="username"
            className="text-xs font-semibold text-[var(--color-secondary-font)] tracking-wide"
          >
            მომხმარებელი ან ელფოსტა
          </label>
          <input
            id="username"
            name="username"
            type="text"
            placeholder="მაგ: user@mail.com ან მომხმარებელი"
            value={form.username}
            onChange={handleChange}
            className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:border-[var(--color-primary-blue)] focus:ring-2 focus:ring-[var(--color-primary-blue)]"
          />
        </div>

        {/* Password */}
        <div className="flex flex-col gap-1">
          <label
            htmlFor="password"
            className="text-xs font-semibold text-[var(--color-secondary-font)] tracking-wide"
          >
            პაროლი
          </label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="••••••••"
            value={form.password}
            onChange={handleChange}
            className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:border-[var(--color-primary-blue)] focus:ring-2 focus:ring-[var(--color-primary-blue)]"
          />
        </div>

        {/* Action button */}
        <div className="flex flex-row gap-4 pt-2">
          <button
            type="button"
            className="flex-1 h-10 rounded-xl font-bold text-sm transition bg-[var(--color-primary-blue)] text-white hover:bg-[#00345f]"
            onClick={() => {
              handleLogIn();
            }}
          >
            შესვლა
          </button>
        </div>
      </form>
    </section>
  );
};

export default LogIn;
