// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import Notification from "./Notification"

// export default function Finalcheckoutpage() {
//   const [cartItems, setCartItems] = useState([]);
//   const [allProducts, setAllProducts] = useState([]);
//   const [notification, setNotification] = useState(null);

//   useEffect(() => {
//     const token = sessionStorage.getItem("user-token");
//     if (!token) return;

//     // Fetch cart items for the logged-in user
//     axios.get(`${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/addcart`)
//       .then((response) => {
//         if (response.data !== "Fail" && response.data !== "Error") {
//           const filteredProducts = response.data.filter((item) => item.userid.toString() === token);
//           setCartItems(filteredProducts);

//           // Proceed to update payment status
//           updatePaymentStatus(filteredProducts, token);
//         }
//       })
//       .catch((error) => {
//         console.error("Error fetching cart items:", error);
//       });
//   }, []);

//   const updatePaymentStatus = (products, token) => {
//     const paymentRequests = products.map((item) => {
//       return axios.post(`${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/updatepayment`, {
//         payment_status: true,
//         token,
//         product_id: item.product_id,
//         main_id: item.id,
//         shipment_id: `TRBSID${token}${item.product_id}${Math.floor(Math.random() * 1000)}`,
//         order_id: `TRBOID${token}${item.product_id}${Math.floor(Math.random() * 1000)}`,
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

//   return (
//     <div>
//       {notification && <Notification message={notification.message} type={notification.type} onClose={() => setNotification(null)} />}
//       Loading...
//     </div>);
// }

// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import Notification from "./Notification";

// export default function Finalcheckoutpage() {
//   const [cartItems, setCartItems] = useState([]);
//   const [notification, setNotification] = useState(null);

//   useEffect(() => {
//     const token = sessionStorage.getItem("user-token");
//     if (!token) return;

//     // Fetch cart items for the logged-in user
//     axios.get(`${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/addcart`)
//       .then((response) => {
//         if (response.data !== "Fail" && response.data !== "Error") {
//           const filteredProducts = response.data.filter((item) => item.userid.toString() === token);
//           setCartItems(filteredProducts);

//           // Proceed to update payment status
//           updatePaymentStatus(filteredProducts, token);
//         }
//       })
//       .catch((error) => {
//         console.error("Error fetching cart items:", error);
//       });
//   }, []);

//   const updatePaymentStatus = (products, token) => {
//     const paymentRequests = products.map((item) => {
//       return axios.post(`${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/updatepayment`, {
//         payment_status: true,
//         token,
//         product_id: item.product_id,
//         main_id: item.id,
//         shipment_id: `TRBSID${token}${item.product_id}${Math.floor(Math.random() * 1000)}`,
//         order_id: `TRBOID${token}${item.product_id}${Math.floor(Math.random() * 1000)}`,
//         ordered_date: new Date().toLocaleDateString("fr-CA"),
//         shipped_date: null,
//         delivered_date: null,
//         order_quantity: item.quantity,
//         order_status: "purchased",
//         order_amount: item.quantity * item.price,
//         product_name:item.name,
//         seller_id: item.seller_id
//       });
//     });

//     Promise.all(paymentRequests)
//       .then(() => {
//         setNotification({ message: 'Product Purchased Successfully', type: 'success' });
//         setTimeout(() => setNotification(null), 3000);
//         updateProductQuantities(products); // Update product quantities based on purchased items
//       })
//       .catch((err) => {
//         console.log("Error updating payment status:", err);
//         setNotification({ message: 'Error purchasing product', type: 'error' });
//       });
//   };

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
//               window.location.href = `${process.env.REACT_APP_HOST}${process.env.REACT_APP_FRONT_END_PORT}/Resale-bazaar`;
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

//   return (
//     <div>
//       {notification && <Notification message={notification.message} type={notification.type} onClose={() => setNotification(null)} />}
//       Loading...
//     </div>
//   );
// }


import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Notification from "./Notification";

export default function Finalcheckoutpage() {
  const [cartItems, setCartItems] = useState([]);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    const token = sessionStorage.getItem("user-token");
    if (!token) return;

    // Fetch cart items for the logged-in user
    axios.get(`${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/addcart`)
      .then((response) => {
        if (response.data !== "Fail" && response.data !== "Error") {
          const filteredProducts = response.data.filter((item) => item.userid.toString() === token);
          setCartItems(filteredProducts);

          // Proceed to update payment status
          updatePaymentStatus(filteredProducts, token);
        }
      })
      .catch((error) => {
        console.error("Error fetching cart items:", error);
      });
  }, []);

  const updatePaymentStatus = (products, token) => {
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
        seller_id: item.seller_id
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
      {notification && <Notification message={notification.message} type={notification.type} onClose={() => setNotification(null)} />}
      Loading...
    </div>
  );
}
