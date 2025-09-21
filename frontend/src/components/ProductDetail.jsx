import React from 'react';
import NewProducts from './CustomProducts';

import { useParams } from 'react-router-dom';

import { useEffect, useState } from 'react';
import CustomProducts from './CustomProducts';

const ProductDetail = ({
  API_BASE_URL,
  GET_OPTIONS,
  POST_OPTIONS,
  ProductComponent,
  handleCartUpdate,
  fetchRecentProducts,
  recentProductList,
}) => {
  const { id } = useParams();
  const [productDetail, setProductDetail] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  const [commentList, setCommentList] = useState([]);
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [comment, setComment] = useState('');

  const fetchProductDetail = async () => {
    const endpoint = `/product/${id}/`;

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

  const fetchComments = async () => {
    const endpoint = `/product/comments/${id}/`;

    try {
      const response = await fetch(API_BASE_URL + endpoint, {
        GET_OPTIONS,
      });

      if (!response.ok) {
        throw new Error('Failed to fetch comments');
      }

      const data = await response.json();

      if (data.Response === 'False') {
        setErrorMessage(data.Error || 'Failed to fetch comments');
        setCommentList([]);
        return;
      }

      setCommentList(data);
    } catch (error) {
      console.error('Error comments:', error);
      setErrorMessage('Error fetching comments. Please try again later...');
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();

    console.log('handleComment initiated');

    const endpoint = `/product/comments/add/`; // trailing slash required

    try {
      const response = await fetch(API_BASE_URL + endpoint, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          lastname: lastName.trim(),
          comment: comment.trim(),
          product: id,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add comment');
      }

      const data = await response.json();

      if (data.Response === 'False') {
        setErrorMessage(data.Error || 'Failed to add comment');
      } else {
        // Optimistic clear + refresh
        setName('');
        setLastName('');
        setComment('');
        fetchComments();
      }
    } catch (error) {
      console.error('Error adding comment:', error);
      setErrorMessage('Error adding comment. Please try again later...');
    }
  };

  useEffect(() => {
    fetchProductDetail();
    fetchRecentProducts();
    fetchComments();

    console.log('recent products:', recentProductList);
  }, [id]);

  return (
    <>
      <div className="product-parent">
        <ProductComponent
          key={productDetail.product_id}
          product={productDetail}
          handleCartUpdate={handleCartUpdate}
          API_BASE_URL={API_BASE_URL}
          variant="product-detail"
        />

        {errorMessage && <div className="text-red-600 mb-4">{errorMessage}</div>}
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

      <section className="comments-section">
        <div className="add-comment-parent">
          <h3>დატოვეთ კომენტარი</h3>
          <form onSubmit={handleComment}>
            <label>
              სახელი:
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
            </label>
            <label>
              გვარი:
              <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} />
            </label>
            <label>
              კომენტარი:
              <input
                className="h-50"
                type="text"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </label>
            <button type="submit">დამატება</button>
          </form>
        </div>
        <div className="comments-parent">
          <div className="comments-section">
            <h3>კომენტარები</h3>
            {commentList.length === 0 ? (
              <p>კომენტარები ვერ მოიძებნა</p>
            ) : (
              commentList.map((c, idx) => (
                <div key={idx} className="comment-card">
                  <div className="comment-header">
                    <span className="comment-author">
                      {c.name} {c.lastname}
                    </span>
                    <span className="comment-date">{new Date(c.created_at).toLocaleString()}</span>
                  </div>
                  <div className="comment-body">{c.comment}</div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default ProductDetail;
