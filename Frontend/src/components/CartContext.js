import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  // localStorage.clear();
  // const [authToken, setAuthToken] = useState("");
  const [cartItems, setCartItems] = useState([]);
  const [wishItems, setWishItems] = useState([]);
  const [selectedWishlistItems, setSelectedWishlistItems] = useState([]);
  const [shippingAddressData, setShippingAddressData] = useState({});
  const [billingAddressData, setBillingAddressData] = useState({});

  const [user, setUser] = useState(() => {
    const storedUser = JSON.parse(sessionStorage.getItem("user"));
    return storedUser || { firstname: "", lastname: "", email: "" };
  });

  const setUserData = (userData) => {
    setUser(userData);
  };
  useEffect(() => {
    sessionStorage.setItem("user", JSON.stringify(user));
  }, [user]);

  const addToCart = (product,from) => {
    const isProductInCart = cartItems.some(item => item.product_id === product.product_id);
    const userProduct=product.seller_id.toString()===sessionStorage.getItem('user-token')
    if (isProductInCart) {
      alert("Product already exists in the cart");
    }
    else if(userProduct){
      alert('You are the seller of this product')
    }
    else{
      axios
      .post(`${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/addcart`, {product,from})
      .then((response) => {
        setCartItems((prevItems) => [...prevItems, { ...product }]);
      })
      .catch((error) => {
        console.error("Error adding to cart:", error);
      });
    alert("Product added to cart");
    window.location.reload(false);
    }
   

  };

  const removeFromCart = (productId) => {
    axios
      .delete(`${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/products/${productId}`)
      .then((response) => {
        setCartItems((prevItems) =>
          prevItems.filter((item) => item.id !== productId)
        );
        alert("Product removed from cart:");
        // console.log("Product removed from cart:");
      })
      .catch((error) => {
        console.error("Error removing product from cart:", error);
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
      (total, item) => total + item.price,
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
      alert('You are the seller of this product')
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
    alert("Product added to wishlist");
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
        setBillingAddressData
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export function useData() {
  return useContext(CartContext);
}
