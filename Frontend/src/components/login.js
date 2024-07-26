import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import MyNavbar from "./navbar";
import Footer from "./footer";
import axios from "axios";
import { useData } from "./CartContext";
import CryptoJS from "crypto-js";
import { googleLogout, useGoogleLogin } from "@react-oauth/google";
import Scrolltotopbtn from "./Scrolltotopbutton";
import Notification from "./Notification";

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
  const [user, setUser] = useState([]);
  //eslint-disable-next-line no-unused-vars
  const [profile, setProfile] = useState(null);
  const [notification, setNotification] = useState(null);


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
                // sessionStorage.setItem("accessToken", res.data.accessToken)
                // setAuthToken(res.data.accessToken);
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
  const logOut = () => {
    googleLogout();
    setProfile(null);
  };

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
          // sessionStorage.setItem("accessToken", res.data.accessToken)
          // setAuthToken(res.data.accessToken);
          const data = res.data[0];
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
          navigate("/");
          // window.location.reload(false);
        } else {
          setNotification({ message: 'Invalid Username or Password', type: 'error' });
          setTimeout(() => setNotification(null), 3000);
          // window.location.reload(false);
        }
      })
      .catch((err) => console.log(err));
  };
  return (
    <div className="fullscreen">
      <MyNavbar />
      {notification && <Notification message={notification.message} type={notification.type} onClose={() => setNotification(null)} />}

      <main>
        <div className="text-center mt-4">
          <button onClick={signin} className="btn border">
            <span className="fs-5">
              <i className="bi bi-google"></i>
            </span>
            &nbsp;&nbsp;&nbsp;Continue With Google
          </button>
        </div>
        <div className="d-md-flex justify-content-around m-lg-5 m-md-5 m-4">
          <div className="col-md-4">
            <div className="card bg-white shadow mb-3">
              <div className="card-body">
                <form action="" method="post" onSubmit={handleSubmit}>
                  <h3 className="text-center">Login</h3>
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
      <Scrolltotopbtn/>
    </div>
  );
};

export default Login;
