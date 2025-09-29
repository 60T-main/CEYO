import React from 'react';

import { useParams } from 'react-router-dom';

import { useEffect, useState } from 'react';
import CustomProducts from '../components/CustomProducts';

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
  const [rating, setRating] = useState(1);

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

    const endpoint = `/product/comments/add/`; // trailing slash required

    try {
      const response = await fetch(API_BASE_URL + endpoint, {
        ...POST_OPTIONS,
        body: JSON.stringify({
          name: name.trim(),
          lastname: lastName.trim(),
          rating: parseInt(rating, 10),
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
        setRating(1);
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
          POST_OPTIONS={POST_OPTIONS}
          variant="product-detail"
        />

        {errorMessage && <div className="text-red-600 mb-4">{errorMessage}</div>}
      </div>
      {{ recentProductList } && (
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
      )}
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
              შეფასება:
              <div className="flex gap-2">
                {[...Array(5)].map((_, idx) => (
                  <i
                    key={idx}
                    className={`bi text-xl star ${idx < rating ? 'bi-star-fill' : 'bi-star'}`}
                    onClick={() => setRating(idx + 1)}
                    style={{ cursor: 'pointer' }}
                  ></i>
                ))}
              </div>
            </label>
            <label>
              კომენტარი:
              <textarea
                className="comment-textarea"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={5}
              />
            </label>
            <div className="submit-comment-div">
              <button className="w-full h-full" type="submit">
                დამატება
              </button>
            </div>
          </form>
        </div>
        <div className="comments-parent">
          <div className="comments-list">
            <h3>კომენტარები</h3>
            {commentList.length === 0 ? (
              <p>კომენტარები ვერ მოიძებნა</p>
            ) : (
              commentList.map((c, idx) => (
                <div key={idx} className="comment-card">
                  <div className="comment-header">
                    <div className="autor-rating-parent">
                      <span className="comment-author">
                        {c.name} {c.lastname}
                      </span>
                      <div className="comment-rating">
                        {[...Array(c.rating)].map((_, idx) => (
                          <i key={idx} className={'bi text-xl bi-star-fill star'}></i>
                        ))}
                      </div>
                    </div>
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
