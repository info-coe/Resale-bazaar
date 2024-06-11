import React from "react";
import { useCart } from "./CartContext";
import { useNavigate } from "react-router-dom";
import MyNavbar from "./navbar";
import Footer from "./footer";
// import { Link } from "react-router-dom";
import Cartemptyimg from '../images/cartempty.png'

export default function Cartitems() {
  const navigate = useNavigate();
  const { cartItems, calculateTotalPrice, removeFromCart } = useCart();
  const totalPrice = calculateTotalPrice();

  const checkout = () => {
    if (sessionStorage.getItem("token") !== null) {
      navigate("/checkoutpage");
    } else {
      navigate("/login");
    }
  };
  return (
    <div className="fullscreen">
      <MyNavbar />
      <main>
        <div>
         
          <div className="table-responsive">
          <table className="table table-hover">
            <thead>
              <tr className="">
                <th className="bg-secondary text-white">#</th>
                <th className="bg-secondary text-white">Product Name</th>
                <th className="bg-secondary text-white">Product Image</th>
                <th className="bg-secondary text-white">Price</th>
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
                   <div style={{width:"70px", height:"60px" }}>
                   <img
                      src={`${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/images/${JSON.parse(product.image)[0]}`}
                      alt={product.name}
                      style={{ maxWidth: "100%", maxHeight: "100%" ,backgroundSize:"contain"}}
                    />
                   </div>
                  </td>
                  <td className="text-secondary">{product.name}</td>
                  <td>&#8377; {product.price}</td>
                </tr>
              ))
            ): (
              <tr>
              <td colSpan={4} className="text-center">
              <img src={Cartemptyimg} alt="Your Cart is Empty" width="280" height="280" style={{objectFit:"contain"}}/>
              </td>
            </tr>
            )
            }
            </tbody>
          </table>
          </div>
        </div>
        <div className="mt-2">
          <div className="d-flex flex-wrap gap-3 float-end me-2">
            <p className="mt-1"><b>Total Price: &#8377; {totalPrice}</b></p>
            <button
              type="button"
              className="btn btn-primary mb-5"
              disabled={cartItems.length === 0} // Disable the button if cart is empty
              onClick={checkout}
            >
              Checkout
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
