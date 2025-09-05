import React from 'react';
import AddToCart from './AddToCart.jsx'


import { Link } from "react-router-dom";

const Product = ({ product:
    { product_id, name, description, category, price, images }, handleCartUpdate }) => {
    return (

        <>
                        <Link to={`/product/${product_id}`}
                  style={{ textDecoration: "none", color: "inherit" }}>

                        <li className="card">
                            <img className="product-img" src="/no-img.jpg" alt={name} />
                            <div>
                                <h3>{name}</h3>
                            </div>
                            <div className="content">
                                <p>{ description }</p>
                                <p>{category}</p>
                                <p>${price}</p>
                </div>
        </li >
            </Link>
            
        
            <AddToCart
                product_id={product_id}
                handleCartUpdate= {handleCartUpdate}
            />
                            </>
    )
};
 
export default Product;