import React from 'react';

const HeroBanner = ({}) => {
  return (
    <>
      <section className="hero-section">
        <img className="hero" src="./public/hero.png" alt="Hero Banner" />
        <h3 className="inline-font font-bold absolute top-28 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          ახალი კოლექცია
        </h3>
      </section>
    </>
  );
};

export default HeroBanner;
