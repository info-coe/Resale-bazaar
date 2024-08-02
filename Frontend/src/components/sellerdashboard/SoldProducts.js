import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Link, useLocation, useParams } from "react-router-dom";
import MyNavbar from "../navbar";
import Footer from "../footer";
import "bootstrap/dist/css/bootstrap.min.css";
import Scrolltotopbtn from "../Scrolltotopbutton";
import Product from "../Product";
import InfiniteScroll from "react-infinite-scroll-component";
import Notification from "../Notification";


const SellerProfile = () => {
  const { sellerId } = useParams();
  // const [sellerProducts, setSellerProducts] = useState([]);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  // const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
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

  const fetchProducts = async (pageNum) => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/allproductsall?limit=${pageSize}&page=${pageNum}&category=${sellerId}`
      );

      if (res.data !== "Fail" && res.data !== "Error") {
        const filterProducts = res.data;
        console.log(filterProducts)
        const existingProductIds = new Set(products.map((product) => product.id));
        const newProducts = filterProducts.filter( 
          (product) => !existingProductIds.has(product.id) && product.quantity > 0
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
        setTimeout(() => {setNotification(null);
        window.location.reload(false);
          
        },3000);
      })
      .catch((err) => {
        console.error("Error posting data:", err);
      });
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
          <div className="">
            <h4 className="mb-4">
              <span style={{ fontSize: "22px" }}>Products by</span>{" "}
              <span className="text-secondary" style={{ fontStyle: "italic" }}>
                {userDetails.shopname == null || undefined || ""
                  ? userDetails.name
                  : userDetails.shopname}
              </span>
            </h4>
            {/* {loading ? (
              <div className="centered-message"><i className="bi bi-arrow-clockwise spin-icon"></i></div>
            ) : sellerProducts.length === 0 ? (
              <p>No products available.</p>
            ) : (
              <div className="product-grid container ">
                {sellerProducts.map((product, index) => (
                  <Product key={index} product={product} admin="home" />
                ))}
              </div>
            )} */}

            <InfiniteScroll
              dataLength={filteredProducts.length}
              next={() => setPage((prevPage) => prevPage + 1)}
              hasMore={hasMore}
              loader={<div className="centered-message"><i className="bi bi-arrow-clockwise spin-icon"></i></div>}
              endMessage={<div className="centered-message"><p>No more products to display</p></div>}
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
                  // required
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
// import React, { useEffect, useState } from "react";
// import MyNavbar from "./navbar";
// import Menu from "./menu";
// import { Link } from "react-router-dom";
// import Filter from "./women/filter";
// import Filterdisplaynav from "./filterdisplaynav";
// import Product from "./Product";
// import axios from "axios";
// import InfiniteScroll from "react-infinite-scroll-component";

// // import Scrolltotopbtn from "../Scrolltotopbutton";

// const SoldProducts = () => {
//   const [products, setProducts] = useState([]);
//   const [filteredProducts, setFilteredProducts] = useState([]);
//   const [hasMore, setHasMore] = useState(true);
//   const [page, setPage] = useState(1);
//   const pageSize = 8;

//   console.log(filteredProducts);
//   useEffect(() => {
//     fetchProducts(page);
//   }, [page]);

//   const fetchProducts = async (pageNum) => {
//     try {
//       const res = await axios.get(
//         `${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/allproducts`
//       );
//       console.log(res.data);
//       if (res.data !== "Fail" && res.data !== "Error") {
//         // Filter the products by category "Boy"
//         const filterProducts = res.data;

//         // Get the IDs of the currently loaded products to avoid duplicates
//         const existingProductIds = new Set(
//           products.map((product) => product.id)
//         );

//         // Filter new products to remove duplicates
//         const newProducts = filterProducts.filter(
//           (product) =>
//             !existingProductIds.has(product.id) && product.quantity === 0
//         );

//         if (newProducts.length > 0) {
//           // Update products and filteredProducts state
//           setProducts((prevProducts) => [...prevProducts, ...newProducts]);
//           setFilteredProducts((prevProducts) => [
//             ...prevProducts,
//             ...newProducts,
//           ]);
//         }

//         // Check if there are more products to load
//         if (filterProducts.length < pageSize) {
//           setHasMore(false);
//         }
//       } else {
//         setHasMore(false); // Stop fetching if an error response is returned
//       }
//     } catch (err) {
//       console.log(err);
//       setHasMore(false); // Stop fetching if there's an error
//     }
//   };

//   const handleFilter = (filteredProducts) => {
//     setFilteredProducts(filteredProducts);
//   };

//   return (
//     <div className="fullscreen">
//       <MyNavbar />
//       <main>
//         <nav className="p-2 ps-lg-5 pe-lg-5">
//           <Link to="/" className="text-decoration-none text-dark">
//             <i className="bi bi-house-fill"></i>
//           </Link>
//           &nbsp; /{" "}
//           <Link to="/soldproducts" className="text-decoration-none text-dark">
//             soldproducts
//           </Link>{" "}
//         </nav>
//         <div className="d-lg-flex justify-content-around p-2 ps-lg-5 pe-lg-5">
//           <div className="col-lg-2 col-xs-12 col-md-12">
//             <Menu />
//             <Filter products={products} onFilter={handleFilter} />
//           </div>

//           <div className="col-xs-12 col-md-12 col-lg-10 ps-lg-3">
//             <Filterdisplaynav
//               pageSize={pageSize}
//               setPageSize={() => {}}
//               productName="Boys Fashion"
//             />

//             <InfiniteScroll
//               dataLength={filteredProducts.length}
//               next={() => setPage((prevPage) => prevPage + 1)}
//               hasMore={hasMore}
//               loader={
//                 <div className="centered-message">
//                   <i className="bi bi-arrow-clockwise spin-icon"></i>
//                 </div>
//               }
//               endMessage={
//                 <div className="centered-message">
//                   <p>No more products to display</p>
//                 </div>
//               }
//             >
//               <div className="product-grid container">
//                 {filteredProducts.length > 0 ? (
//                   filteredProducts.map((product, index) => (
//                     <Product
//                       product={product}
//                       key={index}
//                       rendercomp="boykids"
//                       type="kids"
//                     />
//                   ))
//                 ) : (
//                   <h1 style={{ fontSize: "18px" }}>No products to display</h1>
//                 )}
//               </div>
//             </InfiniteScroll>
//           </div>
//         </div>
//       </main>
//       {/* <Footer />*/}
//       {/* <Scrolltotopbtn/>  */}
//     </div>
//   );
// };

// export default SoldProducts;
