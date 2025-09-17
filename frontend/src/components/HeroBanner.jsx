import React from 'react';

const HeroBanner = ({}) => {
  return (
    <>
      <section className="hero-section">
        <div className="video-parent">
          <iframe
            src="https://player.vimeo.com/video/1084642808?h=a792886aaa&autoplay=1&loop=1&muted=1&background=1"
            className="video-frame"
            allow="autoplay; fullscreen"
            loading="lazy"
          ></iframe>
        </div>
      </section>
    </>
  );
};

export default HeroBanner;
