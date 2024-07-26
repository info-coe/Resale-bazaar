// import React, { useEffect, useState } from 'react';
// import axios from 'axios';

// export default function Finalcheckoutpage() {
//   // eslint-disable-next-line no-unused-vars
//   const [product, setProduct] = useState([]);

//   useEffect(() => {
//     const token = sessionStorage.getItem("user-token");
//     if (!token) return;

//     axios
//       .get(`${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/addcart`)
//       .then((response) => {
//         if (response.data !== "Fail" && response.data !== "Error") {
//           if (sessionStorage.getItem("user-token") !== null) {
//             const filteredProducts = response.data.filter((item) => item.userid.toString() === sessionStorage.getItem("user-token"));
//             setProduct(filteredProducts);

//             filteredProducts.forEach((item) => {
//               axios
//                 .post(`${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/updatepayment`, {
//                   payment_status: true,
//                   token,
//                   product_id: item.product_id,
//                   main_id: item.id,
//                   shipment_id: `TRBSID${token}${item.product_id}`,
//                   order_id : `TRBOID${token}${item.product_id}`,
//                   ordered_date :  new Date().toLocaleDateString("fr-CA"),
//                   shipped_date : null,
//                   delivered_date : null
//                 })
//                 .then((res) => {
//                   alert("Product Purchased Successfully");
//                   // window.location.href = `${process.env.REACT_APP_HOST}3000/Resale-bazaar`;
//                 })
//                 .catch((err) => console.log("Error updating payment status:", err));
//             });
//           }
//         }
//       })
//       .catch((error) => {
//         console.error("Error fetching cart items:", error);
//       });
//   }, []);

//   const [allProducts, setAllProducts] = useState([]);

//   useEffect(() => {
//     axios
//       .get(`${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/allproducts`)
//       .then((res) => {
//         if (res.data !== "Fail" && res.data !== "Error") {
//           setAllProducts(res.data);
//         }
//       })
//       .catch((error) => {
//         console.log("Error fetching data:", error);
//       });
//   }, []);

 

//   useEffect(() => {
//     axios.get(`${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/updatepayment`)
//       .then((res) => {
//         if (res.data !== "Fail" && res.data !== "Error") {
//           allProducts.forEach((product) => {
//             const orderCount = res.data.filter((order) => order.product_id === product.id).length;
//             const updatedQuantity = Math.max(product.quantity - orderCount, 0);
//             console.log(updatedQuantity) // Ensure quantity does not go below zero
//             axios.post(`${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/updateproducts`, {
//               product_id: parseInt(product.id),
//               quantity: updatedQuantity
//             })
//             .then((response) => {
//               // Handle response if needed
//             })
//             .catch((error) => {
//               console.error("Error updating product quantity:", error);
//             });
//           });
//         }
//       })
//       .catch((error) => {
//         console.log("Error fetching orders:", error);
//       });
//   }, [allProducts]);


//   return <div>Loading...</div>;
// }


// // import React, { useEffect, useState } from 'react';
// // import axios from 'axios';

// // export default function Finalcheckoutpage() {
// //   const [product, setProduct] = useState([]);
// //   const [allProducts, setAllProducts] = useState([]);

// //   useEffect(() => {
// //     const token = sessionStorage.getItem("user-token");
// //     if (!token) return;

// //     axios
// //       .get(`${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/addcart`)
// //       .then((response) => {
// //         if (response.data !== "Fail" && response.data !== "Error") {
// //           const filteredProducts = response.data.filter((item) => item.userid.toString() === token);
// //           setProduct(filteredProducts);

// //           filteredProducts.forEach(async (item) => {
// //             try {
// //               const res = await axios.post(`${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/updatepayment`, {
// //                 payment_status: true,
// //                 token,
// //                 product_id: item.product_id,
// //                 main_id: item.id,
// //                 shipment_id: `TRBSID${token}${item.product_id}`,
// //                 order_id: `TRBOID${token}${item.product_id}`,
// //                 ordered_date: new Date().toLocaleDateString("fr-CA"),
// //                 shipped_date: null,
// //                 delivered_date: null
// //               });
// //               console.log("Payment updated successfully for product:", item.product_id);
// //               alert("Product Purchased Successfully");
// //               window.location.reload(false)
// //                 //  window.location.href = `${process.env.REACT_APP_HOST}3000/Resale-bazaar`;
// //             } catch (err) {
// //               console.log("Error updating payment status:", err);
// //             }
// //           });
// //         }
// //       })
// //       .catch((error) => {
// //         console.error("Error fetching cart items:", error);
// //       });
// //   }, []);

// //   useEffect(() => {
// //     axios
// //       .get(`${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/allproducts`)
// //       .then((res) => {
// //         if (res.data !== "Fail" && res.data !== "Error") {
// //           setAllProducts(res.data);
// //         }
// //       })
// //       .catch((error) => {
// //         console.log("Error fetching data:", error);
// //       });
// //   }, []);

// //   useEffect(() => {
// //     const updateProductQuantities = async () => {
// //       try {
// //         const res = await axios.get(`${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/updatepayment`);
// //         if (res.data !== "Fail" && res.data !== "Error") {
// //           const productIdsToUpdate = new Set(res.data.map(order => order.product_id)); // Get unique product_ids from orders

// //           const updatedProducts = allProducts.map(product => {
// //             if (productIdsToUpdate.has(product.id)) {
// //               const orderCount = res.data.filter(order => order.product_id === product.id).length;
// //               // console.log(orderCount)
// //               const updatedQuantity = Math.max(product.quantity - orderCount, 0);

// //               try {
// //                 axios.post(`${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/updateproducts`, {
// //                   product_id: parseInt(product.id),
// //                   quantity: updatedQuantity
// //                 });
// //                 console.log("Quantity updated successfully for product:", product.id);
// //               } catch (error) {
// //                 console.error("Error updating product quantity:", error);
// //               }

// //               return { ...product, quantity: updatedQuantity }; // Update local quantity in state
// //             }
// //             return product; // Return unchanged product if not updated
// //           });

// //           setAllProducts(updatedProducts); // Update state with new product quantities
// //         }
// //       } catch (error) {
// //         console.log("Error fetching orders:", error);
// //       }
// //     };

// //     if (allProducts.length > 0) {
// //       updateProductQuantities();
// //     }
// //   }, [allProducts]);

// //   return <div>Loading...</div>; // Placeholder until data loads and updates complete
// // }


// import React, { useEffect, useState } from 'react';
// import axios from 'axios';

// export default function Finalcheckoutpage() {
//   const [product, setProduct] = useState([]);
//   const [allProducts, setAllProducts] = useState([]);
//   const token = sessionStorage.getItem("user-token");

//   useEffect(() => {
//     if (!token) return;

//     axios.get(`${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/addcart`)
//       .then((response) => {
//         if (response.data !== "Fail" && response.data !== "Error") {
//           const filteredProducts = response.data.filter((item) => item.userid.toString() === token);
//           setProduct(filteredProducts);

//           filteredProducts.forEach((item) => {
//             updatePaymentStatus(item);
//           });
//         }
//       })
//       .catch((error) => {
//         console.error("Error fetching cart items:", error);
//       });
//   }, [token]);

//   useEffect(() => {
//     axios.get(`${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/allproducts`)
//       .then((res) => {
//         if (res.data !== "Fail" && res.data !== "Error") {
//           setAllProducts(res.data);
//         }
//       })
//       .catch((error) => {
//         console.error("Error fetching products:", error);
//       });
//   }, []);

//   useEffect(() => {
//     if (allProducts.length > 0) {
//       updateProductQuantities();
//     }
//   }, [allProducts]);

//   const updatePaymentStatus = (item) => {
//     axios.post(`${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/updatepayment`, {
//       payment_status: true,
//       token,
//       product_id: item.product_id,
//       main_id: item.id,
//       shipment_id: `TRBSID${token}${item.product_id}`,
//       order_id: `TRBOID${token}${item.product_id}`,
//       ordered_date: new Date().toLocaleDateString("fr-CA"),
//       shipped_date: null,
//       delivered_date: null
//     })
//     .then((res) => {
//       alert("Product Purchased Successfully");
//       window.location.reload(false)
//       window.location.href = `${process.env.REACT_APP_HOST}3000/Resale-bazaar`;

//     })
//     .catch((err) => console.error("Error updating payment status:", err));
//   };

//   const updateProductQuantities = () => {
//     axios.get(`${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/updatepayment`)
//       .then((res) => {
//         if (res.data !== "Fail" && res.data !== "Error") {
//           res.data.forEach((order) => {
//             const product = allProducts.find(p => p.id === order.product_id);
//             if (product) {
//               const updatedQuantity = Math.max(product.quantity - 1, 0); // Assuming 1 unit per order
//               console.log(updatedQuantity)
//               axios.post(`${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/updateproducts`, {
//                 product_id: parseInt(product.id),
//                 quantity: updatedQuantity
//               })
//               .then((response) => {
//                 // Handle response if needed
//               })
//               .catch((error) => {
//                 console.error("Error updating product quantity:", error);
//               });
//             }
//           });
//         }
//       })
//       .catch((error) => {
//         console.error("Error fetching orders:", error);
//       });
//   };

//   return <div>Loading...</div>;
// }
// import React, { useEffect, useState } from 'react';
// import axios from 'axios';

// export default function Finalcheckoutpage() {
//   const [product, setProduct] = useState([]);
//   const [allProducts, setAllProducts] = useState([]);

//   useEffect(() => {
//     const token = sessionStorage.getItem("user-token");
//     if (!token) return;

//     axios.get(`${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/addcart`)
//       .then((response) => {
//         if (response.data !== "Fail" && response.data !== "Error") {
//           const filteredProducts = response.data.filter((item) => item.userid.toString() === token);
//           setProduct(filteredProducts);

//           const updatePaymentRequests = filteredProducts.map((item) => {
//             return axios.post(`${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/updatepayment`, {
//               payment_status: true,
//               token,
//               product_id: item.product_id,
//               main_id: item.id,
//               shipment_id: `TRBSID${token}${item.product_id}`,
//               order_id: `TRBOID${token}${item.product_id}`,
//               ordered_date: new Date().toLocaleDateString("fr-CA"),
//               shipped_date: null,
//               delivered_date: null
//             });
//           });

//           Promise.all(updatePaymentRequests)
//             .then(() => {
//               alert("Product Purchased Successfully");
//               window.location.href = `${process.env.REACT_APP_HOST}3000/Resale-bazaar`;
//             })
//             .catch((err) => console.log("Error updating payment status:", err));
//         }
//       })
//       .catch((error) => {
//         console.error("Error fetching cart items:", error);
//       });
//   }, []);

//   useEffect(() => {
//     axios.get(`${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/allproducts`)
//       .then((res) => {
//         if (res.data !== "Fail" && res.data !== "Error") {
//           setAllProducts(res.data);
//         }
//       })
//       .catch((error) => {
//         console.log("Error fetching data:", error);
//       });
//   }, []);

//   useEffect(() => {
//     axios.get(`${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/updatepayment`)
//       .then((res) => {
//         if (res.data !== "Fail" && res.data !== "Error") {
//           const updateQuantityRequests = allProducts.map((product) => {
//             const orderCount = res.data.filter((order) => order.product_id === product.id).length;
//             const updatedQuantity = Math.max(product.quantity - orderCount, 0);

//             return axios.post(`${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/updateproducts`, {
//               product_id: parseInt(product.id),
//               quantity: updatedQuantity
//             });
//           });

//           Promise.all(updateQuantityRequests)
//             .then(() => {
//               console.log("Product quantities updated successfully");
//             })
//             .catch((error) => {
//               console.error("Error updating product quantity:", error);
//             });
//         }
//       })
//       .catch((error) => {
//         console.log("Error fetching orders:", error);
//       });
//   }, [allProducts]);

//   return <div>Loading...</div>;
// }
// import React, { useEffect, useState } from 'react';
// import axios from 'axios';

// export default function Finalcheckoutpage() {
//   const [product, setProduct] = useState([]);
//   const [allProducts, setAllProducts] = useState([]);

//   useEffect(() => {
//     const token = sessionStorage.getItem("user-token");
//     if (!token) return;

//     // Fetch cart items for the user
//     axios.get(`${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/addcart`)
//       .then((response) => {
//         if (response.data !== "Fail" && response.data !== "Error") {
//           const filteredProducts = response.data.filter((item) => item.userid.toString() === token);
//           setProduct(filteredProducts);

//           // Proceed to update payment
//           const updatePaymentRequests = filteredProducts.map((item) => {
//             return axios.post(`${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/updatepayment`, {
//               payment_status: true,
//               token,
//               product_id: item.product_id,
//               main_id: item.id,
//               shipment_id: `TRBSID${token}${item.product_id}`,
//               order_id: `TRBOID${token}${item.product_id}`,
//               ordered_date: new Date().toLocaleDateString("fr-CA"),
//               shipped_date: null,
//               delivered_date: null
//             });
//           });

//           Promise.all(updatePaymentRequests)
//             .then(() => {
//               alert("Product Purchased Successfully");
//               updateProductQuantities(filteredProducts); 
//               window.location.reload(false)
//               window.location.href = `${process.env.REACT_APP_HOST}3000/Resale-bazaar`;
//             })
//             .catch((err) => console.log("Error updating payment status:", err));
//         }
//       })
//       .catch((error) => {
//         console.error("Error fetching cart items:", error);
//       });
//   }, []);

//   const updateProductQuantities = (cartItems) => {
//     axios.get(`${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/allproducts`)
//       .then((res) => {
//         if (res.data !== "Fail" && res.data !== "Error") {
//           const updateQuantityRequests = cartItems.map((cartItem) => {
//             const product = res.data.find((p) => p.id === cartItem.product_id);
//             if (product) {
//               const updatedQuantity = Math.max(product.quantity - cartItem.quantity, 0); // Ensure quantity does not go negative
//               // console.log(updatedQuantity)
//               return axios.post(`${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/updateproducts`, {
//                 product_id: product.id,
//                 quantity: updatedQuantity
//               });
//             } else {
//               return Promise.resolve(); // Skip if product not found
//             }
//           });

//           Promise.all(updateQuantityRequests)
//             .then(() => {
//               console.log("Product quantities updated successfully");
//             })
//             .catch((error) => {
//               console.error("Error updating product quantity:", error);
//             });
//         }
//       })
//       .catch((error) => {
//         console.log("Error fetching products:", error);
//       });
//   };

//   return <div>Loading...</div>;
// }
// import React, { useEffect, useState } from 'react';
// import axios from 'axios';

// export default function Finalcheckoutpage() {
//   const [product, setProduct] = useState([]);
//   const [allProducts, setAllProducts] = useState([]);
//   const [cartItems, setCartItems] = useState([]);

//   useEffect(() => {
//     const token = sessionStorage.getItem("user-token");
//     if (!token) return;

//     axios.get(`${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/addcart`)
//       .then((response) => {
//         if (response.data !== "Fail" && response.data !== "Error") {
//           const filteredProducts = response.data.filter((item) => item.userid.toString() === token);
//           setCartItems(filteredProducts);
//           const updatePaymentRequests = filteredProducts.map((item) => {
//             return axios.post(`${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/updatepayment`, {
//               payment_status: true,
//               token,
//               product_id: item.product_id,
//               main_id: item.id,
//               shipment_id: `TRBSID${token}${item.product_id}`,
//               order_id: `TRBOID${token}${item.product_id}`,
//               ordered_date: new Date().toLocaleDateString("fr-CA"),
//               shipped_date: null,
//               delivered_date: null
//             });
//           });

//           Promise.all(updatePaymentRequests)
//             .then(() => {
//               alert("Product Purchased Successfully");
//               window.location.href = `${process.env.REACT_APP_HOST}${process.env.REACT_APP_FRONT_END_PORT}/Resale-bazaar`;
//             })
//             .catch((err) => console.log("Error updating payment status:", err));
//         }
//       })
//       .catch((error) => {
//         console.error("Error fetching cart items:", error);
//       });
//   }, []);

//   useEffect(() => {
//     axios.get(`${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/allproducts`)
//       .then((res) => {
//         if (res.data !== "Fail" && res.data !== "Error") {
//           setAllProducts(res.data);
//         }
//       })
//       .catch((error) => {
//         console.log("Error fetching data:", error);
//       });
//   }, []);

//   useEffect(() => {
//     if (cartItems.length > 0 && allProducts.length > 0) {
//       const updateQuantityRequests = cartItems.map((cartItem) => {
//         const product = allProducts.find((p) => p.id === cartItem.product_id);
//         if (product) {
//           const updatedQuantity = Math.max(product.quantity - cartItem.quantity, 0);
//           return axios.post(`${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/updateproducts`, {
//             product_id: product.id,
//             quantity: updatedQuantity
//           });
//         }
//       });

//       Promise.all(updateQuantityRequests)
//         .then(() => {
//           console.log("Product quantities updated successfully");
//         })
//         .catch((error) => {
//           console.error("Error updating product quantities:", error);
//         });
//     }
//   }, [cartItems, allProducts]);

//   return <div>Loading...</div>;
// }
import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function Finalcheckoutpage() {
  const [cartItems, setCartItems] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
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
        shipment_id: `TRBSID${token}${item.product_id}`,
        order_id: `TRBOID${token}${item.product_id}`,
        ordered_date: new Date().toLocaleDateString("fr-CA"),
        shipped_date: null,
        delivered_date: null,
        order_quantity: item.quantity,
        order_status:"purchased",
        order_amount:item.quantity * item.price
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

  return <div>Loading...</div>;
}
