import React, { useEffect, useState } from "react";
// import { useCart } from "./CartContext";
import { Link} from "react-router-dom";
import axios from "axios";

const Product = (props) => {
  //eslint-disable-next-line no-unused-vars
  const [existingProducts, setExistingProducts] = useState([]);
    // eslint-disable-next-line no-unused-vars 
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // const navigate = useNavigate();

  // const { addToCart, addToWishlist, cartItems, wishItems } = useCart();
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
  // const handleAddToWishlist = () => {
  //   const isProductInWishlist = wishItems.some(
  //     (item) => item.product_id === props.product.id
  //   );
  //   if (isProductInWishlist) {
  //     alert("Product already exists in the wishlist");
  //     return; // Exit the function early
  //   } else if (isLoggedIn) {
  //     addToWishlist(props.product);
  //   } else {
  //     navigate("/login");
  //   }
  // };

  // const handleAddToCart = () => {
  //   const isProductInCart = cartItems.some(
  //     (item) => item.product_id === props.product.id
  //   );
  //   if (isProductInCart) {
  //     alert("Product already exists in the cart");
  //   } else if (isLoggedIn) {
  //     addToCart(props.product, "main");
  //   } else {
  //     navigate("/login");
  //   }
  // };
  const datta = JSON.parse(props.product.image);
  const firstImage = datta[0];

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
          <p className="card-text text-success">
            <b>&#36; {props.product.price}.00</b>
          </p>
          {props.product.size !== "NA" &&
          <h6 className="card-text" style={{lineHeight:"8px"}}>{props.product.size}</h6>  
          }       
        </div>
      </div>
    </div>
  );
};
export default Product;
