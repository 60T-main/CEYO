import React from 'react';
import Skeleton from 'react-loading-skeleton';

const CardSkeleton = ({ variant }) => {
  return (
    <>
      {variant === 'search' && (
        <div className="card-skeleton-search">
          <Skeleton width="100%" height="100%" />
        </div>
      )}
      {variant === 'home' && (
        <div className="card-skeleton-home">
          <div className="ml-5">
            <Skeleton width={100} height={100} />
          </div>
          <div className="ml-5">
            <Skeleton />
          </div>
        </div>
      )}
      {variant === 'products' && (
        <div className="card-skeleton-products">
          <Skeleton width="100%" height="100%" />
        </div>
      )}
      {variant === 'product-detail' && (
        <>
          <div className="card-skeleton-product">
            <div className="card-skeleton-product-img">
              <Skeleton width="100%" height="100%" />
            </div>
            <div className="card-skeleton-product-content">
              <div className="card-skeleton-product-name">
                <Skeleton width="100%" height="100%" />
              </div>
              <div className="card-skeleton-product-price">
                <Skeleton width="100%" height="100%" />
              </div>
              <div className="card-skeleton-product-buttons">
                <Skeleton width="100%" height="100%" count="2" />
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default CardSkeleton;
