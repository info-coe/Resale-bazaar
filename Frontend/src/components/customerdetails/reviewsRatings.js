import React, { useState } from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import Footer from '../footer';
import MyNavbar from '../navbar';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';

function ReviewRatings() {
  const location = useLocation();
  const { filteredProducts } = location.state || {};
  const productData = filteredProducts || {}
  console.log(productData)
  const sellerID = productData.seller_id
  const buyerID = productData.buyer_id
  const [activeRating, setActiveRating] = useState(0);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [values, setValues] = useState({
    rating: "",
    description: "",
    title: "",
    images: [],
    sellerId:sellerID,
    buyerId :buyerID
  });

  const handleRatingClick = (rating) => {
    setActiveRating(rating);
    setValues((prevValues) => ({
      ...prevValues,
      rating: rating
    }));
  };

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    const newFiles = [...selectedFiles, ...imageFiles];

    if (newFiles.length > 5) {
      setErrorMessage('You can only upload up to 5 images.');
    } else {
      setSelectedFiles(newFiles);
      setValues((prevValues) => ({
        ...prevValues,
        images: newFiles
      }));
      setErrorMessage('');
    }
  };

  const handleRemoveImage = (index) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(newFiles);
    setValues((prevValues) => ({
      ...prevValues,
      images: newFiles
    }));
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setValues((prevValues) => ({
      ...prevValues,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append('rating', values.rating);
    formData.append('description', values.description);
    formData.append('title', values.title);
    formData.append('sellerId', values.sellerId); 
    formData.append('buyerId',values.buyerId)
    values.images.forEach(image => {
      formData.append('images', image); 
    });

    try {
      const response = await axios.post(`${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/reviews`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log('Review added successfully:', response.data);
      // Handle success (e.g., show a success message)
    } catch (error) {
      console.error('Error adding review:', error);
      // Handle error (e.g., show an error message)
    }
  };

  return (
    <div className='fullscreen'>
      <MyNavbar />
      <main>
        <div className='d-flex justify-content-center'>
          <div className="review p-2 col-md-6 col-lg-4 col-12 mt-5">
            <div className="fb-form">
              <div>
                <h4 className="">Tell us what you think</h4>
              </div>
              <hr />
              <div className="text-end">
                <Link to="/orders" className="text-decoration-none">
                  Back to Orders
                </Link>
              </div>

              <h6 className='mt-4'>Rate this product</h6>
              <div className="rating pt-3 pb-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <i
                    key={star}
                    className={`fa fa-star ${star <= activeRating ? 'active-rating' : ''}`}
                    onClick={() => handleRatingClick(star)}
                  />
                ))}
              </div>
              <h6>Review this product</h6>
              <textarea
                id="fb-comment"
                name="description"
                className="form-control"
                placeholder="Description.."
                value={values.description}
                onChange={handleInputChange}
              ></textarea>
              <input
                type="text"
                id="review-title"
                name="title"
                className='form-control'
                placeholder='Review title..'
                value={values.title}
                onChange={handleInputChange}
              />
              <div className="border ms-2" style={{ width: "50px", cursor: "pointer" }} onClick={() => document.getElementById('file-input').click()}>
                <i className="bi bi-camera-fill fs-2 m-2"></i>
              </div>
              <input
                type="file"
                id="file-input"
                style={{ display: 'none' }}
                multiple
                accept="image/*"
                onChange={handleFileChange}
              />
              <div className="image-preview mt-2">
                {selectedFiles.map((file, index) => (
                  <div key={index} className="image-container1">
                    <img src={URL.createObjectURL(file)} alt={`Preview ${index}`} width="70" height="70" />
                    <button className="remove-button" onClick={() => handleRemoveImage(index)}>×</button>
                  </div>
                ))}
              </div>
              {errorMessage && <p className="error-message">{errorMessage}</p>}
              <button type="submit" className="form-control btn btn-primary mt-4" onClick={handleSubmit}>Submit</button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default ReviewRatings;
