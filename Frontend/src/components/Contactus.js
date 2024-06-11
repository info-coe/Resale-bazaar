import React, { useState } from "react";
import MyNavbar from "./navbar";
import Menu from "./menu";
import { Link } from "react-router-dom";
import Footer from "./footer";
import axios from "axios";

export default function Contactus() {
  const [values,setValues]= useState({
    name:"",
    email:"",
    enquiry:""
  })
  const handleChange=(e)=>{
    const {name,value}=e.target;

    setValues({
     ...values,
     [name]:value
    })
  }

  const handleSubmit=(e)=>{
    e.preventDefault()
            axios.post(`${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/contact`,values).then((res)=>{
              if(res.data === "Error"){
                alert("Error while adding product. Please try again filling all the fields");
              }else{
                alert("contact information successfully added")
                window.location.reload(false)
              }
            }).catch((err)=>{
              console.log(err)
            })
  } 

  return (
    <div className="fullscreen">
      <MyNavbar />
      <main>
      <img
        src="https://www.lincad.co.uk/wp-content/uploads/2022/08/contact-us-scaled-1.jpg"
        alt="aboutus"
        width="100%"
        height="300px"
        style={{objectFit:"cover",backgroundPosition:'center',backgroundRepeat:'no-repeat'}}
      ></img>
      <div className="d-lg-flex justify-content-around p-2 ps-lg-5 pe-lg-5 mt-3">
        <div className="col-lg-3 col-xs-12 col-md-12">
          <Menu />
        </div>

        <div className="col-xs-12 col-md-12 col-lg-9 ps-3">
          <h1 style={{fontSize:"26px"}}>Contact Us</h1>
          <section>
            <p>
              Thank you for visiting Closet Bargain. For any questions,
              feedback, and/or grievances please email us at &nbsp;
              <Link
                to="mailto:bargain@gmail.com"
                className="text-decoration-none"
              >
                bargain@gmail.com
              </Link>
              with the necessary information.
            </p>
            <p>
              We aim to respond within 24 hours and get back to you with the
              best possible answers and solutions for your queries. To find
              answers at the quickest rate, you can also check our Frequently
              Asked Questions page.
              <br />- Team Bargain
            </p>
          </section>
          <form className="m-3" onSubmit={handleSubmit}>
            <div className="d-md-flex col-md-8 col-xs-12 mt-3 mb-3">
              <label htmlFor="name" className="col-md-2">
                <b>Your Name</b>
              </label>
              <div className="d-flex col-md-8">
                <input
                  type="text"
                  className="col-md-5 form-control"
                  id="name"
                  name="name"
                  placeholder="Enter Your Name"
                  onChange={handleChange}
                  required
                ></input>
                &nbsp;<span className="text-danger fs-4">*</span>
              </div>
            </div>
            <div className="d-md-flex col-md-8 col-xs-12 mt-3 mb-3">
              <label htmlFor="email" className="col-md-2">
                <b>Your Email</b>
              </label>
              <div className="d-flex col-md-8">
                <input
                  type="email"
                  className="form-control col-md-5"
                  id="email"
                  name="email"
                  placeholder="Enter Your Email Address"
                  onChange={handleChange}
                  required
                ></input>
                &nbsp;<span className="text-danger fs-4">*</span>
              </div>
            </div>
            <div className="d-md-flex col-md-8 col-xs-12 mt-3 mb-3">
              <label htmlFor="enquiry" className="col-md-2">
                <b>Enquiry</b>
              </label>
              <div className="d-flex col-md-8">
                <textarea
                  id="enquiry"
                  className="col-md-5 form-control"
                  name="enquiry"
                  rows="5"
                  cols="40"
                  placeholder="Enter Your Enquiry"
                  onChange={handleChange}
                  required
                ></textarea>
                &nbsp;<span className="text-danger fs-4">*</span>
              </div>
            </div>
            <div className="d-md-flex col-md-8 col-xs-12 mt-3 mb-3">
              <div className="col-md-2"></div>
              <button type="submit" className="btn btn-primary col-md-3">
                SUBMIT
              </button>
            </div>
          </form>
        </div>
      </div>
      </main>
      <Footer />
    </div>
  );
}
