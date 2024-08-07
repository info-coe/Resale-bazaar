import React, { useState, useEffect } from "react";
import MyNavbar from "./navbar";
import { useNavigate } from "react-router-dom";
import Footer from "./footer";
import axios from "axios";
import CryptoJS from "crypto-js";
import { googleLogout, useGoogleLogin } from "@react-oauth/google";
import { useData } from "./CartContext";
import Scrolltotopbtn from "./Scrolltotopbutton";
import Notification from "./Notification";

const Register = () => {
  const [confirmpassword, setConfirmpassword] = useState("");
  const [notification, setNotification] = useState(null);
  const [values, setValues] = useState({
    firstname: "",
    lastname: "",
    shopname: "",
    email: "",
    phone: "",
    password: "",
  });
  const { setUserData } = useData();
  const [error, setError] = useState("");
  const [userdetails, setUserDetails] = useState([]);
  const navigate = useNavigate();
  const [shopNameFilter, setShopNameFilter] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);


  const handleInput = (event) => {
    setValues((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
    // console.log(CryptoJS.MD5(event.target.value).toString())
  };
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/user`)
      .then((res) => {
        if (res.data !== "Fail" && res.data !== "Error") {
          setShopNameFilter(res.data);
          const userDetails = res.data.map((item) => ({
            email: item.email,
            phone: item.phone,
          }));
          setUserDetails(userDetails);
        }
      })
      .catch((err) => console.log(err));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
 
  const handleSubmit = (event) => {
    event.preventDefault();
    const { email, phone, password } = values;
    if (values.shopname && shopNameFilter.some((user) => user.shopname === values.shopname)) {
      setError("This ShopName already exist");
    } else if (userdetails.some((user) => user.email === email)) {
      setError("This Email already Registered");
    } else if (userdetails.some((user) => user.phone.toString() === phone)) {
      setError("Phone number already exists");
    } else if (password !== confirmpassword) {
      setError("Passwords do not match");
    } else {
      const passwordRegex = /^(?=.*\d)(?=.*[a-zA-Z])(?=.*[!@#$%^&*]).{8,}$/;
      if (!passwordRegex.test(password)) {
        setError(
          "Password must contain at least 8 characters, including one number, one letter, and one special character."
        );
      } else {
        setError("");
        values.password = CryptoJS.MD5(values.password).toString();
        navigate("/emailverification", { state: { values } });
      }
    }
  };
  // console.log(values);
  const [user, setUser] = useState([]);
  //eslint-disable-next-line no-unused-vars
  const [profile, setProfile] = useState(null);

  const signin = useGoogleLogin({
    onSuccess: (codeResponse) => setUser(codeResponse),
    onError: (error) => console.log("Login Failed:", error),
  });
  useEffect(() => {
    if (user) {
      axios
        .get(
          `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`,
          {
            headers: {
              Authorization: `Bearer ${user.access_token}`,
              Accept: "application/json",
            },
          }
        )
        .then((res) => {
          setProfile(res.data);
          axios
            .post(
              `${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/googleLogin`,
              { username: res.data.email }
            )
            .then((res) => {
              // console.log(res)
              if (res.data !== "Error") {
                if (res.data === "Fail") {
                  axios
                    .post(
                      `${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/register`,
                      {
                        firstname: res.data.name,
                        lastname: "",
                        shopname: "",
                        email: res.data.email,
                        phone: 0,
                        password: "",
                      }
                    )
                    .then((result) => {
                      if (result.data !== "Error") {
                        const data = result.data[0];
                        setUserData(data);
                        var token = data.user_id;
                        sessionStorage.setItem("token", "user");
                        if (!token) {
                          setNotification({ message:"Unable to login. Please try after some time.", type:'error'});
                          setTimeout(() => setNotification(null), 3000);
                          return;
                        }
                        sessionStorage.removeItem("user-token");
                        sessionStorage.setItem("user-token", token);
                        navigate("/");
                      }
                    })
                    .catch((err) => console.log(err));
                } else {
                  const data = res.data[0];
                  setUserData(data);
                  var token = data.user_id;
                  sessionStorage.setItem("token", "user");
                  if (!token) {
                    setNotification({ message:"Unable to login. Please try after some time." , type:"error"});
                    setTimeout(() => setNotification(null), 3000);
                    return;
                  }
                  sessionStorage.removeItem("user-token");
                  sessionStorage.setItem("user-token", token);
                  navigate("/");
                  // window.location.reload(false);
                }
              } else {
                setNotification({ message:"Invalid Username or Password" , type:"error"});
                setTimeout(() => setNotification(null), 3000);
                window.location.reload(false);
              }
            })
            .catch((err) => console.log(err));
        })
        .catch((err) => console.log(err));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps

    axios
      .get(`${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/user`)
      .then((res) => {
        if (res.data !== "Fail" && res.data !== "Error") {
          console.log(res);
        }
      })

      .catch((err) => console.log(err));
      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);
  
  //eslint-disable-next-line no-unused-vars
  const logOut = () => {
    googleLogout();
    setProfile(null);
  };

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };
  const handleToggleConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className="fullscreen">
      <MyNavbar />
      {notification && <Notification message={notification.message} type={notification.type} onClose={() => setNotification(null)} />}

      <main>
        <div className="text-center mt-4 mb-4">
          <button onClick={signin} className="btn border">
            <span className="fs-5">
              <i className="bi bi-google"></i>
            </span>
            &nbsp;&nbsp;&nbsp;Continue With Google
          </button>
        </div>
        <div className="p-2 ps-lg-5 pe-lg-5 mb-5">
          <div className="col-xs-12 col-md-12 col-lg-12">
            <form method="post" onSubmit={handleSubmit}>
              <div>
                <div>
                  <h1 className="text-center fs-3">Create Account</h1>
                </div>
                <hr />
                <div className="form-group d-md-flex justify-content-center mt-4 mb-2">
                  <label
                    className="control-label col-sm-2 col-md-2 fw-bold"
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
                    className="control-label col-sm-2 col-md-2 fw-bold"
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
                    className="control-label col-sm-2 col-md-2 fw-bold"
                    htmlFor="shopname"
                  >
                    Shop Name
                  </label>
                  <div className="d-flex col-sm-6 col-md-4 col-xs-12">
                    <input
                      className="form-control mb-2"
                      type="text"
                      id="shopname"
                      name="shopname"
                      onChange={handleInput}
                      placeholder="Enter Shop Name (Optional)"
                      // pattern="[A-Z][a-z]*\s*\w*"
                      pattern="^[A-Z][a-z]*[\s\w!@#\$%\^&\*\(\)\-\+=\[\]\{\};:',.<>/?]*$"
                      title="First letter should be uppercase, remaining letters are lowercase. No special characters"
                    />
                    {/* <span className="text-danger fs-4"> &nbsp;*</span> */}
                  </div>
                </div>
                <div className="form-group  d-md-flex justify-content-center mt-2 mb-2">
                  <label
                    className="control-label col-sm-2 col-md-2 fw-bold"
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
                    className="control-label col-sm-2 col-md-2 fw-bold"
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
              <div>
                <div className="form-group  d-md-flex justify-content-center mt-2 mb-2">
                  <label
                    className="control-label col-sm-2 col-md-2 fw-bold"
                    htmlFor="password"
                  >
                    Password
                  </label>
                  <div className="d-flex col-sm-6 col-md-4 col-xs-12 passwordgroup">
                    <input
                      className="form-control mb-2"
                      // type="password"
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      name="password"
                      onChange={handleInput}
                      placeholder="Enter Password"
                      required
                      pattern="^(?=.*\d)(?=.*[a-zA-Z])(?=.*[!@#$%^&*]).{8,}$"
                      title="Password must contain at least 8 characters, including one number, one letter, and one special character."
                    />
                     <button
                      type="button"
                      id="btnToggle"
                      className="toggle12"
                      onClick={handleTogglePassword}
                    >
                      <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                    </button>
                    <span className="text-danger fs-4"> &nbsp;*</span>
                  </div>
                </div>
                <div className="form-group  d-md-flex justify-content-center mt-2 mb-2">
                  <label
                    className="control-label col-sm-2 col-md-2 fw-bold"
                    htmlFor="confirmpassword"
                  >
                    Confirm Password
                  </label>
                  <div className="d-flex col-sm-6 col-md-4 col-xs-12 passwordgroup">
                    <input
                      className="form-control mb-2"
                      type={showConfirmPassword ? 'text' : 'password'}
                      id="confirmpassword"
                      name="confirmpassword"
                      onChange={(e) =>
                        setConfirmpassword(e.currentTarget.value)
                      }
                      placeholder="Enter Confirm Password"
                      required
                    />
                     <button
                      type="button"
                      id="btnToggle"
                      className="toggle12"
                      onClick={handleToggleConfirmPassword}
                    >
                      <i className={`bi ${showConfirmPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                    </button>
                    <span className="text-danger fs-4"> &nbsp;*</span>
                  </div>
                </div>
              </div>
              {/* Error message */}
              {error && (
                <div className="text-danger text-center mb-3">{error}</div>
              )}
              <div className="form-group  d-md-flex justify-content-center">
                <div className="col-sm-2 col-md-2"></div>
                <div className="col-sm-6 col-md-4 col-xs-12 text-center">
                  <button
                    type="submit"
                    className="btn btn-primary register-next-step-button w-50 mt-3"
                  >
                    Register
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </main>
      <Footer />
      <Scrolltotopbtn/>
    </div>
  );
};

export default Register;
