import React from 'react';

const Product = ({ product:
    { name, description, category, price, images } }) => {
    return (
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
                        </li>
    )
};
 
export default Product;