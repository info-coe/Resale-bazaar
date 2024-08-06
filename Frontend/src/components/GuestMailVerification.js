import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation, Link } from "react-router-dom";
import MyNavbar from "./navbar";
import Footer from "./footer";
import Scrolltotopbtn from "./Scrolltotopbutton";
import Notification from "./Notification";

export default function GuestMailverification() {
  const [notification, setNotification] = useState(null);
  const location = useLocation();
  const data = location.state;
  const [values, setValues] = useState(data?.user || null);
  const product = [data?.product || null];
  const [errorMessage, setErrorMessage] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60); // Timer state
  const [feedbackMessage, setFeedbackMessage] = useState(""); // Feedback message state

  const navigate = useNavigate();

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
      setShowVerification(false);
      setOtpSent(false);
      setErrorMessage("OTP expired. Please resend the OTP.");
      setFeedbackMessage("");
    }

    return () => clearInterval(timer);
  }, [otpSent, timeLeft]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const verifyOTP = () => {
    const otp = document.querySelector(".otp_num").value;
    axios
      .post(`${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/verify`, {
        email: values?.email || "",
        otp: otp,
      })
      .then((res) => {
        if (res.status === 200) {
          // OTP verified successfully
          setErrorMessage(""); // Clear previous error messages
          setShowSuccess(true);
          setShowVerification(false);
          setFeedbackMessage(""); // Clear feedback message
  
          // Show success message for 2 seconds before redirecting
          setTimeout(() => {
            navigate("/guestshipping", { state: { user: values, product: product } });
          }, 2000);
        }
      })
      .catch((err) => {
        // Handle errors from the backend
        if (err.response?.status === 400) {
          // Assuming 400 status for invalid OTP
          setErrorMessage("Invalid OTP");
        } else if (err.response?.status === 500) {
          // Handle server errors
          setErrorMessage("An error occurred during OTP verification. Please try again.");
        } else {
          // General error message
          setErrorMessage("An unexpected error occurred.");
        }
        setShowSuccess(false);
      });
  };
  

  const sendOTP = () => {
    axios
      .post(`${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/sendotp`, {
        email: values.email,
      })
      .then((res) => {
        if (res.status === 200) {
          setShowVerification(true);
          setErrorMessage("");
          setOtpSent(true);
          setTimeLeft(60); // Reset timer
        }
      })
      .catch((err) => {
        if (err.response?.status === 404) {
          setErrorMessage("Email does not exist");
        } else {
          setErrorMessage("An error occurred. Please try again.");
        }
      });
  };

  return (
    <div className="fullscreen">
      <MyNavbar />
      {notification && <Notification message={notification.message} type={notification.type} onClose={() => setNotification(null)} />}
      <main>
        <div className="d-flex justify-content-center">
          <div className="container m-4">
            <div className="text-end">
              <Link to="/guestcheckout" className="text-decoration-none">
                Back
              </Link>
            </div>
            <h1 className="text-center fs-3 mt-4 mb-3">Email Verification</h1>
            <div className="row d-flex flex-wrap justify-content-center align-items-center">
              <div className="col-auto mt-2 mb-2">
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  value={values?.email || ""}
                  onChange={handleChange}
                  style={{ width: "280px" }}
                  disabled
                />
              </div>
              <div className="col-auto mt-2 mb-2">
                <button className="btn btn-primary" onClick={sendOTP} disabled={otpSent || values === null}>
                  Send OTP
                </button>
              </div>
            </div>
            {showSuccess && (
              <div className=" text-success text-center">
                OTP verified successfully
              </div>
            )}
            {showVerification && (
              <div className="verification mt-4">
                <div className="title text-center">
                  <p>
                    An OTP has been sent to{" "}
                    <span className="emailpartial">
                      ***{values.email.slice(3)}
                    </span>
                  </p>
                  <p><b>Time left:</b> <span style={{ color: timeLeft <= 10 ? "red" : "black" }}>{timeLeft}s</span></p>
                </div>
                <div
                  className="otp-input-fields m-auto d-flex justify-content-around pt-4 pb-4 p-2 shadow rounded"
                  style={{ maxWidth: "300px" }}
                >
                  <input
                    type="number"
                    className="otp_num w-auto text-center rounded border border-success"
                    placeholder="Enter OTP"
                    maxLength={4}
                  />
                  <button onClick={verifyOTP} className="btn btn-primary" disabled={timeLeft === 0}>
                    Verify
                  </button>
                </div>
                {feedbackMessage && (
                  <div className="feedback-message text-warning text-center mt-2">{feedbackMessage}</div>
                )}
              </div>
            )}
            {errorMessage && (
              <div className=" text-danger text-center">{errorMessage}</div>
            )}
          </div>
        </div>
      </main>
      <Footer />
      <Scrolltotopbtn />
    </div>
  );
}
