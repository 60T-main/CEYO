import React from 'react';
import Skeleton from 'react-loading-skeleton';

const CardSkeleton = ({}) => {
  return (
    <div className="">
      <div className="ml-5">
        <Skeleton width={100} height={100} />
      </div>
      <div className="ml-5">
        <Skeleton />
      </div>
    </div>
  );
};

export default CardSkeleton;
