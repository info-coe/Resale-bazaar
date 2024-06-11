import React, { useEffect, useState } from "react";
import Customermenu from "./Customermenu";
import MyNavbar from "../navbar";
import Footer from "../footer";
import Customerbanner from "./Customerbanner";
import { useData } from "../CartContext";
import axios from "axios";

export default function Customerinfo() {
  const { user,authToken } = useData();
  const [values, setValues] = useState({
    firstname: "" ,
    lastname: "",
    email: "",
    phone: "",
  });

  console.log(authToken);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/user`,{
        headers:{Authorization:`Bearer ${sessionStorage.getItem("accessToken")}`}
      })
      .then((res) => {
        console.log(res.data);
          res.data.map((item)=>{
          if(parseInt(sessionStorage.getItem("user-token")) === (item.user_id)){
            setValues(prev => ({
              ...prev,
              firstname: (item.firstname === null) ? ("") : (item.firstname),
              lastname: (item.lastname === null) ? ("") : (item.lastname),
              email: (item.email === null) ? ("") : (item.email),
              phone: (item.phone === null) ? ("") : (item.phone),
            }))
          }
          return null;
        })
      })
      .catch((err) => console.log(err));
      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // console.log(values);
  const handleInput = (event) => {
    setValues((prev) => ({
      ...prev,
      [event.target.name]: [event.target.value],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post(`${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/updateuser`, values)
      .then((res) => {
        if (res.data === "Error") {
          alert(
            "Error while updating profile. Please try again filling all the fields"
          );
        } else {
          alert("Profile updated successfully");
          window.location.reload(false);
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="fullscreen">
      <MyNavbar />
      <main>
      <Customerbanner />
      <div className="d-lg-flex justify-content-around p-2 ps-lg-5 pe-lg-5">
        <div className="col-lg-3 col-xs-12 col-md-12 p-lg-4 p-2">
          <Customermenu />
        </div>

        <div className="col-xs-12 col-md-12 col-lg-9 p-lg-4 p-2">
          <form onSubmit={handleSubmit}>
            <span>
              <h1 style={{fontSize:"18px"}}>YOUR PERSONAL DETAILS</h1>
            </span>
            <hr />
            <div>
              <div className="d-md-flex col-md-8 col-xs-12 mt-3 mb-3">
                <label htmlFor="firstname" className="col-md-4 col-xs-12">
                  <b>First Name</b>
                </label>
                <div className="d-flex col-md-8">
                  <input
                    type="text"
                    name="firstname"
                    id="firstname"
                    placeholder="First Name"
                    defaultValue={user.firstname ? user.firstname : ""}
                    className="form-control"
                    onChange={handleInput}
                    required
                  />
                  &nbsp;<span className="text-danger fs-4">*</span>
                </div>
              </div>
              <div className="d-md-flex col-md-8 col-xs-12 mt-3 mb-3">
                <label htmlFor="lastname" className="col-md-4 col-xs-12">
                  <b>Last Name</b>
                </label>
                <div className="d-flex col-md-8">
                  <input
                    type="text"
                    name="lastname"
                    id="lastname"
                    placeholder="Last Name"
                    defaultValue={user.lastname ? user.lastname : ""}
                    className="form-control"
                    onChange={handleInput}
                    required
                  />
                  &nbsp;<span className="text-danger fs-4">*</span>
                </div>
              </div>
              <div className="d-md-flex col-md-8 col-xs-12 mt-3 mb-3">
                <label htmlFor="email" className="col-md-4 col-xs-12">
                  <b> Email</b>
                </label>
                <div className="d-flex col-md-8">
                  <input
                    type="email"
                    name="email"
                    id="email"
                    placeholder="Email"
                    className="form-control"
                    defaultValue={user.email ? user.email : ""}
                    onChange={handleInput}
                    required
                  />
                  &nbsp;<span className="text-danger fs-4">*</span>
                </div>
              </div>
            </div>
            <br />
            <span>
              <h2 style={{fontSize:"18px"}}>YOUR CONTACT INFORMATION</h2>
            </span>
            <hr />
            <div className="d-md-flex col-md-8 col-xs-12 mt-3 mb-3">
              <label htmlFor="phone" className="col-md-4 col-xs-12">
                <b>Phone</b>
              </label>
              <div className="d-flex col-md-8">
                <input
                  type="tel"
                  name="phone"
                  id="phone"
                  placeholder="Mobile Number"
                  defaultValue={user.phone ? user.phone : ""}
                  className="form-control "
                  onChange={handleInput}
                  required
                />
                &nbsp;<span className="text-danger fs-4">*</span>
              </div>
            </div>
            <div className="mt-4 mb-5">
              <button type="submit" className="btn btn-success ps-4 pe-4">
                Save
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
