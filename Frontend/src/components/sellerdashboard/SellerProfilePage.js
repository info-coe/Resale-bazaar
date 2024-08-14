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
  const location = useLocation();
  const {userDetails} = location.state || [{
    userId: "",
    email: "",
    phone: "",
    name: "",
    shopname: "",
  }];
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  useEffect(() => {
    applyFilter(filter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [products, filter]);

  // useEffect(() => {
  //   axios
  //     .get(`${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/user`)
  //     .then((res) => {
  //       if (res.data !== "Fail" && res.data !== "Error") {
  //         const filteredUserDetails = res.data.filter(
  //           (item) => item.user_id.toString() === sellerId.toString()
  //         );
  //         const userDetails = filteredUserDetails.map((item) => ({
  //           userId: item.user_id,
  //           email: item.email,
  //           phone: item.phone,
  //           name: item.firstname + " " + item.lastname,
  //           shopname: item.shopname,
  //         }));
  //         setSellerDetails(userDetails);
  //       }
  //     })
  //     .catch((err) => console.log(err));
  //     // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

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
        setNotification({ message: "Data added successfully", type: "success" });
        setTimeout(() => {setNotification(null);
          window.location.reload(false);
         },3000);
      })
      .catch((err) => {
        console.error("Error posting data:", err);
      });
  };

  // eslint-disable-next-line no-unused-vars
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
  // console.log(sellerDetails.phone)
  return (
    <>
      <MyNavbar />
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
      <div className="container mt-3">
        <div className="row">
          <div className="col-lg-12">
            <div className="seller-profile-header border">
              <div className="m-5">
                <h2 className="seller-name fs-1">
                  <i className="bi bi-person-circle fs-1"></i>&nbsp;
                  {userDetails.length > 0 &&
                    (userDetails[0].shopname === "" ||
                    userDetails[0].shopname === null ||
                    userDetails[0].shopname === undefined
                      ? userDetails[0].name
                      : userDetails[0].shopname)}
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
                {userDetails.length > 0 &&
                  (userDetails[0].shopname === "" ||
                  userDetails[0].shopname === null ||
                  userDetails[0].shopname === undefined
                    ? userDetails[0].name
                    : userDetails[0].shopname)}
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

