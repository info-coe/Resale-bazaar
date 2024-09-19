import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import MyNavbar from "../navbar";
import Menu from "../menu";
import Filterdisplaynav from "../filterdisplaynav";
import Filter from "./filter";
import Highendcoutureimg from "../../images/highendcouture.webp";
import Sareesimg from "../../images/sarees.webp";
import Lehengaimg from "../../images/lehanga.webp";
import Dressesimg from "../../images/dresses.webp";
import Twinningoutfitsimg from "../../images/twinningoutfits.webp";
import Product from "../Product";
import axios from "axios";
import InfiniteScroll from "react-infinite-scroll-component";
// import Footer from "../footer";
import Scrolltotopbtn from "../Scrolltotopbutton";
import Comingsoon from "../comingsoon";

const Womenallproducts = () => {
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
        `${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/womenall?limit=${pageSize}&page=${pageNum}&category=women`
      );

      if (res.data !== "Fail" && res.data !== "Error") {
        const filterProducts = res.data;

        const existingProductIds = new Set(
          products.map((product) => product.id)
        );
        const newProducts = filterProducts.filter(
          (product) =>
            !existingProductIds.has(product.id) && product.quantity > 0
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
        <h1
          className="ps-lg-5 ps-2 text-center mt-2"
          style={{ textShadow: "2px 3px 2px lightgray", fontSize: "28px" }}
        >
          Womens Fashion
        </h1>
        <div className="scroll-container">
          <div className="m-md-4 m-2">
            <Link
              to="/High End Couture"
              className="text-dark text-decoration-none"
            >
              <img
                src={Highendcoutureimg}
                alt="high end couture"
                className="rounded-circle womenallimgs"
              />
              <p>High end Couture</p>
            </Link>
          </div>
          <div className="m-md-4 m-2">
            <Link to="/sarees" className="text-dark text-decoration-none">
              <img
                src={Sareesimg}
                alt="sarees"
                className="rounded-circle womenallimgs"
              />
              <p>Sarees</p>
            </Link>
          </div>
          <div className="m-md-4 m-2">
            <Link to="/lehenga" className="text-dark text-decoration-none">
              <img
                src={Lehengaimg}
                alt="lehenga"
                className="rounded-circle womenallimgs"
              />
              <p>Lehangas</p>
            </Link>
          </div>
          <div className="m-md-4 m-2">
            <Link to="/dresses" className="text-dark text-decoration-none">
              <img
                src={Dressesimg}
                alt="dresses"
                className="rounded-circle womenallimgs"
              />
              <p>Dresses</p>
            </Link>
          </div>
          <div className="m-md-4 m-2">
            <Link
              to="/Twinning-outfits,Tie Dye"
              className="text-dark text-decoration-none"
            >
              <img
                src={Twinningoutfitsimg}
                alt="twinning outfits"
                className="rounded-circle womenallimgs"
              />
              <p>Twinning Outfits / Tie Dye</p>
            </Link>
          </div>
        </div>
        <nav className="p-2 ps-lg-5 pe-lg-5">
          <Link to="/" className="text-decoration-none text-dark">
            <i className="bi bi-house-fill"></i>
          </Link>
          &nbsp; / Women
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
              productName="Womens Fashion"
            />

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

export default Womenallproducts;

// import React, { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import MyNavbar from "../navbar";
// import Menu from "../menu";
// import Filterdisplaynav from "../filterdisplaynav";
// import Filter from "./filter";
// import Highendcoutureimg from "../../images/highendcouture.webp";
// import Sareesimg from "../../images/sarees.webp";
// import Lehengaimg from "../../images/lehanga.webp";
// import Dressesimg from "../../images/dresses.webp";
// import Twinningoutfitsimg from "../../images/twinningoutfits.webp";
// import Product from "../Product";
// import axios from "axios";
// import Pagination from "../pagination";
// import Footer from "../footer";
// import Scrolltotopbtn from "../Scrolltotopbutton";

// const Womenallproducts = () => {
//   const [products, setProducts] = useState([]);
//   const [pageSize, setPageSize] = useState(24);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [filteredProducts, setFilteredProducts] = useState([]);

//   // eslint-disable-next-line no-unused-vars
//   const [viewRowIndex, setViewRowIndex] = useState(null);
//   useEffect(() => {
//     axios
//       .get(`${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/women`)
//       .then((res) => {
//         if (res.data !== "Fail" && res.data !== "Error") {
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

//   // console.log(products)
//   const handleFilter = (filteredProducts) => {
//     setFilteredProducts(filteredProducts);
//   };

//   return (
//     <div className="fullscreen">
//       <MyNavbar />
//       <main>
//       <h1
//         className="ps-lg-5 ps-2 text-center mt-2"
//         style={{ textShadow: "2px 3px 2px gray" ,fontSize:"28px"}}
//       >
//         Womens Fashion
//       </h1>
//       <div className="scroll-container">
//         <div className="m-md-4 m-2 ">
//           <Link to="/High End Couture" className="text-dark text-decoration-none">
//             <img
//               src={Highendcoutureimg}
//               alt="high end couture"
//               className=" rounded-circle womenallimgs"
//             />
//             <p>High end Couture</p>
//           </Link>
//         </div>
//         <div className="m-md-4 m-2">
//           <Link to="/sarees" className="text-dark text-decoration-none">
//             <img
//               src={Sareesimg}
//               alt="sarees"
//               className=" rounded-circle womenallimgs"
//             />
//             <p>Sarees</p>
//           </Link>
//         </div>
//         <div className="m-md-4 m-2">
//           <Link to="/lehenga" className="text-dark text-decoration-none">
//             <img
//               src={Lehengaimg}
//               alt="lehenga"
//               className=" rounded-circle womenallimgs"
//             />
//             <p>Lehangas</p>
//           </Link>
//         </div>
//         <div className="m-md-4 m-2">
//           <Link to="/dresses" className="text-dark text-decoration-none">
//             <img
//               src={Dressesimg}
//               alt="dresses"
//               className="rounded-circle womenallimgs"
//             />
//             <p>Dresses</p>
//           </Link>
//         </div>
//         <div className="m-md-4 m-2">
//           <Link
//             to="/Twinning-outfits,Tie Dye"
//             className="text-dark text-decoration-none"
//           >
//             <img
//               src={Twinningoutfitsimg}
//               alt="twinning outfits"
//               className="rounded-circle womenallimgs"
//             />
//             <p>Twinning Outfits / Tie Dye</p>
//           </Link>
//         </div>
//       </div>
//       <nav className="p-2 ps-lg-5 pe-lg-5">
//         <Link to="/" className="text-decoration-none text-dark">
//           <i className="bi bi-house-fill"></i>
//         </Link>
//         &nbsp; / Women
//       </nav>
//       <div className="d-lg-flex justify-content-around p-2 ps-lg-5 pe-lg-5">
//         <div className="col-lg-2 col-xs-12 col-md-12">
//           <Menu />
//           <Filter products={products} onFilter={handleFilter} />
//         </div>

//         <div className="col-xs-12 col-md-12 col-lg-10 ps-lg-3">
//           <Filterdisplaynav pageSize={pageSize} setPageSize={setPageSize} productName="Womens Fashion" />

//           <div className="">
//           {/* <div className="d-md-flex flex-wrap ms-md-2 mt-5">
//             {tableData.length > 0 ? (
//               tableData.map((product, index) => (
//                 <Product product={product} key={index} admin="women" />
//               ))
//             ) : (
//               <h2 style={{fontSize:"18px"}}>No products to display</h2>
//             )}
//           </div> */}
//           <div className="product-grid container">
//           {tableData.length > 0 ? (
//               tableData.map((product, index) => (
//                 <Product product={product} key={index} admin="women" />
//               ))
//             ) : (
//               <h2 style={{fontSize:"18px"}}>No products to display</h2>
//             )}
//             </div>
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

// export default Womenallproducts;
