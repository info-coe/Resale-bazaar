import React, { useState,  useRef } from "react";
import axios from "axios";
import MyNavbar from "../navbar";
import Footer from "../footer";
import Scrolltotopbtn from "../Scrolltotopbutton";
import Notification from "../Notification";
export default function Addnewproduct() {
  const [categories, setCategories] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [disabled, setDisabled] = useState(false);
  const [notification, setNotification] = useState(null);


  const [values, setValues] = useState({
    producttype: "",
    category: "",
    productname: "",
    productdescription: "",
    location: "",
    color: "",
    alteration: "",
    size: "",
    measurements: "",
    material: "",
    condition: "",
    source: "",
    age: "",
    language: "",
    quantity: "",
    price: "",
    notes: "",
    accepted_by_admin: "false",
    seller_id: sessionStorage.getItem("user-token") || "", // Ensure this correctly fetches the user token
  });
  const [selectedAttributes, setSelectedAttributes] = useState([]);
  const [customAttributes, setCustomAttributes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [errors, setErrors] = useState({});

  const placeholders = ["Cover", "Back", "Detail", "Forward", "Label", "Side"];
  const totalPlaceholders = placeholders.length;

  const [media, setMedia] = useState({
    images: Array(totalPlaceholders).fill(null),
    video: null,
  });

  const validateForm = () => {
    const newErrors = {};

    // Validate product name length
    if (values.productname.length > 90) {
      newErrors.productname = "Product name must be less than 90 characters";
    }

    // Validate number of selected images
    const nonNullImages = media.images.filter((image) => image !== null);
    if (nonNullImages.length < 2) {
      newErrors.files = "Please select at least 2 images";
    } else if (nonNullImages.length > 7) {
      newErrors.images = "Please select less than 7 images";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if there are no errors
  };
  
  const handleAddMediaChange = (e, type) => {
    const files = Array.from(e.target.files);
    const newMedia = { ...media };
    const newErrors = { ...errors };
  
    if (type === "images") {
      files.forEach((file) => {
        const nextAvailableIndex = newMedia.images.findIndex(
          (image) => image === null
        );
        if (nextAvailableIndex !== -1) {
          newMedia.images[nextAvailableIndex] = file;
        }
      });
    } else if (type === "video" && files.length > 0) {
      const file = files[0];
      const maxSizeInBytes = 2.1 * 1024 * 1024; // 2MB in bytes
      if (file.size > maxSizeInBytes) {
        newErrors.video = "Video size must be less than 2MB or equal to 2MB";
        setErrors(newErrors);
        return;
      } else {
        newMedia.video = file;
        delete newErrors.video;
      }
    }
  
    setMedia(newMedia);
    setErrors(newErrors);
  };

  const removeMedia = (type, index) => {
    const newMedia = { ...media };

    if (type === "images") {
      newMedia.images.splice(index, 1, null); // Replace removed image with null
    } else if (type === "video") {
      newMedia.video = null;
    }

    setMedia(newMedia);
  };

  const handleKeyup = (e) => {
    const { name, value } = e.target;
    const newErrors = { ...errors };
    if (name === "productname" && value.length > 90) {
      newErrors.productname = "Product name must be less than 90 characters";
    } else {
      delete newErrors.productname;
    }

    if (name === "productimageurl") {
      const nonNullImages = media.images.filter((image) => image !== null);
      if (nonNullImages.length < 2) {
        newErrors.files = "Please select at least 2 images";
      } else {
        delete newErrors.files; // Remove the error if number of images is valid
      }
    }

    setErrors(newErrors);
  };

   // Create refs for each input element
   const productnameInputRef = useRef(null);
   const productdescriptionInputRef = useRef(null);
   const colorInputRef = useRef(null);
   const locationInputRef = useRef(null);
   const notesInputRef = useRef(null);
   
   const capitalizeWords = (str) => {
    return str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  const capitalizeFirstLetterOnly = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };
   
  const handleInput = (event) => {
    const { name, value, selectionStart, selectionEnd } = event.target;
    let processedValue;
    if (["productdescription", "notes"].includes(name)) {
      processedValue = capitalizeFirstLetterOnly(value);
    } else if (["productname", "color", "location"].includes(name)) {
      processedValue = capitalizeWords(value);
    } else {
      processedValue = value;
    }
    setValues((prevValues) => ({
      ...prevValues,
      [name]: processedValue,
    }));

    // Restore cursor position
    requestAnimationFrame(() => {
      if (name === "productname" && productnameInputRef.current) {
        productnameInputRef.current.setSelectionRange(selectionStart, selectionEnd);
      } else if (name === "productdescription" && productdescriptionInputRef.current) {
        productdescriptionInputRef.current.setSelectionRange(selectionStart, selectionEnd);
      } else if (name === "color" && colorInputRef.current) {
        colorInputRef.current.setSelectionRange(selectionStart, selectionEnd);
      } else if (name === "location" && locationInputRef.current) {
        locationInputRef.current.setSelectionRange(selectionStart, selectionEnd);
      } else if (name === "notes" && notesInputRef.current) {
        notesInputRef.current.setSelectionRange(selectionStart, selectionEnd);
      }
    });
  };

  // Map attribute names to their corresponding refs
  // Refs for each attribute input
  const attributeRefs = {
    Occasion: useRef(null),
    Type: useRef(null),
    Brand: useRef(null),
    Season: useRef(null),
    Length: useRef(null),
  };

   // Handle input change
  const handleInputChange = (event, attribute, ref) => {
    const { value, selectionStart, selectionEnd, type } = event.target;

    let processedValue;
    if (attribute === 'Length') {
      // For 'Length', use value as is (numeric input)
      processedValue = value;
    } else {
      // For other attributes, apply capitalization rules
      processedValue = capitalizeWords(value);
    }

    // Update the state with new value
    setCustomAttributes((prevAttributes) =>
      prevAttributes.map((item) =>
        item.name === attribute ? { ...item, value: processedValue } : item
      )
    );

    // Restore cursor position
    if (type !== 'number') {
      requestAnimationFrame(() => {
        if (ref.current) {
          ref.current.setSelectionRange(selectionStart, selectionEnd);
        }
      });
    }
  };
  
  

  const handleProducttype = (event) => {
    setValues((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));

    if (event.target.name === "producttype") {
      if (event.target.value === "women") {
        setCategories([
          "High End Couture",
          "Sarees",
          "Lehenga",
          "Dresses",
          "Twinning-outfits,Tie Dye",
        ]);
        setSizes(["NA", "XS", "S", "M", "L", "XL"]);
      } else if (event.target.value === "kids") {
        setCategories(["Girl", "Boy"]);
        setSizes([
          "NA",
          "0-2 Years",
          "2-4 Years",
          "4-6 Years",
          "6-8 Years",
          "8-10 Years",
          "10-15 Years",
        ]);
      } else if (event.target.value === "jewellery") {
        setCategories(["Necklaces", "Bangles", "Earrings", "Rings"]);
      }
    }
  };

  // Handle checkbox changes in modal
  const handleCheckboxChange = (option) => {
    setSelectedAttributes((prev) =>
      prev.includes(option)
        ? prev.filter((attr) => attr !== option)
        : [...prev, option]
    );
  };

  const handleAddAttribute = () => {
    setShowModal(true);
  };

  const handleModalSubmit = () => {
    const newCustomAttributes = selectedAttributes.filter(
      (attribute) => !customAttributes.find((item) => item.name === attribute)
    );
    setCustomAttributes([
      ...customAttributes,
      ...newCustomAttributes.map((attribute) => ({
        name: attribute,
        value: "",
      })),
    ]);
    setSelectedAttributes([]);
    setShowModal(false);
  };

  const handleSubmit = async (event) => {
    // setDisabled(true)
    event.preventDefault();
    const isValid = validateForm();

    if (!isValid) {
      return;
    }

    const updatedValues = { ...values };

    if (values.producttype === "jewellery") {
      updatedValues.size = "NA";
      updatedValues.material = "NA";
      updatedValues.source = "NA";
    }
    if (values.producttype === "women") {
      // updatedValues.size = "NA";
      updatedValues.alteration = "NA";
      // updatedValues.material = "NA";
      updatedValues.source = "NA";
    }
    if(values.category === "Sarees"){
      updatedValues.measurements = "NA";
      updatedValues.size = "NA";
    }
    if (values.producttype === "kids") {
      updatedValues.source = "NA";
      updatedValues.age= "NA"
    }

    const formData = new FormData();

    media.images.forEach((image) => {
      if (image) {
        formData.append("media", image);
      }
    });

    if (media.video) {
      formData.append("media", media.video);
    }

    for (const key in updatedValues) {
      formData.append(key, updatedValues[key]);
    }

    customAttributes.forEach((attribute) => {
      formData.append(attribute.name, attribute.value);
    });

    setDisabled(true)
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/addproducts`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data === "Error") {
       
        setNotification({ message: 'Error while adding product. Please try again filling all the fields', type: 'error' });
        setTimeout(() => setNotification(null), 3000);
        setDisabled(false); // Re-enable the save button on error
      } else {
        setNotification({ message: 'Product added successfully', type: 'success' });
        setTimeout(() => {
          setNotification(null);
          window.location.reload(false); 
        }, 1000); 
      }
    } catch (error) {
      console.error("Error:", error);
      setNotification({ message: 'An error occurred while adding the product. Please try again.', type: 'error' });
      setTimeout(() => setNotification(null), 3000);
      setDisabled(false); // Re-enable the save button on error
    }
  };

  const attributeOptions = [
    "Occasion",
    "Type",
    "Brand",
    // "Style",
    "Season",
    // "Fit",
    "Length",
    // Add more attribute options here
  ];
  const placeholderValues = {
    Occasion: "Function, Party, Birthdays",
    Type: "Designer, Homemade, Repaired",
    Brand: "Enter Brand Name",
    // Style: "Enter Style",
    Season: "Summer, Winter, Spring",
    // Fit: "Enter Fit",
    Length: "In Meters",
    // Add more placeholder values here for additional attributes
  };

  const allDivs = placeholders.map((placeholder, index) => (
    <div className="col-4 col-md-3 mb-3" key={index}>
      <div className="card position-relative bg-light" style={{ height: "140px" }}>
        {media.images[index] ? (
          <>
            <img
              src={URL.createObjectURL(media.images[index])}
              alt={`upload-${index}`}
              className="card-img-top"
              style={{ height: "100%", objectFit: "contain" }}
            />
            <button
              type="button"
              className="btn-close rounded-circle bg-white position-absolute top-0 end-0 m-2"
              style={{ padding: "5px", fontSize: "16px" }}
              aria-label="Close"
              onClick={() => removeMedia("images", index)}
            ></button>
            <div
              className="placeholder-caption text-center"
              style={{
                position: "absolute",
                bottom: "0",
                width: "100%",
                background: "rgba(255, 255, 255, 0.7)",
                padding: "5px 0",
                fontSize: "14px",
                color: "black",
              }}
            >
              {placeholder}
            </div>
          </>
        ) : (
          <div
            className="d-flex justify-content-center align-items-center"
            style={{
              height: "100%",
              backgroundColor: "rgba(255, 255, 255, 0.7)",
            }}
          >
            <div className="text-center">
              <p>{placeholder}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  ));

 // Add the addPhoto div if there's space available
const nextAvailableIndex = media.images.findIndex((image) => image === null);
if (nextAvailableIndex !== -1 && nextAvailableIndex < totalPlaceholders) {
  allDivs.splice(
    nextAvailableIndex,
    0,
    <div className="col-4 col-md-3 mb-3" key="addPhoto">
      <div
        className="card d-flex justify-content-center align-items-center bg-light"
        style={{ height: "140px" }}
      >
        <label className="w-100 text-center" htmlFor="addPhotoInput">
          <i className="bi bi-camera-fill fs-5"></i>
          <p>Add a photo</p>
        </label>
        <input
          id="addPhotoInput"
          type="file"
          accept="image/jpeg, image/png"
          multiple
          onChange={(e) => handleAddMediaChange(e, "images")}
          style={{ display: "none" }}
        />
      </div>
    </div>
  );
}

allDivs.push(
  <div className="col-4 col-md-3 mb-3" key="addVideo">
    <div
      className="card d-flex justify-content-center align-items-center bg-light"
      style={{ height: "140px" }}
      title="Accepts only MP4, WEBM, AVI, MOV formats"
    >
      {media.video ? (
        <>
          <video
            controls
            src={URL.createObjectURL(media.video)}
            style={{
              height: "100%",
              width: "100%",
              objectFit: "contain",
              display: "flex",
              alignItems: "center",
            }}
          />
          <button
            type="button"
            className="btn-close rounded-circle bg-white position-absolute top-0 end-0 m-2"
            style={{ padding: "5px", fontSize: "16px" }}
            aria-label="Close"
            onClick={() => removeMedia("video")}
          ></button>
        </>
      ) : (
        <>
          <label className="w-100 text-center" htmlFor="addVideoInput">
            <i className="bi bi-camera-reels-fill fs-5"></i>
            <p>Add a video</p>
          </label>
          <input
            id="addVideoInput"
            type="file"
            accept="video/mp4, video/webm, video/avi, video/mov"
            onChange={(e) => handleAddMediaChange(e, "video")}
            style={{ display: "none" }}
          />
        </>
      )}
    </div>
  </div>
);
  return (
    <div className="fullscreen">
      <MyNavbar />
      {notification && <Notification message={notification.message} type={notification.type} onClose={() => setNotification(null)} />}

      <div className="d-md-flex">
        <div className="col-12">
          <div className="fullscreen2">
            <main>
              <div className="container">
                <div className="row justify-content-center">
                  <div className="col-xs-12 col-sm-8 col-md-9z col-lg-6">
                    <h1 className="mt-4 fs-3">List an item</h1>
                    <hr className="mb-4" />
                    <form className="mb-4" onSubmit={handleSubmit}>
                      <div className="mb-3">
                        <label
                          htmlFor="producttype"
                          className="form-label fw-bolder"
                        >
                          Product Type
                        </label>
                        <div className="d-flex">
                          <select
                            id="producttype"
                            name="producttype"
                            className="form-select"
                            onChange={handleProducttype}
                            required
                          >
                            <option value="">Select Product Type</option>
                            <option value="women">Women</option>
                            <option value="kids">Kids</option>
                            <option value="jewellery">Jewellery</option>
                          </select>
                          <span className="text-danger fs-4"> &nbsp;*</span>
                        </div>
                      </div>
                      <div className="mb-3">
                        <label
                          htmlFor="category"
                          className="form-label fw-bolder"
                        >
                          Product Category
                        </label>
                        <div className="d-flex">
                          <select
                            id="category"
                            value={values.category}
                            className="form-select"
                            name="category"
                            onChange={handleInput}
                            required
                          >
                            <option value="">Select Category</option>
                            {categories.map((item, index) => {
                              return (
                                <option value={item} key={index}>
                                  {item}
                                </option>
                              );
                            })}
                          </select>
                          <span className="text-danger fs-4"> &nbsp;*</span>
                        </div>
                      </div>
                      <div className="mb-3">
                        <label
                          htmlFor="productname"
                          className="form-label fw-bolder"
                        >
                          Product Name
                        </label>
                        <div className="d-flex">
                          <input
                            type="text"
                            className="form-control"
                            id="productname"
                            name="productname"
                            placeholder="Product Name"
                            value={values.productname}
                            ref={productnameInputRef}
                            onChange={(e) => {
                              handleInput(e);
                              handleKeyup(e);
                            }}
                            title="Enter product name less than 90 chars"
                            required
                          />
                          <span className="text-danger fs-4"> &nbsp;*</span>
                        </div>
                        {errors.productname && (
                          <span className="text-danger fs-6">
                            {errors.productname}
                          </span>
                        )}
                      </div>
                      <div className="mb-4">
                        <div className="">
                          <label
                            htmlFor="Images"
                            className="form-label fw-bolder"
                          >
                            Upload Images & Video
                          </label>

                          <div className="row">{allDivs}</div>

                          {/* SVG icons */}
                          <svg style={{ display: "none" }}>
                            <symbol id="photo" viewBox="0 0 24 24">
                              <path d="M12 2a9 9 0 11-6.363 15.364L12 12l6.363 6.364A9 9 0 0112 2z"></path>
                            </symbol>
                            <symbol id="video" viewBox="0 0 24 24">
                              <path d="M12 2a9 9 0 11-6.363 15.364L12 12l6.363 6.364A9 9 0 0112 2z"></path>
                            </symbol>
                          </svg>
                          {errors.files && (
                            <p className="text-danger">{errors.files}</p>
                          )}
                           {errors.video && (
        <p className="text-danger">{errors.video}</p>
    )}
                        </div>
                      </div>
                      <div className="mb-3">
                        <label
                          htmlFor="productdescription"
                          className="form-label fw-bolder"
                        >
                          Product Description
                        </label>
                        <div className="d-flex">
                          <textarea
                            className="form-control"
                            id="productdescription"
                            name="productdescription"
                            placeholder="Product Description"
                            value={values.productdescription}
                            onChange={handleInput}
                            ref={productdescriptionInputRef}
                            required
                          ></textarea>
                          <span className="text-danger fs-4"> &nbsp;*</span>
                        </div>
                      </div>

                      <div className="mb-3">
                        <label htmlFor="color" className="form-label fw-bolder">
                          Color
                        </label>
                        <div className="d-flex">
                          <input
                            type="text"
                            className="form-control"
                            id="color"
                            name="color"
                            placeholder="Color"
                            value={values.color}
                            onChange={handleInput}
                            ref={colorInputRef}
                            required
                          />
                          <span className="text-danger fs-4"> &nbsp;*</span>
                        </div>
                      </div>

                      <div className="mb-3">
                        <label
                          htmlFor="location"
                          className="form-label fw-bolder"
                        >
                          Location
                        </label>
                        <div className="d-flex">
                          <input
                            type="text"
                            className="form-control"
                            id="location"
                            name="location"
                            placeholder="Location"
                            value={values.location}
                            ref={locationInputRef}
                            onChange={handleInput}
                            required
                          />
                          <span className="text-danger fs-4"> &nbsp;*</span>
                        </div>
                      </div>
                      {values.producttype !== "women" && (
                        <div className="mb-3">
                          <label
                            htmlFor="alteration"
                            className="form-label fw-bolder"
                          >
                            Alteration
                          </label>
                          <div className="d-flex">
                            <select
                              id="alteration"
                              name="alteration"
                              className="form-select"
                              onChange={handleInput}
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
                      {values.producttype !== "jewellery" &&
                        values.category !== "Sarees" && (
                          <div className="mb-3">
                            <label
                              htmlFor="size"
                              className="form-label fw-bolder"
                            >
                              Size
                            </label>
                            <div className="d-flex">
                              <select
                                id="size"
                                value={values.size}
                                name="size"
                                className="form-select"
                                onChange={handleInput}
                                required
                              >
                                <option value="">Select Size</option>
                                {sizes.map((item, index) => {
                                  return (
                                    <option value={item} key={index}>
                                      {item}
                                    </option>
                                  );
                                })}
                              </select>
                              <span className="text-danger fs-4"> &nbsp;*</span>
                            </div>
                          </div>
                        )}
                      {/* {values.producttype !== "women" && (
                        <div className="mb-3">
                          <label
                            htmlFor="measurements"
                            className="form-label fw-bolder"
                          >
                            Measurements
                          </label>
                          <div className="d-flex">
                            <input
                              type="text"
                              className="form-control"
                              id="measurements"
                              name="measurements"
                              placeholder="Measurements (eg. 12 to 16)"
                              value={values.measurements}
                              onChange={handleInput}
                              required
                            />
                            <span className="text-danger fs-4"> &nbsp;*</span>
                          </div>
                        </div>
                      )} */}
                      { values.category !== "Sarees" && (
    <div className="mb-3">
        <label htmlFor="measurements" className="form-label fw-bolder">
            Measurements
        </label>
        <div className="d-flex">
            <input
                type="number"
                className="form-control"
                id="measurements"
                name="measurements"
                placeholder="In Inches "
                value={values.measurements}
                onChange={handleInput}
                min={1}
                required
            />
            <span className="text-danger fs-4"> &nbsp;*</span>
        </div>
    </div>
)}

                      {values.producttype !== "jewellery" &&
                        // values.producttype !== "women" &&
                         (
                          <div className="mb-3">
                            <label
                              htmlFor="material"
                              className="form-label fw-bolder"
                            >
                              Material
                            </label>
                            <div className="d-flex">
                              <select
                                className="form-select"
                                id="material"
                                name="material"
                                placeholder="Material (eg. Silk,Cotton etc.)"
                                value={values.material}
                                onChange={handleInput}
                                required
                              >
                                <option value="">Select Material</option>
                                <option value="NA">NA</option>
                                <option value="Silk">Silk</option>
                                <option value="Cotton">Cotton</option>
                                <option value="Pattu">Pattu</option>
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
                                <option value="Spandex Elastane">
                                  Spandex (Elastane)
                                </option>
                              </select>
                              <span className="text-danger fs-4"> &nbsp;*</span>
                            </div>
                          </div>
                        )}

                      <div className="mb-3">
                        <label
                          htmlFor="condition"
                          className="form-label fw-bolder"
                        >
                          Condition
                        </label>
                        <div className="d-flex">
                          <select
                            className="form-select"
                            id="condition"
                            name="condition"
                            value={values.condition}
                            onChange={handleInput}
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
                      {values.producttype !== "women" &&
                        values.producttype !== "jewellery" &&
                        values.producttype !== "kids" && (
                          <div className="mb-3">
                            <label
                              htmlFor="source"
                              className="form-label fw-bolder"
                            >
                              Source
                            </label>
                            <div className="d-flex">
                              <select
                                className="form-select"
                                id="source"
                                name="source"
                                value={values.source}
                                onChange={handleInput}
                                required
                              >
                                <option value="">Select source</option>
                                <option value="NA">NA</option>
                                <option value="Vintage">Vintage</option>
                                <option value="Preloved">Preloved</option>
                                <option value="Reworked/upcycled">
                                  Reworked / Upcycled
                                </option>
                                <option value="Custom">Custom</option>
                                <option value="Homemade">Homemade</option>
                                <option value="Deadstock">Deadstock</option>
                                <option value="Designer">Designer</option>
                                <option value="Repaired">Repaired</option>
                              </select>
                              <span className="text-danger fs-4"> &nbsp;*</span>
                            </div>
                          </div>
                        )}

{values.producttype !== "kids" &&(
 <div className="mb-3">
 <label htmlFor="age" className="form-label fw-bolder">
   Style
 </label>
 <div className="d-flex">
   <select
     className="form-select"
     id="age"
     name="age"
     value={values.age}
     onChange={handleInput}
     required
   >
     <option value="">Select Style</option>
     <option value="NA">NA</option>
     <option value="Modern">Modern</option>
     <option value="00s">00s</option>
     <option value="90s">90s</option>
     <option value="80s">80s</option>
     <option value="70s">70s</option>
     <option value="60s">60s</option>
     <option value="50s">50s</option>
     <option value="Antique">Antique</option>
   </select>
   <span className="text-danger fs-4"> &nbsp;*</span>
 </div>
</div>
)}
                     

                      {/* <div className="mb-3">
                        <label
                          htmlFor="quantity"
                          className="form-label fw-bolder"
                        >
                          Quantity
                        </label>
                        <div className="d-flex">
                          <select
                            className="form-select"
                            id="quantity"
                            name="quantity"
                            placeholder="Enter Quantity"
                            value={values.quantity}
                            onChange={handleInput}
                            required
                          >
                            <option value="">Select Quantity</option>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                          </select>
                          <span className="text-danger fs-4"> &nbsp;*</span>
                        </div>
                      </div> */}
                      <div className="mb-3">
    <label htmlFor="quantity" className="form-label fw-bolder">
        Quantity
    </label>
    <div className="d-flex">
        <input
            type="number"
            className="form-control"
            id="quantity"
            name="quantity"
            placeholder="Enter Quantity"
            value={values.quantity}
            onChange={handleInput}
            min="1"
            max="99"
            required
        />
        <span className="text-danger fs-4"> &nbsp;*</span>
    </div>
</div>

                      <div className="mb-3">
                        <label htmlFor="price" className="form-label fw-bolder">
                          Price
                        </label>
                        <div className="d-flex">
                          <input
                            type="number"
                            className="form-control"
                            id="price"
                            name="price"
                            placeholder="&#36;"
                            value={values.price}
                            onChange={handleInput}
                            min="1"
                            pattern="[0-9]+"
                            title="Price must be positive numbers"
                            required
                          />
                          <span className="text-danger fs-4"> &nbsp;*</span>
                        </div>
                      </div>
                      <div className="mb-3">
                        <label htmlFor="notes" className="form-label fw-bolder">
                          Notes
                        </label>
                        <div className="d-flex">
                          <textarea
                            className="form-control"
                            id="notes"
                            name="notes"
                            placeholder="Notes (Optional)"
                            value={values.notes}
                            onChange={handleInput}
                            ref={notesInputRef}
                            // required
                          ></textarea>
                          {/* <span className="text-danger fs-4"> &nbsp;*</span> */}
                        </div>
                      </div>

                      {/* {customAttributes.map((attribute) => (
                        <div key={attribute.name} className="mb-3">
                          <label
                            htmlFor={attribute.name}
                            className="form-label"
                          >
                            <b>{attribute.name}</b>
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id={attribute.name}
                            placeholder={placeholderValues[attribute.name]}
                            value={attribute.value}
                            onChange={(event) =>
                              handleInputChange(event, attribute.name)
                            }
                          />
                        </div>
                      ))} */}
                     {customAttributes.map((attribute) => (
        <div key={attribute.name} className="mb-3">
          <label htmlFor={attribute.name} className="form-label">
            <b>{attribute.name}</b>
          </label>
          <input
            type={attribute.name === "Length" ? "number" : "text"}
            className="form-control"
            id={attribute.name}
            name={attribute.name}
            placeholder={placeholderValues[attribute.name]}
            value={attribute.value}
            onChange={(e) => handleInputChange(e, attribute.name, attributeRefs[attribute.name])}
            ref={attributeRefs[attribute.name]}
            min={attribute.name === "Length" ? "1" : undefined}
          />
        </div>
      ))}

                      {/* <div className="mb-3">
                        <button
                          type="button"
                          className="btn btn-primary mb-3"
                          onClick={handleAddAttribute}
                        >
                          Add Custom Attribute
                        </button>
                        <div
                          className="modal"
                          style={{ display: showModal ? "block" : "none" }}
                        >
                          <div className="modal-dialog">
                            <div className="modal-content">
                              <div className="modal-header">
                                <h5 className="modal-title">
                                  Select Custom Attributes
                                </h5>
                                <button
                                  type="button"
                                  className="btn-close"
                                  onClick={() => setShowModal(false)}
                                ></button>
                              </div>
                              <div className="modal-body">
                                {attributeOptions.map((option) => (
                                  <div key={option} className="form-check">
                                    <input
                                      type="checkbox"
                                      className="form-check-input"
                                      id={option}
                                      checked={selectedAttributes.includes(
                                        option
                                      )}
                                      onChange={() =>
                                        handleCheckboxChange(option)
                                      }
                                    />
                                    <label
                                      className="form-check-label"
                                      htmlFor={option}
                                    >
                                      {option}
                                    </label>
                                  </div>
                                ))}
                              </div>
                              <div className="modal-footer">
                                <button
                                  type="button"
                                  className="btn btn-secondary"
                                  onClick={() => setShowModal(false)}
                                >
                                  Close
                                </button>
                                <button
                                  type="button"
                                  className="btn btn-primary"
                                  onClick={handleModalSubmit}
                                  disabled={selectedAttributes.length === 0}
                                >
                                  Submit
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div> */}
                      <div className="mb-3">
    <button
        type="button"
        className="btn btn-primary mb-3"
        onClick={handleAddAttribute}
    >
        Add Custom Attribute
    </button>
    <div className="modal" style={{ display: showModal ? "block" : "none" }}>
        <div className="modal-dialog">
            <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title">Select Custom Attributes</h5>
                    <button
                        type="button"
                        className="btn-close"
                        onClick={() => setShowModal(false)}
                    ></button>
                </div>
                <div className="modal-body">
                    {attributeOptions.map((option) => (
                        <div key={option} className="form-check">
                            <input
                                type="checkbox"
                                className="form-check-input"
                                id={option}
                                checked={selectedAttributes.includes(option)}
                                onChange={() => handleCheckboxChange(option)}
                            />
                            <label className="form-check-label" htmlFor={option}>
                                {option}
                            </label>
                        </div>
                    ))}
                </div>
                <div className="modal-footer">
                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => setShowModal(false)}
                    >
                        Close
                    </button>
                    <button
                        type="button"
                        className="btn btn-primary"
                        onClick={handleModalSubmit}
                        disabled={selectedAttributes.length === 0}
                    >
                        Submit
                    </button>
                </div>
            </div>
        </div>
    </div>
</div>

                      <div className="text-center">
                        <button
                          type="submit"
                          className="btn btn-success me-2"
                          id="btn-save"
                          name="btn-save"
                          disabled={disabled}  // Disable the button if disabled state is true
                        >
                          <i className="bi bi-save2-fill"></i>&nbsp; Save
                        </button>
                        <button className="btn btn-danger" type="reset">
                          <i className="bi bi-trash-fill"></i>&nbsp; Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </main>
            <Footer />
            <Scrolltotopbtn/>
          </div>
        </div>
      </div>
    </div>
  );
}
