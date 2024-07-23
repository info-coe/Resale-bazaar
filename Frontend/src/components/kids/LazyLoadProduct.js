import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const LazyLoadProduct = ({ product }) => {
  return (
    <div className="card mb-4">
      <img src={product.image} className="card-img-top" alt={product.name} />
      <div className="card-body">
        <h5 className="card-title">{product.name}</h5>
        <p className="card-text">${product.price}</p>
      </div>
    </div>
  );
};

export default LazyLoadProduct;
