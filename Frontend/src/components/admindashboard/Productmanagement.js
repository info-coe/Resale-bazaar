import React, { useState, useEffect } from "react";
import axios from "axios";
import Notification from "../Notification";
import Adminnavbar from "./Adminnavbar";
import Adminpagination from "./Adminpagination";
import Footer from "../footer";
import Confirm from "../confirmalertbox";

export default function Productmanagement() {
  const [pageSize, setPageSize] = useState(15);
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [editingId, setEditingId] = useState(null);
  //eslint-disable-next-line no-unused-vars
  const [viewRowIndex, setViewRowIndex] = useState(null);
  const [formData, setFormData] = useState({
    id: null,
    name: "",
    description: "",
    location: "",
    color: "",
    alteration: "",
    size: "",
    measurements: "",
    condition: "",
    age: "",
    quantity: "",
    price: "",
    material: "",
    occasion: "",
    type: "",
    brand: "",
    style: "",
    season: "",
    fit: "",
    length:"",
    notes:"",
    image: [],
  });
  const [sizes, setSizes] = useState([]);
  const [deletedImages, setDeletedImages] = useState([]);
  const [disabled, setDisabled] = useState(false);
  const [notification, setNotification] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);  // To control modal visibility
  const [idToDelete, setIdToDelete] = useState(null);  // Store the product ID to delete


  const userid = sessionStorage.getItem("user-token");

  useEffect(() => {
    setCurrentPage(1);
    setViewRowIndex(null);
  }, [pageSize]);

  useEffect(() => {
    axios
      .get(
        `${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/sellerproducts`
      )
      .then((res) => {
        if (res.data !== "Fail" && res.data !== "Error") {
          setFilteredProducts(
            res.data.filter(
              (item) =>
                item.shop_status === "enabled"
            )
          );
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

  // const handleDelete = (id) => {
  //   if (window.confirm("Do you want to delete this product?")) {
  //     axios
  //       .delete(
  //         `${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/handleproducts/${id}`
  //       )
  //       .then((response) => {
  //         window.location.reload(false);
  //       //   console.log(response);
  //       })
  //       .catch((error) => {
  //         console.error(error);
  //       });
  //   }
  // };
  const handleDelete = (id) => {
    setIdToDelete(id);
    setShowConfirm(true);  // Show the confirmation modal
  };
  const handleConfirmDelete = () => {
    axios
      .delete(`${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/handleproducts/${idToDelete}`)
      .then((response) => {
        window.location.reload(false);  // Reload the page after deletion
        console.log(response);
      })
      .catch((error) => {
        console.error(error);
      });
    setShowConfirm(false);  // Close the modal
  };

  const handleCancelDelete = () => {
    setShowConfirm(false);  // Hide the modal if user cancels
  };

  const handleEdit = (id, initialData) => {
    setEditingId(id);
    const parsedImage = initialData.image ? JSON.parse(initialData.image) : [];
    setFormData({
      id: initialData.id,
      name: initialData.name,
      description: initialData.description,
      location: initialData.location,
      color: initialData.color,
      alteration: initialData.alteration,
      size: initialData.size,
      measurements: initialData.measurements,
      condition: initialData.condition,
      age: initialData.age,
      quantity:initialData.quantity,
      price: initialData.price,
      material: initialData.material,
      occasion: initialData.occasion,
      type:initialData.type,
      brand: initialData.brand,
      style: initialData.style,
      season: initialData.season,
      fit: initialData.fit,
      length:initialData.length,
      notes:initialData.notes,
      image: parsedImage,
      accepted_by_admin: "true"
    });
    setSizes(getSizesForProductType(initialData.product_type));
  };

  const getSizesForProductType = (producttype) => {
    let newSizes = [];
    if (producttype === "women") {
      newSizes = ["NA", "XS", "S", "M", "L", "XL"];
    } else if (producttype === "kids") {
      newSizes = [
        "NA",
        "0-2 Years",
        "2-4 Years",
        "4-6 Years",
        "6-8 Years",
        "8-10 Years",
        "10-15 Years",
      ];
    } else if (producttype === "jewellery") {
      // Assuming jewellery doesn't have sizes
      newSizes = [];
    }
    return newSizes;
  };

  const [errors, setErrors] = useState({});

  const handleKeyup = (e) => {
    const { name, value } = e.target;
    const newErrors = { ...errors };
    if (name === "name" && value.length > 90) {
      newErrors.name = "Product name must be less than 90 characters";
    } else {
      delete newErrors.name;
    }
    setErrors(newErrors);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const capitalizeWords = (str) => {
      return str
        .split(" ")
        .map((word) => {
          return word.charAt(0).toUpperCase() + word.slice(1);
        })
        .join(" ");
    };
    const capitalizedValue = capitalizeWords(value);

    setFormData((prevData) => ({
      ...prevData,
      [name]: capitalizedValue,
    }));
    handleKeyup(e, capitalizedValue);
  };
  

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter(file => file.type.startsWith('image/') || file.type.startsWith('video/'));
    const oversizedVideos = validFiles.filter(file => file.type.startsWith('video/') && file.size > 2.1 * 1024 * 1024);
    if (oversizedVideos.length > 0) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        image: "Video files must be less than 2MB or equal to 2 MB.",
      }));
      return;
    }
  
    const newFiles = validFiles.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      type: file.type.startsWith('image/') ? 'image' : 'video'
    }));
  
    const newImages = [...formData.image, ...newFiles];
  
    if (newImages.length > 6) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        image: "You can only upload up to 6 images or videos.",
      }));
      return;
    }
  
    setFormData((prevData) => ({
      ...prevData,
      image: newImages,
    }));
  };
  
  const handleDeleteImage = (index) => {
    const updatedImages = [...formData.image];
    const removedImage = updatedImages.splice(index, 1)[0];
    setFormData((prevData) => ({
      ...prevData,
      image: updatedImages,
    }));

    setDeletedImages((prevDeleted) => [...prevDeleted, removedImage]);
  };
  

  const handleSubmitEdit = async (e) => {
    e.preventDefault();

    if (formData.image.length < 2) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        image: "You must have at least 2 images or videos.",
      }));
      return;
    }

    if (formData.image.length > 6) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        image: "You can only upload up to 6 images or videos.",
      }));
      return;
    }
    setDisabled(true)

    try {
      const formDataToSend = new FormData();

      // Filter out empty or null fields from formData
      const filteredFormData = {};
      Object.keys(formData).forEach((key) => {
        if (formData[key]) {
          filteredFormData[key] = formData[key];
        }
      });

      // Append non-file form data
      Object.keys(filteredFormData).forEach((key) => {
        if (key !== 'image') {
          formDataToSend.append(key, filteredFormData[key]);
        }
      });

      // Append image files
      filteredFormData.image.forEach((imageObj) => {
        if (imageObj.file) {
          formDataToSend.append('images', imageObj.file);
        }
      });

      // Append deleted images
      formDataToSend.append('deletedImages', JSON.stringify(deletedImages));
      // eslint-disable-next-line no-unused-vars
      const response = await axios.put(
        `${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/handleproducts/${formData.id}`,
        formDataToSend,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      setNotification({ message: 'Product updated successfully', type: 'success' });
      setTimeout(() => {setNotification(null);
        setDeletedImages([]);
        window.location.reload(false); // Reload the page or update state as necessary
       },1000);
     
    } catch (error) {
      console.error('Error updating product:', error);
      setDisabled(false);
    }
  };


  const getMediaType = (url) => {
    const extension = url.split('.').pop().toLowerCase();
    if (["mp4", "webm", "avi","mov", "quicktime"].includes(extension)) {
      return 'video';
    }
    return 'image';
  };
    
  return (
    <div className="">
      <Adminnavbar />
      {notification && <Notification message={notification.message} type={notification.type} onClose={() => setNotification(null)} />}

      <div className="">
        {/* <div className="col-md-2 selleraccordion">
          <Adminmenu />
        </div> */}
        <div className="container">
          <div className="fullscreen2">
            <main>
            <div className="text-center p-3">
              <h6> <i><span className="" style={{color:"blue" , fontSize:"25px"}}>Admin</span></i> Dashboard</h6>
              </div>
              <div className="m-2 ps-md-4">
                <h1 style={{ fontSize: "28px" }}>Product Management</h1>
              </div>

              <div className=" m-md-3 rounded">
                <div className="table-responsive p-md-3">
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
                        <th>Price</th>
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
                                  src={`${JSON.parse(item.image)[0]}`}
                                  // src={item.image}
                                  alt="sellerproduct"
                                  style={{
                                    maxWidth: "100%",
                                    height: "100px",
                                    objectFit: "contain",
                                  }}
                                ></img>
                              </td>
                              <td style={{maxWidth:"200px"}}>{item.name}</td>
                              <td>${item.price}.00</td>
                              <td>
                                {item.accepted_by_admin === "true" ? (
                                  <span
                                    className="text-success"
                                    style={{ fontWeight: "600" }}
                                  >
                                    Approved
                                  </span>
                                ) : item.rejection_reason ? (
                                  <>
                                    <div>
                                      <span
                                        className="text-danger"
                                        style={{ fontWeight: "600" }}
                                      >
                                        Rejected
                                      </span>
                                    </div>
                                    <div>Reason: {item.rejection_reason}</div>
                                  </>
                                ) : (
                                  <span
                                    className="text-warning"
                                    style={{ fontWeight: "600" }}
                                  >
                                    ...Pending
                                  </span>
                                )}
                              </td>
                              <td>
                                <button
                                  className="btn btn-outline-primary m-1"
                                  type="button"
                                  data-toggle="modal"
                                  data-target="#exampleModalLong"
                                  onClick={() => handleEdit(item.id, item)}
                                >
                                  Edit
                                </button>{" "}
                                <button
                                  className="btn btn-outline-danger m-1"
                                  onClick={() => handleDelete(item.id)}
                                >
                                  Delete
                                </button>
                                {showConfirm && (
        <Confirm
          title="Delete Product"
          message="Do you want to delete this product?"
          onConfirm={handleConfirmDelete}  // Confirm action handler
          onCancel={handleCancelDelete}    // Cancel action handler
        />
      )}
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

                <Adminpagination
                  stateData={filteredProducts}
                  setViewRowIndex={setViewRowIndex}
                  pageSize={pageSize}
                  setPageSize={setPageSize}
                  currentPage={currentPage}
                  setCurrentPage={setCurrentPage}
                />
              </div>
            </main>
            {/* <Adminfooter /> */}
          </div>
        </div>
        
      </div>
      <Footer/>
      {/* Modal for editing product */}
      {editingId !== null && (
        <div
          className="modal fade show"
          tabIndex="-1"
          style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
          // onClick={() => setEditingId(null)}  

          >
          <div className="modal-dialog modal-dialog-scrollable">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Product</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setEditingId(null)}
                ></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleSubmitEdit}>
                {formData.image !== "NA" && formData.image !== null && (
  <>
      <div className="mb-3">
        <label className="form-label fw-bolder">Current Files</label>
        <div className="d-flex flex-wrap">
          {formData.image && formData.image.length > 0 ? (
            formData.image.map((mediaObj, index) => (
              <div key={index} className="me-2 mb-2 position-relative">
                {mediaObj.file ? (
                  mediaObj.type === 'image' ? (
                    <img
                      src={mediaObj.preview}
                      alt={`Product ${index + 1}`}
                      className="img-thumbnail"
                      style={{ width: '100px', height: '100px' ,  objectFit: 'contain' , alignSelf:"center"  }}
                    />
                  ) : (
                    <video
                      src={mediaObj.preview}
                      controls
                      className="img-thumbnail"
                      style={{ width: '100px', height: '100px' ,  objectFit: 'contain' , alignSelf:"center" }}
                    ></video>
                  )
                ) : (
                  getMediaType(mediaObj) === 'image' ? (
                    <img
                      src={mediaObj}
                      alt={`Product ${index + 1}`}
                      className="img-thumbnail"
                      style={{ width: '100px', height: '100px' ,  objectFit: 'contain' , alignSelf:"center" }}
                    />
                  ) : (
                    <video
                      src={mediaObj}
                      controls
                      className="img-thumbnail"
                      style={{ width: '100px', height: '100px' ,  objectFit: 'contain' , alignSelf:"center" }}
                    ></video>
                  )
                )}
                <button
                  type="button"
                  className="btn-close rounded-circle bg-white position-absolute top-0 end-0 m-2"
                  style={{ padding: "5px", fontSize: "16px" }}
                  aria-label="Close"
                  onClick={() => handleDeleteImage(index)}
                ></button>
              </div>
            ))
          ) : (
            <p>No media available</p>
          )}
        </div>
      </div>
      <div className="mb-3">
        <label htmlFor="productImages" className="form-label fw-bolder">
          Add Photo / Video
        </label>
        <input
          type="file"
          className="form-control"
          id="productImages"
          name="images"
          multiple
          onChange={handleImageChange}
          accept="image/*,video/*"
        />
        {errors.image && <p className="text-danger">{errors.image}</p>}
      </div>
  </>
)}

                  {formData.name !== "NA" && formData.name !== null && (
                    <div className="mb-3">
                      <label htmlFor="productName" className="form-label fw-bolder">
                        Product Name
                      </label>
                      <div className="d-flex">
                      <input
                        type="text"
                        className="form-control"
                        id="productName"
                        name="name"
                        placeholder="Product Name"
                        value={formData.name}
                        onChange={(e) => {
                          handleChange(e);
                          handleKeyup(e);
                        }}
                        title="Enter product name less than 90 chars"
                        required
                      />
                    <span className="text-danger fs-4"> &nbsp;*</span>
                       {errors.name && (
                          <span className="text-danger fs-6">
                            {errors.name}
                          </span>
                        )}
                    </div>
                    </div>
                  )}
                  {formData.description !== "NA" && formData.description !== null && (
                    <div className="mb-3">
                      <label
                        htmlFor="productDescription"
                        className="form-label fw-bolder"
                      >
                        
                        Description
                      </label>
                      <div className="d-flex">

                      <textarea
                        className="form-control"
                        id="productDescription"
                        name="description"
                        placeholder="Product Description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                      />
                    <span className="text-danger fs-4"> &nbsp;*</span>
                    </div>
                    </div>
                  )}
                  
                  {formData.color !== "NA" && formData.color !== null && (
                    <div className="mb-3">
                      <label htmlFor="productColor" className="form-label fw-bolder">
                        Color
                      </label>
                      <div className="d-flex">

                      <input
                        type="text"
                        className="form-control"
                        id="productColor"
                        name="color"
                        placeholder="Color"
                        value={formData.color}
                        onChange={handleChange}
                        required
                      />
                    <span className="text-danger fs-4"> &nbsp;*</span>
                    </div>
                    </div>
                  )}
                  {formData.location !== "NA" && formData.location !== null  && (
                    <div className="mb-3">
                      <label htmlFor="productLocation" className="form-label fw-bolder">
                        Location
                      </label>
                      <div className="d-flex">

                      <input
                        type="text"
                        className="form-control"
                        id="productLocation"
                        name="location"
                        placeholder="Location"
                        value={formData.location}
                        onChange={handleChange}
                        required
                      />
                    <span className="text-danger fs-4"> &nbsp;*</span>
                    </div>
                    </div>
                  )}
                  {formData.alteration !== "NA" && (
                    <div className="mb-3">
                      <label htmlFor="productAlteration" className="form-label fw-bolder">
                        Alteration
                      </label>
                      <div className="d-flex">
                      <select
                        id="productAlteration"
                        name="alteration"
                        value={formData.alteration}
                        className="form-select"
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select Alteration</option>
                        <option value="NA">NA</option>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>
                      <span className="text-danger fs-4"> &nbsp;*</span>
                    </div>
                    </div>
                  )}
                  {formData.size !== "NA" && (
                    <div className="mb-3">
                      <label htmlFor="productSize" className="form-label fw-bolder fw-bolder">
                        Size
                      </label>
                      <div className="d-flex">
                      <select
                        className="form-select"
                        id="productSize"
                        name="size"
                        value={formData.size}
                        onChange={handleChange}
                        required
                      >
                        {sizes.map((size, index) => (
                          <option key={index} value={size}>
                            {size}
                          </option>
                        ))}
                      </select>
                      <span className="text-danger fs-4"> &nbsp;*</span>
                    </div>
                    </div>
                  )}
                  {formData.measurements !== "NA" && formData.measurements !== null && (
                    <div className="mb-3">
                      <label
                        htmlFor="productMeasurements"
                        className="form-label fw-bolder"
                      >
                        Measurements
                      </label>
                      <div className="d-flex">
                      <input
                        type="text"
                        className="form-control"
                        id="productMeasurements"
                        name="measurements"
                        placeholder="Measurements (eg. 12 to 16)"
                        value={formData.measurements}
                        onChange={handleChange}
                        required
                      />
                      <span className="text-danger fs-4"> &nbsp;*</span>
                    </div>
                    </div>
                  )}
                  {formData.condition !== "NA"  && (
                    <div className="mb-3">
                      <label htmlFor="productCondition" className="form-label fw-bolder">
                        Condition
                      </label>
                      <div className="d-flex">
                        <select
                          className="form-select"
                          id="productCondition"
                          name="condition"
                          value={formData.condition}
                          onChange={handleChange}
                          required
                        >
                          <option value="">Select Condition</option>
                          <option value="NA">NA</option>
                          <option value="Brand New">Brand New</option>
                          <option value="Like New">Like New</option>
                          <option value="Excellent">Used - Excellent</option>
                          <option value="Good">Used - Good</option>
                          <option value="Fair">Used - Fair</option>
                        </select>
                        <span className="text-danger fs-4"> &nbsp;*</span>

                      </div>
                    </div>
                  )}
                  {formData.age !== "NA" && (
                    <div className="mb-3">
                      <label htmlFor="productAge" className="form-label fw-bolder">
                        Age
                      </label>
                      <div className="d-flex">
                        <select
                          className="form-select"
                          id="productAge"
                          name="age"
                          value={formData.age}
                          onChange={handleChange}
                          required
                        >
                          <option value="">Select Age</option>
                          <option value="NA">NA</option>
                          <option value="Modern">Modern</option>
                          <option value="00s">00s</option>
                          <option value="90s">90s</option>
                          <option value="80s">80s</option>
                          <option value="80s">80s</option>
                          <option value="60s">60s</option>
                          <option value="50s">50s</option>
                          <option value="Antique">Antique</option>
                        </select>
                        <span className="text-danger fs-4"> &nbsp;*</span>
                      </div>
                    </div>
                  )}
                  {formData.quantity !== "NA" && (
                    <div className="mb-3">
                    <label
                      htmlFor="ProductQuantity"
                      className="form-label fw-bolder"
                    >
                      Quantity
                    </label>
                    <div className="d-flex">
                      {/* <select
                        className="form-select"
                        id="ProductQuantity"
                        name="quantity"
                        placeholder="Enter Quantity"
                        value={formData.quantity}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select Quantity</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                      </select> */}
                      <input
            type="number"
            className="form-control"
            id="ProductQuantity"
            name="quantity"
            placeholder="Enter Quantity"
            value={formData.quantity}
            onChange={handleChange}
            min="1"
            max="99"
            required
        />
                      <span className="text-danger fs-4"> &nbsp;*</span>
                    </div>
                  </div>
                  )}
                  {formData.price !== "NA" && formData.price !== null && (
                    <div className="mb-3">
                      <label htmlFor="productPrice" className="form-label fw-bolder">
                        Price
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="productPrice"
                        name="price"
                        placeholder="Ex: &#36;100"
                        value={formData.price}
                        onChange={handleChange}
                        min="1"
                        pattern="[0-9]+"
                        title="Price must be positive numbers"
                        required
                      />
                    </div>
                  )}
                  {formData.material !== "NA" && (
                    <div className="mb-3">
                      <label htmlFor="productMaterial" className="form-label fw-bolder">
                        Material
                      </label>
                      <div className="d-flex">
                        <select
                          className="form-select"
                          id="productMaterial"
                          name="material"
                          value={formData.material}
                          onChange={handleChange}
                          placeholder="Material (eg. Silk,Cotton etc.)"
                          required
                        >
                          <option value="">Select Material</option>
                          <option value="NA">NA</option>
                          <option value="Silk">Silk</option>
                          <option value="Cotton">Cotton</option>
                          <option value="Crepe">Crepe</option>
                          <option value="Net">Net</option>
                          <option value="Georgette">Georgette</option>
                          <option value="Rayon">Rayon</option>
                          <option value="Polyester">Polyester</option>
                          <option value="Wool">Wool</option>
                          <option value="Linen">Linen</option>
                          <option value="Nylon">Nylon</option>
                          <option value="Denim">Denim</option>
                          <option value="Leather">Leather</option>
                          <option value="Velvet">Velvet</option>
                          <option value="Spandex (Elastane)">
                            Spandex (Elastane)
                          </option>
                        </select>
                        <span className="text-danger fs-4"> &nbsp;*</span>

                      </div>
                    </div>
                  )}
                  {/* {formData.occasion !== "NA" && formData.occasion !== null && ( */}
                    <div className="mb-3">
                      <label htmlFor="productOccasion" className="form-label fw-bolder">
                        Occasion
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="productOccasion"
                        name="occasion"
                        placeholder="Enter Occasion (eg. Function,Party)"
                        value={formData.occasion}
                        onChange={handleChange}
                        // required
                      />
                    </div>
                  {/* )} */}
                  {/* {formData.type !== "NA" && formData.type !== null && ( */}
                    <div className="mb-3">
                      <label htmlFor="productType" className="form-label fw-bolder">
                        Type
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="productType"
                        name="type"
                        placeholder="Enter Type"
                        value={formData.type}
                        onChange={handleChange}
                        // required
                      />
                    </div>
                  {/* )} */}
                  {/* {formData.brand !== "NA" && formData.brand !== null  && ( */}
                    <div className="mb-3">
                      <label htmlFor="productBrand" className="form-label fw-bolder">
                        Brand
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="productBrand"
                        name="brand"
                        placeholder="Enter Brand Name"
                        value={formData.brand}
                        onChange={handleChange}
                        // required
                      />
                    </div>
                  {/* )} */}
                  {/* {formData.style !== "NA" && formData.style !== null && ( */}
                    {/* <div className="mb-3">
                      <label htmlFor="productStyle" className="form-label fw-bolder">
                        Style
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="productStyle"
                        name="style"
                        placeholder="Enter Style"
                        value={formData.style}
                        onChange={handleChange}
                        // required
                      />
                    </div> */}
                  {/* )} */}
                  {/* {formData.season !== "NA" && formData.season !== null && ( */}
                    <div className="mb-3">
                      <label htmlFor="productSeason" className="form-label fw-bolder">
                        Season
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="productSeason"
                        name="season"
                        placeholder="Enter Season (eg. Summer,Winter)"
                        value={formData.season}
                        onChange={handleChange}
                        // required
                      />
                    </div>
                  {/* )} */}
                  {/* {formData.fit !== "NA" && formData.fit !== null && ( */}
                    {/* <div className="mb-3">
                      <label htmlFor="productFit" className="form-label fw-bolder">
                        Fit
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="productFit"
                        name="fit"
                        placeholder="Enter Fit"
                        value={formData.fit}
                        onChange={handleChange}
                        // required
                      />
                    </div> */}
                  {/* )} */}
                  {/* {formData.length !== "NA" && formData.length !== null && ( */}
                    <div className="mb-3">
                      <label htmlFor="productLength" className="form-label fw-bolder">
                        Length
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="productLength"
                        name="length"
                        placeholder="Enter Length"
                        value={formData.length}
                        onChange={handleChange}
                        // required
                      />
                    </div>
                  {/* )} */}
                  {formData.notes !== "" && formData.notes !==null &&  (
                    <div className="mb-3">
                    <label htmlFor="ProductNotes" className="form-label fw-bolder">
                      Notes
                    </label>
                    <div className="d-flex">
                      <textarea
                        className="form-control"
                        id="ProductNotes"
                        name="notes"
                        placeholder="Notes (Optional)"
                        value={formData.notes}
                        onChange={handleChange}
                        // required
                      ></textarea>
                      {/* <span className="text-danger fs-4"> &nbsp;*</span> */}
                    </div>
                  </div>
                  )}
                  <button type="submit" className="btn btn-primary"  disabled={disabled}>
                    Save Changes
                  </button>{" "}
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setEditingId(null)}
                  >
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
