import React, { useState } from "react";
import axios from "axios";
import MyNavbar from "../navbar";
import Footer from "../footer";
export default function Addnewproduct() {
  const [categories, setCategories] = useState([]);
  const [sizes, setSizes] = useState([]);

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
    accepted_by_admin: "false",
    seller_id: sessionStorage.getItem("user-token") || "", // Ensure this correctly fetches the user token
  });
  const [selectedAttributes, setSelectedAttributes] = useState([]);
  const [customAttributes, setCustomAttributes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [errors, setErrors] = useState({});
 
  const placeholders = ['Cover', 'Back', 'Detail', 'Forward', 'Label', 'Side'];
  const totalPlaceholders = placeholders.length;

  const [media, setMedia] = useState({
    images: Array(totalPlaceholders).fill(null),
    video: null
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

    if (type === 'images') {
      files.forEach((file) => {
        const nextAvailableIndex = newMedia.images.findIndex(image => image === null);
        if (nextAvailableIndex !== -1) {
          newMedia.images[nextAvailableIndex] = file;
        }
      });
    } else if (type === 'video' && files.length > 0) {
      newMedia.video = files[0];
    }

    setMedia(newMedia);
  };

  const removeMedia = (type, index) => {
    const newMedia = { ...media };

    if (type === 'images') {
      newMedia.images.splice(index, 1, null); // Replace removed image with null
    } else if (type === 'video') {
      newMedia.video = null;
    }

    setMedia(newMedia);
  };

  // const removeImage = (index) => {
  //   const newImages = [...images];
  //   newImages.splice(index, 1); // Remove the image at the specified index
  //   newImages.push(null); // Add a null placeholder to maintain the length of the array

  //   setImages(newImages);
  // };
  
 
  const handleKeyup = (e) => {
    const { name, value } = e.target;
    const newErrors = { ...errors };


    // Validate product name length onBlur
    if (
      name === "productname" &&
      value.length > 90
    ) {
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


  // const handleInput = (event) => {
  //   const { name, value } = event.target;

  //   // Capitalize the first letter of the entire input string
  //   const capitalizedValue = value.charAt(0).toUpperCase() + value.slice(1);

  //   setValues((prevValues) => ({
  //     ...prevValues,
  //     [name]: capitalizedValue,
  //   }));

  //   handleKeyup(event, capitalizedValue);
  // };
  const handleInput = (event) => {
    const { name, value } = event.target;

    // Capitalize the first letter of each word in the input string
    const capitalizeWords = (str) => {
        return str.split(' ').map(word => {
            return word.charAt(0).toUpperCase() + word.slice(1);
        }).join(' ');
    };

    const capitalizedValue = capitalizeWords(value);

    setValues((prevValues) => ({
        ...prevValues,
        [name]: capitalizedValue,
    }));

    handleKeyup(event, capitalizedValue);
};

 

  // const handleInputChange = (event, attribute) => {
  //   const value = event.target.value;
  //   const capitalizedValue = value.charAt(0).toUpperCase() + value.slice(1);
  //   setCustomAttributes(
  //     customAttributes.map((item) =>
  //       item.name === attribute ? { ...item, value: capitalizedValue } : item
  //     )
  //   );
  // };

  const handleInputChange = (event, attribute) => {
    const value = event.target.value;

    // Capitalize the first letter of each word in the input string
    const capitalizeWords = (str) => {
        return str.split(' ').map(word => {
            return word.charAt(0).toUpperCase() + word.slice(1);
        }).join(' ');
    };

    const capitalizedValue = capitalizeWords(value);

    setCustomAttributes(
      customAttributes.map((item) =>
        item.name === attribute ? { ...item, value: capitalizedValue } : item
      )
    );
};


  const handleProducttype = (event) => {
    setValues((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));

    if (event.target.name === "producttype") {
      if (event.target.value === "women") {
        setCategories([
          "Highendcouture",
          "Sarees",
          "Lehenga",
          "Dresses",
          "Twinning-outfits",
        ]);
        setSizes(["NA","XS", "S", "M", "L", "XL"]);
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

  const handleCheckboxChange = (attribute) => {
    if (selectedAttributes.includes(attribute)) {
      setSelectedAttributes(
        selectedAttributes.filter((item) => item !== attribute)
      );
    } else {
      setSelectedAttributes([...selectedAttributes, attribute]);
    }
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
    event.preventDefault();
    const isValid = validateForm();
  
    if (!isValid) {
      return;
    }
  
    const updatedValues = { ...values };
  
    if (values.producttype === "jewellery") {
      updatedValues.size = "NA";
      updatedValues.material = "NA";
    }
  
    const formData = new FormData();
    const allMedia = [];
  
    media.images.forEach((image) => {
      if (image) {
        formData.append('media', image);
        allMedia.push(image);
      }
    });
  
    if (media.video) {
      formData.append('media', media.video);
      allMedia.push(media.video);
    }
  
    for (const key in updatedValues) {
      formData.append(key, updatedValues[key]);
    }
  
    customAttributes.forEach((attribute) => {
      formData.append(attribute.name, attribute.value);
    });
  
    formData.append('allMedia', JSON.stringify(allMedia.map(file => file.name))); // Store media filenames
  
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/addproducts`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          }
        }
      );
  
      if (response.data === "Error") {
        alert("Error while adding product. Please try again filling all the fields");
      } else {
        alert("Product added successfully");
        window.location.reload(false);
      }
    } catch (error) {
      console.error("Error:", error);
      // Handle specific error cases as needed
    }
  };
  
  
  
  const attributeOptions = [
    "Occasion",
    "Type",
    "Brand",
    "Style",
    "Season",
    "Fit",
    "Length",
    // Add more attribute options here
  ];
  const placeholderValues = {
    Occasion: "Enter Occasion (eg. Function,Party)",
    Type: "Enter Type",
    Brand: "Enter Brand Name",
    Style: "Enter Style",
    Season: "Enter Season (eg. Summer,Winter)",
    Fit: "Enter Fit",
    Length: "Enter Length",
    // Add more placeholder values here for additional attributes
  };
  


const allDivs = placeholders.map((placeholder, index) => (
  <div className="col-4 col-md-3  mb-3" key={index}>
    <div className="card position-relative bg-light" style={{ height: '140px' }}>
      {media.images[index] ? (
        <>
          <img src={URL.createObjectURL(media.images[index])} alt={`upload-${index}`} className="card-img-top" style={{ height: '100%',objectFit:"contain" }} />
          <button
            type="button"
            className="btn-close rounded-circle bg-white position-absolute top-0 end-0 m-2"
            style={{ padding: '5px', fontSize: '16px' }}
            aria-label="Close"
            onClick={() => removeMedia('images', index)}
          ></button>
          <div className="placeholder-caption text-center" style={{ position: 'absolute', bottom: '0', width: '100%', background: 'rgba(255, 255, 255, 0.7)', padding: '5px 0', fontSize: '14px', color: 'black' }}>
            {placeholder}
          </div>
        </>
      ) : (
        <div className="d-flex justify-content-center align-items-center" style={{ height: '100%', backgroundColor: 'rgba(255, 255, 255, 0.7)' }}>
          <div className="text-center">
            <p>{placeholder}</p>
          </div>
        </div>
      )}
    </div>
  </div>
));

// Add the addPhoto div if there's space available
const nextAvailableIndex = media.images.findIndex(image => image === null);
  if (nextAvailableIndex !== -1 && nextAvailableIndex < totalPlaceholders) {
    allDivs.splice(nextAvailableIndex, 0, (
      <div className="col-4 col-md-3 mb-3" key="addPhoto">
        <div className="card d-flex justify-content-center align-items-center bg-light" style={{ height: '140px' }}>
          <label className="w-100 text-center" htmlFor="addPhotoInput">
           
            <i className="bi bi-camera-fill fs-5"></i>
            <p>Add a photo</p>
          </label>
          <input
            id="addPhotoInput"
            type="file"
            accept="image/jpeg, image/png"
            multiple
            onChange={(e) => handleAddMediaChange(e, 'images')}
            style={{ display: 'none' }}
          />
        </div>
      </div>
    ));
  }
  allDivs.push(
    <div className="col-4 col-md-3 mb-3" key="addVideo">
      <div className="card d-flex justify-content-center align-items-center bg-light" style={{ height: '140px' }}>
        {media.video ? (
          <>
            <video controls src={URL.createObjectURL(media.video)} style={{ height: '100%', width:"100%", objectFit:"contain", display:"flex", alignItems:"center" }} />
            <button
              type="button"
              className="btn-close rounded-circle bg-white position-absolute top-0 end-0 m-2"
              style={{ padding: '5px', fontSize: '16px' }}
              aria-label="Close"
              onClick={() => removeMedia('video')}
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
              accept="video/mp4, video/webm"
              onChange={(e) => handleAddMediaChange(e, 'video')}
              style={{ display: 'none' }}
            />
          </>
        )}
      </div>
    </div>
  );
  return (
    <div className="fullscreen">
      <MyNavbar/>
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
     
      
     
        <div className="row">
          {allDivs}
        </div>
       

      {/* SVG icons */}
      <svg style={{ display: 'none' }}>
        <symbol id="photo" viewBox="0 0 24 24">
          <path d="M12 2a9 9 0 11-6.363 15.364L12 12l6.363 6.364A9 9 0 0112 2z"></path>
        </symbol>
        <symbol id="video" viewBox="0 0 24 24">
          <path d="M12 2a9 9 0 11-6.363 15.364L12 12l6.363 6.364A9 9 0 0112 2z"></path>
        </symbol>
      </svg>
      {errors.files && <span className="text-danger">{errors.files}</span>}
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
                            required
                          ></textarea>
                          <span className="text-danger fs-4"> &nbsp;*</span>
                        </div>
                      </div>
                     
                       
                        <div className="mb-3">
                          <label
                            htmlFor="color"
                            className="form-label fw-bolder"
                          >
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
                            onChange={handleInput}
                            required
                          />
                          <span className="text-danger fs-4"> &nbsp;*</span>
                        </div>
                      </div>
                      
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
                      {values.producttype !== "jewellery" &&
                         (
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
                              placeholder="Measurements (eg. 32 to 36)"
                              value={values.measurements}
                              onChange={handleInput}
                              required
                            />
                            <span className="text-danger fs-4"> &nbsp;*</span>
                          </div>
                        </div>
                      
                      {values.producttype !== "jewellery" &&
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
                                <option value="Brand New">
                                  Brand New
                                </option>
                                <option value="Like New">
                                  Like New
                                </option>
                                <option value="Excellent">
                                  Used - Excellent 
                                </option>
                                <option value="Good">
                                  Used - Good
                                </option>
                                <option value="Fair">
                                  Used - Fair
                                </option>
                              </select>
                              <span className="text-danger fs-4"> &nbsp;*</span>
                            </div>
                          </div>
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
                       
                      <div className="mb-3">
                        <label htmlFor="age" className="form-label fw-bolder">
                          Age
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
                      <div className="mb-3">
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
                          </select>
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
                            placeholder="Price"
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
                     
                       {customAttributes.map((attribute) => (
          <div key={attribute.name} className="mb-3">
            <label htmlFor={attribute.name} className="form-label">
              {attribute.name}
            </label>
            <input
              type="text"
              className="form-control"
              id={attribute.name}
              placeholder={placeholderValues[attribute.name]}
              value={attribute.value}
              onChange={(event) => handleInputChange(event, attribute.name)}
            />
          </div>
        ))}
                        
                        <div className="mb-3">
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
            <Footer/>
          </div>
        </div>
      </div>
    </div>
  );
}
