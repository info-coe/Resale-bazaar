// import React, { useState } from 'react';
// import '@fortawesome/fontawesome-free/css/all.min.css';
// import 'bootstrap-icons/font/bootstrap-icons.css';
// import Footer from '../footer';
// import MyNavbar from '../navbar';
// import { Link } from 'react-router-dom';

// function ReviewRatings() {
//   const [activeRating, setActiveRating] = useState(0);
//   const [selectedFiles, setSelectedFiles] = useState([]);
//   const [errorMessage, setErrorMessage] = useState('');

//   const handleRatingClick = (rating) => {
//     setActiveRating(rating);
//   };

//   const handleFileChange = (event) => {
//     const files = Array.from(event.target.files);
//     const imageFiles = files.filter(file => file.type.startsWith('image/'));
//     const newFiles = [...selectedFiles, ...imageFiles];

//     if (newFiles.length > 5) {
//       setErrorMessage('You can only upload up to 5 images.');
//     } else {
//       setSelectedFiles(newFiles);
//       setErrorMessage('');
//     }
//   };

//   const handleRemoveImage = (index) => {
//     const newFiles = selectedFiles.filter((_, i) => i !== index);
//     setSelectedFiles(newFiles);
//   };

//   return (
//     <div className='fullscreen'>
//         <MyNavbar/>
//     <main>
//         <div className='d-flex justify-content-center'>
//     <div className="review p-2 col-md-6 col-lg-4 col-12 mt-5">
//       <div className="fb-form">
//         {/* <h4>Tell us what you think</h4> */}

//              <div>
//                 <h4 className="">Tell us what you think</h4>
//              </div>
//               <hr />
//               <div className="text-end">
//                   <Link to="/orders" className="text-decoration-none">
//                     Back to Orders
//                   </Link>
//               </div>

//         <h6 className='mt-4'>Rate this product</h6>
//         <div className="rating pt-3 pb-3">
//           {[1, 2, 3, 4, 5].map((star) => (
//             <i
//               key={star}
//               className={`fa fa-star ${star <= activeRating ? 'active-rating' : ''}`}
//               onClick={() => handleRatingClick(star)}
//             />
//           ))}
//         </div>
//         <h6>Review this product</h6>
//         <textarea id="fb-comment" className="form-control" placeholder="Description.."></textarea>
//         <input type="text" className='form-control' placeholder='Review title..'/>
//         <div className="border ms-2" style={{ width: "50px", cursor: "pointer" }} onClick={() => document.getElementById('file-input').click()}>
//           <i className="bi bi-camera-fill fs-2 m-2"></i>
//         </div>
//         <input type="file" id="file-input" style={{ display: 'none' }} multiple accept="image/*" onChange={handleFileChange} />
//         <div className="image-preview mt-2">
//           {selectedFiles.map((file, index) => (
//             <div key={index} className="image-container1">
//               <img src={URL.createObjectURL(file)} alt={`Preview ${index}`} width="70" height="70" />
//               <button className="remove-button" onClick={() => handleRemoveImage(index)}>×</button>
//             </div>
//           ))}
//         </div>
//         {errorMessage && <p className="error-message">{errorMessage}</p>}
//         <input type="submit" className="form-control btn btn-primary mt-4" />
//       </div>
//     </div>
//     </div>
//     </main>
//     <Footer/>
//     </div>
//   );
// }

// export default ReviewRatings;


import React, { useState } from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import Footer from '../footer';
import MyNavbar from '../navbar';
import { Link } from 'react-router-dom';

function ReviewRatings() {
  const [activeRating, setActiveRating] = useState(0);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [values, setValues] = useState({
    rating: "",
    description: "",
    title: "",
    images: []
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

  const handleSubmit = (event) => {
    event.preventDefault();
    // Here you can use 'values' to submit the form data or perform other actions
    console.log('Submitted values:', values);
    // Reset form or perform other actions after submission
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
