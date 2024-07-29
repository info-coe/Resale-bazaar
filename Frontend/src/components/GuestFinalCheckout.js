import React, { useEffect, useState } from "react";
import axios from "axios";

export default function GuestFinalCheckout() {
  const [notification, setNotification] = useState(null);
  const guest_user = JSON.parse(sessionStorage.getItem("guest_user"));
  const guest_product = JSON.parse(sessionStorage.getItem("guest_product"));
  const [values, setValues] = useState({
    payment_status: "",
    product_id: "",
    shipment_id: "",
    order_id: "",
    ordered_date: "",
    shipped_date: "",
    delivered_date: "",
    order_quantity: "",
    order_status: "",
    order_amount: "",
    customer_first_name: "",
    customer_last_name: "",
    customer_email: "",
    customer_phone: "",
  });

  useEffect(() => {
    if (guest_product) {
      guest_product.map((item) =>
        setValues({
          payment_status: true,
          product_id: item.id,
          shipment_id: `TRBSID${item.id}${Math.floor(Math.random() * 1000)}`,
          order_id: `TRBOID${item.id}${Math.floor(Math.random() * 1000)}`,
          ordered_date: new Date().toLocaleDateString("fr-CA"),
          shipped_date: null,
          delivered_date: null,
          order_quantity: item.quantity,
          order_status: "purchased",
          order_amount: item.quantity * item.price,
          customer_first_name: guest_user.firstname,
          customer_last_name: guest_user.lastname,
          customer_email: guest_user.email,
          customer_phone: guest_user.phone,
        })
      );
      updatePaymentStatus(guest_product);
    }
  }, []);

  const updatePaymentStatus = (purchasedItems) => {
    axios.post(
      `${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/guestupdatepayment`,
      {values}
    ).then((res)=>{
      console.log(res.data);
    }).catch((err)=>{
      console.log(err);
    });

    axios
    .get(
      `${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/allproducts`
    )
    .then((res) => {
      if (res.data !== "Fail" && res.data !== "Error") {
        const updateQuantityRequests = res.data.map((product) => {
          const orderCount = purchasedItems
            .filter((item) => item.id === product.id)
            .reduce((total, item) => total + item.quantity, 0); // Sum the quantities from the orders
          const updatedQuantity = Math.max(product.quantity - orderCount, 0); // Update product quantity

          return axios.post(
            `${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/updateproducts`,
            {
              product_id: parseInt(product.id),
              quantity: updatedQuantity, // New quantity after order
            }
          );
        });

        Promise.all(updateQuantityRequests)
          .then(() => {
            console.log("Product quantities updated successfully");
            window.location.href = `${process.env.REACT_APP_HOST}${process.env.REACT_APP_FRONT_END_PORT}/Resale-bazaar`;
          })
          .catch((error) => {
            console.error("Error updating product quantity:", error);
          });
      }
    })
    .catch((error) => {
      console.log("Error fetching all products:", error);
    });
  };

  return (
    <div>
      {notification ? <div>{notification.message}</div> : <div>Loading...</div>}
    </div>
  );
}
