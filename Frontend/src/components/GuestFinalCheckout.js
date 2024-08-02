import React, { useEffect, useState } from "react";
import axios from "axios";
import Notification from "./Notification";

export default function GuestFinalCheckout() {
  const [notification, setNotification] = useState(null);
  const guest_user = JSON.parse(sessionStorage.getItem("guest_user"));
  const guest_product = JSON.parse(sessionStorage.getItem("guest_products"));

  useEffect(() => {
    if (guest_product) {
      updatePaymentStatus(guest_product);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updatePaymentStatus = async (purchasedItems) => {
    try {
      // Create the payload for payment status update
      const paymentRequests = purchasedItems.map(item => ({
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
        product_name : item.name,
        seller_ID : item.seller_id
      }));

      // Post all payment status updates
      await axios.post(
        `${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/guestupdatepayment`,
        paymentRequests
      );

      setNotification({ message: 'Product Purchased Successfully', type: 'success' });
      setTimeout(() => setNotification(null), 3000);

      await updateProductQuantities(purchasedItems); // Update product quantities based on purchased items
    } catch (err) {
      console.log("Error updating payment status:", err);
      setNotification({ message: 'Error updating payment status', type: 'error' });
    }
  };

  const updateProductQuantities = async (purchasedItems) => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/allproducts`
      );
      
      if (data !== "Fail" && data !== "Error") {
        const updateQuantityRequests = data.map(product => {
          const orderCount = purchasedItems
            .filter(item => item.id === product.id)
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
        await Promise.all(updateQuantityRequests);
        sessionStorage.removeItem("guest_products");
        sessionStorage.removeItem("guest_user");
        window.location.href = `${process.env.REACT_APP_HOST}${process.env.REACT_APP_FRONT_END_PORT}/`;
      }
    } catch (error) {
      console.error("Error updating product quantity:", error);
    }
  };

  return (
    
    <>
<div className="d-flex flex-column justify-content-center align-items-center" style={{ height: '100vh' }}>
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
     
      <div className="waviy">
        <span style={{ '--i': 1 }}>L</span>
        <span style={{ '--i': 2 }}>o</span>
        <span style={{ '--i': 3 }}>a</span>
        <span style={{ '--i': 4 }}>d</span>
        <span style={{ '--i': 5 }}>i</span>
        <span style={{ '--i': 6 }}>n</span>
        <span style={{ '--i': 7 }}>g</span>
        <span style={{ '--i': 8 }}>.</span>
        <span style={{ '--i': 9 }}>.</span>
        <span style={{ '--i': 10 }}>.</span>
      </div>
</div>

</>
  );
}
