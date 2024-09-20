import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import MyNavbar from "./navbar";
import Footer from "./footer";
import axios from "axios";
import { useData } from "./CartContext";
import CryptoJS from "crypto-js";
import { useGoogleLogin } from "@react-oauth/google";
import Scrolltotopbtn from "./Scrolltotopbutton";
import Notification from "./Notification";
import googleicon from "../images/googleicon.png"


const Login = () => {

  const { setUserData, guest_product, addToCart } = useData();
  // eslint-disable-next-line no-unused-vars
  const [values, setValues] = useState({
    username: "",
    password: "",
  });
  const [user, setUser] = useState([]);
  //eslint-disable-next-line no-unused-vars
  const [profile, setProfile] = useState(null);
  const [notification, setNotification] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

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
                          setNotification({ message: 'Unable to login. Please try after some time.', type: 'error' });
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
                    setNotification({ message: 'Unable to login. Please try after some time.', type: 'error' });
                    setTimeout(() => setNotification(null), 3000);
                    return;
                  }
                  sessionStorage.removeItem("user-token");
                  sessionStorage.setItem("user-token", token);
                  navigate("/");
                  // window.location.reload(false);
                }
              } else {
                setNotification({ message: 'Invalid Username or Password', type: 'error' });
                setTimeout(() => setNotification(null), 3000);
                window.location.reload(false);
              }
            })
            .catch((err) => console.log(err));
        })
        .catch((err) => console.log(err));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);
  //eslint-disable-next-line no-unused-vars


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
    if (values.username === "admin@admin") {
      url = "admin";
    } else {
      url = "user";
    }
    values.password = CryptoJS.MD5(values.password).toString();
    axios
      .post(
        `${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/${url}`,
        values
      )
      .then((res) => {
        // console.log(res)
        if (res.data !== "Fail" && res.data !== "Error") {
          sessionStorage.setItem("accessToken", res.data.accessToken)
          // setAuthToken(res.data.accessToken);
          const data = res.data.data[0];
          setUserData(data);
          var token;
          if (url === "user") {
            token = data.user_id;
            sessionStorage.setItem("token", "user");
          } else if (url === "admin") {
            token = data.admin_id;
            sessionStorage.setItem("token", "admin");
          }
          if (!token) {
            setNotification({ message: 'Unable to login. Please try after some time.', type: 'error' });
            setTimeout(() => setNotification(null), 3000);
            return;
          }
          sessionStorage.removeItem("user-token");
          sessionStorage.setItem("user-token", token);
          // eslint-disable-next-line array-callback-return
          guest_product.map((item) => {
            item.userid = token;
            addToCart(item, "main", item.quantity)
          });
          sessionStorage.removeItem("guest_products")
          navigate("/");
        } else {
          setNotification({ message: 'Invalid Username or Password', type: 'error' });
          setTimeout(() => setNotification(null), 3000);
        }
      })
      .catch((err) => console.log(err));
  };
  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="fullscreen">
      <MyNavbar />
      {notification && <Notification message={notification.message} type={notification.type} onClose={() => setNotification(null)} />}

      <main>

        <div className="d-md-flex justify-content-around m-lg-5 m-md-5">
          <div className="col-lg-4 col-xs-12 col-md-8">
            <div className="  mb-3">
              <div className="p-4 rounded shadow m-3">
                <form action="" method="post" onSubmit={handleSubmit}>
                  <h3 className="text-center mb-4">Login</h3>
                  {/* <div className="form-group p-2">
                    <label htmlFor="username" className="fw-bold">Email</label>
                    <input
                      type="text"
                      id="username"
                      name="username"
                      placeholder="User Name / Email"
                      className="form-control"
                      onChange={handleInput}
                      required
                    />
                  </div> */}

                  <div className="input-field ">
                  <label htmlFor="email" className="fixed-label fw-bold">Email *</label>
                  <input
                    type="email"
                   id="username"
                      name="username"
                    onChange={handleInput}
                    // placeholder="Enter Email"
                    required
                  />
                </div>
                <div className="input-field  passwordgroup">
                  <label htmlFor="password" className="fixed-label fw-bold">Password *</label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    // placeholder="Password"
                    // className="form-control"
                    required
                    onChange={handleInput}
                    // type={showPassword ? "text" : "password"}
                    // id="password"
                    // name="password"
                    // onChange={handleInput}
                    // placeholder="Enter Password"
                    // required
                    // pattern="^(?=.*\d)(?=.*[a-zA-Z])(?=.*[!@#$%^&*]).{8,}$"
                    // title="Password must contain at least 8 characters, including one number, one letter, and one special character."
                  />
                  <button
                    type="button"
                    id="btnToggle"
                    className="toggle12"
                    onClick={handleTogglePassword}
                  >
                    <i
                      className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"
                        }`}
                    ></i>
                  </button>
                </div>

                  {/* <div className="form-group passwordgroup p-2">
                    <label htmlFor="password" className="fw-bold">Password</label>
                    <input
                      // type="password"
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      name="password"
                      placeholder="Password"
                      className="form-control"
                      required
                      onChange={handleInput}
                    />
                    <button
                      type="button"
                      id="btnToggle"
                      className="toggle11"
                      onClick={handleTogglePassword}
                    >
                      <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                    </button>
                  </div> */}
                  <div className="text-end p-1">
                    <Link to="/forgotpassword">Reset Password</Link>
                  </div>
                  <div>
                    <button
                      type="submit"
                      name="btn-login"
                      className="btn btn-primary w-100 mt-3"
                    >
                      Log In
                    </button>
                  </div>
                </form>
              </div>
              <div className="d-flex justify-content-around p-2 mt-3">
          <div
            style={{ borderBottom: "1px solid gray", width: "45%" }}
          ></div>
          <p className="text-center" style={{ marginBottom: '-10px' }}>or</p>
          <div
            style={{ borderBottom: "1px solid gray", width: "45%" }}
          ></div>
        </div>
        <div className="mt-3  mb-5 p-2 ">
          <button onClick={signin} className="btn shadow w-100 p-2" >
            {/* <span className="fs-5">
                  <i className="bi bi-google"></i>
                </span> */}
            <img src={googleicon} alt="Google icon" width="30" />
            &nbsp;&nbsp;&nbsp;Continue With Google
          </button>
        </div>
            </div>
          </div>
        </div>
       
      </main>
      <Footer />
      <Scrolltotopbtn />
    </div>
  );
};

export default Login;
