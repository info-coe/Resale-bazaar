import React, { useState, useEffect } from "react";
import MyNavbar from "../navbar";
import Menu from "../menu";
import Filterdisplaynav from "../filterdisplaynav";
import { Link } from "react-router-dom";
import Product from "../Product";
import axios from "axios";
import InfiniteScroll from "react-infinite-scroll-component";
import Filter from "./filter";
import Scrolltotopbtn from "../Scrolltotopbutton";
import Comingsoon from "../comingsoon";

const Rings = () => {
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
        `${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/jewellery?limit=${pageSize}&page=${pageNum}&category=Rings`
      );

      if (res.data !== "Fail" && res.data !== "Error") {
        const filterProducts = res.data;

        const existingProductIds = new Set(
          products.map((product) => product.id)
        );

        const newProducts = filterProducts.filter(
          (product) => !existingProductIds.has(product.id)&& product.quantity > 0
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

  const handleFilter = (filteredProducts) => {
    setFilteredProducts(filteredProducts);
  };

  return (
    <div className="fullscreen">
      <MyNavbar />
      <main>
        <nav className="p-2 ps-lg-5 pe-lg-5">
          <Link to="/" className="text-decoration-none text-dark">
            <i className="bi bi-house-fill"></i>
          </Link>
          &nbsp; /{" "}
          <Link to="/jewellery" className="text-decoration-none text-dark">
            Jewelery
          </Link>{" "}
          /&nbsp; Rings
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
              productName="Rings"
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
                      rendercomp="jewellery"
                      type="jewellery"
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
      {/* <Footer /> */}
      <Scrolltotopbtn />
    </div>
  );
};

export default Rings;
// import React, { useState, useEffect } from "react";
// import MyNavbar from "../navbar";
// import Menu from "../menu";
// import Filterdisplaynav from "../filterdisplaynav";
// import { Link } from "react-router-dom";
// import Product from "../Product";
// import axios from "axios";
// import Pagination from "../pagination";
// import Footer from "../footer";
// import Filter from "./filter";
// import Scrolltotopbtn from "../Scrolltotopbutton";

// const Rings = () => {
//   const [products, setProducts] = useState([]);
//   const [pageSize, setPageSize] = useState(24);
//   const [currentPage, setCurrentPage] = useState(1);
//   // eslint-disable-next-line no-unused-vars
//   const [viewRowIndex, setViewRowIndex] = useState(null);
//   const [filteredProducts, setFilteredProducts] = useState([]);

//   useEffect(() => {
//     axios
//       .get(`${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/jewellery`)
//       .then((res) => {
//         if (res.data !== "Fail" && res.data !== "Error") {
//           const filterProducts = res.data.filter(
//             (item) => item.category === "Rings"
//           );
//           setProducts(filterProducts);
//           setFilteredProducts(filterProducts);
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
//       <nav className="p-2 ps-lg-5 pe-lg-5">
//           <Link to="/" className="text-decoration-none text-dark">
//             <i className="bi bi-house-fill"></i>
//           </Link>
//           &nbsp; /{" "}
//           <Link to="/jewellery" className="text-decoration-none text-dark">
//             Jewelery
//           </Link>{" "}
//           /&nbsp; Rings
//         </nav>
//       <div className="d-lg-flex justify-content-around p-2 ps-lg-5 pe-lg-5">
//         <div className="col-lg-2 col-xs-12 col-md-12">
//           <Menu />
//           <Filter products={products} onFilter={handleFilter} />
//         </div>

//         <div className="col-xs-12 col-md-12 col-lg-10 ps-lg-3">
//           <Filterdisplaynav pageSize={pageSize} setPageSize={setPageSize} productName="Rings"/>
//           <div className="">

//           <div className="product-grid container">
//             {tableData.length > 0 ? (
//               tableData.map((product, index) => (
//                 <Product
//                   product={product}
//                   key={index}
//                   rendercomp="jewellery"
//                   type="jewellery"
//                 />
//               ))
//             ) : (
//               <h1 style={{fontSize:"18px"}}>No products to display</h1>
//             )}
//           </div>
//           </div>
//           <Pagination
//             stateData={filteredProducts}
//             pageSize={pageSize}
//             setViewRowIndex={setViewRowIndex}
//             currentPage={currentPage}
//             setCurrentPage={setCurrentPage}
//           />
//         </div>
//       </div>
//       </main>
//       <Footer />
//       <Scrolltotopbtn/>
//     </div>
//   );
// };

// export default Rings;
