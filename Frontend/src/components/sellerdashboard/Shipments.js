import React, { useState, useEffect } from "react";
import Sellernavbar from "./Sellernavbar";
import Sellermenu from "./Sellermenu";
import Sellerfooter from "./Sellerfooter";
import Sellerpagination from "./sellerpagination";
import axios from "axios";
import Scrolltotopbtn from "../Scrolltotopbutton";

export default function Shipments() {
  // eslint-disable-next-line no-unused-vars
  const [products, setProducts] = useState([]);
  const [pageSize, setPageSize] = useState(25);
  const [currentPage, setCurrentPage] = useState(1);
  // eslint-disable-next-line no-unused-vars
  const [viewRowIndex, setViewRowIndex] = useState(null);
  const [shippingProducts, setShippingProducts] = useState([]);
  const [checkedShipments, setCheckedShipments] = useState([]); // List of checked shipments and their statuses
  const [canShip, setCanShip] = useState(false); // To enable the "shipped" button
  const [canDeliver, setCanDeliver] = useState(false); // To enable the "delivered" button

  useEffect(() => {
    setCurrentPage(1);
    setViewRowIndex(null);
  }, [pageSize]);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/shipmentjoin`)
      .then((result) => {
        setShippingProducts(
          result.data.filter(
            (item) => item.seller_id.toString() === sessionStorage.getItem("user-token")
          )
        );
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    // Determine if the shipment can be shipped or delivered based on its status
    const shipment = shippingProducts.find((item) =>
      checkedShipments.includes(item.shipment_id)
    );
    if (shipment) {
      setCanShip(!shipment.shipped_date);
      setCanDeliver(shipment.shipped_date && !shipment.delivered_date);
    }
  }, [checkedShipments, shippingProducts]);

  const handleOrder = (actionType) => {
    if (checkedShipments.length === 0) {
      console.log("No shipment selected.");
      return;
    }

    const updateRequests = checkedShipments.map((shipmentId) => {
      let updateData = { shipment_id: shipmentId };

      if (actionType === "delivered") {
        updateData.delivered_date = new Date().toLocaleDateString("fr-CA");
      } else if (actionType === "shipped") {
        updateData.shipped_date = new Date().toLocaleDateString("fr-CA");
      }

      return axios.post(`${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/updateOrder`, updateData);
    });

    Promise.all(updateRequests)
      .then(() => {
        console.log("Orders updated successfully");
        // Update the state or reload data as needed
        setShippingProducts((prev) =>
          prev.map((item) =>
            checkedShipments.includes(item.shipment_id)
              ? { ...item, ...(actionType === "delivered" ? { delivered_date: new Date().toLocaleDateString("fr-CA") } : { shipped_date: new Date().toLocaleDateString("fr-CA") }) }
              : item
          )
        );
        setCheckedShipments([]); // Clear checked shipments
        setCanShip(false); // Reset buttons
        setCanDeliver(false); // Reset buttons
      })
      .catch((err) => console.log("Error updating orders:", err));
  };


  const handleChecked = (e) => {
    const shipmentId = e.target.name;
    const isChecked = e.target.checked;

    if (isChecked) {
      setCheckedShipments((prev) => [...prev, shipmentId]);
    } else {
      setCheckedShipments((prev) => prev.filter((id) => id !== shipmentId));
    }
  };

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const tableData = shippingProducts.slice(startIndex, endIndex);

  return (
    <div className="">
      <Sellernavbar />
      <div className="d-md-flex">
        <div className="col-md-2 selleraccordion">
          <Sellermenu />
        </div>
        <div className="col-md-10">
          <div className="fullscreen2">
            <main>
              <div className="d-flex justify-content-between m-2">
                <h1 style={{ fontSize: "28px" }}>Shipments</h1>
                <div className="d-flex gap-2">
                  <button
                    className="btn btn-info"
                    onClick={() => handleOrder("shipped")}
                    disabled={!canShip || checkedShipments.length === 0}
                  >
                    <i className="bi bi-truck"></i> Set as shipped(selected)
                  </button>
                  <button
                    className="btn btn-success"
                    onClick={() => handleOrder("delivered")}
                    disabled={!canDeliver || checkedShipments.length === 0}
                  >
                    <i className="bi bi-check2-circle"></i> Set as delivered(selected)
                  </button>
                </div>
              </div>

              <div className="border m-3 rounded">
                <div className="table-responsive p-3">
                  <table
                    id="dynamic-table"
                    className="table table-striped table-bordered table-hover dataTable no-footer"
                    role="grid"
                    aria-describedby="dynamic-table_info"
                  >
                    <thead className="">
                      <tr role="row">
                        <th className="sorting p-3" rowSpan="1" colSpan="1">
                          <label className="pos-rel">
                            <span className="lbl"></span>
                          </label>
                        </th>
                        <th className="sorting p-3" tabIndex="0" aria-controls="dynamic-table" rowSpan="1" colSpan="1">
                          Picture
                        </th>
                        <th className="sorting p-3" tabIndex="0" aria-controls="dynamic-table" rowSpan="1" colSpan="1">
                          Shipment#
                        </th>
                        <th className="sorting p-3" tabIndex="0" aria-controls="dynamic-table" rowSpan="1" colSpan="1">
                          Order#
                        </th>
                        <th className="hidden-480 sorting p-3" tabIndex="0" aria-controls="dynamic-table" rowSpan="1" colSpan="1">
                          Date Ordered
                        </th>
                        <th className="hidden-480 sorting p-3" tabIndex="0" aria-controls="dynamic-table" rowSpan="1" colSpan="1">
                          Date Shipped
                        </th>
                        <th className="hidden-480 sorting p-3" rowSpan="1" colSpan="1">
                          Date Delivered
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {tableData.map((item, index) => (
                        <tr role="row" key={index} className="">
                          <th className="sorting p-3" rowSpan="1" colSpan="1">
                            <label className="pos-rel">
                              <input
                                type="checkbox"
                                name={item.shipment_id}
                                className="ace"
                                checked={checkedShipments.includes(item.shipment_id)}
                                onChange={handleChecked}
                              />
                              <span className="lbl"></span>
                            </label>
                          </th>
                          <td style={{ width: "100px", height: "100px" }}>
                            <img
                              src={`${JSON.parse(item.image)[0]}`}
                              alt="Shipment product"
                              style={{ maxWidth: "100%", height: "100px", objectFit: "contain" }}
                            />
                          </td>
                          <td>{item.shipment_id}</td>
                          <td>{item.order_id}</td>
                          <td>{item.ordered_date && item.ordered_date.slice(0, 10)}</td>
                          <td>{item.shipped_date && item.shipped_date.slice(0, 10)}</td>
                          <td>{item.delivered_date && item.delivered_date.slice(0, 10)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <Sellerpagination
                  stateData={products}
                  pageSize={pageSize}
                  setPageSize={setPageSize}
                  setViewRowIndex={setViewRowIndex}
                  currentPage={currentPage}
                  setCurrentPage={setCurrentPage}
                />
              </div>
            </main>
            <Sellerfooter />
            <Scrolltotopbtn />
          </div>
        </div>
      </div>
    </div>
  );
}
