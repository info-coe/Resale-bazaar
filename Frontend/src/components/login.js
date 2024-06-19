import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import MyNavbar from "./navbar";
import Footer from "./footer";
import axios from "axios";
import { useData } from "./CartContext";
import CryptoJS from "crypto-js";

const Login = () => {
  sessionStorage.clear();
  // useEffect(()=>{
  //   axios
  //   .post(`${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/`)
  //   .then(res=>{
  //     // console.log(res)
  //     sessionStorage.setItem("productAccessToken", res.data.accessToken);
  //   }).catch((error) => {
  //     console.log("Error fetching data:", error);
  //   });
  // },[]);
  const { setUserData } = useData();
  // eslint-disable-next-line no-unused-vars
  const [values, setValues] = useState({
    username: "",
    password: "",
  });
  const [showAdditionalContent, setShowAdditionalContent] = useState(false);
  const [AdditionalContentbtn, setAdditionalContentbtn] = useState("+");

  const handleInput = (event) => {
    setValues((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent default form submission behavior
  
    var url = "";
    if (values.username === "admin@admin") {
      url = "admin"; // Set URL to "admin" if username is "admin@admin"
    } else {
      url = "user"; // Otherwise, set URL to "user" for other usernames
    }
  
    values.password = CryptoJS.MD5(values.password).toString(); // Hash the password using MD5
  
    axios
      .post(`${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/${url}`, values)
      .then((res) => {
        if (res.data !== "Fail" && res.data !== "Error") { // Check if response indicates success
          const data = res.data[0]; // Assuming data is an array and taking the first element
          setUserData(data); // Set user data (assuming this updates state with user info)
  
          var token;
          if (url === "user") { // If URL is set to "user"
            token = data.user_id; // Set token to user_id
            sessionStorage.setItem("token", "user"); // Set session storage token as 'user'
          } else if (url === "admin") { // If URL is set to "admin"
            token = data.admin_id; // Set token to admin_id
            sessionStorage.setItem("token", "admin"); // Set session storage token as 'admin'
          }
  
          if (!token) { // If token is not set (should not happen based on logic)
            alert("Unable to login. Please try after some time.");
            return;
          }
  
          sessionStorage.removeItem("user-token"); // Remove any existing user-token
          sessionStorage.setItem("user-token", token); // Set user-token with the obtained token
          navigate("/"); // Navigate to home page
        } else { // If response indicates failure
          alert("Invalid Username or Password");
          window.location.reload(false); // Reload the window to reset the form
        }
      })
      .catch((err) => console.log(err)); // Catch any errors during API call
  };
  

  const toggleAdditionalContent = () => {
    if (showAdditionalContent) {
      setShowAdditionalContent(false);
      setAdditionalContentbtn("+");
    } else {
      setShowAdditionalContent(true);
      setAdditionalContentbtn("-");
    }
  };
  return (
    <div className="fullscreen">
      <MyNavbar />
      <main>
        <div className="d-md-flex justify-content-around m-lg-5 m-md-5 m-4">
          <div className="col-md-5">
            <div className="card bg-white shadow mb-3 ">
              <div className="card-body">
                <h1 className="fs-4">NEW CUSTOMER</h1>
                <hr />
                <p style={{ color: "#646464" }}>
                  By creating an account on our website, you will be able to
                  shop faster, be up to date on an orders status, and keep track
                  of the orders you have previously made.
                </p>
                <Link to="/register" className="text-decoration-none">
                  <button type="button" className="btn btn-primary">
                    Register
                  </button>
                </Link>
              </div>
            </div>
            <div className="card bg-white shadow mb-3">
              <div className="card-body ">
                <div>
                  <h2 className="fs-5">
                    Why do you have to register?{" "}
                    <span
                      className="float-end"
                      onClick={toggleAdditionalContent}
                      style={{ cursor: "pointer" }}
                    >
                      {AdditionalContentbtn}
                    </span>
                  </h2>
                </div>
                {showAdditionalContent && (
                  <div>
                    <hr />
                    Registration as a buyer is mandatory. To track your order
                    and shipment status, or to reach out to you in case of any
                    issues, we prefer you to register and create a buyer's
                    account. The process takes less than a minute and will
                    definitely prove to be beneficial in the long run; just
                    enter a few basic details and you are good to go!
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="col-md-5">
            <div className="card bg-white shadow mb-3">
              <div className="card-body">
                <form action="" method="post" onSubmit={handleSubmit}>
                  {/* <div className="d-flex gap-5">
                    
                    <label htmlFor="customer" className="d-flex align-items-center">
                      <input
                        type="radio"
                        name="selectedlogin"
                        id="customer"
                        value="customer"
                        onChange={handleInput}
                        required
                      />
                      <h6 className="mt-1">&nbsp;CUSTOMER</h6>
                    </label>

                    <label htmlFor="admin" className="d-flex align-items-center">
                      <input
                        type="radio"
                        name="selectedlogin"
                        id="admin"
                        value="admin"
                        onChange={handleInput}
                        required
                      />
                      <h6 className="mt-1">&nbsp;ADMIN</h6>
                    </label>

                 
                  </div>
                  <hr /> */}
                  <h3>Login In</h3>
                  <div className="form-group p-2">
                    <label htmlFor="username">Email</label>
                    <input
                      type="text"
                      id="username"
                      name="username"
                      placeholder="User Name / Email"
                      className="form-control"
                      onChange={handleInput}
                      required
                    />
                  </div>
                  <div className="form-group p-2">
                    <label htmlFor="password">Password</label>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      placeholder="Password"
                      className="form-control"
                      required
                      onChange={handleInput}
                    />
                  </div>
                  <div className="text-end p-1">
                    <Link to="/forgotpassword">Forgot Password?</Link>
                  </div>
                  <div>
                    <button
                      type="submit"
                      name="btn-login"
                      className="btn btn-primary "
                    >
                      Log In
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Login;
