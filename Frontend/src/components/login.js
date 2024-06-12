import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import MyNavbar from "./navbar";
import Footer from "./footer";
import axios from "axios";
import { useData } from "./CartContext";
import CryptoJS from "crypto-js";

const Login = () => {
  sessionStorage.clear();
  const { setUserData, setAuthToken } = useData();
  // eslint-disable-next-line no-unused-vars
  const [values, setValues] = useState({
    username: "",
    password: "",
    selectedlogin: "",
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
    e.preventDefault();
    var url = "";
    if (values.selectedlogin.toString() === "customer") {
      url = "user";
    } else if (values.selectedlogin.toString() === "admin") {
      url = "admin";
    }
    values.password = CryptoJS.MD5(values.password).toString();
    axios
      .post(`${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/${url}`, values)
      .then((res) => {
        // console.log(res)
        if (res.data !== "Fail" && res.data !== "Error") {
          sessionStorage.setItem("accessToken", res.data.accessToken)
          setAuthToken(res.data.accessToken);
          const data = res.data.data[0];
          setUserData(data);
          var token;
          if (url === 'user') {
            token = data.user_id;
            sessionStorage.setItem("token", "user");
          } else if (url === 'admin') {
            token = data.admin_id;
            sessionStorage.setItem("token", "admin");
          }
          if (!token) {
            alert("Unable to login. Please try after some time.");
            return;
          }
          sessionStorage.removeItem("user-token");
          sessionStorage.setItem("user-token", token);
          navigate("/");
          window.location.reload(false);
        } else {
          alert("Invalid Username or Password");
          window.location.reload(false);
        }
      })
      .catch((err) => console.log(err));
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
                  <div className="d-flex gap-5">
                    
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
                  <hr />
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
