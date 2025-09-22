import React from 'react';
import Skeleton from 'react-loading-skeleton';

const BannerSkeleton = ({}) => {
  return (
    <div className="banner-skeleton">
      <Skeleton borderRadius={20} width="100%" height="100%" />
    </div>
  );
};

export default BannerSkeleton;
