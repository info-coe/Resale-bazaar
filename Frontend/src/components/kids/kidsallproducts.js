import React, { useEffect, useState } from "react";
import MyNavbar from "../navbar";
import Menu from "../menu";
import { Link } from "react-router-dom";
import Filter from "./filter";
import Filterdisplaynav from "../filterdisplaynav";
import Product from "../Product";
import axios from "axios";
import Girlimg from "../../images/girl.webp";
import Boyimg from "../../images/boy.webp";
import InfiniteScroll from "react-infinite-scroll-component";
import Comingsoon from "../comingsoon";

const Kidsallproducts = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const pageSize = 8;

  useEffect(() => {
    fetchProducts(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const fetchProducts = async (pageNum) => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/kidsall?limit=${pageSize}&page=${pageNum}&category=kids`
      );

      if (res.data !== "Fail" && res.data !== "Error") {
        // Filter the products by category "Boy"
        const filterProducts = res.data;

        // Get the IDs of the currently loaded products to avoid duplicates
        const existingProductIds = new Set(
          products.map((product) => product.id)
        );

        // Filter new products to remove duplicates
        const newProducts = filterProducts.filter(
          (product) => !existingProductIds.has(product.id)&& product.quantity > 0
        );

        if (newProducts.length > 0) {
          // Update products and filteredProducts state
          setProducts((prevProducts) => [...prevProducts, ...newProducts]);
          setFilteredProducts((prevProducts) => [
            ...prevProducts,
            ...newProducts,
          ]);
        }

        // Check if there are more products to load
        if (filterProducts.length < pageSize) {
          setHasMore(false);
        }
      } else {
        setHasMore(false); // Stop fetching if an error response is returned
      }
    } catch (err) {
      console.log(err);
      setHasMore(false); // Stop fetching if there's an error
    }
  };

  const handleFilter = (filteredProducts) => {
    setFilteredProducts(filteredProducts);
  };

  return (
    <div className="fullscreen">
      <MyNavbar />
      <main>
      <h1
        className="ps-lg-5 ps-2 text-center mt-2"
        style={{ textShadow: "2px 3px 2px lightgray" , fontSize:"28px" }}
      >
        Kids Zone
      </h1>
      <div className="d-flex flex-wrap justify-content-center text-center">
        <div className="m-md-4 m-2 ">
          <Link to="/girl" className="text-dark text-decoration-none">
            <img
              src={Girlimg}
              width="130px"
              height="130px"
              alt="high end couture"
              className=" rounded-circle womenallimgs"
            />
            <p>Girl</p>
          </Link>
        </div>
        <div className="m-md-4 m-2 ">
          <Link to="/boy" className="text-dark text-decoration-none">
            <img
              src={Boyimg}
              width="130px"
              height="130px"
              alt="sarees"
              className=" rounded-circle womenallimgs"
            />
            <p>Boy</p>
          </Link>
        </div>
      </div>
        <nav className="p-2 ps-lg-5 pe-lg-5">
          <Link to="/" className="text-decoration-none text-dark">
            <i className="bi bi-house-fill"></i>
          </Link>
          &nbsp; /{" "}
          <Link to="/kids" className="text-decoration-none text-dark">
            Kids
          </Link>{" "}
       
        </nav>
        <div className="d-lg-flex justify-content-around p-2 ps-lg-5 pe-lg-5">
          <div className="col-lg-2 col-xs-12 col-md-12">
            <Menu />
            <Filter products={products} onFilter={handleFilter} />
          </div>

          <div className="col-xs-12 col-md-12 col-lg-10 ps-lg-3">
            <Filterdisplaynav
              pageSize={pageSize}
              setPageSize={() => {}}
              productName="Boys Fashion"
            />

            <InfiniteScroll
              dataLength={filteredProducts.length}
              next={() => setPage((prevPage) => prevPage + 1)}
              hasMore={hasMore}
              loader={<div className="centered-message"><i className="bi bi-arrow-clockwise spin-icon"></i></div>}
              endMessage={<div className="centered-message"></div>}
            >
              <div className={filteredProducts.length > 0 ? "product-grid container" : "full-page-center"}>
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product, index) => (
                    <Product
                      product={product}
                      key={index}
                      rendercomp="boykids"
                      type="kids"
                    />
                  ))
                ) : (
                  <Comingsoon/>
                )}
              </div>
            </InfiniteScroll>
          </div>
        </div>
      </main>
      {/* <Footer />*/}
      {/* <Scrolltotopbtn/>  */}
    </div>
  );
};

export default Kidsallproducts;

// import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import MyNavbar from "../navbar";
// import Menu from "../menu";
// import Filterdisplaynav from "../filterdisplaynav";
// import Filter from "./filter";
// import Girlimg from "../../images/girl.webp";
// import Boyimg from "../../images/boy.webp";
// import Product from "../Product";
// import Pagination from "../pagination";
// import axios from "axios";
// // import Footer from "../footer";
// import Scrolltotopbtn from "../Scrolltotopbutton";

// const Kidsallproducts = () => {
//   const [products, setProducts] = useState([]);
//   const [pageSize, setPageSize] = useState(25);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [filteredProducts, setFilteredProducts] = useState([]);
// console.log(filteredProducts)
//   // eslint-disable-next-line no-unused-vars
//   const [viewRowIndex, setViewRowIndex] = useState(null);
//   useEffect(() => {
//     axios
//       .get(`${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/kids?limit=${10000}&page=${1}`)
//       .then((res) => {
//         if (res.data !== "Fail" && res.data !== "Error") {
//           console.log(res.data)
//           setProducts(res.data);
//           setFilteredProducts(res.data);
//         }
//       })
//       .catch((err) => console.log(err));
//   }, []);
//   useEffect(() => {
//     setCurrentPage(1);
//     setViewRowIndex(null);
//   }, [pageSize]);

//   const startIndex = (currentPage - 1) * pageSize;
//   const endIndex = startIndex + pageSize;
//   const tableData = filteredProducts.slice(startIndex, endIndex);

//   const handleFilter = (filteredProducts) => {
//     setFilteredProducts(filteredProducts);
//   };

//   return (
//     <div className="fullscreen">
//       <MyNavbar />
//       <main>
//         <h1
//           className="ps-lg-5 ps-2 text-center mt-2"
//           style={{ textShadow: "2px 3px 2px gray", fontSize: "28px" }}
//         >
//           Kids Zone
//         </h1>
//         <div className="d-flex flex-wrap justify-content-center text-center">
//           <div className="m-md-4 m-2 ">
//             <Link to="/girl" className="text-dark text-decoration-none">
//               <img
//                 src={Girlimg}
//                 width="130px"
//                 height="130px"
//                 alt="high end couture"
//                 className=" rounded-circle womenallimgs"
//               />
//               <p>Girl</p>
//             </Link>
//           </div>
//           <div className="m-md-4 m-2 ">
//             <Link to="/boy" className="text-dark text-decoration-none">
//               <img
//                 src={Boyimg}
//                 width="130px"
//                 height="130px"
//                 alt="sarees"
//                 className=" rounded-circle womenallimgs"
//               />
//               <p>Boy</p>
//             </Link>
//           </div>
//         </div>
//         <nav className="p-2 ps-lg-5 pe-lg-5">
//           <Link to="/" className="text-decoration-none text-dark">
//             <i className="bi bi-house-fill"></i>
//           </Link>
//           &nbsp; / Kids
//         </nav>
//         <div className="d-lg-flex justify-content-around p-2 ps-lg-5 pe-lg-5">
//           <div className="col-lg-2 col-xs-12 col-md-12">
//             <Menu />
//             <Filter products={products} onFilter={handleFilter} />
//           </div>

//           <div className="col-xs-12 col-md-12 col-lg-10 ps-lg-3">
//             <Filterdisplaynav
//               pageSize={pageSize}
//               setPageSize={setPageSize}
//               productName="Kids Fashion"
//             />

//             <div className="">
//               <div className="product-grid container">
//                 {tableData.length > 0 ? (
//                   tableData.map((product, index) => (
//                     <Product product={product} key={index} type="kids" />
//                   ))
//                 ) : (
//                   <h2 style={{ fontSize: "18px" }}>No products to display</h2>
//                 )}
//               </div>
//             </div>
//             {/* <Pagination
//               stateData={filteredProducts}
//               pageSize={pageSize}
//               setViewRowIndex={setViewRowIndex}
//               currentPage={currentPage}
//               setCurrentPage={setCurrentPage}
//             /> */}
//           </div>
//         </div>
//       </main>
//       {/* <Footer /> */}
//       <Scrolltotopbtn />
//     </div>
//   );
// };

// export default Kidsallproducts;
