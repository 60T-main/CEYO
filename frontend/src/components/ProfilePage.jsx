import React, { useEffect, useState, useMemo } from 'react';

const ProfilePage = ({
  loggedIn,
  getUserInfo,
  userInfo,
  checkIfLogedIn,
  PUT_OPTIONS,
  POST_OPTIONS,
  API_BASE_URL,
  LogIn,
}) => {
  const [form, setForm] = useState({
    username: '',
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
  });
  const [touched, setTouched] = useState({});
  const [messege, setMessege] = useState(null);

  const handleEdit = async () => {
    const endpoint = '/customer/edit/';
    try {
      const response = await fetch(API_BASE_URL + endpoint, {
        ...PUT_OPTIONS,
        body: JSON.stringify(form),
        headers: {
          ...(PUT_OPTIONS.headers || {}),
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to edit user data');
      } else {
        setMessege('დეტალები წარმატებით შეცვალა!');
      }

      const data = await response.json();

      if (data.Response === 'False') {
        setErrorMessage(data.Error || 'Failed to edit user data');
        return;
      }
    } catch (error) {
      console.error('Error editing user details:', error);
      setErrorMessage('Error editing user details. Please try again later...');
    }
  };

  const handleLogout = async () => {
    const endpoint = '/customer/logout/';
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

  useEffect(() => {
    checkIfLogedIn();
    getUserInfo();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Populate local state when userInfo changes
  useEffect(() => {
    if (userInfo) {
      setForm({
        username: userInfo.username || '',
        first_name: userInfo.first_name || '',
        last_name: userInfo.last_name || '',
        email: userInfo.email || '',
        phone: userInfo.phone || '',
      });
    }
  }, [userInfo]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((t) => ({ ...t, [name]: true }));
  };

  const original = useMemo(
    () => ({
      username: userInfo?.username || '',
      first_name: userInfo?.first_name || '',
      last_name: userInfo?.last_name || '',
      email: userInfo?.email || '',
      phone: userInfo?.phone || '',
    }),
    [userInfo]
  );

  const isDirty = useMemo(() => {
    return Object.keys(form).some((k) => form[k] !== original[k]);
  }, [form, original]);

  // Simple visual validation (no blocking): email format & phone digits length 7-15
  const emailInvalid =
    touched.email && form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);
  const phoneInvalid = touched.phone && form.phone && !/^\+?\d{7,15}$/.test(form.phone);

  const handleCancel = () => {
    setForm(original);
    setTouched({});
  };

  const handleFakeSubmit = (e) => {
    e.preventDefault();
    // Visual only: highlight touched fields as though attempted submit
    setTouched({
      username: true,
      first_name: true,
      last_name: true,
      email: true,
      phone: true,
    });
    // No actual API call yet.
  };

  if (!loggedIn) {
    return <LogIn POST_OPTIONS={POST_OPTIONS} API_BASE_URL={API_BASE_URL}></LogIn>;
  }

  return (
    <section className="mt-30 px-5 lg:px-[var(--padding-x-large)] md:items-center flex flex-col gap-10">
      <div className="flex flex-col gap-2">
        <h2 className="text-xl font-bold text-[var(--color-primary-blue)]">პროფილის ინფორმაცია</h2>
        <p className="text-xs md:text-sm text-[var(--color-secondary-font)]">
          შეგიძლიათ შეცვალოთ პირადი მონაცემები
        </p>
      </div>

      <form
        onSubmit={handleFakeSubmit}
        className="bg-white rounded-2xl shadow-sm p-5 md:p-8 flex flex-col gap-6 max-w-xl"
      >
        {/* Username (read-only) */}
        <div className="flex flex-col gap-1">
          <label
            htmlFor="username"
            className="text-xs font-semibold text-[var(--color-secondary-font)] tracking-wide"
          >
            მომხმარებელი
          </label>
          <input
            id="username"
            name="username"
            value={form.username}
            disabled
            className="w-full bg-gray-100 text-gray-500 cursor-not-allowed border border-gray-200 rounded-md px-3 py-2 text-sm outline-none"
          />
          <p className="text-[10px] text-[var(--color-secondary-font)]">ცვლილება შეუძლებელია.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* First Name */}
          <div className="flex flex-col gap-1">
            <label
              htmlFor="first_name"
              className="text-xs font-semibold text-[var(--color-secondary-font)] tracking-wide"
            >
              სახელი
            </label>
            <input
              id="first_name"
              name="first_name"
              placeholder="თქვენი სახელი"
              value={form.first_name}
              onChange={handleChange}
              onBlur={handleBlur}
              className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:border-[var(--color-primary-blue)] focus:ring-2 focus:ring-[var(--color-primary-blue)]"
            />
          </div>
          {/* Last Name */}
          <div className="flex flex-col gap-1">
            <label
              htmlFor="last_name"
              className="text-xs font-semibold text-[var(--color-secondary-font)] tracking-wide"
            >
              გვარი
            </label>
            <input
              id="last_name"
              name="last_name"
              placeholder="თქვენი გვარი"
              value={form.last_name}
              onChange={handleChange}
              onBlur={handleBlur}
              className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:border-[var(--color-primary-blue)] focus:ring-2 focus:ring-[var(--color-primary-blue)]"
            />
          </div>
        </div>

        {/* Email */}
        <div className="flex flex-col gap-1">
          <label
            htmlFor="email"
            className="text-xs font-semibold text-[var(--color-secondary-font)] tracking-wide"
          >
            ემაილი
          </label>
          <input
            id="email"
            name="email"
            placeholder="მაგ: user@mail.com"
            value={form.email}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`w-full bg-white border rounded-md px-3 py-2 text-sm outline-none transition focus:border-[var(--color-primary-blue)] focus:ring-2 focus:ring-[var(--color-primary-blue)] ${
              emailInvalid
                ? 'border-red-500 ring-2 ring-red-400 focus:ring-red-400 focus:border-red-500'
                : 'border-gray-300'
            }`}
          />
          {emailInvalid && (
            <p className="text-[10px] text-red-600 font-medium">შეიყვანეთ ვალიდური ელფოსტა.</p>
          )}
        </div>

        {/* Phone */}
        <div className="flex flex-col gap-1">
          <label
            htmlFor="phone"
            className="text-xs font-semibold text-[var(--color-secondary-font)] tracking-wide"
          >
            ტელეფონი
          </label>
          <input
            id="phone"
            name="phone"
            placeholder="მაგ: +995555111222"
            value={form.phone}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`w-full bg-white border rounded-md px-3 py-2 text-sm outline-none transition focus:border-[var(--color-primary-blue)] focus:ring-2 focus:ring-[var(--color-primary-blue)] ${
              phoneInvalid
                ? 'border-red-500 ring-2 ring-red-400 focus:ring-red-400 focus:border-red-500'
                : 'border-gray-300'
            }`}
          />
          {phoneInvalid && (
            <p className="text-[10px] text-red-600 font-medium">
              შეიყვანეთ 7-15 ციფრი (არავალდ. + ნიშანი დასაწყისში).
            </p>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex flex-row gap-4 pt-2">
          <button
            type="submit"
            onClick={handleEdit}
            disabled={!isDirty}
            className={`flex-1 h-10 rounded-xl font-bold text-sm transition ${
              isDirty
                ? 'bg-[var(--color-primary-blue)] text-white hover:bg-[#00345f]'
                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
            }`}
          >
            შენახვა
          </button>
          <button
            type="button"
            onClick={handleCancel}
            disabled={!isDirty}
            className={`flex-1 h-10 rounded-xl font-bold text-sm transition ${
              isDirty
                ? 'bg-[#ed1a2d] text-[#FFF8F0] hover:bg-[#c81324]'
                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
            }`}
          >
            გაუქმება
          </button>
        </div>
        {!isDirty && (
          <p className="text-[10px] text-[var(--color-secondary-font)]">ცვლილება არ არის.</p>
        )}
        {messege && <h4 className="messege !text-green-600">{messege}</h4>}
      </form>

      <div className="bg-red-500 rounded-3xl w-25 h-10 flex justify-center items-center">
        <button
          className=""
          onClick={() => {
            handleLogout();
          }}
        >
          <h4 className="text-white ">გასვლა</h4>
        </button>
      </div>
    </section>
  );
};

export default ProfilePage;
