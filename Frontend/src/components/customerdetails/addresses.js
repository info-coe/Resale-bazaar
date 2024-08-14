import React, { useEffect, useState } from "react";
import axios from "axios";
import MyNavbar from "../navbar";
import Customermenu from "./Customermenu";
import Footer from "../footer";
import Customerbanner from "./Customerbanner";
import Scrolltotopbtn from "../Scrolltotopbutton";
import Notification from "../Notification";

export default function Addresses() {
  const [addresses, setAddresses] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [notification, setNotification] = useState(null);
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    country: "",
    state: "",
    city: "",
    address1: "",
    pincode: "",
  });

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/saveShippingAddress`
        );
        if (res.data !== "Fail" && res.data !== "Error") {
          const userid = sessionStorage.getItem("user-token");
          setAddresses(
            res.data.filter((item) => item.user_id === parseInt(userid))
          );
        }
      } catch (error) {
        console.log("Error fetching addresses:", error);
      }
    };

    fetchAddresses();
  }, [addresses]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleEdit = (address) => {
    setEditingId(address.id);
    setFormData(address);
  };

  const handleDelete = async (addressId) => {
    try {
      await axios.delete(
        `${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/saveShippingAddress/${addressId}`
      );
      setAddresses(addresses.filter((item) => item.id !== addressId));
      setNotification({ message: 'Address deleted successfully', type: 'success' });
      setTimeout(() => setNotification(null), 3000);
    } catch (error) {
      console.error("Error deleting address:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/saveShippingAddress/${editingId}`,
        formData
      );
      setAddresses(
        addresses.map((item) =>
          item.id === editingId ? response.data : item
        )
      );
      setEditingId(null);
      setNotification({ message: 'Address updated successfully', type: 'success' });
      setTimeout(() => setNotification(null), 3000);
    } catch (error) {
      console.error("Error updating address:", error);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
  };

  return (
    <div className="fullscreen">
      <MyNavbar />
      {notification && <Notification message={notification.message} type={notification.type} onClose={() => setNotification(null)} />}
      <main>
        <Customerbanner />
        <div className="d-lg-flex justify-content-around p-2 ps-lg-5 pe-lg-5">
          <div className="col-lg-3 col-xs-12 col-md-12 p-lg-4 p-2">
            <Customermenu />
          </div>

          <div className="col-xs-12 col-md-12 col-lg-9 p-lg-4 p-2">
            {addresses.length > 0 ? (
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>FirstName</th>
                      <th>LastName</th>
                      <th>Country</th>
                      <th>State</th>
                      <th>City</th>
                      <th>Address1</th>
                      <th>Pincode</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {addresses.map((item) => (
                      <tr key={item.id}>
                        {editingId === item.id ? (
                          <>
                            <td>
                              <input
                                type="text"
                                name="firstname"
                                value={formData.firstname}
                                onChange={handleInputChange}
                                className="form-control"
                                required
                              />
                            </td>
                            <td>
                              <input
                                type="text"
                                name="lastname"
                                value={formData.lastname}
                                onChange={handleInputChange}
                                className="form-control"
                                required
                              />
                            </td>
                            <td>
                              <input
                                type="text"
                                name="country"
                                value={formData.country}
                                onChange={handleInputChange}
                                className="form-control"
                                required
                              />
                            </td>
                            <td>
                              <input
                                type="text"
                                name="state"
                                value={formData.state}
                                onChange={handleInputChange}
                                className="form-control"
                                required
                              />
                            </td>
                            <td>
                              <input
                                type="text"
                                name="city"
                                value={formData.city}
                                onChange={handleInputChange}
                                className="form-control"
                                required
                              />
                            </td>
                            <td>
                              <input
                                type="text"
                                name="address1"
                                value={formData.address1}
                                onChange={handleInputChange}
                                className="form-control"
                                required
                              />
                            </td>
                            <td>
                              <input
                                type="text"
                                name="pincode"
                                value={formData.pincode}
                                onChange={handleInputChange}
                                className="form-control"
                                required
                              />
                            </td>
                            <td>
                              <button
                                className="btn btn-success btn-sm me-2"
                                onClick={handleSubmit}
                              >
                                Save
                              </button>
                              <button
                                className="btn btn-secondary btn-sm"
                                onClick={handleCancel}
                              >
                                Cancel
                              </button>
                            </td>
                          </>
                        ) : (
                          <>
                            <td>{item.firstname}</td>
                            <td>{item.lastname}</td>
                            <td>{item.country}</td>
                            <td>{item.state}</td>
                            <td>{item.city}</td>
                            <td>{item.address1}</td>
                            <td>{item.pincode}</td>
                            <td>
                              <button
                                className="btn btn-primary btn-sm me-2"
                                onClick={() => handleEdit(item)}
                              >
                                Edit
                              </button>
                              <button
                                className="btn btn-danger btn-sm"
                                onClick={() => handleDelete(item.id)}
                              >
                                Delete
                              </button>
                            </td>
                          </>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="fs-6">No Addresses</p>
            )}
          </div>
        </div>
      </main>
      <Footer />
      <Scrolltotopbtn/>
    </div>
  );
}
