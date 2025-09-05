import React from 'react';

const Cart = ({ cart }) => {
    return (
        <div>
            {cart.cart_items && cart.cart_items.length > 0 ? (
                <div style={{ display: "flex", flexDirection: "row", gap: "1rem", marginLeft: "2rem" }}>
                    <div>Cart: </div>
                    <div>{cart.total_items}</div>
                    <div>${cart.total_price}</div>
                    <div>
                    {cart.cart_items.map((item) => (
                        <div key={item.product_id}>{item.name} { item.quantity } ${ item.subtotal }</div>
                    ))}
                        </div>
                </div>
            ) : (
                <div style={{ color: 'red' }}>cart is empty</div>
            )}
        </div>
    )
};
 
export default Cart;