import React, { useEffect, useMemo, useState } from "react";
import Adminnavbar from "./Adminnavbar";
import axios from "axios";
import Product from "../Product";
import Footer from "../footer";

export default function Usersmanagement() {
  const [data, setData] = useState([]);
  const [expandedSellerId, setExpandedSellerId] = useState(null);
  const [sellerproducts, setSellerproducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // Search term for filtering shops
  const [notificationMessage, setNotificationMessage] = useState("");

  const [statusDetails, setStatusDetails] = useState({
    reason: "",
    shopstatus: "",
    sellerId: null,
    email: "",
    displayName:""
  });

  const handleInputChange = (e) => {
    setStatusDetails((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  useEffect(() => {
    axios
      .get(
        `${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/usermanagement`
      )
      .then((res) => {
        if (res.data !== "Error" && res.data !== "Fail") {
          setData(res.data);
        }
      });
  }, []);

  const sellers = useMemo(() => {
    return Array.from(new Set(data.map((item) => item.seller_id))).map(
      (sellerId) => {
        const sellerData = data.find((item) => item.seller_id === sellerId);
        return {
          seller_id: sellerId,
          displayName: sellerData?.shopname || `${sellerData?.firstname} ${sellerData?.lastname}` || "unnamed Seller",
          currentStatus: sellerData?.product_status,
          email: sellerData?.email,
        };
      }
    );
  }, [data]);
  

  const handleAccordionToggle = (sellerId) => {
    setExpandedSellerId(expandedSellerId === sellerId ? null : sellerId);
    setSellerproducts(data.filter((item) => item.seller_id === sellerId));
  };
  const filteredShops = useMemo(() => {
    return sellers.filter((item) =>
      item.displayName?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [sellers, searchTerm]);
  

  const handlesubmit = (e) => {
    e.preventDefault(); // Prevent default form submission
    axios
      .post(
        `${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/shopstatus`,
        statusDetails
      )
      .then((res) => {
        setNotificationMessage("Store status updated successfully!");
        setTimeout(() => {
          window.location.reload(false);
        }, 3000);
      })
      .catch((err) => {
        console.error("Error posting data:", err);
      });
  };

  return (
    <div>
      <Adminnavbar />
      <div>
        {/* <div className="col-md-2 selleraccordion">
          <Adminmenu />
        </div> */}
        <div className="container">
          <div className="fullscreen2">
          <div className="text-center p-3">
              <h6> <i><span className="" style={{ color: "blue", fontSize: "25px" }}>Admin</span></i> Dashboard</h6>
            </div>
            <div className="m-2 ps-md-4">
              <h1 style={{ fontSize: "28px" }}>STORES</h1>
            </div>
            <main className="mt-4">
              <div className="d-flex justify-content-end">
                <input
                  type="text"
                  className="form-control mb-3 rounded-pill"
                  style={{ height: "50px", width: "25%" }}
                  placeholder="Search shops..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="menumain">
                <div className="accordion" id="shopAccordion">
                  {filteredShops.length > 0 ? (
                    filteredShops.map((seller) => (
                      <div
                        className="accordion-item"
                        key={seller.seller_id}
                        style={{ marginBottom: "10px" }}
                      >
                        <h2
                          className="accordion-header"
                          id={`heading-${seller.seller_id}`}
                        >
                          <button
                            className="accordion-button"
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target={`#collapse-${seller.seller_id}`}
                            aria-expanded={
                              expandedSellerId === seller.seller_id
                            }
                            aria-controls={`collapse-${seller.seller_id}`}
                            onClick={() =>
                              handleAccordionToggle(seller.seller_id)
                            }
                            style={{
                              backgroundColor: "#f8f9fa",
                              border: "1px solid #dee2e6",
                            }} // Custom styling for accordion button
                          >
                            {seller.displayName} - {seller.email}
                          </button>
                        </h2>
                        <div
                          id={`collapse-${seller.seller_id}`}
                          className={`accordion-collapse collapse ${
                            expandedSellerId === seller.seller_id ? "show" : ""
                          }`}
                          aria-labelledby={`heading-${seller.seller_id}`}
                          data-bs-parent="#shopAccordion"
                        >
                          <div className="accordion-body">
                            <div className="text-end me-4">
                              <button
                                className="btn btn-primary"
                                data-bs-toggle="modal"
                                data-bs-target="#exampleModal"
                                onClick={() => {
                                  setStatusDetails((prev) => ({
                                    ...prev,
                                    sellerId: seller.seller_id,
                                    shopstatus: seller.currentStatus,
                                    email: seller.email,
                                    displayName: seller.displayName,
                                  }));
                                }}
                              >
                                Manage Store
                              </button>
                            </div>
                            <div className="product-grid">
                              {sellerproducts.map((sellers, index) => (
                                <Product key={index} product={sellers} />
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <>
                      <div className="text-center">No sellers found.</div>
                    </>
                  )}
                </div>
              </div>
            </main>
            {/* <Adminfooter /> */}
          </div>
        </div>
      </div>
     <Footer/>
      <div
        className="modal fade"
        id="exampleModal"
        tabindex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                Manage Store
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <form onSubmit={handlesubmit}>

            <div className="modal-body">
            {notificationMessage && <div className="alert alert-info">{notificationMessage}</div>}

                <div className="mb-3">
                  <label htmlFor="reason" className="form-label fw-bold">
                    Reason
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="reason"
                    id="reason"
                    value={statusDetails.reason}
                    onChange={handleInputChange}
                    placeholder="Enter Your Reason"
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="producttype" className="form-label fw-bolder">
                    Shop Status
                  </label>
                  <div className="d-flex">
                    <select
                      id="shopstatus"
                      name="shopstatus"
                      className="form-select"
                      // onChange={handleProducttype}
                      value={statusDetails.shopstatus}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select Shop Status</option>
                      <option value="enabled">Enabled</option>
                      <option value="disabled">Disabled</option>
                    </select>
                  </div>
                </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                close
              </button>
              <button
                type="submit"
                className="btn btn-primary"
               
              >
                submit
              </button>
            </div>
             </form>
          </div>
          </div>

      </div>
    </div>
  );
}
