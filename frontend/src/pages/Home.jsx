import React, { useEffect } from 'react';

import { useApi } from '../services/api';

const Home = ({ HeroBanner, children }) => {
  const { fetchProducts } = useApi();

  useEffect(() => {
    fetchProducts({ order_by: 'last_modified' });
  }, []);

  return (
    <>
      <HeroBanner />

      {children}
    </>
  );
};

export default Home;
