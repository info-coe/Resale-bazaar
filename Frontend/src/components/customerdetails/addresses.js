import React,{ useEffect, useState } from "react";
import MyNavbar from "../navbar";
import Customermenu from "./Customermenu";
// import { Link } from "react-router-dom";
import Footer from "../footer";
import Customerbanner from "./Customerbanner";
import axios from "axios";


export default function Addresses() {
  const [address,setAddress]=useState([])
  useEffect(() => {
    // Fetch all products
    axios.get(`${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/saveShippingAddress`)
      .then((res) => {
        if (res.data !== "Fail" && res.data !== "Error") {
          const userid = sessionStorage.getItem("user-token");
          setAddress(res.data.filter((item)=>item.user_id === parseInt(userid)))
        }
      })
      .catch((error) => {
        console.log("Error fetching all products:", error);
      });
    },[])

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

          {address.length > 0 ? (
            <div className="table-responsive">
          <table className="table table-hover">
            <thead>
              <tr>
                 <th>FirstName</th>
                 <th>LastName</th>
                 <th>email</th>
                 <th>Country</th>
                 <th>State</th>
                 <th>City</th>
                 <th>Address1</th>
                 <th>Pincode</th>
              </tr>
            </thead>
            <tbody style={{overflowY:"auto"}}>
              {address.map((item)=>(
                 <tr>
                  <td>{item.firstname}</td>
                  <td>{item.lastname}</td>
                  <td>{item.email}</td>
                  <td>{item.country}</td>
                  <td>{item.state}</td>
                  <td>{item.city}</td>
                  <td>{item.address1}</td>
                  <td>{item.pincode}</td>
                 </tr>
              ))}
            </tbody>
          </table>
          </div>
          ):(
            <p className="fs-6">No Addresses</p>
            )}
        </div>
      </div>
      </main>
      <Footer />
    </div>
  );
}
