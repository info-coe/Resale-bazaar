import React, { useEffect, useState } from "react";
import MyNavbar from "../navbar";
import Customermenu from "./Customermenu";
import Footer from "../footer";
import Customerbanner from "./Customerbanner";
import axios from "axios";

export default function Changepassword() {

  const [userdetails,setUserDetails]= useState([])
  const [admindetails,setAdminDetails]=useState([])

  const [values,setValues]= useState({
     oldpassword:'',
     newpassword:'',
     confirmpassword:''
  })

  const handlechange = (event) => {
    setValues((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  }
    
  useEffect(() => {
    // Fetch all products
    axios.get(`${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/user`)
      .then((res) => {
        if (res.data !== "Fail" && res.data !== "Error") {
          const userid = sessionStorage.getItem("user-token");
          setUserDetails(res.data.filter((item)=>item.user_id.toString() === userid))
        }
      })
      .catch((error) => {
        console.log("Error fetching all products:", error);
      });
    },[])

    useEffect(() => {
      // Fetch all products
      axios.get(`${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/admin`)
        .then((res) => {
          if (res.data !== "Fail" && res.data !== "Error") {
            setAdminDetails(res.data)
            console.log(res.data)
          }
        })
        .catch((error) => {
          console.log("Error fetching all products:", error);
        });
      },[])
  
      const handleChangePassword = () => {
        // Check the selected login type and set the URL accordingly
        const user = sessionStorage.getItem("token");
        let url = "";
        let updatedUser = null;
        let updatedAdmin = null;
      
        if (user === "user") {
          url = "updateuser";
          updatedUser = {
            email: userdetails[0].email,
            password: values.newpassword
          };
        } else if (user === "admin") {
          url = "updateadmin";
          updatedAdmin = {
            email: admindetails[0].email,
            password: values.newpassword
          };
        }
      
        if (!updatedUser && !updatedAdmin) {
          console.log("Invalid user type.");
          return;
        }
      
        if (user === "user" && values.oldpassword !== userdetails[0].password) {
          alert("Old password is incorrect.");
          return;
        }
      
        if (user === "admin" && values.oldpassword !== admindetails[0].password) {
          alert("Old password is incorrect.");
          return;
        }
      
        if (values.newpassword !== values.confirmpassword) {
          alert("Password and Confirm Passwords do not match.");
          return;
        }
      
        const updatedData = updatedUser ? updatedUser : updatedAdmin;
      
        axios
          .post(`${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/${url}/`, updatedData)
          .then((res) => {
            alert(`${user}Password updated successfully`);
            window.location.reload(false);
          })
          .catch((error) => {
            console.log("Error updating password:", error);
          });
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
          <form>
            <div>
              <div className="d-md-flex col-md-8 col-xs-12 mt-3 mb-3">
                <label htmlFor="oldpassword" className="col-md-4 col-xs-12">
                  Old Password
                </label>
                <div className="d-flex col-md-8">
                  <input
                    type="password"
                    name="oldpassword"
                    id="oldpassword"
                    placeholder="Old Password"
                    value={values.oldpassword}
                    className="form-control"
                    onChange={handlechange}
                  />
                  &nbsp;<span className="text-danger fs-4">*</span>
                </div>
              </div>
              <div className="d-md-flex col-md-8 col-xs-12 mt-3 mb-3">
                <label htmlFor="newpassword" className="col-md-4 col-xs-12">
                  New Password
                </label>
                <div className="d-flex col-md-8">
                  <input
                    type="password"
                    name="newpassword"
                    id="newpassword"
                    placeholder="New Password"
                    value={values.newpassword}
                    className="form-control"
                    onChange={handlechange}
                    required
                  />
                  &nbsp;<span className="text-danger fs-4">*</span>
                </div>
              </div>
              <div className="d-md-flex col-md-8 col-xs-12 mt-3 mb-3">
                <label htmlFor="confirmpassword" className="col-md-4 col-xs-12">
                  Confirm Password
                </label>
                <div className="d-flex col-md-8">
                  <input
                    type="password"
                    name="confirmpassword"
                    id="confirmpassword"
                    placeholder="Confirm Password"
                    value={values.confirmpassword}
                    className="form-control"
                    onChange={handlechange}
                    required
                  />
                  &nbsp;<span className="text-danger fs-4">*</span>
                </div>
              </div>
            </div>
            <button type="button" className="btn btn-success mt-3 mb-5" onClick={handleChangePassword}>
              Change Password
            </button>
          </form>
        </div>
      </div>
      </main>
      <Footer />
    </div>
  );
}
