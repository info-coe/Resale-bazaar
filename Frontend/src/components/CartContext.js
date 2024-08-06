import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
 
  const [notification, setNotification] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [wishItems, setWishItems] = useState([]);
  const [selectedWishlistItems, setSelectedWishlistItems] = useState([]);
  const [shippingAddressData, setShippingAddressData] = useState({});
  const [billingAddressData, setBillingAddressData] = useState({});
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [guest_product, setGuest_product] = useState(JSON.parse(sessionStorage.getItem("guest_products")) || []);

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

  
  const addToCart = (product, from, quantity = 1) => {
    const isProductInCart = cartItems.some(item => item.product_id === product.product_id);
    const userProduct = product.seller_id.toString() === sessionStorage.getItem('user-token');
  
    if (isProductInCart) {
      setNotification({message:'Product already exists in the cart' , type: 'error'});
      setTimeout(() => setNotification(null), 3000);
    } else if (userProduct) {
      setNotification({ message:"You are the seller of this product" , type:"error"});
      setTimeout(() => setNotification(null), 3000);
    } else {
      const productWithQuantity = { ...product, quantity: quantity };
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
    if(isLoggedIn){
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
    }
    else{
      const updated_guest_product = guest_product.filter(item => item.id !== productId);
      sessionStorage.setItem("guest_products", JSON.stringify(updated_guest_product));
      setNotification({ message:"Product removed from cart!" , type:'success'});
      setTimeout(() => setNotification(null), 3000);
      window.location.reload(false);
    }
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
    if(isLoggedIn){
      return cartItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );
    }else{
      return guest_product.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );
    }
  };

  useEffect(() => {
    if (sessionStorage.getItem("token") !== "admin") {
      sessionStorage.getItem("user-token") !== null && setIsLoggedIn(true);
    }
   
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
        updateCartItemQuantity,
        guest_product,
        setGuest_product,
        isLoggedIn,
        setIsLoggedIn,
        setWishItems
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export function useData() {
  return useContext(CartContext);
}



