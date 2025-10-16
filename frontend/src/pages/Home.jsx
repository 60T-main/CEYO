import React, { useEffect } from 'react';

import { useApi } from '../services/api';

const Home = ({ HeroBanner, children }) => {
  const { fetchProducts } = useApi();

  useEffect(() => {
    fetchProducts({ order_by: 'created_at' });
    console.log('fetched last modified products');
  }, []);

  return (
    <>
      <HeroBanner />

      {children}
    </>
  );
};

export default Home;
