import "./App.css";
import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "font-awesome/css/font-awesome.min.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";

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
import ProtectedRoute from "./components/ProtectedRoute";
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

// import axios from "axios";

import ContactSeller from "./components/sellerdashboard/ContactSeller";
import ReviewRatings from "./components/customerdetails/reviewsRatings";

import Scrolltotop from "./components/Scrolltotop";
import CancelOrder from "./components/customerdetails/CancelOrder";
import Refundproducts from "./components/admindashboard/Refundproducts";
import Myshop from "./components/sellerdashboard/Myshop";
import GuestCheckoutpage from "./components/GuestCheckoutpage";
import GuestShippingdetails from "./components/GuestShippingdetails";
import GuestFinalCheckout from "./components/GuestFinalCheckout";
import GuestMailverification from "./components/GuestMailVerification";
// const Home = React.lazy(() => import("./components/home"));
// const Womenallproducts = React.lazy(() =>
//   import("./components/women/Womenallproducts")
// );
// const Highendcouture = React.lazy(() =>
//   import("./components/women/Highendcouture")
// );
// const Sarees = React.lazy(() => import("./components/women/Sarees"));
// const Lehenga = React.lazy(() => import("./components/women/Lehenga"));
// const Dresses = React.lazy(() => import("./components/women/Dresses"));
// const Twinningoutfits = React.lazy(() =>
//   import("./components/women/Twinningoutfits")
// );

// const Kidsallproducts = React.lazy(() =>
//   import("./components/kids/kidsallproducts")
// );
// const Girl = React.lazy(() => import("./components/kids/Girl"));
// const Boy = React.lazy(() => import("./components/kids/Boy"));

// const Jewelryallcollection = React.lazy(() =>
//   import("./components/jewelry/Jewelryallcollection")
// );

// const Login = React.lazy(() => import("./components/login"));
// const Register = React.lazy(() => import("./components/register"));
// const Customerinfo = React.lazy(() =>
//   import("./components/customerdetails/customerinfo")
// );
// const ProtectedRoute = React.lazy(() => import("./components/ProtectedRoute"));
// const Addresses = React.lazy(() =>
//   import("./components/customerdetails/addresses")
// );
// const Addaddress = React.lazy(() =>
//   import("./components/customerdetails/Addaddress")
// );
// const Orders = React.lazy(() => import("./components/customerdetails/Orders"));
// const Changepassword = React.lazy(() =>
//   import("./components/customerdetails/Changepassword")
// );
// const Productdetails = React.lazy(() => import("./components/Productdetails"));
// const Aboutus = React.lazy(() => import("./components/Aboutus"));
// const Contactus = React.lazy(() => import("./components/Contactus"));
// const Selleraccount = React.lazy(() => import("./components/Selleraccount"));
// const FAQ = React.lazy(() => import("./components/Faq"));
// const Emailverification = React.lazy(() =>
//   import("./components/Emailverification")
// );
// const Notfound = React.lazy(() => import("./Notfound"));
// const Addnewproduct = React.lazy(() =>
//   import("./components/sellerdashboard/Addnewproduct")
// );
// const Shipments = React.lazy(() =>
//   import("./components/sellerdashboard/Shipments")
// );
// const Sellerorders = React.lazy(() =>
//   import("./components/sellerdashboard/Sellerorders")
// );
// const Sellerproducts = React.lazy(() =>
//   import("./components/sellerdashboard/Sellerproducts")
// );
// const Acceptproduct = React.lazy(() =>
//   import("./components/admindashboard/acceptproduct")
// );
// const Checkout = React.lazy(() => import("./components/Checkoutpage"));
// const Finalcheckoutpage = React.lazy(() =>
//   import("./components/finalcheckoutpage")
// );
// const Cartitems = React.lazy(() => import("./components/Cartitems"));
// const Forgotpassword = React.lazy(() => import("./components/Forgotpassword"));
// const NecklacesChains = React.lazy(() =>
//   import("./components/jewelry/NecklacesChains")
// );
// const BraceletsBangles = React.lazy(() =>
//   import("./components/jewelry/BraceletsBangles")
// );
// const Earrings = React.lazy(() => import("./components/jewelry/Earrings"));
// const Rings = React.lazy(() => import("./components/jewelry/Rings"));
// const Offers = React.lazy(() => import("./components/sellerdashboard/Offers"));
// const Search = React.lazy(() => import("./components/Search"));
// const OrderPage = React.lazy(() =>
//   import("./components/customerdetails/OrderPage")
// );
// const SellerProfile = React.lazy(() =>
//   import("./components/sellerdashboard/SellerProfilePage")
// );
// const ContactSeller = React.lazy(() =>
//   import("./components/sellerdashboard/ContactSeller")
// );
// const ReviewRatings = React.lazy(() =>
//   import("./components/customerdetails/reviewsRatings")
// );

//ProtectedRoute

function App() {
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);

  const checkUserToken = () => {
    const userToken = sessionStorage.getItem("user-token");
    if (!userToken || userToken === "undefined") {
      setIsUserLoggedIn(false);
    }
    setIsUserLoggedIn(true);
  };

  useEffect(() => {
    checkUserToken();
  }, [isUserLoggedIn]);

  return (
    <>
      <BrowserRouter >
        <Scrolltotop />
        {/* <React.Suspense fallback={<div>Loading...</div>}> */}
          <Routes>
            {/* Login routes */}
            {/* <Route path="register" element={<Register />}></Route> */}
            <Route path="register" element={<Register />}></Route>
            {/* <Route path="login" element={<Login />}></Route> */}

            <Route path="login" element={<Login />}></Route>

            <Route
              path="customerinfo"
              element={
                <ProtectedRoute>
                  {isUserLoggedIn && <Customerinfo />}
                </ProtectedRoute>
              }
            ></Route>
            <Route
              path="addresses"
              element={
                <ProtectedRoute>
                  {isUserLoggedIn && <Addresses />}
                </ProtectedRoute>
              }
            ></Route>

            <Route path="acceptproduct" element={<Acceptproduct />}></Route>
            <Route path="checkoutpage" element={<Checkout />}></Route>

            <Route
              path="emailverification"
              element={<Emailverification />}
            ></Route>

            <Route path="cartitems" element={<Cartitems />}></Route>

            <Route
              path="addaddress"
              element={
                <ProtectedRoute>
                  {isUserLoggedIn && <Addaddress />}
                </ProtectedRoute>
              }
            />

            <Route
              path="orders"
              element={
                <ProtectedRoute>{isUserLoggedIn && <Orders />}</ProtectedRoute>
              }
            />

            <Route
              path="changepassword"
              element={
                <ProtectedRoute>
                  {isUserLoggedIn && <Changepassword />}
                </ProtectedRoute>
              }
            />
            <Route path="offers" element={<Offers />}></Route>
            <Route path="aboutus" element={<Aboutus />}></Route>
            <Route path="contactus" element={<Contactus />}></Route>
            <Route
              path="selleraccount"
              element={
                <ProtectedRoute>
                  {isUserLoggedIn && <Selleraccount />}
                </ProtectedRoute>
              }
            ></Route>
            <Route path="faq" element={<FAQ />}></Route>

            {/* Women components routes */}
            <Route path="/" element={<Home />}></Route>
            <Route path="women" element={<Womenallproducts />}></Route>
            <Route path="product/:id" element={<Productdetails />}></Route>
            <Route path="High End Couture" element={<Highendcouture />}></Route>
            <Route path="sarees" element={<Sarees />}></Route>
            <Route path="lehenga" element={<Lehenga />}></Route>
            <Route path="dresses" element={<Dresses />}></Route>
            <Route
              path="Twinning-outfits,Tie Dye"
              element={<Twinningoutfits />}
            ></Route>

            {/* Kids components routes */}
            <Route path="kids" element={<Kidsallproducts />}></Route>
            <Route path="girl" element={<Girl />}></Route>
            <Route path="boy" element={<Boy />}></Route>

            {/* Jewelery components routes */}
            <Route path="jewellery" element={<Jewelryallcollection />}></Route>
            <Route path="necklaces" element={<NecklacesChains />}></Route>
            <Route path="bangles" element={<BraceletsBangles />}></Route>
            <Route path="earrings" element={<Earrings />}></Route>
            <Route path="rings" element={<Rings />}></Route>

            {/* Seller account routes */}
            <Route
              path="addnewproduct"
              element={
                <ProtectedRoute>
                  {isUserLoggedIn && <Addnewproduct />}
                </ProtectedRoute>
              }
            ></Route>
            <Route
              path="shipments"
              element={
                <ProtectedRoute>
                  {isUserLoggedIn && <Shipments />}
                </ProtectedRoute>
              }
            ></Route>
            <Route
              path="sellerorders"
              element={
                <ProtectedRoute>
                  {isUserLoggedIn && <Sellerorders />}
                </ProtectedRoute>
              }
            ></Route>
            <Route
              path="sellerproducts"
              element={
                <ProtectedRoute>
                  {isUserLoggedIn && <Sellerproducts />}
                </ProtectedRoute>
              }
            ></Route>
             <Route
              path="myshop"
              element={
                <ProtectedRoute>
                  {isUserLoggedIn && <Myshop/>}
                </ProtectedRoute>
              }
            ></Route>

            <Route
              path="finalcheckoutpage"
              element={
                <ProtectedRoute>
                  {isUserLoggedIn && <Finalcheckoutpage />}
                </ProtectedRoute>
              }
            ></Route>
            <Route path="forgotpassword" element={<Forgotpassword />}></Route>
            <Route path="*" element={<Notfound />}></Route>
            <Route path="/search" element={<Search />} />
            <Route path="/orderpage" element={
              <ProtectedRoute>
              {isUserLoggedIn && <OrderPage />}
            </ProtectedRoute>
            } />
            <Route path="/cancelorder" element={
                              <ProtectedRoute>
                              {isUserLoggedIn && <CancelOrder />}
                            </ProtectedRoute>
              
              } />

            <Route
              path="/sellerprofile/:sellerId"
              element={<SellerProfile />}
            />
            <Route path="/contactseller" element={
              <ProtectedRoute>
              {isUserLoggedIn &&  <ContactSeller />}
            </ProtectedRoute>
             
              } />
            <Route path="/feedback" element={
               <ProtectedRoute>
               {isUserLoggedIn && <ReviewRatings />}
             </ProtectedRoute>
              } />
          <Route path="refundsproduct" element={<Refundproducts />}/>
          <Route path="guestcheckout" element={<GuestCheckoutpage/>}/>
          <Route path="guestshipping" element={<GuestShippingdetails/>}/>
          <Route path="guestfinalcheckout" element={<GuestFinalCheckout />}/>
          <Route path="guestmailverification" element={<GuestMailverification/>}/>
          </Routes>
        {/* </React.Suspense> */}
      </BrowserRouter>
    </>
  );
}

export default App;
