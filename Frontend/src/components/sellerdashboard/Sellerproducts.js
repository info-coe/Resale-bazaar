import React, { useState, useEffect } from "react";
import axios from "axios";
import Sellernavbar from "./Sellernavbar";
import Sellermenu from "./Sellermenu";
import Sellerfooter from "./Sellerfooter";
import Sellerpagination from "./sellerpagination";
import { useNavigate } from "react-router-dom";

export default function Sellerproducts() {
  const [pageSize, setPageSize] = useState(6);
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [viewRowIndex, setViewRowIndex] = useState(null);
  const [formData, setFormData] = useState({
    id: null,
    name: "",
    description: "",
    // image: "",
    location: "",
    color: "",
    alteration: "",
    size: "",
    measurements: "",
    condition: "",
    // source: "",
    age: "",
    // quantity: "",
    price: "",
    material: "",
    occasion: "",
    type: "",
    brand: "",
    style: "",
    season: "",
    fit: ""
  });

  const userid = sessionStorage.getItem("user-token");
  const navigate = useNavigate();
  useEffect(() => {
    setCurrentPage(1);
    setViewRowIndex(null);
  }, [pageSize]);

  useEffect(() => {
    // Fetching all products
    axios
      .get(`${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/sellerproducts`)
      .then((res) => {
        if (res.data !== "Fail" && res.data !== "Error") {
          const rejectedProducts = res.data.filter(
            (item) =>
              item.rejectedReason !== null &&
              item.accepted_by_admin === "false" &&
              item.seller_id.toString() === userid
          );
          const approvedProducts = res.data.filter(
            (item) =>
              item.accepted_by_admin === "true" &&
              item.seller_id.toString() === userid
          );
          const pendingProducts = res.data.filter(
            (item) =>
              item.rejectedReason === null &&
              item.accepted_by_admin === "false" &&
              item.seller_id.toString() === userid
          );
          const mergedProducts = [
            ...approvedProducts,
            ...rejectedProducts,
            ...pendingProducts,
          ];
          setFilteredProducts(mergedProducts);
        }
      })
      .catch((err) => console.log(err));
  }, [userid]);

  useEffect(() => {
    setCurrentPage(1);
  }, [pageSize]);

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const tableData = filteredProducts.slice(startIndex, endIndex);

  const handleDelete = (id) => {
    if (window.confirm("Do you want to delete this product?")) {
      axios
        .delete(
          `${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/handleproducts/${id}`
        )
        .then((response) => {
          window.location.reload(false);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  const handleEdit = (id, initialData) => {
    setEditingId(id);
    setFormData({
      id: initialData.id,
      name: initialData.name,
      description: initialData.description , 
      location: initialData.location ,
      color: initialData.color ,
      alteration: initialData.alteration ,
      size: initialData.size,
      measurements: initialData.measurements ,
      condition: initialData.condition ,
      age: initialData.age ,
      price: initialData.price ,
      material: initialData.material ,
      occasion: initialData.occasion ,
      brand: initialData.brand,
      style: initialData.style ,
      season: initialData.season ,
      fit: initialData.fit 
    });
  };

  const handleSubmitEdit = async (e) => {
    e.preventDefault();
    try {
      // Filter out empty values from formData
      const filteredFormData = {};
      Object.keys(formData).forEach(key => {
        if (formData[key]) {
          filteredFormData[key] = formData[key];
        }
      });

      const response = await axios.put(
        `${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/handleproducts/${formData.id}`,
        filteredFormData
      );
      alert("Product updated successfully");
      setEditingId(null);
      window.location.reload(false); // Reload the page or update state as necessary
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  

  return (
    <div className="">
      <Sellernavbar />
      <div className="d-md-flex">
        <div className="col-md-2 selleraccordion">
          <Sellermenu />
        </div>
        <div className="col-md-10 ">
          <div className="fullscreen2">
            <main>
              <div className="m-2">
                <h1 style={{ fontSize: "28px" }}>Products</h1>
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
                        <th>Product ID</th>
                        <th>Picture</th>
                        <th>Product Name</th>
                        <th>Price Including Shipping</th>
                        <th>Product Status</th>
                        <th>Edit</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tableData.length > 0 ? (
                        tableData.map((item, index) => {
                          return (
                            <tr key={index}>
                              <td>{item.id}</td>
                              <td style={{ width: "100px", height: "100px" }}>
                                <img
                                  src={`${JSON.parse(
                                    item.image
                                  )[0]}`}
                                  // src={item.image}
                                  alt="sellerproduct"
                                  style={{
                                    maxWidth: "100%",
                                    height: "100px",
                                    objectFit: "contain",
                                  }}
                                ></img>
                              </td>
                              <td>{item.name}</td>
                              <td>${item.price}.00</td>
                              <td>
                                {item.accepted_by_admin === "true" ? (
                                  <span className="text-success" style={{ fontWeight: "600" }}>
                                    Approved
                                  </span>
                                ) : item.rejection_reason ? (
                                  <>
                                    <div>
                                      <span className="text-danger" style={{ fontWeight: "600" }}>
                                        Rejected
                                      </span>
                                    </div>
                                    <div>Reason: {item.rejection_reason}</div>
                                  </>
                                ) : (
                                  <span className="text-warning" style={{ fontWeight: "600" }}>
                                    ...Pending
                                  </span>
                                )}
                              </td>
                              <td>
                                <button
                                  className="btn btn-outline-primary"
                                  type="button"data-toggle="modal" data-target="#exampleModalLong"
                                  onClick={() => handleEdit(item.id, item)}
                                >
                                  Edit
                                </button>{" "}
                                <button
                                  className="btn btn-outline-danger"
                                  onClick={() => handleDelete(item.id)}
                                >
                                  Delete
                                </button>
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan={6} className="text-center">
                            No Data To Display
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                <Sellerpagination
                  stateData={filteredProducts}
                  setViewRowIndex={setViewRowIndex}
                  pageSize={pageSize}
                  setPageSize={setPageSize}
                  currentPage={currentPage}
                  setCurrentPage={setCurrentPage}
                />
              </div>
            </main>
            <Sellerfooter />
          </div>
        </div>
      </div>

      {/* Modal for editing product */}
      {editingId !== null && (
        <div className="modal fade show" tabIndex="-1" style={{ display: "block" }}>
          <div className="modal-dialog modal-dialog-scrollable">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Product</h5>
                <button type="button" className="btn-close" onClick={() => setEditingId(null)}></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleSubmitEdit}>
                  {formData.name !== null && (
                    <div className="mb-3">
                      <label htmlFor="productName" className="form-label">
                        Product Name
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="productName"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  )}
                  {formData.description !== null && (
                    <div className="mb-3">
                      <label htmlFor="productDescription" className="form-label">
                        Description
                      </label>
                      <textarea
                        className="form-control"
                        id="productDescription"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                      />
                    </div>
                  )}
                
                  {formData.location !== null && (
                    <div className="mb-3">
                      <label htmlFor="productLocation" className="form-label">
                        Location
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="productLocation"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                      />
                    </div>
                  )}
                  {formData.color !== null && (
                    <div className="mb-3">
                      <label htmlFor="productColor" className="form-label">
                        Color
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="productColor"
                        name="color"
                        value={formData.color}
                        onChange={handleChange}
                      />
                    </div>
                  )}
                  {formData.alteration !== null && (
                    <div className="mb-3">
                      <label htmlFor="productAlteration" className="form-label">
                        Alteration
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="productAlteration"
                        name="alteration"
                        value={formData.alteration}
                        onChange={handleChange}
                      />
                    </div>
                  )}
                  {formData.size !== null && (
                    <div className="mb-3">
                      <label htmlFor="productSize" className="form-label">
                        Size
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="productSize"
                        name="size"
                        value={formData.size}
                        onChange={handleChange}
                      />
                    </div>
                  )}
                  {formData.measurements !== null && (
                    <div className="mb-3">
                      <label htmlFor="productMeasurements" className="form-label">
                        Measurements
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="productMeasurements"
                        name="measurements"
                        value={formData.measurements}
                        onChange={handleChange}
                      />
                    </div>
                  )}
                  {formData.condition !== null && (
                    <div className="mb-3">
                      <label htmlFor="productCondition" className="form-label">
                        Condition
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="productCondition"
                        name="condition"
                        value={formData.condition}
                        onChange={handleChange}
                      />
                    </div>
                  )}
                
                  {formData.age !== null && (
                    <div className="mb-3">
                      <label htmlFor="productAge" className="form-label">
                        Age
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="productAge"
                        name="age"
                        value={formData.age}
                        onChange={handleChange}
                      />
                    </div>
                  )}
                 
                  {formData.price !== null && (
                    <div className="mb-3">
                      <label htmlFor="productPrice" className="form-label">
                        Price
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="productPrice"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  )}
                  {formData.material !== null && (
                    <div className="mb-3">
                      <label htmlFor="productMaterial" className="form-label">
                        Material
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="productMaterial"
                        name="material"
                        value={formData.material}
                        onChange={handleChange}
                      />
                    </div>
                  )}
                  {formData.occasion !== null && (
                    <div className="mb-3">
                      <label htmlFor="productOccasion" className="form-label">
                        Occasion
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="productOccasion"
                        name="occasion"
                        value={formData.occasion}
                        onChange={handleChange}
                      />
                    </div>
                  )}
                 
                  {formData.brand !== null && (
                    <div className="mb-3">
                      <label htmlFor="productBrand" className="form-label">
                        Brand
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="productBrand"
                        name="brand"
                        value={formData.brand}
                        onChange={handleChange}
                      />
                    </div>
                  )}
                  {formData.style !== null && (
                    <div className="mb-3">
                      <label htmlFor="productStyle" className="form-label">
                        Style
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="productStyle"
                        name="style"
                        value={formData.style}
                        onChange={handleChange}
                      />
                    </div>
                  )}
                  {formData.season !== null && (
                    <div className="mb-3">
                      <label htmlFor="productSeason" className="form-label">
                        Season
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="productSeason"
                        name="season"
                        value={formData.season}
                        onChange={handleChange}
                      />
                    </div>
                  )}
                  {formData.fit !== null && (
                    <div className="mb-3">
                      <label htmlFor="productFit" className="form-label">
                        Fit
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="productFit"
                        name="fit"
                        value={formData.fit}
                        onChange={handleChange}
                      />
                    </div>
                  )}
                  <button type="submit" className="btn btn-primary">
                    Save Changes
                  </button>{" "}
                  <button type="button" className="btn btn-secondary" onClick={() => setEditingId(null)}>
                    Cancel
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      
    </div>
  );
}
