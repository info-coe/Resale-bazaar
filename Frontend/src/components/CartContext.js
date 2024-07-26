import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  // localStorage.clear();
  // const [authToken, setAuthToken] = useState("");
  const [notification, setNotification] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [wishItems, setWishItems] = useState([]);
  const [selectedWishlistItems, setSelectedWishlistItems] = useState([]);
  const [shippingAddressData, setShippingAddressData] = useState({});
  const [billingAddressData, setBillingAddressData] = useState({});

  const [user, setUser] = useState(() => {
    const storedUser = JSON.parse(sessionStorage.getItem("user"));
    return storedUser || { firstname: "", lastname: "", email: "",shopname:'' };
  });

  const setUserData = (userData) => {
    setUser(userData);
  };
  useEffect(() => {
    sessionStorage.setItem("user", JSON.stringify(user));
  }, [user]);

  
  const addToCart = (product, from) => {
    const isProductInCart = cartItems.some(item => item.product_id === product.product_id);
    const userProduct = product.seller_id.toString() === sessionStorage.getItem('user-token');
  
    if (isProductInCart) {
      setNotification({message:'Product already exists in the cart' , type: 'error'});
      setTimeout(() => setNotification(null), 3000);
    } else if (userProduct) {
      setNotification({ message:"You are the seller of this product" , type:"error"});
      setTimeout(() => setNotification(null), 3000);
    } else {
      const productWithQuantity = { ...product, quantity: 1 };
      axios
        .post(`${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/addcart`, { product: productWithQuantity, from })
        .then((response) => {
          setCartItems((prevItems) => [...prevItems, productWithQuantity]);
        })
        .catch((error) => {
          console.error("Error adding to cart:", error);
        });
      setNotification({ message:"Product added to cart" , type: 'success'});
      setTimeout(() => setNotification(null), 3000);
      // window.location.reload(false);
    }
  };
  
  const removeFromCart = (productId) => {
    axios
      .delete(`${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/products/${productId}`)
      .then((response) => {
        setCartItems((prevItems) =>
          prevItems.filter((item) => item.id !== productId)
        );
        setNotification({ message:"Product removed from cart!" , type:'success'});
        setTimeout(() => setNotification(null), 3000);
      })
      .catch((error) => {
        console.error("Error removing product from cart:", error);
      });
  };
  const updateCartItemQuantity = (productId, newQuantity) => {
    setCartItems(prevItems => {
      return prevItems.map(item =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      );
    });
  };
  
  const incrementQuantity = (index) => {
    const updatedCartItems = [...cartItems];
    updatedCartItems[index].quantity++;
    setCartItems(updatedCartItems);
  };

  const decrementQuantity = (index) => {
    const updatedCartItems = [...cartItems];
    if (updatedCartItems[index].quantity > 1) {
      updatedCartItems[index].quantity--;
      setCartItems(updatedCartItems);
    }
  };

  const calculateTotalPrice = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/wishlist`)
      .then((response) => {
        if (response.data !== "Fail" && response.data !== "Error") {
          if (Array.isArray(response.data)) {
            setWishItems(response.data);
          }
        } 
      })
      .catch((error) => {
        console.error("Error fetching wishlist items:", error);
      });
  }, []);

  const addToWishlist = (product) => {
    const userProduct=product.seller_id.toString()===sessionStorage.getItem('user-token')
    if(userProduct){
      setNotification({ message:"You are the seller of the product" , type:"error"});
      setTimeout(() => setNotification(null), 3000);
    }else{
      axios
      .post(`${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/addwishlist`, product)
      .then((response) => {
        // console.log(response.data)
        setWishItems((prevItems) => [...prevItems, product]);
      })
      .catch((error) => {
        console.error("Error adding to wishlist:", error);
      });
    setNotification({ message:"Product added to wishlist" , type:"success"});
    setTimeout(() => setNotification(null), 3000);
    window.location.reload(false);
    }

  };

  const removeFromWishlist = (productId) => {
    axios
      .delete(`${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/wishlist/${productId}`)
      .then((response) => {
        setWishItems((prevItems) =>
          prevItems.filter((item) => item.id !== productId)
        );
        // alert("Product removed from wishlist");
      })
      .catch((error) => {
        console.error("Error removing product from wishlist:", error);
      });
  };

  const moveFromWishlistToCart = () => {
    selectedWishlistItems.forEach((productId) => {
      const product = wishItems.find((item) => item.product_id === productId);
      if (product) {
        addToCart(product,"wish");
        removeFromWishlist(product.id);
      }
    });
    setSelectedWishlistItems([]);
  };

  const handleCheckboxChange = (productId) => {
    if (selectedWishlistItems.includes(productId)) {
      setSelectedWishlistItems(
        selectedWishlistItems.filter((id) => id !== productId)
      );
    } else {
      setSelectedWishlistItems([...selectedWishlistItems, productId]);
    }
  };
  

  return (
    <CartContext.Provider
      value={{
        // authToken,
        // setAuthToken,
        notification,
        setNotification,
        user,
        setUserData,
        cartItems,
        setCartItems,
        addToCart,
        removeFromCart,
        incrementQuantity,
        decrementQuantity,
        calculateTotalPrice,
        wishItems,
        addToWishlist,
        removeFromWishlist,
        moveFromWishlistToCart,
        selectedWishlistItems,
        handleCheckboxChange,
        shippingAddressData,
        setShippingAddressData,
        billingAddressData,
        setBillingAddressData,
        updateCartItemQuantity
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export function useData() {
  return useContext(CartContext);
}



// import React, { createContext, useContext, useEffect, useState } from "react";
// import axios from "axios";
// import Alert from "./Alerts";

// const CartContext = createContext();

// export const useCart = () => useContext(CartContext);

// export const CartProvider = ({ children }) => {
//   // localStorage.clear();
//   // const [authToken, setAuthToken] = useState("");
//   const [cartItems, setCartItems] = useState([]);
//   const [wishItems, setWishItems] = useState([]);
//   const [selectedWishlistItems, setSelectedWishlistItems] = useState([]);
//   const [shippingAddressData, setShippingAddressData] = useState({});
//   const [billingAddressData, setBillingAddressData] = useState({});
//   const [alertConfig, setAlertConfig] = useState(null);

//   const [user, setUser] = useState(() => {
//     const storedUser = JSON.parse(sessionStorage.getItem("user"));
//     return storedUser || { firstname: "", lastname: "", email: "",shopname:'' };
//   });

//   const setUserData = (userData) => {
//     setUser(userData);
//   };
//   useEffect(() => {
//     sessionStorage.setItem("user", JSON.stringify(user));
//   }, [user]);

//   const showAlert = (config) => {
//     setAlertConfig(config);
//   };

//   const handleAlertClose = () => {
//     setAlertConfig(null);
//   };

//   const handleAlertConfirm = () => {
//     // Handle confirm actions if needed
//     setAlertConfig(null);
//   };
  
//   const addToCart = (product, from) => {
//     const isProductInCart = cartItems.some(item => item.product_id === product.product_id);
//     const userProduct = product.seller_id.toString() === sessionStorage.getItem('user-token');
  
//     if (isProductInCart) {
//       // alert("Product already exists in the cart");
//       showAlert({ status: 'info', title: '', content: 'Product already exists in the cart', confirmbtn: false });
//     } else if (userProduct) {
//       // alert('You are the seller of this product');
//       showAlert({ status: 'info', title: '', content: 'You are the seller of this product', confirmbtn: false });
//     } else {
//       // Set the default quantity to 1
//       const productWithQuantity = { ...product, quantity: 1 };
  
//       axios
//         .post(`${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/addcart`, { product: productWithQuantity, from })
//         .then((response) => {
//           setCartItems((prevItems) => [...prevItems, productWithQuantity]);
//       showAlert({ status: 'success', title: '', content: 'Product added to cart', confirmbtn: false });

//         })
//         .catch((error) => {
//           console.error("Error adding to cart:", error);
//         });
  
//       // alert("Product added to cart");
//       // window.location.reload(false);
//     }
//   };
  
//   const removeFromCart = (productId) => {
//     axios
//       .delete(`${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/products/${productId}`)
//       .then((response) => {
//         setCartItems((prevItems) =>
//           prevItems.filter((item) => item.id !== productId)
//         );
//         // alert("Product removed from cart:");
//         showAlert({ status: 'success', title: '', content: 'Product removed from cart', confirmbtn: false });
//         // console.log("Product removed from cart:");
//       })
//       .catch((error) => {
//         console.error("Error removing product from cart:", error);
//       });
//   };
//   const updateCartItemQuantity = (productId, newQuantity) => {
//     setCartItems(prevItems => {
//       return prevItems.map(item =>
//         item.id === productId ? { ...item, quantity: newQuantity } : item
//       );
//     });
//   };
  
//   const incrementQuantity = (index) => {
//     const updatedCartItems = [...cartItems];
//     updatedCartItems[index].quantity++;
//     setCartItems(updatedCartItems);
//   };

//   const decrementQuantity = (index) => {
//     const updatedCartItems = [...cartItems];
//     if (updatedCartItems[index].quantity > 1) {
//       updatedCartItems[index].quantity--;
//       setCartItems(updatedCartItems);
//     }
//   };

//   const calculateTotalPrice = () => {
//     return cartItems.reduce(
//       (total, item) => total + item.price * item.quantity,
//       0
//     );
//   };

//   useEffect(() => {
//     axios
//       .get(`${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/wishlist`)
//       .then((response) => {
//         if (response.data !== "Fail" && response.data !== "Error") {
//           if (Array.isArray(response.data)) {
//             setWishItems(response.data);
//           }
//         } 
//       })
//       .catch((error) => {
//         console.error("Error fetching wishlist items:", error);
//       });
//   }, []);

//   const addToWishlist = (product) => {
//     console.log(product)
//     const userProduct=product.seller_id.toString()===sessionStorage.getItem('user-token')
//     if(userProduct){
//       // alert('You are the seller of this product')
//       showAlert({ status: 'info', title: '', content: 'You are the seller of this product', confirmbtn: false });
//     }else{
//       axios
//       .post(`${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/addwishlist`, product)
//       .then((response) => {
//         // console.log(response.data)
//         setWishItems((prevItems) => [...prevItems, product]);
//         showAlert({ status: 'success', title: '', content: 'Product added to wishlist', confirmbtn: false });
//       })
//       .catch((error) => {
//         console.error("Error adding to wishlist:", error);
//       });
//     // alert("Product added to wishlist");
//     // window.location.reload(false);
//     }

//   };

//   const removeFromWishlist = (productId) => {
//     console.log(productId)
//     axios
//       .delete(`${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/wishlist/${productId}`)
//       .then((response) => {
//         setWishItems((prevItems) =>
//           prevItems.filter((item) => item.id !== productId)
//         );
//         // alert("Product removed from wishlist");
//         // showAlert({ status: 'success', title: '', content: 'Product removed from wishlist', confirmbtn: false });
//       })
//       .catch((error) => {
//         console.error("Error removing product from wishlist:", error);
//       });
//   };

//   const moveFromWishlistToCart = () => {
//     selectedWishlistItems.forEach((productId) => {
//       const product = wishItems.find((item) => item.product_id === productId);
//       if (product) {
//         addToCart(product,"wish");
//         removeFromWishlist(product.id);
//       }
//     });
//     setSelectedWishlistItems([]);
//   };

//   const handleCheckboxChange = (productId) => {
//     if (selectedWishlistItems.includes(productId)) {
//       setSelectedWishlistItems(
//         selectedWishlistItems.filter((id) => id !== productId)
//       );
//     } else {
//       setSelectedWishlistItems([...selectedWishlistItems, productId]);
//     }
//   };
  

//   return (
//     <CartContext.Provider
//       value={{
//         // authToken,
//         // setAuthToken,
//         user,
//         setUserData,
//         cartItems,
//         setCartItems,
//         addToCart,
//         removeFromCart,
//         incrementQuantity,
//         decrementQuantity,
//         calculateTotalPrice,
//         wishItems,
//         addToWishlist,
//         removeFromWishlist,
//         moveFromWishlistToCart,
//         selectedWishlistItems,
//         handleCheckboxChange,
//         shippingAddressData,
//         setShippingAddressData,
//         billingAddressData,
//         setBillingAddressData,
//         updateCartItemQuantity
//       }}
//     >
//       {children}
//       {alertConfig && (
//         <Alert
//           status={alertConfig.status}
//           title={alertConfig.title}
//           content={alertConfig.content}
//           confirmbtn={alertConfig.confirmbtn}
//           onClose={handleAlertClose}
//           onConfirm={handleAlertConfirm}
//         />
//       )}
//     </CartContext.Provider>
//   );
// };

// export function useData() {
//   return useContext(CartContext);
// }
