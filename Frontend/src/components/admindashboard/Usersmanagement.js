import React, { useEffect, useState } from "react";
import Adminnavbar from "./Adminnavbar";
import Adminmenu from "./Adminmenu";
import axios from "axios";
import Product from "../Product";
import Adminfooter from "./Adminfooter";

export default function Usersmanagement() {
  const [data, setData] = useState([]);
  const [expandedSellerId, setExpandedSellerId] = useState(null);
  const [sellerproducts, setSellerproducts] = useState([]);
  const [reason,setReason]=useState('')



 const handleInputChange =(e)=>{
    setReason(e.target.value)
 }

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

  const sellers = Array.from(new Set(data.map((item) => item.seller_id))).map(
    (sellerId) => {
      const sellerData = data.find((item) => item.seller_id === sellerId);
      const shopname = sellerData?.shopname;
      const displayName =
        shopname || `${sellerData?.firstname} ${sellerData?.lastname}`;

      return {
        seller_id: sellerId,
        displayName: displayName || "unnamed Seller",
      };
    }
  );

  const handleAccordionToggle = (sellerId) => {
    setExpandedSellerId(expandedSellerId === sellerId ? null : sellerId);
    setSellerproducts(data.filter((item) => item.seller_id === sellerId));
  };

  return (
    <div>
      <Adminnavbar />
      <div className="d-md-flex">
        <div className="col-md-2 selleraccordion">
          <Adminmenu />
        </div>
        <div className="col-md-10">
          <div className="fullscreen2">
            <main className="container mt-4">
              <h1 className="text-center mb-4" style={{ fontSize: "28px" }}>
                STORES
              </h1>
              <div className="menumain">
                <div className="accordion" id="shopAccordion">
                  {sellers.length > 0 ? (
                    sellers.map((seller) => (
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
                            {seller.displayName}
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
                              >
                                Manage Store
                              </button>
                            </div>
                            <div className="product-grid container">
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
            <Adminfooter />
          </div>
        </div>
      </div>

      <div
        class="modal fade"
        id="exampleModal"
        tabindex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h1 class="modal-title fs-5" id="exampleModalLabel">
                Manage Store
              </h1>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div class="modal-body">
            <div className="mb-3">
                  <label htmlFor="reason" className="form-label fw-bold">
                    Reason
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="reason"
                    value={reason}
                    onChange={handleInputChange}
                    placeholder="Enter Your Reason"
                    required
                  />
                </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary">
                Disabled
              </button>
              <button type="button" class="btn btn-primary">
                Enabled
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
