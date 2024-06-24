import React, { useState, useEffect } from "react";
import Sellernavbar from "./Sellernavbar";
import Sellermenu from "./Sellermenu";
import Sellerfooter from "./Sellerfooter";
import Sellerpagination from "./sellerpagination";
import { Link } from "react-router-dom";
import axios from "axios";

export default function Shipments() {
  // eslint-disable-next-line no-unused-vars
  const [products, setProducts] = useState([]);
  const [pageSize, setPageSize] = useState(6);
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
        `${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/updatepayment`
      )
      .then((res) => {
        setFilteredProducts(res.data);
        axios
        .get(
          `${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/sellerproducts`
        )
        .then((result) => {
          setShippingProducts(
            result.data.filter(
              (item) =>
                item.seller_id.toString() === sessionStorage.getItem("user-token")
            )
          );
        })
        .catch((err) => console.log(err));

      })
      .catch((err) => console.log(err));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const allSellerProducts = filteredProducts
  .filter((product) =>
    shippingProducts.some(
      (order) => order.id === product.product_id
    )
  );

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const tableData = allSellerProducts.slice(startIndex, endIndex);

  const handleChecked = (e) => {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    if (e.currentTarget.checked) {
      for (let i = 0; i < checkboxes.length; i++) {
        checkboxes[i].checked = true;
        console.log(checkboxes[i]);
      }
    } else {
      for (let i = 0; i < checkboxes.length; i++) {
        checkboxes[i].checked = false;
      }
    }
  };

  const handleOrder = () => {
    // console.log(order);
    axios
    .post(
      `${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/updateOrder`, {
        shipment_id : orderStatus,
        shipped_date : new Date().toLocaleDateString("fr-CA")
      }
    )
    .then((res) => {
      console.log(res.data);
      // setFilteredProducts(res.data);
    })
    .catch((err) => console.log(err));
  };

  // console.log(shippingProducts);

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
                    <button className="btn btn-info" onClick={handleOrder}>
                      <i className="bi bi-truck"></i> Set as shipped(selected)
                    </button>
                  {/* </Link> */}
                  <Link to="/addnewproduct">
                    <button className="btn btn-success">
                      <i className="bi bi-check2-circle"></i> Set as
                      delivered(selected)
                    </button>
                  </Link>
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
                            <input
                              type="checkbox"
                              name="allcheckboxes"
                              className="ace"
                              onChange={handleChecked}
                            />
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
                                onChange={() => setOrderStatus(item.shipment_id)}
                              />
                              <span className="lbl"></span>
                            </label>
                          </th>
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
