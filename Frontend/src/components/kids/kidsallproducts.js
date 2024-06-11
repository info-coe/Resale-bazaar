import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import MyNavbar from "../navbar";
import Menu from "../menu";
import Filterdisplaynav from "../filterdisplaynav";
import Filter from "./filter";
import Girlimg from "../../images/girl.webp";
import Boyimg from "../../images/boy.webp";
import Product from "../Product";
import Pagination from "../pagination";
import axios from "axios";
import Footer from "../footer";

const Kidsallproducts = () => {
  const [products, setProducts] = useState([]);
  const [pageSize, setPageSize] = useState(6);
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredProducts, setFilteredProducts] = useState([]);

  // eslint-disable-next-line no-unused-vars
  const [viewRowIndex, setViewRowIndex] = useState(null);
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/kids`)
      .then((res) => {
        if (res.data !== "Fail" && res.data !== "Error") {
          setProducts(res.data);
          setFilteredProducts(res.data);
        }
      })
      .catch((err) => console.log(err));
  }, []);
  useEffect(() => {
    setCurrentPage(1);
    setViewRowIndex(null);
  }, [pageSize]);

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const tableData = filteredProducts.slice(startIndex, endIndex);

  const handleFilter = (filteredProducts) => {
    setFilteredProducts(filteredProducts);
  };

  return (
    <div className="fullscreen">
      <MyNavbar />
      <main>
      <h1
        className="ps-lg-5 ps-2 text-center mt-2"
        style={{ textShadow: "2px 3px 2px gray" , fontSize:"28px" }}
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
        &nbsp; / Kids
      </nav>
      <div className="d-lg-flex justify-content-around p-2 ps-lg-5 pe-lg-5">
        <div className="col-lg-2 col-xs-12 col-md-12">
          <Menu />
          <Filter products={products} onFilter={handleFilter} />
        </div>

        <div className="col-xs-12 col-md-12 col-lg-10 ps-lg-3">
          <Filterdisplaynav pageSize={pageSize} setPageSize={setPageSize} productName="Kids Fashion"/>

         
          <div className="d-flex flex-wrap  justify-content-around gap-3 mt-5">
            {tableData.length > 0 ? (
              tableData.map((product, index) => (
                <Product product={product} key={index} type="kids" />
              ))
            ) : (
              <h2 style={{fontSize:"28px"}}>No products to display</h2>
            )}
          </div>
          <Pagination
            stateData={filteredProducts}
            pageSize={pageSize}
            setViewRowIndex={setViewRowIndex}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
        </div>
      </div>
      </main>
      <Footer />
    </div>
  );
};

export default Kidsallproducts;
