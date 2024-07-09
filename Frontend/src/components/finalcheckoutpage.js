import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function Finalcheckoutpage() {
  // eslint-disable-next-line no-unused-vars
  const [product, setProduct] = useState([]);

  useEffect(() => {
    const token = sessionStorage.getItem("user-token");
    if (!token) return;

    axios
      .get(`${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/addcart`)
      .then((response) => {
        if (response.data !== "Fail" && response.data !== "Error") {
          if (sessionStorage.getItem("user-token") !== null) {
            const filteredProducts = response.data.filter((item) => item.userid.toString() === sessionStorage.getItem("user-token"));
            setProduct(filteredProducts);

            filteredProducts.forEach((item) => {
              axios
                .post(`${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/updatepayment`, {
                  payment_status: true,
                  token,
                  product_id: item.product_id,
                  main_id: item.id,
                  shipment_id: `TRBSID${token}${item.product_id}`,
                  order_id : `TRBOID${token}${item.product_id}`,
                  ordered_date :  new Date().toLocaleDateString("fr-CA"),
                  shipped_date : null,
                  delivered_date : null
                })
                .then((res) => {
                  alert("Product Purchased Successfully");
                  window.location.href = `${process.env.REACT_APP_HOST}3000/Resale-bazaar`;
                })
                .catch((err) => console.log("Error updating payment status:", err));
            });
          }
        }
      })
      .catch((error) => {
        console.error("Error fetching cart items:", error);
      });
  }, []);

  const [allProducts, setAllProducts] = useState([]);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/allproducts`)
      .then((res) => {
        if (res.data !== "Fail" && res.data !== "Error") {
          setAllProducts(res.data);
        }
      })
      .catch((error) => {
        console.log("Error fetching data:", error);
      });
  }, []);

 

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/updatepayment`)
      .then((res) => {
        if (res.data !== "Fail" && res.data !== "Error") {
          allProducts.forEach((product) => {
            const orderCount = res.data.filter((order) => order.product_id === product.id).length;
            const updatedQuantity = Math.max(product.quantity - orderCount, 0); // Ensure quantity does not go below zero
            axios.post(`${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/updateproducts`, {
              product_id: parseInt(product.id),
              quantity: updatedQuantity
            })
            .then((response) => {
              // Handle response if needed
            })
            .catch((error) => {
              console.error("Error updating product quantity:", error);
            });
          });
        }
      })
      .catch((error) => {
        console.log("Error fetching orders:", error);
      });
  }, [allProducts]);


  return <div>Loading...</div>;
}
