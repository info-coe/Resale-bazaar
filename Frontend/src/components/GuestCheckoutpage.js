import React, { useEffect, useState } from "react";
import MyNavbar from "./navbar";
import Footer from "./footer";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Scrolltotopbtn from "./Scrolltotopbutton";
import axios from "axios";

const GuestCheckoutpage = () => {
  const location = useLocation();
  const locationState = location.state || {}; 
  const from = locationState.from !== null ? locationState.from : {}; 
  const initialProduct = { ...from, quantity: 1 }; 
  const [product, setProduct] = useState(initialProduct);
  const [products, setProducts] = useState([]); 
  const [message, setMessage] = useState(""); 

  const [userdetails, setUserDetails] = useState([]);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/user`)
      .then((res) => {
        if (res.data !== "Fail" && res.data !== "Error") {
          const userDetails = res.data.map((item) => ({
            email: item.email,
            phone: item.phone,
          }));
          setUserDetails(userDetails);
        }
      })
      .catch((err) => console.log(err));

    axios
      .get(
        `${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/sellerproducts`
      )
      .then((res) => {
        if (res.data !== "Fail" && res.data !== "Error") {
          setProducts(res.data); // Assuming response.data contains the product array
          // console.log(products)
        }
      })
      .catch((error) => {
        console.error("Error fetching seller products:", error);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [values, setValues] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
  });
  const [error, setError] = useState("");
  const handleInput = (event) => {
    setValues((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    navigate("/guestmailverification", { state: { user: values } });
    const { email, phone } = values;
    if (userdetails.some((user) => user.email === email)) {
      setError("This Email already Registered");
    } else if (userdetails.some((user) => user.phone.toString() === phone)) {
      setError("Phone number already exists");
    }
  };

  
  const productImage = product.image ? JSON.parse(product.image) : [];

  return (
    <div className="fullscreen">
      <MyNavbar />
      <main>
        <div className="">
         
          <div className="mb-4">
            <form method="post" onSubmit={handleSubmit}>
              <div className="">
                <div className="form-group d-md-flex justify-content-center mt-4 mb-2">
                  <label
                    className="control-label col-sm-2 col-md-1 fw-bold"
                    htmlFor="firstname"
                  >
                    First Name
                  </label>
                  <div className="d-flex col-sm-6 col-md-4 col-xs-12">
                    <input
                      className="form-control mb-2"
                      type="text"
                      id="firstname"
                      name="firstname"
                      onChange={handleInput}
                      placeholder="Enter First Name"
                    
                      required
                    />
                    <span className="text-danger fs-4"> &nbsp;*</span>
                  </div>
                </div>
                <div className="form-group  d-md-flex justify-content-center mt-2 mb-2">
                  <label
                    className="control-label col-sm-2 col-md-1 fw-bold"
                    htmlFor="lastname"
                  >
                    Last Name
                  </label>
                  <div className="d-flex col-sm-6 col-md-4 col-xs-12">
                    <input
                      className="form-control mb-2"
                      type="text"
                      id="lastname"
                      name="lastname"
                      onChange={handleInput}
                      placeholder="Enter Last Name"
                     
                      required
                    />
                    <span className="text-danger fs-4"> &nbsp;*</span>
                  </div>
                </div>

                <div className="form-group  d-md-flex justify-content-center mt-2 mb-2">
                  <label
                    className="control-label col-sm-2 col-md-1 fw-bold"
                    htmlFor="email"
                  >
                    Email
                  </label>
                  <div className="d-flex col-sm-6 col-md-4 col-xs-12">
                    <input
                      className="form-control mb-2"
                      type="email"
                      id="email"
                      name="email"
                      onChange={handleInput}
                      placeholder="Enter Email"
                      required
                    />
                    <span className="text-danger fs-4"> &nbsp;*</span>
                  </div>
                </div>
              </div>
              <div>
                <div className="form-group  d-md-flex justify-content-center mt-2 mb-2">
                  <label
                    className="control-label col-sm-2 col-md-1 fw-bold"
                    htmlFor="phone"
                  >
                    Phone
                  </label>
                  <div className="d-flex col-sm-6 col-md-4 col-xs-12">
                    <input
                      className="form-control mb-2"
                      type="tel"
                      id="phone"
                      name="phone"
                      onChange={handleInput}
                      placeholder="Enter Phone Number"
                      pattern="[0-9]{10}"
                      title="10 digit numeric value only"
                      minLength={10}
                      maxLength={10}
                      required
                    />
                    <span className="text-danger fs-4"> &nbsp;*</span>
                  </div>
                </div>
              </div>

              <div className="form-group  d-md-flex justify-content-center">
                <div className="col-sm-2 col-md-1"></div>
                <div className="col-sm-6 col-md-4 col-xs-12 text-center">
                  <button
                    type="submit"
                    className="btn btn-primary register-next-step-button w-50 mt-3"
                  >
                    Continue
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </main>
      <Footer />
      <Scrolltotopbtn />
    </div>
  );
};

export default GuestCheckoutpage;
