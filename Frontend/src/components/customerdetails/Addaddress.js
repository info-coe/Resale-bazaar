import React from "react";
import MyNavbar from "../navbar";
import Customermenu from "./Customermenu";
import Footer from "../footer";
import Customerbanner from "./Customerbanner";

export default function Addaddress() {
  return (
    <div className="fullscreen">
      <MyNavbar />
      <main>
        <Customerbanner />
        <div className="d-lg-flex justify-content-around p-2 ps-lg-5 pe-lg-5">
          <div className="col-lg-3 col-xs-12 col-md-12 p-lg-4 p-2">
            <Customermenu />
          </div>

          <div className="col-xs-12 col-md-12 col-lg-9 p-md-4 p-2">
            <form>
              <div className="d-md-flex col-lg-10 col-xs-12">
                <div className="d-md-flex  col-md-5 col-xs-12 mt-3 mb-3">
                  <label htmlFor="firstname" className="col-md-4 col-xs-12">
                    <b>First Name </b>
                  </label>
                  <div className="d-flex col-md-8">
                    <input
                      className="form-control"
                      type="text"
                      name="firstname"
                      id="firstname"
                      placeholder="First Name"
                      required
                    />
                    &nbsp;<span className="text-danger fs-4">*</span>
                  </div>
                </div>
                <div className="col-1"></div>
                <div className="d-md-flex col-md-5 col-xs-12 mt-3 mb-3">
                  <label htmlFor="lastname" className="col-md-4 col-xs-12">
                    <b>Last Name</b>
                  </label>
                  <div className="d-flex col-md-8">
                    <input
                      className="form-control"
                      type="text"
                      name="lastname"
                      id="lastname"
                      placeholder="Last Name"
                      required
                    />
                    &nbsp;<span className="text-danger fs-4">*</span>
                  </div>
                </div>
              </div>
              <div className="d-md-flex col-lg-10 col-xs-12">
                <div className="d-md-flex col-md-5 col-xs-12 mt-3 mb-3">
                  <label htmlFor="email" className="col-md-4 col-xs-12">
                    <b>Email</b>
                  </label>
                  <div className="d-flex col-md-8">
                    <input
                      className="form-control"
                      type="email"
                      name="email"
                      id="email"
                      placeholder="example@gmail.com"
                      required
                    />
                    &nbsp;<span className="text-danger fs-4">*</span>
                  </div>
                </div>
                <div className="col-1"></div>
                <div className="d-md-flex col-md-5 col-xs-12 mt-3 mb-3">
                  <label htmlFor="country" className="col-md-4 col-xs-12">
                    <b>Country</b>
                  </label>
                  <div className="d-flex col-md-8">
                    <select id="country" name="country" className="form-select">
                      <option value="select">Select Country</option>
                      <option value="india">INDIA</option>
                    </select>
                    &nbsp;<span className="text-danger fs-4">*</span>
                  </div>
                </div>
              </div>
              <div className="d-md-flex col-lg-10 col-xs-12">
                <div className="d-md-flex col-md-5 col-xs-12 mt-3 mb-3">
                  <label htmlFor="state" className="col-md-4 col-xs-12">
                    <b>State</b>
                  </label>
                  <div className="d-flex col-md-8">
                    <select id="state" name="state" className="form-select">
                      <option value="">Select State</option>
                    </select>
                    &nbsp;<span className="text-danger fs-4">*</span>
                  </div>
                </div>
                <div className="col-1"></div>
                <div className="d-md-flex col-md-5 col-xs-12 mt-3 mb-3">
                  <label htmlFor="city" className="col-md-4 col-xs-12">
                    <b>City</b>
                  </label>
                  <div className="d-flex col-md-8">
                    <input
                      className="form-control"
                      type="text"
                      name="city"
                      id="city"
                      placeholder="City"
                      required
                    />
                    &nbsp;<span className="text-danger fs-4">*</span>
                  </div>
                </div>
              </div>
              <div className="d-md-flex col-lg-10 col-xs-12">
                <div className="d-md-flex col-md-5 col-xs-12 mt-3 mb-3">
                  <label htmlFor="address1" className="col-md-4 col-xs-12">
                    <b>Address 1</b>
                  </label>
                  <div className="d-flex col-md-8">
                    <input
                      className="form-control"
                      type="text"
                      name="address1"
                      id="address1"
                      placeholder="House/Flat no"
                      required
                    />
                    &nbsp;<span className="text-danger fs-4">*</span>
                  </div>
                </div>
                <div className="col-1"></div>
                <div className="d-md-flex col-md-5 col-xs-12 mt-3 mb-3">
                  <label htmlFor="address2" className="col-md-4 col-xs-12">
                    <b>Address 2</b>
                  </label>
                  <div className="d-flex col-md-8">
                    <input
                      className="form-control"
                      type="text"
                      name="address2"
                      id="address2"
                      placeholder="Street, Landmark etc."
                    />
                    &nbsp;<span className="text-white fs-4">*</span>
                  </div>
                </div>
              </div>
              <div className="d-md-flex col-lg-10 col-xs-12">
                <div className="d-md-flex col-md-5 col-xs-12 mt-3 mb-3">
                  <label htmlFor="pincode" className="col-md-4 col-xs-12">
                    <b>Pin Code</b>
                  </label>
                  <div className="d-flex col-md-8">
                    <input
                      className="form-control"
                      type="number"
                      minLength={6}
                      maxLength={6}
                      name="pincode"
                      id="pincode"
                      placeholder="123456"
                      required
                    />
                    &nbsp;<span className="text-danger fs-4">*</span>
                  </div>
                </div>
                <div className="col-1"></div>
                <div className="d-md-flex col-md-5 col-xs-12 mt-3 mb-3">
                  <label htmlFor="phone" className="col-md-4 col-xs-12">
                    <b>Phone Number</b>
                  </label>
                  <div className="d-flex col-md-8">
                    <input
                      className="form-control"
                      type="tel"
                      pattern="[0-9]{10}"
                      title="Enter phone number in format: xxxxxxxxxx"
                      name="phone"
                      id="phone"
                      placeholder="mobile number"
                      required
                    />
                    &nbsp;<span className="text-danger fs-4">*</span>
                  </div>
                </div>
              </div>
              <div className="mb-5">
                <button className="btn btn-success ps-4 pe-4">Save</button>
              </div>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
