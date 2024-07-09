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
//                   window.location.href = `${process.env.REACT_APP_HOST}3000/Resale-bazaar`;
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
//             const updatedQuantity = Math.max(product.quantity - orderCount, 0); // Ensure quantity does not go below zero
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


import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function Finalcheckoutpage() {
  const [product, setProduct] = useState([]);
  const [allProducts, setAllProducts] = useState([]);

  useEffect(() => {
    const token = sessionStorage.getItem("user-token");
    if (!token) return;

    axios
      .get(`${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/addcart`)
      .then((response) => {
        if (response.data !== "Fail" && response.data !== "Error") {
          const filteredProducts = response.data.filter((item) => item.userid.toString() === token);
          setProduct(filteredProducts);

          filteredProducts.forEach(async (item) => {
            try {
              const res = await axios.post(`${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/updatepayment`, {
                payment_status: true,
                token,
                product_id: item.product_id,
                main_id: item.id,
                shipment_id: `TRBSID${token}${item.product_id}`,
                order_id: `TRBOID${token}${item.product_id}`,
                ordered_date: new Date().toLocaleDateString("fr-CA"),
                shipped_date: null,
                delivered_date: null
              });
              console.log("Payment updated successfully for product:", item.product_id);
              alert("Product Purchased Successfully");
              window.location.reload(false)
                 window.location.href = `${process.env.REACT_APP_HOST}3000/Resale-bazaar`;
            } catch (err) {
              console.log("Error updating payment status:", err);
            }
          });
        }
      })
      .catch((error) => {
        console.error("Error fetching cart items:", error);
      });
  }, []);

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
    const updateProductQuantities = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/updatepayment`);
        if (res.data !== "Fail" && res.data !== "Error") {
          const productIdsToUpdate = new Set(res.data.map(order => order.product_id)); // Get unique product_ids from orders

          const updatedProducts = allProducts.map(product => {
            if (productIdsToUpdate.has(product.id)) {
              const orderCount = res.data.filter(order => order.product_id === product.id).length;
              const updatedQuantity = Math.max(product.quantity - orderCount, 0);

              try {
                axios.post(`${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/updateproducts`, {
                  product_id: parseInt(product.id),
                  quantity: updatedQuantity
                });
                console.log("Quantity updated successfully for product:", product.id);
              } catch (error) {
                console.error("Error updating product quantity:", error);
              }

              return { ...product, quantity: updatedQuantity }; // Update local quantity in state
            }
            return product; // Return unchanged product if not updated
          });

          setAllProducts(updatedProducts); // Update state with new product quantities
        }
      } catch (error) {
        console.log("Error fetching orders:", error);
      }
    };

    if (allProducts.length > 0) {
      updateProductQuantities();
    }
  }, [allProducts]);

  return <div>Loading...</div>; // Placeholder until data loads and updates complete
}