import React from 'react';

const Home = ({ HeroBanner, children }) => {
  return (
    <>
      <HeroBanner />

      {children}
    </>
  );
};

export default Home;
