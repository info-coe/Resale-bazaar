import React from "react";
import visa from "../images/visa.webp";
import mastercard from "../images/mastercard-icon.png";
import paypal from "../images/Paypal_logo.png";
import stripe from "../images/stripe.webp";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <>
      <div className="p-1"></div>
      <footer className="footer1" style={{ backgroundColor: "#E5E7E9" }}>
        <div className="d-md-flex flex-wrap justify-content-around p-3">
          <div className="col-md-2">
            <h5 className="mb-4 mt-4">My Account</h5>
            <div className="d-md-flex">
              <div className="me-3">
                <span>
                  <Link
                    to={
                      sessionStorage.getItem("token") !== "admin" &&
                      (sessionStorage.getItem("token") !== null
                        ? "/customerinfo"
                        : "/login")
                    }
                    className="text-decoration-none"
                  >
                    <i className="bi bi-chevron-double-right"></i> My Account
                  </Link>
                </span>{" "}
                <hr style={{ margin: "5px 0" }} />
                <span>
                  <Link
                    to={
                      sessionStorage.getItem("token") !== "admin" &&
                      (sessionStorage.getItem("token") !== null
                        ? "/orders"
                        : "/login")
                    }
                    className="text-decoration-none"
                  >
                    <i className="bi bi-chevron-double-right"></i> Orders
                  </Link>
                </span>{" "}
                <hr style={{ margin: "5px 0" }} />
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <h5 className="mb-4 mt-4 ">Sell</h5>
            <div className="d-md-flex">
              <div className="me-3">
                <span>
                  <Link
                    // to="/addnewproduct"
                    to={
                      sessionStorage.getItem("token") !== "admin" &&
                      (sessionStorage.getItem("token") !== null
                        ? "/addnewproduct"
                        : "/login")
                    }
                    className="text-decoration-none"
                  >
                    <i className="bi bi-chevron-double-right"></i> Sell on The
                    Resale Bazaar
                  </Link>
                </span>{" "}
              </div>
            </div>
          </div>
          <div className="col-md-2">
            <h5 className="mb-4 mt-4 ">Useful Links</h5>
            <div className="d-md-flex">
              <div className="me-3">
                <span>
                  <Link to="/aboutus" className="text-decoration-none">
                    <i className="bi bi-chevron-double-right"></i> About Us
                  </Link>
                </span>{" "}
                <hr style={{ margin: "5px 0" }} />
                <span>
                  <Link to="/contactus" className="text-decoration-none">
                    <i className="bi bi-chevron-double-right"></i> Contact Us
                  </Link>
                </span>{" "}
                <hr style={{ margin: "5px 0" }} />
                <span>
                  <Link to="/faq" className="text-decoration-none">
                    <i className="bi bi-chevron-double-right"></i> FAQ's
                  </Link>
                </span>{" "}
                <hr style={{ margin: "5px 0" }} />
              </div>
            </div>
          </div>

          <div className="col-md-2 ">
            <h5 className="mb-4 mt-4">Follow Us</h5>
            <div>
              <Link
                to="https://www.facebook.com/profile.php?id=61561740383274"
                className="text-primary"
                target="blank"
              >
                <span style={{ cursor: "pointer" }}>
                  <i className="bi bi-facebook fs-3 ms-2 me-2"></i>
                </span>
              </Link>
              <Link
                to="https://www.instagram.com/resalebazaar2024/"
                className="text-danger"
                target="blank"
              >
                <span style={{ cursor: "pointer" }}>
                  <i className="bi bi-instagram fs-3 ms-2 me-2"></i>
                </span>
              </Link>
              <Link
                to="https://www.linkedin.com/in/the-resale-bazaar-57756731a/"
                className="text-info"
                target="blank"
              >
                <span style={{ cursor: "pointer" }}>
                  <i className="bi bi-linkedin fs-3 ms-2 me-2"></i>
                </span>
              </Link>
            </div>
          </div>
          <div className="col-md-2">
            <h5 className="mb-4 mt-4 ">Payment Methods</h5>
            <div className="d-flex flex-wrap">
              <img
                src={visa}
                alt="visa card"
                className="paymentcards"
                style={{ objectFit: "contain" }}
              />
              <img
                src={mastercard}
                alt="visa card"
                className="paymentcards"
                style={{ objectFit: "contain" }}
              />
              <img
                src={paypal}
                alt="visa card"
                className="paymentcards"
                style={{ objectFit: "contain" }}
              />
              <img
                src={stripe}
                alt="Stripe card"
                className="paymentcards"
                style={{ objectFit: "contain" }}
              />
            </div>
          </div>
        </div>
        <div
          className="p-1 ps-2 fw-bold fst-italic"
          style={{ background: "#BFC9CA" }}
        >
          <p>
            Powered by{" "}
            <Link
              to="mailto:theresalebazaar@gmail.com"
              className="text-decoration-none text-dark"
            >
              TheResaleBazaar
            </Link>
          </p>
          <p>
            Copyright 2024{" "}
            {/* <Link
              to="https://infomericainc.com/"
              className="text-decoration-none text-danger"
            > */}
            <span className="text-danger"> Innovative Strides LLC </span>
            {/* </Link>{" "} */}
            All rights reserved.
            <span className="">
              <Link
                to="/termsofuse"
                className="text-decoration-none text-danger"
              >
                {" "}
                Terms of Use{" "}
              </Link>
            </span>
            <span className=""> | </span>
            <span className="text-danger">
              <Link
                to="/privacypolicy"
                className="text-decoration-none text-danger"
              >
                Privacy Policy{" "}
              </Link>
            </span>
          </p>
        </div>
      </footer>
    </>
  );
};
export default Footer;
