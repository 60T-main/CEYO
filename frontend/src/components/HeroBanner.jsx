import React, { useState, useEffect, useRef } from 'react';
import BannerSkeleton from './BannerSkeleton.jsx';
import Player from '@vimeo/player';

const HeroBanner = () => {
  const iframeRef = useRef(null);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!iframeRef.current) return;

    const player = new Player(iframeRef.current);

    const onLoaded = () => setIsReady(true);
    const onError = (err) => {
      console.error('Vimeo Player error:', err);
      setError('ვერ ჩაიტვირთა ვიდეო');
      // Optionally hide loader anyway:
      setIsReady(true);
    };

    player.on('loaded', onLoaded);
    player.on('error', onError);

    // Extra safety: if event somehow misses
    player.ready().then(() => {
      // Keep existing logic: only flip if not already ready
      setIsReady((prev) => prev || true);
    });

    return () => {
      player.off('loaded', onLoaded);
      player.off('error', onError);
    };
  }, []);

  return (
    <section className="hero-section relative">
      {!isReady && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <BannerSkeleton />
        </div>
      )}
      {error && (
        <div className="absolute top-2 left-1/2 -translate-x-1/2 text-xs bg-red-600 text-white px-3 py-1 rounded z-20">
          {error}
        </div>
      )}
      <div className="video-parent">
        <iframe
          ref={iframeRef}
          src="https://player.vimeo.com/video/1084642808?h=a792886aaa&autoplay=1&loop=1&muted=1&background=1"
          className="video-frame"
          allow="autoplay; fullscreen"
          loading="lazy"
          title="Hero video"
        ></iframe>
      </div>
    </section>
  );
};

export default HeroBanner;
