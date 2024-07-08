import React from 'react';
import "./App.css";
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { AuthProvider } from './AuthContext';
import ProtectedRoute from './ProtectedRoute';
import RestrictedRoute from './RestrictedRoute';

import "bootstrap/dist/css/bootstrap.min.css";
import "font-awesome/css/font-awesome.min.css";


import Home from "./components/home";
import Womenallproducts from "./components/women/Womenallproducts";
import Highendcouture from "./components/women/Highendcouture";
import Sarees from "./components/women/Sarees";
import Lehenga from "./components/women/Lehenga";
import Dresses from "./components/women/Dresses";
import Twinningoutfits from "./components/women/Twinningoutfits";

import Kidsallproducts from "./components/kids/kidsallproducts";
import Girl from "./components/kids/Girl";
import Boy from "./components/kids/Boy";

import Jewelryallcollection from "./components/jewelry/Jewelryallcollection";

import Login from "./components/login";
import Register from "./components/register";
import Customerinfo from "./components/customerdetails/customerinfo";
import Addresses from "./components/customerdetails/addresses";
import Addaddress from "./components/customerdetails/Addaddress";
import Orders from "./components/customerdetails/Orders";
import Changepassword from "./components/customerdetails/Changepassword";
import Productdetails from "./components/Productdetails";

import Aboutus from "./components/Aboutus";
import Contactus from "./components/Contactus";
import Selleraccount from "./components/Selleraccount";
import FAQ from "./components/Faq";
import Emailverification from "./components/Emailverification";
import Notfound from "./Notfound";
import Addnewproduct from "./components/sellerdashboard/Addnewproduct";
import Shipments from "./components/sellerdashboard/Shipments";
import Sellerorders from "./components/sellerdashboard/Sellerorders";
import Sellerproducts from "./components/sellerdashboard/Sellerproducts";
import Acceptproduct from "./components/admindashboard/acceptproduct";
import Checkout from "./components/Checkoutpage";
import Finalcheckoutpage from "./components/finalcheckoutpage";
import Cartitems from "./components/Cartitems";
import Forgotpassword from "./components/Forgotpassword";
import NecklacesChains from "./components/jewelry/NecklacesChains";
import BraceletsBangles from "./components/jewelry/BraceletsBangles";
import Earrings from "./components/jewelry/Earrings";
import Rings from "./components/jewelry/Rings";
import Offers from "./components/sellerdashboard/Offers";
import Search from "./components/Search";
import OrderPage from "./components/customerdetails/OrderPage";
import SellerProfile from "./components/sellerdashboard/SellerProfilePage";

import Scrolltotop from "./components/Scrolltotop";
import ContactSeller from "./components/sellerdashboard/ContactSeller";
import ReviewRatings from "./components/customerdetails/reviewsRatings";

const App = () => {
  return (
    <BrowserRouter basename="Resale-bazaar">
      <AuthProvider>
      <Scrolltotop />
        <Routes>
          {/* Restricted routes */}
          <Route path="/login" element={<RestrictedRoute><Login /></RestrictedRoute>} />
          <Route path="/register" element={<RestrictedRoute><Register /></RestrictedRoute>} />

          {/* Protected routes */}
          <Route path="customerinfo" element={<ProtectedRoute><Customerinfo /></ProtectedRoute>} />
          <Route path="addresses" element={<ProtectedRoute><Addresses /></ProtectedRoute>} />
          <Route path="addaddress" element={<ProtectedRoute><Addaddress /></ProtectedRoute>} />
          <Route path="orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
          <Route path="changepassword" element={<ProtectedRoute><Changepassword /></ProtectedRoute>} />
          <Route path="selleraccount" element={<ProtectedRoute><Selleraccount /></ProtectedRoute>} />
          <Route path="addnewproduct" element={<ProtectedRoute><Addnewproduct /></ProtectedRoute>} />
          <Route path="shipments" element={<ProtectedRoute><Shipments /></ProtectedRoute>} />
          <Route path="sellerorders" element={<ProtectedRoute><Sellerorders /></ProtectedRoute>} />
          <Route path="sellerproducts" element={<ProtectedRoute><Sellerproducts /></ProtectedRoute>} />
          <Route path="finalcheckoutpage" element={<ProtectedRoute><Finalcheckoutpage /></ProtectedRoute>} />
          <Route path="orderpage" element={<ProtectedRoute><OrderPage /></ProtectedRoute>} />
          <Route path="sellerprofile/:sellerId" element={<ProtectedRoute><SellerProfile /></ProtectedRoute>} />
          <Route path="contactseller" element={<ProtectedRoute><ContactSeller /></ProtectedRoute>} />
          <Route path="feedback" element={<ProtectedRoute><ReviewRatings /></ProtectedRoute>} />

          {/* Other routes */}
          <Route path="cartitems" element={<Cartitems />} />
          <Route path="checkoutpage" element={<Checkout />} />
          <Route path="acceptproduct" element={<Acceptproduct />} />
          <Route path="emailverification" element={<Emailverification />} />
          <Route path="offers" element={<Offers />} />
          <Route path="aboutus" element={<Aboutus />} />
          <Route path="contactus" element={<Contactus />} />
          <Route path="faq" element={<FAQ />} />
          <Route path="/" element={<Home />} />
          <Route path="women" element={<Womenallproducts />} />
          <Route path="product/:id" element={<Productdetails />} />
          <Route path="highendcouture" element={<Highendcouture />} />
          <Route path="sarees" element={<Sarees />} />
          <Route path="lehenga" element={<Lehenga />} />
          <Route path="dresses" element={<Dresses />} />
          <Route path="twinningoutfits" element={<Twinningoutfits />} />
          <Route path="kids" element={<Kidsallproducts />} />
          <Route path="girl" element={<Girl />} />
          <Route path="boy" element={<Boy />} />
          <Route path="jewellery" element={<Jewelryallcollection />} />
          <Route path="necklaces" element={<NecklacesChains />} />
          <Route path="bangles" element={<BraceletsBangles />} />
          <Route path="earrings" element={<Earrings />} />
          <Route path="rings" element={<Rings />} />
          <Route path="forgotpassword" element={<Forgotpassword />} />
          <Route path="*" element={<Notfound />} />
          <Route path="/search" element={<Search />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
