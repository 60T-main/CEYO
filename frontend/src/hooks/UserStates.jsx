import React, { useState, useContext, createContext } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  // User States
  const [loggedIn, setLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState('');

  return (
    <UserContext.Provider
      value={{
        loggedIn,
        setLoggedIn,
        userInfo,
        setUserInfo,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => useContext(UserContext);
