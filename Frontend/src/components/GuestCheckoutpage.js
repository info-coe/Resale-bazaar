import React, { useEffect, useState } from "react";
import MyNavbar from "./navbar";
import Footer from "./footer";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Scrolltotopbtn from "./Scrolltotopbutton";
import axios from "axios";

const GuestCheckoutpage = () => {
  const location = useLocation();
  const { from } = location.state;
  const [product, setProduct] = useState(from !== null ? from : {});
  const [products, setProducts] = useState([]); // State to hold fetched products
  const [message, setMessage] = useState(""); // State to hold global error message

  useEffect(() => {
    axios
      .get(
        `${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/sellerproducts`
      )
      .then((res) => {
        if (res.data !== "Fail" && res.data !== "Error") {
          setProducts(res.data); // Assuming response.data contains the product array
        }
      })
      .catch((error) => {
        console.error("Error fetching seller products:", error);
      });
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
    navigate("/guestshipping" , { Gueststate: {user : values, product: product }})
    // const { email, phone, password } = values;
    // if (values.shopname && shopNameFilter.some((user) => user.shopname === values.shopname)) {
    //   setError("This ShopName already exist");
    // } else if (userdetails.some((user) => user.email === email)) {
    //   setError("This Email already Registered");
    // } else if (userdetails.some((user) => user.phone.toString() === phone)) {
    //   setError("Phone number already exists");
    // }
  };

  const handleQuantityChange = (product, newQuantity) => {
    const availableProduct = products.find((p) => p.id === product.id);
    if (newQuantity > availableProduct.quantity) {
      setMessage(
        `Cannot increase quantity beyond available stock: ${availableProduct.quantity}`
      );
    } else {
      setMessage("");
      setProduct((prevItems) => {
        return prevItems.id === product.id
          ? { ...prevItems, quantity: newQuantity }
          : prevItems;
      });
    }
  };

  return (
    <div className="fullscreen">
      <MyNavbar />
      <main>
        <div className="">
          <div className="d-md-flex justify-content-around m-lg-5 m-md-5 m-4">
            <div className="col-md-6">
              <div className="card bg-white shadow mb-3">
                <div className="card-body d-md-flex">
                  <div className="d-flex justify-content-center">
                    <img
                      src={product.image[0]}
                      alt="productIMG"
                      width="250"
                      height="250"
                      // className='guestproductImg'
                      style={{ objectFit: "contain" }}
                    />
                  </div>
                  <div className="p-2" style={{ lineHeight: "35px" }}>
                    <b>Name</b>: {product.name} <br />
                    <b>Color</b>: {product.color} <br />
                    <div className="d-flex align-items-center">
                    <b>QTY </b> :&nbsp;
                      <button
                        className="btn btn-sm btn-outline-secondary me-2"
                        onClick={() =>
                          handleQuantityChange(product, product.quantity - 1)
                        }
                        disabled={product.quantity <= 1}
                      >
                        -
                      </button>
                      <span>{product.quantity}</span>
                      <button
                        className="btn btn-sm btn-outline-secondary ms-2"
                        onClick={() =>
                          handleQuantityChange(product, product.quantity + 1)
                        }
                      >
                        +
                      </button>
                    </div>
                    <b>Price</b>: &#36; {product.price} <br />
                  </div>
                </div>
                {message && (
                  <div className="container">
                    <div className="alert alert-warning">{message}</div>
                  </div>
                )}
              </div>
            </div>
          </div>
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
                      pattern="[A-Z][a-z]*\s*\w*"
                      title="First letter should be uppercase, remaining letters are lowercase. No special characters"
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
                      pattern="[A-Z][a-z]*\s*\w*"
                      title="First letter should be uppercase, remaining letters are lowercase. No special characters"
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