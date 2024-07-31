import React, { useEffect, useState } from "react";
import { useCart } from "./CartContext";
import { useNavigate } from "react-router-dom";
import MyNavbar from "./navbar";
import Footer from "./footer";
import Cartemptyimg from "../images/cartempty.png";
import axios from "axios";
import Scrolltotopbtn from "./Scrolltotopbutton";
import Notification from "./Notification";

export default function Cartitems() {
  const navigate = useNavigate();
  const {
    cartItems,
    calculateTotalPrice,
    removeFromCart,
    updateCartItemQuantity,
    notification,
    setNotification,
    guest_product,
    setGuest_product,
    isLoggedIn,
    setIsLoggedIn
  } = useCart();
  const [products, setProducts] = useState([]); // State to hold fetched products
  const [message, setMessage] = useState("");

  useEffect(()=>{
    const updateGuestProduct = () => {
      const products = JSON.parse(sessionStorage.getItem("guest_products")) || [];
      setGuest_product(products);
    };
    updateGuestProduct();
    window.addEventListener("storage", updateGuestProduct);
    return () => {
      window.removeEventListener("storage", updateGuestProduct);
    };
  },[setGuest_product])

  useEffect(() => {
    if (sessionStorage.getItem("token") !== "admin") {
      sessionStorage.getItem("user-token") !== null && setIsLoggedIn(true);
    }
    axios
      .get(
        `${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/sellerproducts`
      )
      .then((res) => {
        if (res.data !== "Fail" && res.data !== "Error") {
          setProducts(res.data); // Assuming response.data contains the product array
        }
      })
      .catch((error) => {
        console.error("Error fetching seller products:", error);
      });
  }, [setIsLoggedIn]);

  const checkout = () => {
    if (sessionStorage.getItem("token") !== "admin" && isLoggedIn) {
      const updateRequests = cartItems.map((product) => {
        const quantity = product.quantity;
        return axios.put(
          `${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/${product.id}/updateQuantityAndPrice`,
          {
            quantity: quantity,
          }
        );
      });
      Promise.all(updateRequests)
        .then((responses) => {
          responses.forEach((response) => {
            console.log(response.data.message);
          });
          navigate("/checkoutpage");
        })
        .catch((error) => {
          console.error("Error updating quantities and prices:", error);
        });
    } else {
      navigate("/login");
    }
  };

  const guestCheckout = () => {
    navigate("/guestcheckout")
  }

  const handleQuantityChange = (product, newQuantity) => {
    if (isLoggedIn) {
      const availableProduct = products.find(
        (p) => p.id === product.product_id
      );
      if (newQuantity > availableProduct.quantity) {
        setMessage(
          `Cannot increase quantity beyond available stock: ${availableProduct.quantity}`
        );
      } else {
        setMessage("");
        updateCartItemQuantity(product.id, newQuantity);
      }
    } else {
      const availableProducts = products.find(
        (p) => p.id === product.id
      );
      if (newQuantity > availableProducts.quantity) {
        setMessage(
          `Cannot increase quantity beyond available stock: ${availableProducts.quantity}`
        );
      } else {
        setMessage("");
        const productIndex = guest_product.findIndex(
          (item) => item.id === product.id
        );
        if (productIndex !== -1) {
          guest_product[productIndex] = {
            ...guest_product[productIndex],
            quantity: newQuantity,
          };
          sessionStorage.setItem(
            "guest_products",
            JSON.stringify(guest_product)
          );
          console.log("Product updated successfully");
          window.location.reload(false);
        } else {
          console.log("Product not found in the cart");
        }
      }
    }
  };

  const totalPrice = calculateTotalPrice();

  return (
    <div className="fullscreen">
      <MyNavbar />
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      <main>
        <div className="container p-md-5 pt-4">
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr className="">
                  <th className="bg-secondary text-white">#</th>
                  <th className="bg-secondary text-white">Product Image</th>
                  <th className="bg-secondary text-white">Product Name</th>
                  <th className="bg-secondary text-white">Price</th>
                  <th className="bg-secondary text-white">Quantity</th>
                  <th className="bg-secondary text-white">Total</th>
                </tr>
              </thead>
              <tbody>
                {isLoggedIn ? (
                  cartItems.length > 0 ? (
                    cartItems.map((product, index) => (
                      <tr key={index}>
                        <td>
                          <button
                            type="button"
                            className="btn-close w-50"
                            onClick={() => removeFromCart(product.id)}
                          ></button>
                        </td>
                        <td>
                          <div style={{ width: "70px", height: "60px" }}>
                            <img
                              src={`${JSON.parse(product.image)[0]}`}
                              alt={product.name}
                              style={{
                                maxWidth: "100%",
                                maxHeight: "100%",
                                backgroundSize: "contain",
                              }}
                            />
                          </div>
                        </td>
                        <td className="text-secondary">{product.name}</td>
                        <td>&#36; {product.price}</td>
                        <td>
                          <div className="d-flex align-items-center">
                            <button
                              className="btn btn-sm btn-outline-secondary me-2"
                              onClick={() =>
                                handleQuantityChange(
                                  product,
                                  product.quantity - 1
                                )
                              }
                              disabled={product.quantity <= 1}
                            >
                              -
                            </button>
                            <span>{product.quantity}</span>
                            <button
                              className="btn btn-sm btn-outline-secondary ms-2"
                              onClick={() =>
                                handleQuantityChange(
                                  product,
                                  product.quantity + 1
                                )
                              }
                            >
                              +
                            </button>
                          </div>
                        </td>
                        <td>&#36; {product.price * product.quantity}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="text-center">
                        <img
                          src={Cartemptyimg}
                          alt="Your Cart is Empty"
                          width="280"
                          height="280"
                          style={{ objectFit: "contain" }}
                        />
                      </td>
                    </tr>
                  )
                ) : guest_product.length > 0 ? (
                  guest_product.map((product, index) => (
                    <tr key={index}>
                      <td>
                        <button
                          type="button"
                          className="btn-close w-50"
                          onClick={() => removeFromCart(product.id)}
                        ></button>
                      </td>
                      <td>
                        <div style={{ width: "70px", height: "60px" }}>
                          <img
                            src={`${JSON.parse(product.image)[0]}`}
                            alt={product.name}
                            style={{
                              maxWidth: "100%",
                              maxHeight: "100%",
                              backgroundSize: "contain",
                            }}
                          />
                        </div>
                      </td>
                      <td className="text-secondary">{product.name}</td>
                      <td>&#36; {product.price}</td>
                      <td>
                        <div className="d-flex align-items-center">
                          <button
                            className="btn btn-sm btn-outline-secondary me-2"
                            onClick={() =>
                              handleQuantityChange(
                                product,
                                product.quantity - 1
                              )
                            }
                            disabled={product.quantity <= 1}
                          >
                            -
                          </button>
                          <span>{product.quantity}</span>
                          <button
                            className="btn btn-sm btn-outline-secondary ms-2"
                            onClick={() =>
                              handleQuantityChange(
                                product,
                                product.quantity + 1
                              )
                            }
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td>&#36; {product.price*product.quantity}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="text-center">
                      <img
                        src={Cartemptyimg}
                        alt="Your Cart is Empty"
                        width="280"
                        height="280"
                        style={{ objectFit: "contain" }}
                      />
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        {message && (
          <div className="container">
            <div className="alert alert-warning">{message}</div>
          </div>
        )}
        <div className="container">
        <p className="mt-1 text-end me-2">
              <b>Total Price: &#36; {totalPrice}</b>
            </p>
          <div className="d-flex flex-wrap gap-3 float-end me-2">
            {!isLoggedIn && 
            <button
              type="button"
              className="btn btn-primary mb-5"
              // disabled={cartItems.length === 0}
              onClick={guestCheckout}
            >
              Guest Checkout
            </button>
            }
            <button
              type="button"
              className="btn btn-primary mb-5"
              // disabled={cartItems.length === 0}
              onClick={checkout}
            >
              Member Checkout
            </button>
          </div>
        </div>
      </main>
      <Footer />
      <Scrolltotopbtn />
    </div>
  );
}
