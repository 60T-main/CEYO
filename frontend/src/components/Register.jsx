import React, { useEffect, useState } from 'react';

const Register = ({ POST_OPTIONS, API_BASE_URL, handleLogin }) => {
  const [form, setForm] = useState({
    username: '',
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    password: '',
  });
  const [passwords, setPasswords] = useState({
    password: '',
    repeatPassword: '',
  });
  const [passwordsMatch, setPasswordsMatch] = useState(true);

  const [errorMessage, setErrorMessage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, email: value, [name]: value }));
  };
  const handlePassword = (e) => {
    const { name, value } = e.target;
    setPasswords((p) => ({ ...p, [name === 'password-repeat' ? 'repeatPassword' : name]: value }));
  };

  useEffect(() => {
    if (passwords.repeatPassword !== passwords.password) {
      setPasswordsMatch(false);
      setErrorMessage('პაროლი არ ემთხვევა!');
    } else {
      setPasswordsMatch(true);
      setErrorMessage(null);
    }
  }, [passwords]);

  const handleRegister = async () => {
    if (passwordsMatch) {
      const endpoint = '/customer/register/';
      try {
        const response = await fetch(API_BASE_URL + endpoint, {
          ...POST_OPTIONS,
          body: JSON.stringify({ ...form, password: passwords.password }),
          headers: {
            ...(POST_OPTIONS.headers || {}),
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error);
        }

        const data = await response.json();

        window.location.reload();

        if (data.Response === 'False') {
          setErrorMessage(data.error || 'Failed to register user data');
          return;
        }
      } catch (error) {
        console.error(error);
        error.message === 'Username already exists' &&
          setErrorMessage('მომხმარებელი უკვე არსებობს');
      }
    } else {
      setErrorMessage('პაროლი არ ემთხვევა, გთხოვთ სცადოთ ხელახლა');
    }
  };

  return (
    <section className="mt-30 px-5 lg:px-[var(--padding-x-large)] flex flex-col gap-10 items-center min-h-[60vh]">
      <div className="flex flex-col gap-2 max-w-xl w-full">
        <h2 className="text-xl font-bold text-[var(--color-primary-blue)]">რეგისტრაცია</h2>
        <p className="text-xs md:text-sm text-[var(--color-secondary-font)]">
          გთხოვთ შეიყვანოთ თქვენი მონაცემები რეგისტრაციის გასავლელად.
        </p>
      </div>

      <form className="bg-white rounded-2xl shadow-sm p-5 md:p-8 flex flex-col gap-6 max-w-xl w-full">
        {/* Username */}
        <div className="flex flex-col gap-1">
          <label
            htmlFor="username"
            className="text-xs font-semibold text-[var(--color-secondary-font)] tracking-wide"
          >
            მომხმარებლის e-mail
          </label>
          <input
            id="username"
            name="username"
            type="email"
            placeholder="მაგ: user@mail.com"
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
            value={passwords.password}
            onChange={handlePassword}
            className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:border-[var(--color-primary-blue)] focus:ring-2 focus:ring-[var(--color-primary-blue)]"
          />
          <label
            htmlFor="password-repeat"
            className="text-xs font-semibold text-[var(--color-secondary-font)] tracking-wide"
          >
            გაიმეორეთ პაროლი
          </label>
          <input
            id="password-repeat"
            name="password-repeat"
            type="password"
            placeholder="••••••••"
            value={passwords.repeatPassword}
            onChange={handlePassword}
            className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:border-[var(--color-primary-blue)] focus:ring-2 focus:ring-[var(--color-primary-blue)]"
          />
        </div>

        {/* Action button */}
        <div className="flex flex-row gap-4 pt-2">
          <button
            type="button"
            className="flex-1 h-10 rounded-xl font-bold text-sm transition bg-[var(--color-primary-blue)] text-white hover:bg-[#00345f]"
            onClick={() => {
              handleRegister();
            }}
          >
            რეგისტრაცია
          </button>
        </div>

        {errorMessage && <p className="text-red-500">{errorMessage}</p>}
      </form>
    </section>
  );
};

export default Register;
