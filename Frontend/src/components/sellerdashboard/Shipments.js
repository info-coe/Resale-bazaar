import React, { useState, useEffect } from "react";
import Sellernavbar from "./Sellernavbar";
import Sellermenu from "./Sellermenu";
import Sellerfooter from "./Sellerfooter";
import Sellerpagination from "./sellerpagination";
import axios from "axios";

export default function Shipments() {
  // eslint-disable-next-line no-unused-vars
  const [products, setProducts] = useState([]);
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredProducts, setFilteredProducts] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [viewRowIndex, setViewRowIndex] = useState(null);
  const [shippingProducts, setShippingProducts] = useState([]);
  const [orderStatus, setOrderStatus] = useState("");

  useEffect(() => {
    setCurrentPage(1);
    setViewRowIndex(null);
  }, [pageSize]);

  useEffect(() => {
        axios
          .get(
            `${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/shipmentjoin`
          )
          .then((result) => {
            console.log(result.data)
            setShippingProducts(
              result.data.filter(
                (item) =>
                  item.seller_id.toString() ===
                  sessionStorage.getItem("user-token")
              )
            );
          })
          .catch((err) => console.log(err));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // const allSellerProducts = Array.isArray(filteredProducts)
  //   ? filteredProducts.filter((product) =>
  //       shippingProducts.some((order) => order.id === product.product_id)
  //     )
  //   : [];


  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const tableData = shippingProducts.slice(startIndex, endIndex);
  // console.log(tableData)

  const handleOrder = (actionType) => {
    if (!orderStatus) {
      console.log("No shipment selected.");
      return;
    }

    let updateData = {
      shipment_id: orderStatus,
    };

    if (actionType === "delivered") {
      updateData.delivered_date = new Date().toLocaleDateString("fr-CA");
    } else if (actionType === "shipped") {
      updateData.shipped_date = new Date().toLocaleDateString("fr-CA");
    }

    axios
      .post(
        `${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/updateOrder`,
        updateData
      )
      .then((res) => {
        console.log("Order updated successfully:", res.data);
        window.location.reload(false);
      })
      .catch((err) => console.log("Error updating order:", err));
  };
  const [isChecked, setIsChecked] = useState(false); // State to track checkbox checked status
  const handleChecked = (e) => {
    setIsChecked(e.target.checked);
  };

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
                  {/* <Link to="/addnewproduct"> */}
                  <button
                    className="btn btn-info"
                    onClick={() => handleOrder("shipped")}
                    disabled={!isChecked}
                  >
                    <i className="bi bi-truck"></i> Set as shipped(selected)
                  </button>
                  {/* </Link> */}
                  <button
                    className="btn btn-success"
                    onClick={() => handleOrder("delivered")}
                    disabled={!isChecked}
                  >
                    <i className="bi bi-check2-circle"></i> Set as
                    delivered(selected)
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
                            {/* <input
                              type="checkbox"
                              name="allcheckboxes"
                              className="ace"
                              onChange={handleChecked}
                            /> */}
                            <span className="lbl"></span>
                          </label>
                        </th>
                        <th
                          className="sorting p-3"
                          tabIndex="0"
                          aria-controls="dynamic-table"
                          rowSpan="1"
                          colSpan="1"
                          aria-label="ID: activate to sort column ascending"
                        >
                          Picture
                        </th>
                        <th
                          className="sorting p-3"
                          tabIndex="0"
                          aria-controls="dynamic-table"
                          rowSpan="1"
                          colSpan="1"
                          aria-label="ID: activate to sort column ascending"
                        >
                          Shipment#
                        </th>
                        <th
                          className="sorting p-3"
                          tabIndex="0"
                          aria-controls="dynamic-table"
                          rowSpan="1"
                          colSpan="1"
                          aria-label="Name: activate to sort column ascending"
                        >
                          Order#
                        </th>
                        <th
                          className="hidden-480 sorting p-3"
                          tabIndex="0"
                          aria-controls="dynamic-table"
                          rowSpan="1"
                          colSpan="1"
                          aria-label="Timings: activate to sort column ascending"
                        >
                          Date Ordered
                        </th>
                        <th
                          className="hidden-480 sorting p-3"
                          tabIndex="0"
                          aria-controls="dynamic-table"
                          rowSpan="1"
                          colSpan="1"
                          aria-label="Timings: activate to sort column ascending"
                        >
                          Date Shipped
                        </th>
                        <th
                          className="hidden-480 sorting p-3"
                          rowSpan="1"
                          colSpan="1"
                          aria-label="Status"
                        >
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
                                name="allcheckboxes"
                                className="ace"
                                onChange={(e) => {
                                  setOrderStatus(item.shipment_id);
                                  handleChecked(e);
                                }}
                              />

                              <span className="lbl"></span>
                            </label>
                          </th>
                          {/* <td></td> */}
                          <td style={{ width: "100px", height: "100px" }}>
                                <img
                                  src={`${JSON.parse(item.image)[0]}`}
                                  // src={item.image}
                                  alt="Shipmentproduct"
                                  style={{
                                    maxWidth: "100%",
                                    height: "100px",
                                    objectFit: "contain",
                                  }}
                                ></img>
                              </td>
                          <td>{item.shipment_id}</td>
                          <td>{item.order_id}</td>
                          <td>
                            {item.ordered_date &&
                              item.ordered_date.slice(0, 10)}
                          </td>
                          <td>
                            {item.shipped_date &&
                              item.shipped_date.slice(0, 10)}
                          </td>
                          <td>
                            {item.delivered_date &&
                              item.delivered_date.slice(0, 10)}
                          </td>
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
          </div>
        </div>
      </div>
    </div>
  );
}
