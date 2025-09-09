import React from 'react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Cart = ({ cart, handleCartUpdate }) => {

    const handleRemoveFromCart = async (id , e) => {
        e.preventDefault(); 
        
        const response = await fetch(`${API_BASE_URL}/product/cart/delete`, {
        method: 'DELETE',
        credentials: 'include',
        headers: { "Content-Type": "application/json"},
        body: JSON.stringify({ id: id })
    });
          const data = await response.json();
          
          handleCartUpdate()

};

    return (
        <div className='cart-div'>
            <img className="icon cart" src="./public/cart.svg" alt="" />
            <div className='hidden'>
            {cart.cart_items && cart.cart_items.length > 0 ? (
                <div style={{ display: "flex", flexDirection: "row", gap: "1rem", marginLeft: "2rem" }}>
                    <div>Cart: </div>
                    <div>{cart.total_items}</div>
                    <div>${cart.total_price}</div>
                    <div>
                        
                    {cart.cart_items.map((item) => (
                        <div className="cartItem" style={{ display: "flex", justifyContent: "right" }} key={item.id}>
                            <div>{item.name} {item.quantity} $ {item.subtotal}</div>
                            <button onClick={(e) => handleRemoveFromCart(item.id, e)} style={{ color: 'red', cursor: "pointer", marginLeft: "1rem" }}>Remove</button>
                        </div>
                    ))}
                        </div>
                </div>
            ) : (
                <div style={{ color: 'red' }}>cart is empty</div>
                )}
        </div>
        </div>
    )
};
 
export default Cart;