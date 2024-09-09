import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import Footer from "./footer";
import MyNavbar from "./navbar";
import Scrolltotopbtn from "./Scrolltotopbutton";
import Notification from "./Notification";
import CryptoJS from "crypto-js";


export default function Forgotpassword() {
  const [values, setValues] = useState({
    
    email: "",
    password: ""
  });
  const [partialemail, setPartialemail] = useState("");
  const [errormsg, setErrormsg] = useState("");
  const [isVerification, setIsVerification] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [usermail, setUsermail] = useState("");
  const [notification, setNotification] = useState(null);
  const [otpSent, setOtpSent] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const navigate = useNavigate();

  var regex = new RegExp("[a-zA-Z0-9]+@[a-z]+.[a-z]{2,3}");

  useEffect(() => {
    let timer;
    if (otpSent && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);

      if (timeLeft <= 10) {
        setFeedbackMessage("OTP will expire soon. Please verify.");
      }
    } else if (timeLeft === 0) {
      setIsVerification(false);
      setOtpSent(false);
      setErrormsg("OTP expired. Please resend the OTP.");
      setFeedbackMessage("");
    }

    return () => clearInterval(timer);
  }, [otpSent, timeLeft]);

  function verifyOTP() {
    const otp_check = document.querySelector(".otp_num").value;
    axios
      .post(`${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/verify`, {
        email: usermail,
        otp: otp_check,
      })
      .then((res) => {
        if (res.status === 200) {
          setIsVerification(false);
          setIsSuccess(true);
          setIsError(false);
          setFeedbackMessage("");
        } else {
          setIsError(true);
          setErrormsg("Invalid OTP");
          setIsSuccess(false);
        }
      })
      .catch(() => {
        setIsError(true);
        setErrormsg("Invalid OTP");
        setIsSuccess(false);
      });
  }

  function sendOTP() {
    if (regex.test(usermail)) {
      axios
        .post(`${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/sendotp`, {
          email: usermail,
        })
        .then((res) => {
          if (res.status === 200) {
            setIsVerification(true);
            setOtpSent(true);
            setPartialemail("***" + usermail.slice(3));
            setTimeLeft(60);
            setErrormsg("");
          } else {
            setIsError(true);
            setErrormsg("Email does not exist.");
            setIsSuccess(false);
          }
        })
        .catch(() => {
          setIsError(true);
          setErrormsg("Email does not exist.");
          setIsSuccess(false);
        });
    } else {
      setIsError(true);
      setErrormsg("Please enter a valid email address!");
      setIsSuccess(false);
    }
  }

  const handleChange = (e) => {
    setValues((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

    if (e.target.name === 'email') {
      setUsermail(e.target.value);
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    const pass = values.password;
    const cpass = document.getElementById("cpassword").value;

    if (!pass || !cpass) {
      setNotification({ message: 'Please fill in both password fields.', type: 'error' });
      setTimeout(() => setNotification(null), 3000); 
      return;
    }

    if (pass === cpass) {
      values.password = CryptoJS.MD5(values.password).toString();
      axios
        .post(`${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/updateuser`, values)
        .then((res) => {
          if (res.data === "Error") {
            setNotification({ message: 'Password update failed', type: 'error' });
            setTimeout(() => setNotification(null), 3000); 
          } else {
            setNotification({ message: 'Password updated successfully', type: 'success' });
            setTimeout(() => navigate("/login"), 3000);
          }
        })
        .catch(() => {
          setNotification({ message: 'An error occurred during password update', type: 'error' });
          setTimeout(() => setNotification(null), 3000); 
        });
    } else {
      setNotification({ message: 'Passwords did not match', type: 'error' });
      setTimeout(() => setNotification(null), 3000); 
    }
  };

  return (
    <div className="fullscreen">
      <MyNavbar />
      {notification && <Notification message={notification.message} type={notification.type} onClose={() => setNotification(null)} />}

      <main>
        <div className="d-flex justify-content-center">
          <div className="container m-4">
            <div className="text-end">
              <Link to="/login" className="text-decoration-none">Back to login</Link>
            </div>
            <h1 className="text-primary text-center fs-3">Reset Password</h1>
            <div className="row d-flex justify-content-center align-items-center">
              <div className="col-auto">
                <input
                  type="email"
                  name="email"
                  placeholder="Your Email ID"
                  className="form-control"
                  id="getEmail"
                  onChange={handleChange}
                  disabled={otpSent || values === null}
                />
              </div>
              <div className="col-auto">
                <button className="btn btn-primary" onClick={sendOTP} disabled={otpSent || values === null}>
                  Send OTP
                </button>
              </div>
            </div>
            {
              isSuccess && (
                <div className="text-success text-center">
                  OTP verified
                  <div className="m-2">
                    <input
                      type="password"
                      name="password"
                      className="w-auto border rounded p-1 m-2"
                      id="password"
                      onChange={handleChange}
                      placeholder="New Password"
                      required
                    />
                    <input
                      type="password"
                      name="cpassword"
                      className="w-auto border rounded p-1 m-2"
                      id="cpassword"
                      placeholder="Confirm New Password"
                      required
                    />
                    <button
                      type="submit"
                      className="btn btn-primary m-2"
                      onClick={handleSubmit}
                    >
                      Update
                    </button>
                  </div>
                </div>
              )
            }
            {
              isVerification && (
                <div className="verification mt-4">
                  <div className="title text-center">
                    <p>An OTP has been sent to {partialemail}</p>
                    <p>
                      <b>Time left:</b> <span style={{ color: timeLeft <= 10 ? "red" : "black" }}>{timeLeft}s</span>
                    </p>
                  </div>
                  <div
                    className="otp-input-fields m-auto d-flex justify-content-around p-4 shadow rounded"
                    style={{ maxWidth: "320px" }}
                  >
                    <input
                      type="number"
                      className="otp_num w-auto text-center rounded border border-success"
                      maxLength={4}
                      placeholder="Enter OTP"
                    />
                    <button onClick={verifyOTP} className="btn btn-primary">
                      Verify
                    </button>
                  </div>
                  {feedbackMessage && (
                    <div className="feedback-message text-warning text-center mt-2">{feedbackMessage}</div>
                  )}
                </div>
              )
            }
            {
              isError && (
                <div className="text-danger text-center">{errormsg}</div>
              )
            }
          </div>
        </div>
      </main>
      <Footer />
      <Scrolltotopbtn />
    </div>
  )
}
