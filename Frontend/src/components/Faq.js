import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "react-bootstrap";
import MyNavbar from "./navbar";
import Footer from "./footer";

const FAQ = () => {
  const [faqData, setFaqData] = useState([]);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/contact`)
      .then((res) => {
        if (res.data !== "Fail" && res.data !== "Error") {
          setFaqData(res.data);
        }
      })
      .catch((err) => {
        console.log("Error fectching FAQ data", err);
      });
  }, []);

  const CollapsiblePanel = ({ heading, content }) => {
    const [isOpen, setIsOpen] = useState(false);

    const togglePanel = () => {
      setIsOpen(!isOpen);
    };

    return (
      <div
        className={`p-2 mb-3 bg-light shadow w-100 ${isOpen ? "open" : ""}`}
        style={{ cursor: "pointer" }}
      >
        <div
          className="d-flex justify-content-between align-items-center"
          onClick={togglePanel}
        >
          <h6 className="mb-0 text-dark m-2">{heading}</h6>
          <Button className="btn-toggle bg-transparent border-0">
            <span
              className={`fw-bold fs-5 text-${isOpen ? "danger" : "success"}`}
            >
              {isOpen ? "-" : "+"}
            </span>
          </Button>
        </div>
        {isOpen && (
          <div className="mt-3" style={{ cursor: "text" }}>
            {content}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <MyNavbar />
      <img
        src="https://t3.ftcdn.net/jpg/02/97/83/94/360_F_297839409_rZVu6d08jEp0fxDJZYEJSeWwC05I4r7l.jpg"
        alt="aboutus"
        width="100%"
        height="400px"
        style={{objectFit:"cover",backgroundPosition:'center',backgroundRepeat:'no-repeat'}}
      ></img>
      <div className="container mt-lg-5">
        <h1 className="text-center mb-4 fs-4">FREQUENTLY ASKED QUESTIONS</h1>
        <p className="fs-6">
          Keeping Identity of Sellers and Buyers Anonymous is our first
          priority. For all products uploaded on our platforms for Sale, Bargain
          will be Sole BRAND , & in any case Sellers Cannot Contact / Share /
          Send their Personal / Professional (Business) details to Buyers. In
          case Bargain comes to know that Sellers are reaching out / Sending
          their Personal / Professional (Business) details to Buyers, Bargain
          holds the right to deduct & withhold 30% of Payment towards Breach of
          Terms.
        </p>
        {faqData.length > 0 ? (
          faqData.map((item, index) => (
            <CollapsiblePanel key={index} heading={item.enquiry} />
          ))
        ) : (
          <h2 className="text-center fs-6 mb-3">NO FREQUENTLY ASKED QUESTIONS</h2>
        )}
      </div>
      <Footer />
    </>
  );
};

export default FAQ;
