import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Notification from "./Notification";

export default function Finalcheckoutpage() {
  // eslint-disable-next-line no-unused-vars
  const [cartItems, setCartItems] = useState([]);
  const [notification, setNotification] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [paymentIntent, setPaymentIntent] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [loading, setLoading] = useState(true);

 
  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const sessionId = query.get('session_id');

    if (sessionId) {
      // Fetch the session details from your backend
      axios.get(`${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/api/get-session/${sessionId}`)
        .then(response => {
          const paymentIntentId = response.data.paymentIntentId;
          setPaymentIntent(paymentIntentId);
          setLoading(false);
          const token = sessionStorage.getItem("user-token");
   
          if (!token) return;
      
          axios.get(`${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/addcart`)
            .then((response) => {
              if (response.data !== "Fail" && response.data !== "Error") {
                const filteredProducts = response.data.filter((item) => item.userid.toString() === token);
                setCartItems(filteredProducts);
      
                // Proceed to update payment status
                updatePaymentStatus(filteredProducts, token,paymentIntentId);
              }
            })
            .catch((error) => {
              console.error("Error fetching cart items:", error);
            });
        })
        .catch(error => {
          console.error('Error fetching session:', error);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }

      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updatePaymentStatus = (products, token,paymentIntentId) => {
    const paymentRequests = products.map((item) => {
      return axios.post(`${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/updatepayment`, {
        payment_status: true,
        token,
        product_id: item.product_id,
        main_id: item.id,
        shipment_id: `TRBSID${token}${item.product_id}${Math.floor(Math.random() * 1000)}`,
        order_id: `TRBOID${token}${item.product_id}${Math.floor(Math.random() * 1000)}`,
        ordered_date: new Date().toLocaleDateString("fr-CA"),
        shipped_date: null,
        delivered_date: null,
        order_quantity: item.quantity,
        order_status: "purchased",
        order_amount: item.quantity * item.price,
        product_name: item.name,
        seller_id: item.seller_id,
        payment_intent_id:paymentIntentId,
        refundstatus:false
      });
    });

    Promise.all(paymentRequests)
      .then(() => {
        setNotification({ message: 'Product Purchased Successfully', type: 'success' });
        setTimeout(() => setNotification(null), 3000);
        updateProductQuantities(products); // Update product quantities based on purchased items
      })
      .catch((err) => {
        console.log("Error updating payment status:", err);
        setNotification({ message: 'Error purchasing product', type: 'error' });
      });
  };

  const updateProductQuantities = (purchasedItems) => {
    axios.get(`${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/allproducts`)
      .then((res) => {
        if (res.data !== "Fail" && res.data !== "Error") {
          const updateQuantityRequests = res.data.map((product) => {
            const orderCount = purchasedItems
              .filter((item) => item.product_id === product.id)
              .reduce((total, item) => total + item.quantity, 0); // Sum the quantities from the orders
            const updatedQuantity = Math.max(product.quantity - orderCount, 0); // Update product quantity
            
            return axios.post(`${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/updateproducts`, {
              product_id: parseInt(product.id),
              quantity: updatedQuantity // New quantity after order
            });
          });

          Promise.all(updateQuantityRequests)
            .then(() => {
              console.log("Product quantities updated successfully");
              window.location.href = `${process.env.REACT_APP_HOST}${process.env.REACT_APP_FRONT_END_PORT}/`;
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
