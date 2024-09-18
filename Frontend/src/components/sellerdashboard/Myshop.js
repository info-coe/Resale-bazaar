import React, { useState, useEffect } from "react";
import axios from "axios";
import MyNavbar from "../navbar";
import Footer from "../footer";
import "bootstrap/dist/css/bootstrap.min.css";
import Scrolltotopbtn from "../Scrolltotopbutton";
import Product from "../Product";
import InfiniteScroll from "react-infinite-scroll-component";
// import Comingsoon from "../comingsoon";

const Myshop = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState("all");
  const [shopname, setShopname] = useState("");
  const pageSize = 8;
  const storedObject = sessionStorage.getItem("user-token");
  const myRetrievedObject = JSON.parse(storedObject);
 console.log(myRetrievedObject)
  useEffect(() => {
    const fetchShopname = async () => {
      if (!myRetrievedObject) return;

      try {
        const res = await axios.get(
          `${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/user`,
          {
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem('accessToken')}`,
              Accept: "application/json",
            },
          }
        );
        if (res.data !== "Fail" && res.data !== "Error") {
          console.log(res.data)
          const filteredUserDetails = res.data.filter(
            (item) => item.user_id === myRetrievedObject
          );
          console.log(filteredUserDetails)
          if (filteredUserDetails.length > 0) {
            const userDetail = filteredUserDetails[0];
            setShopname(
              userDetail.shopname ||
                userDetail.firstname + " " + userDetail.lastname ||
                "Default Shop Name"
            );
          } else {
            setShopname("Default Shop Name"); // Handle case when no user details are found
          }
        } else {
          setShopname("Default Shop Name"); // Handle case when API response is an error
        }
      } catch (error) {
        console.error("Error fetching shopname:", error);
        setShopname("Default Shop Name"); // Handle network or unexpected errors
      }
    };

    fetchShopname();
  }, [myRetrievedObject]); // Add userId as a dependency to re-fetch if it changes

  useEffect(() => {
    if (myRetrievedObject) {
      fetchProducts(page);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, myRetrievedObject]);

  useEffect(() => {
    applyFilter(filter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [products, filter]);

  const fetchProducts = async (pageNum) => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/allproductsall?limit=${pageSize}&page=${pageNum}&category=${myRetrievedObject}`
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

  return (
    <>
      <MyNavbar />
      <div className="container mt-3">
        <div className="row">
          <div className="col-lg-12">
            <div className="seller-profile-header border">
              <div className="m-5">
                <h2 className="seller-name fs-1">
                  <i className="bi bi-person-circle fs-1"></i>&nbsp;
                  {shopname || null}
                </h2>
                {/* <button
                  className="btn btn-primary ms-5"
                  data-bs-toggle="modal"
                  data-bs-target="#exampleModal"
                >
                  Contact to Seller
                </button> */}
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
                {shopname || "User Name"} {/* Display shopname or fallback */}
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
                  
                </div>
              }
            >
              <div className={filteredProducts.length > 0 ? "product-grid container" : "full-page-center"}>
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product, index) => (
                    <Product product={product} key={index} admin="women" />
                  ))
                ) : (
                  // <Comingsoon/>
                  <h6 className="mt-3">Your sold products will appear here once you make a sale.</h6>
                )}
              </div>
            </InfiniteScroll>
          </div>
        </div>
      </div>

      <Footer />
      <Scrolltotopbtn />
    </>
  );
};

export default Myshop;

// import React, { useState, useEffect, useRef } from "react";
// // import axios from "axios";
// // import { useLocation, useParams } from "react-router-dom";
// import MyNavbar from "../navbar";
// import Footer from "../footer";
// import "bootstrap/dist/css/bootstrap.min.css";
// import Scrolltotopbtn from "../Scrolltotopbutton";
// // import Product from "../Product";
// // import InfiniteScroll from "react-infinite-scroll-component";

// const Myshop = () => {
//     // const { sellerId } = useParams();
//     // const [products, setProducts] = useState([]);
//     // const [filteredProducts, setFilteredProducts] = useState([]);
//     // const [hasMore, setHasMore] = useState(true);
//     // const [page, setPage] = useState(1);
//     // const [filter, setFilter] = useState("all");
//     // const pageSize = 8;
//     // const { state } = useLocation();
//     // const userDetails = state.userDetails[0];
//     // //   const [userDetails, setUserDetails] = useState([]);

//     // useEffect(() => {
//     //     fetchProducts(page);
//     // }, [page]);

//     // useEffect(() => {
//     //     applyFilter(filter);
//     // }, [products, filter]);

//     // const fetchProducts = async (pageNum) => {
//     //     try {
//     //         const res = await axios.get(
//     //             `${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/allproductsall?limit=${pageSize}&page=${pageNum}&category=${sellerId}`
//     //         );

//     //         if (res.data !== "Fail" && res.data !== "Error") {
//     //             const filterProducts = res.data;
//     //             const existingProductIds = new Set(
//     //                 products.map((product) => product.id)
//     //             );
//     //             const newProducts = filterProducts.filter(
//     //                 (product) => !existingProductIds.has(product.id)
//     //             );

//     //             if (newProducts.length > 0) {
//     //                 setProducts((prevProducts) => [...prevProducts, ...newProducts]);
//     //                 setFilteredProducts((prevProducts) => [
//     //                     ...prevProducts,
//     //                     ...newProducts,
//     //                 ]);
//     //             }

//     //             if (filterProducts.length < pageSize) {
//     //                 setHasMore(false);
//     //             }
//     //         } else {
//     //             setHasMore(false);
//     //         }
//     //     } catch (err) {
//     //         console.log(err);
//     //         setHasMore(false);
//     //     }
//     // };

//     // useEffect(() => {
//     //     axios
//     //           .post(
//     //             `${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/users`,
//     //             { sellerID: sessionStorage.getItem("user-token") }
//     //           )
//     //           .then((res) => {
//     //             if (res.data !== "Fail" && res.data !== "Error") {
//     //               const userDetails = res.data.map((item) => ({
//     //                 userId: item.user_id,
//     //                 email: item.email,
//     //                 phone: item.phone,
//     //                 name: item.firstname + " " + item.lastname,
//     //                 shopname: item.shopname,
//     //               }));
//     //               setUserDetails(userDetails);
//     //             }
//     //           })
//     //           .catch((error) => {
//     //             console.error("Error fetching seller details:", error);
//     //           });
//     //     },[]);

//     // const applyFilter = (filter) => {
//     //     let updatedProducts = [...products];
//     //     if (filter === "sold") {
//     //         updatedProducts = products.filter((product) => product.quantity === 0);
//     //     } else if (filter === "available") {
//     //         updatedProducts = products.filter((product) => product.quantity > 0);
//     //     }
//     //     setFilteredProducts(updatedProducts);
//     // };

//     // const handleFilterChange = (newFilter) => {
//     //     setFilter(newFilter);
//     // };

//     return (
//         <div className="fullscreen">
//             <MyNavbar />
//             <main>
//                 {/* <div className="container mt-3">
//                     <div className="row">
//                         <div className="col-lg-12">
//                             <div className="seller-profile-header border">
//                                 <div className="m-5">
//                                     <h2 className="seller-name fs-1">
//                                         <i className="bi bi-person-circle fs-1"></i>&nbsp;
//                                         {userDetails.shopname == null || undefined || ""
//                                             ? userDetails.name
//                                             : userDetails.shopname}
//                                     </h2>

//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//                 <div className="container mt-5">
//                     <div className="row">
//                         <div className="col-lg-12">
//                             <h4 className="mb-4">
//                                 <span style={{ fontSize: "22px" }}>Products by</span>{" "}
//                                 <span className="text-secondary" style={{ fontStyle: "italic" }}>
//                                     {userDetails.shopname == null || undefined || ""
//                                         ? userDetails.name
//                                         : userDetails.shopname}
//                                 </span>
//                             </h4>
//                             <div className="filters mb-4">
//                                 <button
//                                     className={`btn btn-outline-primary me-2 ${filter === "all" ? "active" : ""
//                                         }`}
//                                     onClick={() => handleFilterChange("all")}
//                                 >
//                                     Show All
//                                 </button>
//                                 <button
//                                     className={`btn btn-outline-primary me-2 ${filter === "available" ? "active" : ""
//                                         }`}
//                                     onClick={() => handleFilterChange("available")}
//                                 >
//                                     Available Products
//                                 </button>
//                                 <button
//                                     className={`btn btn-outline-primary ${filter === "sold" ? "active" : ""
//                                         }`}
//                                     onClick={() => handleFilterChange("sold")}
//                                 >
//                                     Sold Products
//                                 </button>
//                             </div>

//                             <InfiniteScroll
//                                 dataLength={filteredProducts.length}
//                                 next={() => setPage((prevPage) => prevPage + 1)}
//                                 hasMore={hasMore}
//                                 loader={
//                                     <div className="centered-message">
//                                         <i className="bi bi-arrow-clockwise spin-icon"></i>
//                                     </div>
//                                 }
//                                 endMessage={
//                                     <div className="centered-message">
//                                         <p>No more products to display</p>
//                                     </div>
//                                 }
//                             >
//                                 <div className="product-grid container">
//                                     {filteredProducts.length > 0 ? (
//                                         filteredProducts.map((product, index) => (
//                                             <Product product={product} key={index} admin="women" />
//                                         ))
//                                     ) : (
//                                         <h2 style={{ fontSize: "18px" }}>No products to display</h2>
//                                     )}
//                                 </div>
//                             </InfiniteScroll>
//                         </div>
//                     </div>
//                 </div> */}
//             </main>
//             <Footer />
//             <Scrolltotopbtn />
//         </div>
//     );
// };

// export default Myshop;
