// import React, { useEffect, useState } from 'react';
// import axios from 'axios';

// export default function GuestFinalCheckout() {
//   const [cartItems, setCartItems] = useState([]);
//   const [allProducts, setAllProducts] = useState([]);
//   const [notification, setNotification] = useState(null);
//   const guest_user = JSON.stringify(sessionStorage.getItem("guest_user"));
//   const guest_product = JSON.parse(sessionStorage.getItem("guest_product"));
// //   console.log(guest_product)

//   const updatePaymentStatus = (products) => {
//     const paymentRequests = products.map((item) => {
//       return axios.post(`${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/guestupdatepayment`, {
//         payment_status: true,
//         product_id: item.id,
//         main_id: item.id,
//         shipment_id: `TRBSID${item.id}${Math.floor(Math.random() * 1000)}`,
//         order_id: `TRBOID${item.id}${Math.floor(Math.random() * 1000)}`,
//         ordered_date: new Date().toLocaleDateString("fr-CA"),
//         shipped_date: null,
//         delivered_date: null,
//         order_quantity: item.quantity,
//         order_status:"purchased",
//         order_amount:item.quantity * item.price
//       });
//     });

//     Promise.all(paymentRequests)
//       .then(() => {
//         setNotification({ message: 'Product Purchased Successfully', type: 'success' });
//         setTimeout(() => setNotification(null), 3000);
//         updateProductQuantities(products); // Update product quantities based on purchased items
//       })
//       .catch((err) => console.log("Error updating payment status:", err));
//   };

//   updatePaymentStatus(guest_product);

//   const updateProductQuantities = (purchasedItems) => {
//     axios.get(`${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/allproducts`)
//       .then((res) => {
//         if (res.data !== "Fail" && res.data !== "Error") {
//           const updateQuantityRequests = res.data.map((product) => {
//             const orderCount = purchasedItems
//               .filter((item) => item.product_id === product.id)
//               .reduce((total, item) => total + item.quantity, 0); // Sum the quantities from the orders
//             const updatedQuantity = Math.max(product.quantity - orderCount, 0); // Update product quantity
            
//             return axios.post(`${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/updateproducts`, {
//               product_id: parseInt(product.id),
//               quantity: updatedQuantity // New quantity after order
//             });
//           });

//           Promise.all(updateQuantityRequests)
//             .then(() => {
//               console.log("Product quantities updated successfully");
//             window.location.href = `${process.env.REACT_APP_HOST}${process.env.REACT_APP_FRONT_END_PORT}/Resale-bazaar`;

//             })
//             .catch((error) => {
//               console.error("Error updating product quantity:", error);
//             });
//         }

//       })
//       .catch((error) => {
//         console.log("Error fetching all products:", error);
//       });
//   };

//   return <div>Loading...</div>;
// }


import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function GuestFinalCheckout() {
  const [notification, setNotification] = useState(null);
  const guest_user = JSON.stringify(sessionStorage.getItem("guest_user"));
  const guest_product = JSON.parse(sessionStorage.getItem("guest_product"));

  useEffect(() => {
    if (guest_product) {
      updatePaymentStatus(guest_product);
    }
  }, []);

  const updatePaymentStatus = (products) => {
    const paymentRequests = products.map((item) => {
      return axios.post(`${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/guestupdatepayment`, {
        payment_status: true,
        product_id: item.id,
        main_id: item.id,
        shipment_id: `TRBSID${item.id}${Math.floor(Math.random() * 1000)}`,
        order_id: `TRBOID${item.id}${Math.floor(Math.random() * 1000)}`,
        ordered_date: new Date().toLocaleDateString("fr-CA"),
        shipped_date: null,
        delivered_date: null,
        order_quantity: item.quantity,
        order_status: "purchased",
        order_amount: item.quantity * item.price
      });
    });

    Promise.all(paymentRequests)
      .then(() => {
        setNotification({ message: 'Product Purchased Successfully', type: 'success' });
        setTimeout(() => setNotification(null), 3000);
        updateProductQuantities(products); // Update product quantities based on purchased items
      })
      .catch((err) => console.log("Error updating payment status:", err));
  };

  const updateProductQuantities = (purchasedItems) => {
    axios.get(`${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/allproducts`)
      .then((res) => {
        if (res.data !== "Fail" && res.data !== "Error") {
          const updateQuantityRequests = res.data.map((product) => {
            const orderCount = purchasedItems
              .filter((item) => item.id === product.id)
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
      {notification ? (
        <div>{notification.message}</div>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
}
