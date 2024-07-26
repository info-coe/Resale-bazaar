import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useLocation, useParams } from "react-router-dom";
import MyNavbar from "../navbar";
import Footer from "../footer";
import "bootstrap/dist/css/bootstrap.min.css";
import Scrolltotopbtn from "../Scrolltotopbutton";
import Product from "../Product";
import InfiniteScroll from "react-infinite-scroll-component";
import Notification from "../Notification";

const SellerProfile = () => {
  const { sellerId } = useParams();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState("all");
  const pageSize = 8;
  const { state } = useLocation();
  const userDetails = state.userDetails[0];
  const [notification, setNotification] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    comment: "",
  });

  const nameInputRef = useRef(null);
  const commentInputRef = useRef(null);

  const { name, email, phone, comment } = formData;

  useEffect(() => {
    fetchProducts(page);
  }, [page]);

  useEffect(() => {
    applyFilter(filter);
  }, [products, filter]);

  const fetchProducts = async (pageNum) => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/allproductsall?limit=${pageSize}&page=${pageNum}&category=${sellerId}`
      );

      if (res.data !== "Fail" && res.data !== "Error") {
        const filterProducts = res.data;
        const existingProductIds = new Set(
          products.map((product) => product.id)
        );
        const newProducts = filterProducts.filter(
          (product) => !existingProductIds.has(product.id)
        );

        if (newProducts.length > 0) {
          setProducts((prevProducts) => [...prevProducts, ...newProducts]);
          setFilteredProducts((prevProducts) => [
            ...prevProducts,
            ...newProducts,
          ]);
        }

        if (filterProducts.length < pageSize) {
          setHasMore(false);
        }
      } else {
        setHasMore(false);
      }
    } catch (err) {
      console.log(err);
      setHasMore(false);
    }
  };

  const applyFilter = (filter) => {
    let updatedProducts = [...products];
    if (filter === "sold") {
      updatedProducts = products.filter((product) => product.quantity === 0);
    } else if (filter === "available") {
      updatedProducts = products.filter((product) => product.quantity > 0);
    }
    setFilteredProducts(updatedProducts);
  };

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
  };

  const capitalizeFirstLetterOfEveryWord = (str) => {
    return str.replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const capitalizeFirstLetter = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const handleInputChange = (e) => {
    const { id, value, selectionStart } = e.target;
    let updatedValue = value;

    if (id === "name") {
      updatedValue = capitalizeFirstLetterOfEveryWord(value);
    } else if (id === "comment") {
      updatedValue = capitalizeFirstLetter(value);
    }

    setFormData((prevFormData) => ({ ...prevFormData, [id]: updatedValue }));

    // Restore cursor position
    if (id === "name") {
      requestAnimationFrame(() => {
        nameInputRef.current.setSelectionRange(selectionStart, selectionStart);
      });
    } else if (id === "comment") {
      requestAnimationFrame(() => {
        commentInputRef.current.setSelectionRange(
          selectionStart,
          selectionStart
        );
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .post(
        `${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/contactseller`,
        {
          name,
          email,
          phone,
          comment,
          user_id: sellerId,
        }
      )
      .then((res) => {
        setNotification({ message: 'Data added successfully', type: 'success' });
        setTimeout(() => setNotification(null), 3000);
        window.location.reload(false);
      })
      .catch((err) => {
        console.error("Error posting data:", err);
      });
  };

  const renderStarRatings = (rating) => {
    const stars = [];
    const filledStars = Math.floor(rating);
    for (let i = 0; i < 5; i++) {
      stars.push(
        <i
          key={i}
          className={`bi ${
            i < filledStars ? "bi-star-fill text-warning" : "bi-star"
          } me-1`}
        ></i>
      );
    }
    return stars;
  };

  return (
    <>
      <MyNavbar />
      {notification && <Notification message={notification.message} type={notification.type} onClose={() => setNotification(null)} />}
      <div className="container mt-3">
        <div className="row">
          <div className="col-lg-12">
            <div className="seller-profile-header border">
              <div className="m-5">
                <h2 className="seller-name fs-1">
                  <i className="bi bi-person-circle fs-1"></i>&nbsp;
                  {userDetails.shopname == null || undefined || ""
                    ? userDetails.name
                    : userDetails.shopname}
                </h2>
                <button
                  className="btn btn-primary ms-5"
                  data-bs-toggle="modal"
                  data-bs-target="#exampleModal"
                >
                  Contact to Seller
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="container mt-5">
        <div className="row">
          <div className="col-lg-12">
            <h4 className="mb-4">
              <span style={{ fontSize: "22px" }}>Products by</span>{" "}
              <span className="text-secondary" style={{ fontStyle: "italic" }}>
                {userDetails.shopname == null || undefined || ""
                  ? userDetails.name
                  : userDetails.shopname}
              </span>
            </h4>
            <div className="filters mb-4">
              <button
                className={`btn btn-outline-primary me-2 ${
                  filter === "all" ? "active" : ""
                }`}
                onClick={() => handleFilterChange("all")}
              >
                Show All
              </button>
              <button
                className={`btn btn-outline-primary me-2 ${
                  filter === "available" ? "active" : ""
                }`}
                onClick={() => handleFilterChange("available")}
              >
                Available Products
              </button>
              <button
                className={`btn btn-outline-primary ${
                  filter === "sold" ? "active" : ""
                }`}
                onClick={() => handleFilterChange("sold")}
              >
                Sold Products
              </button>
            </div>

            <InfiniteScroll
              dataLength={filteredProducts.length}
              next={() => setPage((prevPage) => prevPage + 1)}
              hasMore={hasMore}
              loader={
                <div className="centered-message">
                  <i className="bi bi-arrow-clockwise spin-icon"></i>
                </div>
              }
              endMessage={
                <div className="centered-message">
                  <p>No more products to display</p>
                </div>
              }
            >
              <div className="product-grid container">
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product, index) => (
                    <Product product={product} key={index} admin="women" />
                  ))
                ) : (
                  <h2 style={{ fontSize: "18px" }}>No products to display</h2>
                )}
              </div>
            </InfiniteScroll>
          </div>
        </div>
      </div>

      <div
        className="modal fade"
        id="exampleModal"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                Contact to Seller
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label fw-bold">
                    Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    value={name}
                    onChange={handleInputChange}
                    placeholder="Enter Your Name"
                    ref={nameInputRef}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label fw-bold">
                    Email
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    name="email"
                    value={email}
                    onChange={handleInputChange}
                    placeholder="Enter Your Email"
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="phone" className="form-label fw-bold">
                    Phone
                  </label>
                  <input
                    type="tel"
                    className="form-control"
                    id="phone"
                    name="phone"
                    value={phone}
                    onChange={handleInputChange}
                    placeholder="Enter Your Phone Number"
                    pattern="[0-9]{10}"
                    title="10 digit numeric value only"
                    minLength={10}
                    maxLength={10}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="comment" className="form-label fw-bold">
                    Comment
                  </label>
                  <textarea
                    type="text"
                    className="form-control"
                    id="comment"
                    value={comment}
                    onChange={handleInputChange}
                    placeholder="Enter Comment"
                    ref={commentInputRef}
                  />
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    data-bs-dismiss="modal"
                  >
                    Close
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <Footer />
      <Scrolltotopbtn />
    </>
  );
};

export default SellerProfile;

// // Every word first letter uppercase
// import React, { useState, useEffect, useRef } from 'react';
// import axios from 'axios';
// import { Link, useParams } from 'react-router-dom';
// import MyNavbar from '../navbar';
// import Footer from '../footer';
// import 'bootstrap/dist/css/bootstrap.min.css';

// const SellerProfile = () => {
//   const { sellerId } = useParams();
//   const [sellerDetails, setSellerDetails] = useState({});
//   const [sellerProducts, setSellerProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     phone: '',
//     comment: ''
//   });

//   const nameInputRef = useRef(null);
//   const commentInputRef = useRef(null);

//   const { name, email, phone, comment } = formData;

//   const capitalizeFirstLetterOfEveryWord = (str) => {
//     return str.replace(/\b\w/g, char => char.toUpperCase());
//   };

//   const handleInputChange = (e) => {
//     const { id, value, selectionStart } = e.target;
//     let updatedValue = value;

//     if (id === 'name' || id === 'comment') {
//       updatedValue = capitalizeFirstLetterOfEveryWord(value);
//     }

//     setFormData((prevFormData) => ({ ...prevFormData, [id]: updatedValue }));

//     // Restore cursor position
//     if (id === 'name') {
//       requestAnimationFrame(() => {
//         nameInputRef.current.setSelectionRange(selectionStart, selectionStart);
//       });
//     } else if (id === 'comment') {
//       requestAnimationFrame(() => {
//         commentInputRef.current.setSelectionRange(selectionStart, selectionStart);
//       });
//     }
//   };

//   const handleSubmit = () => {
//     if (!name || !email || !phone) {
//       alert("Please fill out all required fields");
//       return;
//     }

//     axios.post(`${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/contactseller`, {
//       name,
//       email,
//       phone,
//       comment,
//       user_id: sellerId
//     })
//       .then(res => {
//         alert('Data added successfully');
//         setFormData({ name: '', email: '', phone: '', comment: '' });
//       }).catch(err => {
//         console.error('Error posting data:', err);
//       });
//   };

//   useEffect(() => {
//     axios.get(`${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/user`)
//       .then(res => {
//         if (res.data !== "Fail" && res.data !== "Error") {
//           const user = res.data.find(item => item.user_id.toString() === sellerId);
//           if (user) {
//             setSellerDetails({
//               userId: user.user_id,
//               email: user.email,
//               phone: user.phone,
//               name: `${user.firstname} ${user.lastname}`,
//               shopname: user.shopname
//             });
//           }
//         }
//       })
//       .catch(err => console.log(err));

//     axios.get(`${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/allproducts/`)
//       .then(res => {
//         if (res.data !== "Fail" && res.data !== "Error") {
//           const filteredProducts = res.data.filter(product => product.seller_id.toString() === sellerId);
//           setSellerProducts(filteredProducts);
//         }
//         setLoading(false);
//       })
//       .catch(err => {
//         console.log(err);
//         setLoading(false);
//       });
//   }, [sellerId]);

//   const renderStarRatings = (rating) => {
//     const stars = [];
//     const filledStars = Math.floor(rating);
//     for (let i = 0; i < 5; i++) {
//       stars.push(
//         <i key={i} className={`bi ${i < filledStars ? 'bi-star-fill text-warning' : 'bi-star'} me-1`}></i>
//       );
//     }
//     return stars;
//   };

//   return (
//     <>
//       <MyNavbar />
//       <div className="container mt-3">
//         <div className="row">
//           <div className="col-lg-12">
//             <div className="seller-profile-header border">
//               <div className='m-5'>
//                 <h2 className="seller-name fs-1">
//                   <i className="bi bi-person-circle fs-1"></i>&nbsp;{sellerDetails.shopname == null || undefined || '' ? sellerDetails.name : sellerDetails.shopname}
//                 </h2>
//                 <button className="btn btn-primary ms-5" data-bs-toggle="modal" data-bs-target="#exampleModal">
//                   Contact Seller
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//       <div className="container mt-5">
//         <div className="row">
//           <div className="">
//             <h4 className="mb-4"><span style={{ fontSize: "22px" }}>Products by</span> <span className='text-secondary' style={{ fontStyle: "italic" }}>{sellerDetails.shopname == null || undefined || '' ? sellerDetails.name : sellerDetails.shopname}</span></h4>
//             {loading ? (
//               <p>Loading...</p>
//             ) : sellerProducts.length === 0 ? (
//               <p>No products available.</p>
//             ) : (
//               <div className="d-flex flex-wrap justify-content-center ms-md-5 me-md-5 mb-4 mt-md-3 mt-3 ms-2 me-2">
//                 {sellerProducts.map(product => (
//                   <div className="card productcard" key={product.id}>
//                     <Link to={"/product/" + product.id} state={{ productdetails: product }}>
//                       <div className="text-center productimgback">
//                         <img
//                           src={`${JSON.parse(product.image)[0]}`}
//                           className="card-img-top"
//                           alt="product"
//                         />
//                       </div>
//                     </Link>
//                     <div className="card-body">
//                       <p className="card-text text-success">
//                         <b>&#36; {product.price}.00</b>
//                       </p>
//                       {product.size !== "NA" &&
//                         <h6 className="card-text" style={{ lineHeight: "8px" }}>{product.size}</h6>
//                       }
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       <div className="modal fade" id="exampleModal" aria-labelledby="exampleModalLabel" aria-hidden="true">
//         <div className="modal-dialog">
//           <div className="modal-content">
//             <div className="modal-header">
//               <h5 className="modal-title" id="exampleModalLabel">Contact Seller</h5>
//               <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
//             </div>
//             <div className="modal-body">
//               <form>
//                 <div className="mb-3">
//                   <label htmlFor="name" className="form-label fw-bold">Name</label>
//                   <input type="text" className="form-control" id="name" value={name} onChange={handleInputChange} placeholder='Enter Your Name' ref={nameInputRef} />
//                 </div>
//                 <div className="mb-3">
//                   <label htmlFor="email" className="form-label fw-bold">Email</label>
//                   <input type="email" className="form-control" id="email" value={email} onChange={handleInputChange} placeholder='Enter Your Email' />
//                 </div>
//                 <div className="mb-3">
//                   <label htmlFor="phone" className="form-label fw-bold">Phone</label>
//                   <input type="text" className="form-control" id="phone" value={phone} onChange={handleInputChange} placeholder='Enter Your Phone Number' />
//                 </div>
//                 <div className="mb-3">
//                   <label htmlFor="comment" className="form-label fw-bold">Comment</label>
//                   <textarea type="text" className="form-control" id="comment" value={comment} onChange={handleInputChange} placeholder='Enter Comment' ref={commentInputRef} />
//                 </div>
//               </form>
//             </div>
//             <div className="modal-footer">
//               <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
//               <button type="button" className="btn btn-primary" onClick={handleSubmit}>Save</button>
//             </div>
//           </div>
//         </div>
//       </div>

//       <Footer />
//     </>
//   );
// };

// export default SellerProfile;

// Every word first letter uppercase

// import React, { useState, useEffect, useRef } from 'react';
// import axios from 'axios';
// import { Link, useParams } from 'react-router-dom';
// import MyNavbar from '../navbar';
// import Footer from '../footer';
// import 'bootstrap/dist/css/bootstrap.min.css';

// const SellerProfile = () => {
//   const { sellerId } = useParams();
//   const [sellerDetails, setSellerDetails] = useState({});
//   const [sellerProducts, setSellerProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     phone: '',
//     comment: ''
//   });

//   const nameInputRef = useRef(null);
//   const commentInputRef = useRef(null);

//   const { name, email, phone, comment } = formData;

//   const capitalizeFirstLetter = (str) => {
//     if (str.length === 0) return str;
//     return str.charAt(0).toUpperCase() + str.slice(1);
//   };

//   const handleInputChange = (e) => {
//     const { id, value, selectionStart } = e.target;
//     let updatedValue = value;

//     if (id === 'name' || id === 'comment') {
//       updatedValue = capitalizeFirstLetter(value);
//     }

//     setFormData((prevFormData) => ({ ...prevFormData, [id]: updatedValue }), () => {
//       // Restore cursor position
//       if (id === 'name') {
//         nameInputRef.current.setSelectionRange(selectionStart, selectionStart);
//       } else if (id === 'comment') {
//         commentInputRef.current.setSelectionRange(selectionStart, selectionStart);
//       }
//     });
//   };

//   const handleSubmit = () => {
//     if (!name || !email || !phone) {
//       alert("Please fill out all required fields");
//       return;
//     }

//     axios.post(`${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/contactseller`, {
//       name,
//       email,
//       phone,
//       comment,
//       user_id: sellerId
//     })
//       .then(res => {
//         alert('Data added successfully');
//         setFormData({ name: '', email: '', phone: '', comment: '' });
//       }).catch(err => {
//         console.error('Error posting data:', err);
//       });
//   };

//   useEffect(() => {
//     axios.get(`${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/user`)
//       .then(res => {
//         if (res.data !== "Fail" && res.data !== "Error") {
//           const user = res.data.find(item => item.user_id.toString() === sellerId);
//           if (user) {
//             setSellerDetails({
//               userId: user.user_id,
//               email: user.email,
//               phone: user.phone,
//               name: `${user.firstname} ${user.lastname}`,
//               shopname: user.shopname
//             });
//           }
//         }
//       })
//       .catch(err => console.log(err));

//     axios.get(`${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/allproducts/`)
//       .then(res => {
//         if (res.data !== "Fail" && res.data !== "Error") {
//           const filteredProducts = res.data.filter(product => product.seller_id.toString() === sellerId);
//           setSellerProducts(filteredProducts);
//         }
//         setLoading(false);
//       })
//       .catch(err => {
//         console.log(err);
//         setLoading(false);
//       });
//   }, [sellerId]);

//   const renderStarRatings = (rating) => {
//     const stars = [];
//     const filledStars = Math.floor(rating);
//     for (let i = 0; i < 5; i++) {
//       stars.push(
//         <i key={i} className={`bi ${i < filledStars ? 'bi-star-fill text-warning' : 'bi-star'} me-1`}></i>
//       );
//     }
//     return stars;
//   };

//   return (
//     <>
//       <MyNavbar />
//       <div className="container mt-3">
//         <div className="row">
//           <div className="col-lg-12">
//             <div className="seller-profile-header border">
//               <div className='m-5'>
//                 <h2 className="seller-name fs-1">
//                   <i className="bi bi-person-circle fs-1"></i>&nbsp;{sellerDetails.shopname == null || undefined || '' ? sellerDetails.name : sellerDetails.shopname}
//                 </h2>
//                 <button className="btn btn-primary ms-5" data-bs-toggle="modal" data-bs-target="#exampleModal">
//                   Contact Seller
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//       <div className="container mt-5">
//         <div className="row">
//           <div className="">
//             <h4 className="mb-4"><span style={{ fontSize: "22px" }}>Products by</span> <span className='text-secondary' style={{ fontStyle: "italic" }}>{sellerDetails.shopname == null || undefined || '' ? sellerDetails.name : sellerDetails.shopname}</span></h4>
//             {loading ? (
//               <p>Loading...</p>
//             ) : sellerProducts.length === 0 ? (
//               <p>No products available.</p>
//             ) : (
//               <div className="d-flex flex-wrap justify-content-center ms-md-5 me-md-5 mb-4 mt-md-3 mt-3 ms-2 me-2">
//                 {sellerProducts.map(product => (
//                   <div className="card productcard" key={product.id}>
//                     <Link to={"/product/" + product.id} state={{ productdetails: product }}>
//                       <div className="text-center productimgback">
//                         <img
//                           src={`${JSON.parse(product.image)[0]}`}
//                           className="card-img-top"
//                           alt="product"
//                         />
//                       </div>
//                     </Link>
//                     <div className="card-body">
//                       <p className="card-text text-success">
//                         <b>&#36; {product.price}.00</b>
//                       </p>
//                       {product.size !== "NA" &&
//                         <h6 className="card-text" style={{ lineHeight: "8px" }}>{product.size}</h6>
//                       }
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       <div className="modal fade" id="exampleModal" aria-labelledby="exampleModalLabel" aria-hidden="true">
//         <div className="modal-dialog">
//           <div className="modal-content">
//             <div className="modal-header">
//               <h5 className="modal-title" id="exampleModalLabel">Contact Seller</h5>
//               <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
//             </div>
//             <div className="modal-body">
//               <form>
//                 <div className="mb-3">
//                   <label htmlFor="name" className="form-label fw-bold">Name</label>
//                   <input type="text" className="form-control" id="name" value={name} onChange={handleInputChange} placeholder='Enter Your Name' ref={nameInputRef} />
//                 </div>
//                 <div className="mb-3">
//                   <label htmlFor="email" className="form-label fw-bold">Email</label>
//                   <input type="email" className="form-control" id="email" value={email} onChange={handleInputChange} placeholder='Enter Your Email' />
//                 </div>
//                 <div className="mb-3">
//                   <label htmlFor="phone" className="form-label fw-bold">Phone</label>
//                   <input type="text" className="form-control" id="phone" value={phone} onChange={handleInputChange} placeholder='Enter Your Phone Number' />
//                 </div>
//                 <div className="mb-3">
//                   <label htmlFor="comment" className="form-label fw-bold">Comment</label>
//                   <textarea type="text" className="form-control" id="comment" value={comment} onChange={handleInputChange} placeholder='Enter Comment' ref={commentInputRef} />
//                 </div>
//               </form>
//             </div>
//             <div className="modal-footer">
//               <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
//               <button type="button" className="btn btn-primary" onClick={handleSubmit}>Save</button>
//             </div>
//           </div>
//         </div>
//       </div>

//       <Footer />
//     </>
//   );
// };

// export default SellerProfile;

// import React, { useState, useEffect, useRef } from 'react';
// import axios from 'axios';
// import { Link, useParams } from 'react-router-dom';
// import MyNavbar from '../navbar';
// import Footer from '../footer';
// import 'bootstrap/dist/css/bootstrap.min.css';

// const SellerProfile = () => {
//   const { sellerId } = useParams();
//   const [sellerDetails, setSellerDetails] = useState({});
//   const [sellerProducts, setSellerProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [formData, setFormData] = useState({
//     // user_id: sellerId,
//     name: '',
//     email: '',
//     phone: '',
//     comment:""
//   });
//   const nameInputRef = useRef(null);
//   const commentInputRef = useRef(null);

//   const { name, email, phone,comment } = formData;

//   // const handleInputChange = (e) => {
//   //   setFormData({ ...formData, [e.target.id]: e.target.value });
//   // };
//   const capitalizeFirstLetter = (str) => {
//     return str.replace(/\b\w/g, char => char.toUpperCase());
//   };

//   const handleInputChange = (e) => {
//     const { id, value, selectionStart } = e.target;
//     let capitalizedValue = value;

//     // Only capitalize first letter for name and comment
//     if (id === 'name' || id === 'comment') {
//       capitalizedValue = capitalizeFirstLetter(value);
//     }

//     setFormData({ ...formData, [id]: capitalizedValue }, () => {
//       // Restore the cursor position after updating the state
//       if (id === 'name') {
//         nameInputRef.current.setSelectionRange(selectionStart, selectionStart);
//       } else if (id === 'comment') {
//         commentInputRef.current.setSelectionRange(selectionStart, selectionStart);
//       }
//     });
//   };
//   const handleSubmit = () => {
//     // Basic validation
//     if (!name || !email || !phone) {
//       alert("Please fill out all required fields");
//       return;
//     }

//     axios.post(`${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/contactseller`, {
//       name,
//       email,
//       phone,
//       comment,
//       user_id: sellerId
//     })
//     .then(res => {
//       alert('Data added successfully');
//       setFormData({ name: '', email: '', phone: '', comment: '' });
//     }).catch(err => {
//       console.error('Error posting data:', err);
//       // Handle error
//     });
//   };

//   useEffect(() => {
//     // Fetch seller details including profile picture URL
//     axios.get(`${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/user`)
//       .then(res => {
//         if (res.data !== "Fail" && res.data !== "Error") {
//           const user = res.data.find(item => item.user_id.toString() === sellerId);
//           if (user) {
//             setSellerDetails({
//               userId: user.user_id,
//               email: user.email,
//               phone: user.phone,
//               name: `${user.firstname} ${user.lastname}`,
//               shopname:user.shopname
//             });
//           }
//         }
//       })
//       .catch(err => console.log(err));

//     axios.get(`${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/allproducts/`)
//       .then(res => {
//         if (res.data !== "Fail" && res.data !== "Error") {
//           const filteredProducts = res.data.filter(product => product.seller_id.toString() === sellerId);
//           setSellerProducts(filteredProducts);
//         }
//         setLoading(false);
//       })
//       .catch(err => {
//         console.log(err);
//         setLoading(false);
//       });
//   }, [sellerId]);
// //eslint-disable-next-line no-unused-vars
//   const renderStarRatings = (rating) => {
//     const stars = [];
//     const filledStars = Math.floor(rating);
//     for (let i = 0; i < 5; i++) {
//       stars.push(
//         <i key={i} className={`bi ${i < filledStars ? 'bi-star-fill text-warning' : 'bi-star'} me-1`}></i>
//       );
//     }
//     return stars;
//   };

//   return (
//     <>
//       <MyNavbar/>
//       <div className="container mt-3">
//         <div className="row">
//           <div className="col-lg-12">
//             <div className="seller-profile-header border">
//               <div className='m-5'>
//                 <h2 className="seller-name fs-1">
//                   <i className="bi bi-person-circle fs-1"></i>&nbsp;{sellerDetails.shopname==null||undefined||''?sellerDetails.name:sellerDetails.shopname}
//                   {/* {sellerDe tails.shopname} */}
//                 </h2>
//                 {/* <p className='ms-5'>{renderStarRatings(4)}</p> */}
//                 <button className="btn btn-primary ms-5" data-bs-toggle="modal" data-bs-target="#exampleModal">
//                   Contact Seller
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//       <div className="container mt-5">
//         <div className="row">
//           <div className="">
//             <h4 className="mb-4"><span style={{fontSize:"22px"}}>Products by</span> <span className='text-secondary' style={{fontStyle:"italic"}}>{sellerDetails.shopname==null||undefined||''?sellerDetails.name:sellerDetails.shopname}</span></h4>
//             {loading ? (
//               <p>Loading...</p>
//             ) : sellerProducts.length === 0 ? (
//               <p>No products available.</p>
//             ) : (
//               <div className="d-flex flex-wrap justify-content-center ms-md-5 me-md-5 mb-4 mt-md-3 mt-3 ms-2 me-2">
//                 {sellerProducts.map(product => (
//                   <div className="card productcard" key={product.id}>
//                     <Link to={"/product/" + product.id} state={{ productdetails: product }}>
//                       <div className="text-center productimgback">
//                         <img
//                           src={`${JSON.parse(product.image)[0]}`}
//                           className="card-img-top"
//                           alt="product"
//                         />
//                       </div>
//                     </Link>
//                     <div className="card-body">
//                       <p className="card-text text-success">
//                         <b>&#36; {product.price}.00</b>
//                       </p>
//                       {product.size !== "NA" &&
//                         <h6 className="card-text" style={{ lineHeight: "8px" }}>{product.size}</h6>
//                       }
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       <div className="modal fade" id="exampleModal"  aria-labelledby="exampleModalLabel" aria-hidden="true">
//   <div className="modal-dialog">
//     <div className="modal-content">
//       <div className="modal-header">
//         <h5 className="modal-title" id="exampleModalLabel">Contact Seller</h5>
//         <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
//       </div>
//       <div className="modal-body">
//         <form>
//           <div className="mb-3">
//             <label htmlFor="name" className="form-label fw-bold">Name</label>
//             <input type="text" className="form-control" id="name" value={name} onChange={handleInputChange} placeholder='Enter Your Name'  ref={nameInputRef}/>
//           </div>
//           <div className="mb-3">
//             <label htmlFor="email" className="form-label fw-bold">Email</label>
//             <input type="email" className="form-control" id="email" value={email} onChange={handleInputChange} placeholder='Enter Your Email'/>
//           </div>
//           <div className="mb-3">
//             <label htmlFor="phone" className="form-label fw-bold">Phone</label>
//             <input type="text" className="form-control" id="phone" value={phone} onChange={handleInputChange} placeholder='Enter Your Phone Number'/>
//           </div>
//           <div className="mb-3">
//             <label htmlFor="comment" className="form-label fw-bold">Comment</label>
//             <textarea  type="text" className="form-control" id="comment" value={comment} onChange={handleInputChange} placeholder='Enter Comment'  ref={commentInputRef}/>
//           </div>
//         </form>
//       </div>
//       <div className="modal-footer">
//         <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
//         <button type="button" className="btn btn-primary"  onClick={handleSubmit}>Save</button>
//       </div>
//     </div>
//   </div>
//       </div>

//       <Footer/>
//     </>
//   );
// };

// export default SellerProfile;
