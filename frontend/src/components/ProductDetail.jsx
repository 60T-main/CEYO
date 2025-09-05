import React from 'react';

import { useParams } from "react-router-dom";

import { useEffect,useState } from 'react';

const ProductDetail = ({ API_BASE_URL, ProductComponent }) => {

    const { id } = useParams();
    const [productDetail, setProductDetail] = useState([]);


    const fetchProductDetail = async () => {
    const endpoint = `/product/${id}`;

    try {
      const response = await fetch(API_BASE_URL + endpoint);

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
      setErrorMessage('Error fetching products. Please try again later...')
    } 
    }
    

      useEffect(() => {
          fetchProductDetail();
      }, [id]);

    return (
        <>
      <section className="card-section">
            <h2>{productDetail.name}</h2>
            <ul className="card-ul">
              {
                <ProductComponent key={productDetail.product_id} product={productDetail} />
              }
        </ul>
            </section>
        </>
    )
};
    
export default ProductDetail;






