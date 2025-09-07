import React from 'react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


const AddToCart = ({ id , handleCartUpdate}) => {
    
    const handleAddToCart = async (e) => {
        e.preventDefault(); 
    const response = await fetch(`${API_BASE_URL}/product/cart/add`, {
      method: 'POST',
      credentials: 'include',
      headers: { "Content-Type": "application/json"},
      body: JSON.stringify({ id: id })
    });
          const data = await response.json();
          
          handleCartUpdate()

};


    return (
        <>
            <form onSubmit={handleAddToCart}>
              <button type="submit">Add to Cart</button>
            </form>
        </>
    )
};
 
export default AddToCart;