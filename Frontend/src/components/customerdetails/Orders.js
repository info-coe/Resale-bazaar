
import React, { useEffect, useState } from "react";
import MyNavbar from "../navbar";
import Customermenu from "./Customermenu";
import Footer from "../footer";
import Customerbanner from "./Customerbanner";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Scrolltotopbtn from "../Scrolltotopbutton";
import Notification from "../Notification";

export default function Orders() {
  const [allProducts, setAllProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    // Fetch all products
    axios
      .get(`${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/allproducts`)
      .then((res) => {
        if (res.data !== "Fail" && res.data !== "Error") {
          setAllProducts(res.data);
        }
      })
      .catch((error) => {
        console.log("Error fetching all products:", error);
      });

    // Fetch orders
    axios
      .get(`${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/updatepayment`)
      .then((res) => {
        if (res.data !== "Fail" && res.data !== "Error") {
          setOrders(res.data);
        }
      })
      .catch((error) => {
        console.log("Error fetching orders:", error);
      });
  }, []);

  const userId = parseInt(sessionStorage.getItem("user-token"));

  // Filter orders for the current user
  const userOrders = orders.filter(order => order.buyer_id === userId);

  // Map each order to its corresponding product
  const mappedOrders = userOrders.map(order => {
    const product = allProducts.find(product => product.id === order.product_id);
    return {
      ...product,
      order_id: order.order_id,
      shipment_id: order.shipment_id,
      ordered_date: order.ordered_date,
      shipped_date: order.shipped_date,
      delivered_date: order.delivered_date,
      buyer_id: order.buyer_id,
      order_quantity: order.order_quantity,
      order_status: order.order_status
    };
  });

  const navigate = useNavigate(); // Hook to navigate programmatically

  const cancelClick = (product) => {
    // Check if the product has been shipped
    if (product.shipped_date) {
      // alert("You cannot cancel this product as it has already been shipped.");
      setNotification({ message: 'You cannot cancel this product as it has already been shipped.', type: 'error' });
      setTimeout(() => setNotification(null), 3000);
      return;
    }

    // Navigate to the request cancel page with product details
    navigate("/cancelorder", { state: { filteredProducts: product } });
  };

  return (
    <div className="fullscreen">
      <MyNavbar />
      {notification && <Notification message={notification.message} type={notification.type} onClose={() => setNotification(null)} />}

      <main>
        <Customerbanner />

        <div className="d-lg-flex justify-content-around p-2 ps-lg-5 pe-lg-5">
          <div className="col-lg-3 col-xs-12 col-md-12 p-lg-4 p-2">
            <Customermenu />
          </div>

          <div className="col-xs-12 col-md-12 col-lg-9 p-lg-4 p-2">
            {mappedOrders.length > 0 ? (
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Product Image</th>
                      <th>Product Name</th>
                      <th>Total Price</th>
                      <th>Action</th>
                      <th></th>
                    </tr>
                  </thead>

                  <tbody>
                    {mappedOrders.map((product, index) => (
                      <tr key={index}>
                        <td style={{ minWidth: "120px" }}>
                          {product.order_status === 'cancelled' ? (
                            <img
                              src={`${product.image ? JSON.parse(product.image)[0] : 'defaultImagePath'}`}
                              alt={product.name}
                              style={{ maxWidth: "60px", maxHeight: "100px" }}
                            />
                          ) : (
                            <Link
                              to="/orderpage"
                              state={{ filteredProducts: product }}
                              style={{ textDecoration: 'none', color: 'inherit' }}
                            >
                              <img
                                src={`${product.image ? JSON.parse(product.image)[0] : 'defaultImagePath'}`}
                                alt={product.name}
                                style={{ maxWidth: "60px", maxHeight: "100px" }}
                              />
                            </Link>
                          )}
                        </td>

                        <td className="text-secondary pt-3" style={{ minWidth: "170px" }}>
                          {product.name}
                        </td>
                        <td className="pt-3" style={{ minWidth: "100px" }}>
                          &#36; {product.price * product.order_quantity}
                        </td>
                        <td className="pt-3" style={{ minWidth: "100px" }}>
                          {product.order_status === 'cancelled' ? (
                            <span className="text-danger">Cancelled</span>
                          ) : product.delivered_date === null ? (
                            <button
                              className="btn btn-danger"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation(); // Prevent Link click event
                                cancelClick(product);
                              }}
                            >
                              Order Cancel
                            </button>
                          ) : (
                            <Link 
                              to="/feedback" 
                              state={{ filteredProducts: product }} 
                              className="text-decoration-none"
                            >
                              <i className="bi bi-star-fill"></i>&nbsp; Rate & Review Product
                            </Link>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <h1 style={{ fontSize: "20px" }}>No orders</h1>
            )}
          </div>
        </div>
      </main>
      <Footer />
      <Scrolltotopbtn/>
    </div>
  );
}
