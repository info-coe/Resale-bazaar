import React, { useEffect, useState } from "react";
import MyNavbar from "../navbar";
import Customermenu from "./Customermenu";
import Footer from "../footer";
import Customerbanner from "./Customerbanner";
import axios from "axios";
import { Link } from "react-router-dom";

export default function Orders() {
  const [allProducts, setAllProducts] = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    // Fetch all products
    axios
      .get(
        `${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/allproducts`
      )
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
      .get(
        `${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/updatepayment`
      )
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
 console.log(orders)
  const filteredProducts = allProducts
    .filter((product) =>
      orders.some(
        (order) => order.buyer_id === userId && order.product_id === product.id
      )
    )
    .map((product) => {
      const relatedOrder = orders.find(
        (order) => order.buyer_id === userId && order.product_id === product.id
      );
      console.log(relatedOrder)
      return {
        ...product,
        order_id: relatedOrder.order_id,
        shipment_id: relatedOrder.shipment_id,
        ordered_date: relatedOrder.ordered_date,
        shipped_date: relatedOrder.shipped_date,
        delivered_date: relatedOrder.delivered_date,
        buyer_id :relatedOrder.buyer_id,
        order_quantity :relatedOrder.order_quantity
      };
    });

  const cancelClick = (id, updatedQuantity) => {
    const confirmation = window.confirm(
      "Are you sure you want to cancel the order?"
    );
    if (confirmation) {
      // If user confirms, proceed with the Axios requests
      axios
        .post(
          `${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/updateproducts`,
          {
            product_id: parseInt(id),
            quantity: updatedQuantity,
          }
        )
        .then((response) => {
          // Handle response if needed
        })
        .catch((error) => {
          console.error("Error updating product quantity:", error);
        });
      axios
        .delete(
          `${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/updateorders/${id}`,
          {
            data: { orderid: userId }, // Send data in the request body
          }
        )
        .then((response) => {
          console.log("Product removed from orders:", response.data);
        })
        .catch((error) => {
          console.error("Error removing product from orders:", error);
        });
      window.location.reload(false);
    }
  };
  return (
    <div className="fullscreen">
      <MyNavbar />
      <main>
        <Customerbanner />

        <div className="d-lg-flex justify-content-around p-2 ps-lg-5 pe-lg-5">
          <div className="col-lg-3 col-xs-12 col-md-12 p-lg-4 p-2">
            <Customermenu />
          </div>

          <div className="col-xs-12 col-md-12 col-lg-9 p-lg-4 p-2">
            {filteredProducts.length > 0 ? (
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
                    {filteredProducts.map((product, index) => (
                      <tr key={index}>
                        <td style={{ minWidth: "120px" }}>
                          <Link
                            to="/orderpage"
                            state={{ filteredProducts: product }}
                            style={{ textDecoration: 'none', color: 'inherit' }}
                          >
                            <img
                              src={`${JSON.parse(product.image)[0]}`}
                              alt={product.name}
                              style={{ maxWidth: "60px", maxHeight: "100px" }}
                            />
                          </Link>
                        </td>
                        <td className="text-secondary pt-3" style={{ minWidth: "170px" }}>
                          {product.name}
                        </td>
                        <td className="pt-3" style={{ minWidth: "100px" }}>
                          &#36; {product.price * product.order_quantity}
                        </td>
                        <td className="pt-3" style={{ minWidth: "100px" }}>
                          {product.delivered_date === null ? (
                            <button
                              className="btn btn-danger"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation(); // Prevent Link click event
                                cancelClick(product.id, product.quantity + product.order_quantity);
                              }}
                            >
                              Cancel
                            </button>
                          ) : (
                            <Link to="/feedback"  state={{ filteredProducts: product }} className="text-decoration-none"><i className="bi bi-star-fill"></i>&nbsp; Rate & Review Product</Link>
                          )}

                        </td>
                        {/* <td className="pt-3" style={{minWidth:"170px"}}>
                     
                      </td> */}
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
    </div>
  );
}
