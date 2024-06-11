import React, { useEffect, useState } from "react";
import { useCart } from "./CartContext";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Product = (props) => {
  //eslint-disable-next-line no-unused-vars
  const [existingProducts, setExistingProducts] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  const { addToCart, addToWishlist, cartItems,wishItems } = useCart();
  props.product.userid = sessionStorage.getItem("user-token");
  // console.log(cartItems.length);
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/addcart`)
      .then((response) => {
        if (response.data !== "Fail" && response.data !== "Error") {
          if (Array.isArray(response.data)) {
            setExistingProducts(response.data);
          }
        }
      })
      .catch((error) => {
        console.error("Error fetching cart items:", error);
      });

    if (sessionStorage.getItem("token") !== "admin") {
      sessionStorage.getItem("user-token") !== null && setIsLoggedIn(true);
    }
  }, []);

  // const handleAddToWishlist = () => {
  //   if (isLoggedIn) {
  //     addToWishlist(props.product);
  //   } else {
  //     navigate("/login");
  //   }
  // };
  const handleAddToWishlist = () => {
    const isProductInWishlist = wishItems.some(item => item.product_id === props.product.id);
    if (isProductInWishlist) {
        alert("Product already exists in the wishlist");
        return; // Exit the function early
    }

    else if (isLoggedIn) {
        addToWishlist(props.product);
    } else {
        navigate("/login");
    }
};

  // const handleAddToCart = () => {
  //   if (cartItems.length > 0) {
  //     var unique_item = true;
  //     cartItems.map((item) => {
  //       if (item.id === props.product.id) {
  //         alert("Product already exists in the cart");
  //         unique_item = false;
  //         //eslint-disable-next-line array-callback-return
  //         return;
  //       }
  //       return null;
  //     });
  //     unique_item && addToCart(props.product);
  //   } else {
  //     addToCart(props.product);
  //   }
  // };
  const handleAddToCart = () => {
    const isProductInCart = cartItems.some(item => item.product_id === props.product.id);
    if (isProductInCart) {
      alert("Product already exists in the cart");
    } 
    else if (isLoggedIn) {
      addToCart(props.product,"main");
  } else {
      navigate("/login");
  }

};
  const datta = JSON.parse(props.product.image)
  const firstImage = datta[0]

  return (
    <div className="d-flex justify-content-center">
      <div className="card productcard">

        <Link
          to={"/product/" + props.product.id}
          state={{ productdetails: props.product, admin: props.admin }}
        >
          
         <div className="text-center productimgback">
         <img
            src={`${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/images/${firstImage}`} 
            className="card-img-top"
            alt="product"
          />
         </div>
        </Link>
        <div className="card-body">
          <h6 className="card-text">{props.product.name}</h6>
          <p className="card-text text-success">
            <b>&#8377; {props.product.price}.00</b>
          </p>
        </div>
        <div className="card-footer d-flex flex-wrap justify-content-center">
          {props.product.quantity>0 ? (
            <>
            <button
            className="btn btn-secondary ms-1 me-1"
            onClick={handleAddToCart}
          >
            Add to Cart
          </button>
          <button
            className="btn btn-secondary ms-1 me-1"
            onClick={handleAddToWishlist}
          >
            <i className="bi bi-heart-fill" />
          </button>
          </>
          ):(
            <><h6 className="text-danger" style={{fontWeight:'800'}}>Out of Stock</h6></>
          )}
          
        </div>
      </div>
    </div>
  );
};
export default Product;
