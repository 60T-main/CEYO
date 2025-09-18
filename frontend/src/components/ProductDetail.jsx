import React from 'react';
import NewProducts from './CustomProducts';

import { useParams } from 'react-router-dom';

import { useEffect, useState } from 'react';
import CustomProducts from './CustomProducts';

const ProductDetail = ({
  API_BASE_URL,
  GET_OPTIONS,
  ProductComponent,
  handleCartUpdate,
  fetchRecentProducts,
  recentProductList,
}) => {
  const { id } = useParams();
  const [productDetail, setProductDetail] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  const fetchProductDetail = async () => {
    const endpoint = `/product/${id}`;

    try {
      const response = await fetch(API_BASE_URL + endpoint, GET_OPTIONS);

      if (!response.ok) {
        throw new Error('Failed to fetch product details');
      }

      const data = await response.json();

      if (data.Response === 'False') {
        setErrorMessage(data.Error || 'Failed to fetch product details');
        setProductDetail([]);
        return;
      }

      setProductDetail(data);
    } catch (error) {
      console.error('Error fetching products:', error);
      setErrorMessage('Error fetching products. Please try again later...');
    }
  };

  useEffect(() => {
    fetchProductDetail();
    fetchRecentProducts();

    console.log('recent products:', recentProductList);
  }, [id]);

  return (
    <>
      <div className="product-parent">
        {errorMessage && <div className="text-red-600 mb-4">{errorMessage}</div>}
        <ProductComponent
          key={productDetail.product_id}
          product={productDetail}
          handleCartUpdate={handleCartUpdate}
          API_BASE_URL={API_BASE_URL}
          variant="product-detail"
        />
      </div>

      <div className="recent-products-parent">
        <CustomProducts
          Product={ProductComponent}
          currentProduct={productDetail}
          customProductsList={recentProductList || []}
          handleCartUpdate={handleCartUpdate}
          API_BASE_URL={API_BASE_URL}
          variant="recent"
        />
      </div>
    </>
  );
};

export default ProductDetail;
