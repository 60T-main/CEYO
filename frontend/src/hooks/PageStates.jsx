import React, { useState, useContext, createContext } from 'react';

export const PageStates = createContext();

export const PageProvider = ({ children }) => {
  // Overlay States: 'menu', 'search', 'cart', 'filter', 'order', 'checkout', 'none' or null
  const [overlayState, setOverlayState] = useState('none');
  const [overlayClosing, setOverlayClosing] = useState(null);

  // Header Animation State
  const [headerAnimate, setHeaderAnimate] = useState(null);

  // Loading State
  const [isLoading, setIsLoading] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage, setPostsPerPage] = useState(4);

  return (
    <PageStates.Provider
      value={{
        overlayState,
        setOverlayState,
        overlayClosing,
        setOverlayClosing,
        headerAnimate,
        setHeaderAnimate,
        isLoading,
        setIsLoading,
        currentPage,
        setCurrentPage,
        postsPerPage,
        setPostsPerPage,
      }}
    >
      {children}
    </PageStates.Provider>
  );
};

export const usePageContext = () => useContext(PageStates);
