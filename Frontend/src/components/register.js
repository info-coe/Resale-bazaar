import React, { useState, useEffect } from "react";
import MyNavbar from "./navbar";
import { Link, useNavigate } from "react-router-dom";
import Footer from "./footer";
import axios from "axios";
import CryptoJS from "crypto-js";
import { googleLogout, useGoogleLogin } from "@react-oauth/google";
import { useData } from "./CartContext";
import Scrolltotopbtn from "./Scrolltotopbutton";
import Notification from "./Notification";
import googleicon from "../images/googleicon.png";
import bell from "../images/bellfinal.gif";

const Register = () => {
  const [confirmpassword, setConfirmpassword] = useState("");
  const [notification, setNotification] = useState(null);
  const [values, setValues] = useState({
    firstname: "",
    lastname: "",
    shopname: null,
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
  //eslint-disable-next-line no-unused-vars
  const [showModal, setShowModal] = useState(false); // Modal visibility state
  const [modal, setModal] = useState(false);
  const [isChecked, setIsChecked] = useState(false); // State for checkbox

  const handleInput = (event) => {
    setValues((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
    // console.log(CryptoJS.MD5(event.target.value).toString())
  };
  // console.log(shopNameFilter);
  useEffect(() => {
    axios
      .get(
        `${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/registedusers`
      )
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
  console.log(values);

  const handleSubmit = (event) => {
    console.log(values);
    event.preventDefault();
    const { email, phone, password, shopname } = values;
    console.log(values);
    // if (
    //   shopname !== null &&
    //   shopNameFilter.some((user) => user.shopname === shopname)
    // ) {
    if (
      shopname && // This will check that shopname is not null or an empty string
      shopNameFilter.some((user) => user.shopname === shopname.trim()) // Ensure to trim any extra spaces
    ) {
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
        setShowModal(true);
        // // Show the modal after validation passes
        // if (shopname === null) {
        //   values.password = CryptoJS.MD5(values.password).toString();
        //   navigate("/emailverification", { state: { values } });
        // }
        if (!shopname || shopname.trim() === "") {
          values.password = CryptoJS.MD5(values.password).toString();
          navigate("/emailverification", { state: { values } });
        } else {
          setModal(true);
        }
        // values.password = CryptoJS.MD5(values.password).toString();
        // navigate("/emailverification", { state: { values } });
      }
    }
  };
  // Toggle checkbox state
  const handleCheck = () => {
    setIsChecked(!isChecked);
  };
  // Handle OK button in the modal
  const handleOk = () => {
    // Hash the password and navigate to email verification
    values.password = CryptoJS.MD5(values.password).toString();
    setShowModal(false);
    navigate("/emailverification", { state: { values } });
  };

  // Handle Cancel button in the modal
  const handleCancel = () => {
    setShowModal(false);
    // navigate("/"); // Redirect to home page
    setModal(false);
    setIsChecked(false);
  };

  // Handle top-right close button (just closes the modal)
  const handleCloseModal = () => {
    setModal(false); // Only close the modal, no navigation
    setIsChecked(false);
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
                          setNotification({
                            message:
                              "Unable to login. Please try after some time.",
                            type: "error",
                          });
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
                    setNotification({
                      message: "Unable to login. Please try after some time.",
                      type: "error",
                    });
                    setTimeout(() => setNotification(null), 3000);
                    return;
                  }
                  sessionStorage.removeItem("user-token");
                  sessionStorage.setItem("user-token", token);
                  navigate("/");
                  // window.location.reload(false);
                }
              } else {
                setNotification({
                  message: "Invalid Username or Password",
                  type: "error",
                });
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
        console.log(res);
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
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      <main>
        <div className="registerMaindiv">
          <>
            {modal && values.shopname && (
              <div
                className="modal"
                tabIndex="-1"
                style={{
                  display: "block",
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                }}
              >
                <div className="modal-dialog modal-lg modal-dialog-centered">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title">
                        Seller Account Terms and Conditions
                      </h5>
                      <button
                        type="button"
                        className="btn-close"
                        onClick={handleCloseModal}
                        aria-label="Close"
                      ></button>
                    </div>
                    <div className="modal-body">
                      {/* <p style={{fontSize:"17px"}}>
                      <b>Note:</b> <span style={{backgroundColor:"yellow"}}>we are currently limiting sellers on the site during this trial phase. You are able to sign up now to show interest and admin will be in contact when approvals for new stores begin.</span>
                    </p> */}

                      <ul style={{ fontSize: "14px" }}>
                        <li>
                          Sellers must be at least 18 years old and comply with
                          all legal and regulatory requirements.
                        </li>
                        <li>
                          All registration information must be accurate,
                          complete, and regularly updated.
                        </li>
                        <li>
                          Sellers are responsible for safeguarding their account
                          credentials and activities.
                        </li>
                        <li>
                          Sellers must adhere to all platform policies,
                          including product listing standards and legal
                          obligations.
                        </li>
                        <li>
                          Sellers agree to the platform’s fee structure, payment
                          terms, and applicable transaction charges.
                        </li>
                        <li>
                          The platform reserves the right to suspend or
                          terminate accounts for policy violations or misuse.
                        </li>
                      </ul>
                      <br />
                      <div className="form-check">
                        <input
                          type="checkbox"
                          className="form-check-input border-dark"
                          id="agreeTerms"
                          checked={isChecked}
                          onChange={handleCheck} // Toggle checkbox state on change
                        />
                        <label
                          className="form-check-label"
                          htmlFor="agreeTerms"
                        >
                          By clicking "Agree," sellers acknowledge their
                          acceptance of these terms and conditions, including
                          any future amendments.
                        </label>
                      </div>
                      {/* <div className="">
                     {isChecked?null:'Please Check the Condition'}
                    </div> */}
                    </div>
                    <div className="modal-footer">
                      <button
                        type="button"
                        className="btn btn-secondary"
                        // disabled={(!isChecked)}
                        onClick={handleCancel}
                      >
                        Cancel
                      </button>
                      {/* {isChecked && ( // Show OK button only if checkbox is checked
                      
                    )} */}
                      <button
                        type="button"
                        className="btn btn-primary"
                        disabled={!isChecked}
                        onClick={isChecked ? handleOk : null}
                      >
                        OK
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
         
          <div className='registermmm'>
          <div className="registerleft-side"></div>
          <div className="registerright-side">
          <div className=" p-2   d-flex ">
            <img
              src={bell}
              alt="Notification"
              className="rounded"
              width="60"
              height="60"
              style={{ objectFit: "contain" }}
            />
            <p
              style={{ fontSize: "17px" }}
              className="NoteDiv d-flex gap-2 text-center"
            >
              <span className="">
                Seller sign-ups are limited during our trial phase. Register now
                to show interest, and admin will reach out when approvals
                begin...
              </span>
            </p>
          </div>
          <div className="">
            <div className=" p-4">
              <form method="post" onSubmit={handleSubmit}>
                <div className="mb-5">
                  <h1 className="text-center fs-3 ">Create Account</h1>
                </div>

                <div className="input-field ">
                  <label htmlFor="firstname" className="fixed-label fw-bold">
                    First Name *
                  </label>
                  <input
                    // type="email"
                    // id="email"
                    // name="email"
                    // autoComplete="off"
                    // required
                    // onChange={handleInput}
                    // className=" mb-2"
                    type="text"
                    id="firstname"
                    name="firstname"
                    onChange={handleInput}
                    // placeholder="Enter First Name"
                    pattern="[A-Z][a-z]*\s*\w*"
                    title="First letter should be uppercase, remaining letters are lowercase. No special characters"
                    required
                  />
                </div>
                <div className="input-field ">
                  <label htmlFor="lastname" className="fixed-label fw-bold">
                    Last Name *
                  </label>
                  <input
                    // type="email"
                    // id="email"
                    // name="email"
                    // autoComplete="off"
                    // required
                    // onChange={handleInput}
                    type="text"
                    id="lastname"
                    name="lastname"
                    onChange={handleInput}
                    // placeholder="Enter Last Name"
                    pattern="[A-Z][a-z]*\s*\w*"
                    title="First letter should be uppercase, remaining letters are lowercase. No special characters"
                    required
                  />
                </div>
                <div className="input-field ">
                  <label htmlFor="shopname" className="fixed-label fw-bold">
                    Shop Name (Optional)
                  </label>
                  <input
                    type="text"
                    id="shopname"
                    name="shopname"
                    onChange={handleInput}
                    // placeholder="Enter Shop Name (Optional)"
                    pattern="^[A-Z][a-z]*[\s\w!@#\$%\^&\*\(\)\-\+=\[\]\{\};:',.<>/?]*$"
                    title="First letter should be uppercase, remaining letters are lowercase. No special characters"
                  />
                </div>
                <div className="input-field ">
                  <label htmlFor="email" className="fixed-label fw-bold">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    onChange={handleInput}
                    // placeholder="Enter Email"
                    required
                  />
                </div>
                <div className="input-field ">
                  <label htmlFor="phone" className="fixed-label fw-bold">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    onChange={handleInput}
                    // placeholder="Enter Phone Number"
                    pattern="[0-9]{10}"
                    title="10 digit numeric value only"
                    minLength={10}
                    maxLength={10}
                    required
                  />
                </div>
                <div className="input-field  passwordgroup">
                  <label htmlFor="password" className="fixed-label fw-bold">
                    Password *
                  </label>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    onChange={handleInput}
                    // placeholder="Enter Password"
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
                    <i
                      className={`bi ${
                        showPassword ? "bi-eye-slash" : "bi-eye"
                      }`}
                    ></i>
                  </button>
                </div>
                <div className="input-field  passwordgroup">
                  <label htmlFor="phone" className="fixed-label fw-bold">
                    Confirm Password *
                  </label>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmpassword"
                    name="confirmpassword"
                    onChange={(e) => setConfirmpassword(e.currentTarget.value)}
                    // placeholder="Enter Confirm Password"
                    required
                  />
                  <button
                    type="button"
                    id="btnToggle"
                    className="toggle12"
                    onClick={handleToggleConfirmPassword}
                  >
                    <i
                      className={`bi ${
                        showConfirmPassword ? "bi-eye-slash" : "bi-eye"
                      }`}
                    ></i>
                  </button>
                </div>

                {error && (
                  <div className="text-danger text-center mb-2">{error}</div>
                )}
                <p style={{ fontSize: "14px" }}>
                  By Registering, I agree to the{" "}
                  <Link
                    to="/termsofuse"
                    className="text-decoration-none fw-bold"
                  >
                    Terms of Use
                  </Link>{" "}
                  & <Link to="/privacypolicy" className="text-decoration-none fw-bold">Privacy Policy</Link>
                  .
                </p>
                <div className="">
                  <div className="  mb-4">
                    <button
                      type="submit"
                      className="btn btn-primary register-next-step-button mt-3 w-100"
                    >
                      Register
                    </button>
                  </div>
                </div>
              </form>
              <h6 className="text-end">Already a member? <Link className="text-decoration-none " to="/login">Login </Link></h6>
            </div>
           
            <div className="d-flex justify-content-around p-2">
              <div
                style={{ borderBottom: "1px solid gray", width: "45%" }}
              ></div>
              <p className="text-center" style={{ marginBottom: "-10px" }}>
                or
              </p>
              <div
                style={{ borderBottom: "1px solid gray", width: "45%" }}
              ></div>
            </div>
            <div className="mt-3  mb-5 p-2 ">
              <button onClick={signin} className="btn shadow w-100 p-2">
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
        </div>
      </main>
      <Footer />
      <Scrolltotopbtn />
    </div>
  );
};

export default Register;
