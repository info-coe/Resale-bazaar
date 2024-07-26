
import React, { useEffect, useState } from "react";
import { useCart } from "./CartContext";
import { useNavigate } from "react-router-dom";
import MyNavbar from "./navbar";
import Footer from "./footer";
import Cartemptyimg from '../images/cartempty.png';
import axios from 'axios';
import Scrolltotopbtn from "./Scrolltotopbutton";
import Notification from "./Notification";

export default function Cartitems() {
  const navigate = useNavigate();
  const { cartItems, calculateTotalPrice, removeFromCart, updateCartItemQuantity, notification, setNotification } = useCart();
  const [products, setProducts] = useState([]); // State to hold fetched products
  const [message, setMessage] = useState(''); // State to hold global error message

  useEffect(() => {
        axios.get(`${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/sellerproducts`)
        .then((res)=>{
            if(res.data !== "Fail" && res.data !== "Error" ){
              setProducts(res.data); // Assuming response.data contains the product array
            }
        }).catch((error)=>{
          console.error("Error fetching seller products:", error);
        })
  }, []);

  const checkout = () => {
    const updateRequests = cartItems.map(product => {
      const quantity = product.quantity;
      return axios.put(`${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/${product.id}/updateQuantityAndPrice`, {
        quantity: quantity,
      });
    });

    Promise.all(updateRequests)
      .then(responses => {
        responses.forEach(response => {
          console.log(response.data.message);
        });
        navigate("/checkoutpage");
      })
      .catch(error => {
        console.error("Error updating quantities and prices:", error);
      });
  };

  const handleQuantityChange = (product, newQuantity) => {
    const availableProduct = products.find(p => p.id === product.product_id);
    if (newQuantity > availableProduct.quantity) {
      setMessage(`Cannot increase quantity beyond available stock: ${availableProduct.quantity}`);
    } else {
      setMessage('');
      updateCartItemQuantity(product.id, newQuantity);
    }
  };

  const totalPrice = calculateTotalPrice();

  return (
    <div className="fullscreen">
      <MyNavbar />
      {notification && <Notification message={notification.message} type={notification.type} onClose={() => setNotification(null)} />}

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
                {cartItems.length > 0 ? (
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
                            style={{ maxWidth: "100%", maxHeight: "100%", backgroundSize: "contain" }}
                          />
                        </div>
                      </td>
                      <td className="text-secondary">{product.name}</td>
                      <td>&#36; {product.price}</td>
                      <td>
                        <div className="d-flex align-items-center">
                          <button
                            className="btn btn-sm btn-outline-secondary me-2"
                            onClick={() => handleQuantityChange(product, product.quantity - 1)}
                            disabled={product.quantity <= 1}
                          >
                            -
                          </button>
                          <span>{product.quantity}</span>
                          <button
                            className="btn btn-sm btn-outline-secondary ms-2"
                            onClick={() => handleQuantityChange(product, product.quantity + 1)}
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
                      <img src={Cartemptyimg} alt="Your Cart is Empty" width="280" height="280" style={{ objectFit: "contain" }} />
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        {message && (
            <div className="container">
              <div className="alert alert-warning">
                {message}
              </div>
            </div>
          )}
        <div className="container mt-2">
          <div className="d-flex flex-wrap gap-3 float-end me-2">
            <p className="mt-1"><b>Total Price: &#36; {totalPrice}</b></p>
            <button
              type="button"
              className="btn btn-primary mb-5"
              disabled={cartItems.length === 0}
              onClick={checkout}
            >
              Checkout
            </button>
          </div>
        </div>
      </main>
      <Footer />
      <Scrolltotopbtn/>
    </div>
  );
}


