import React, { useState, useEffect } from "react";
import MyNavbar from "../navbar";
import Menu from "../menu";
import Filterdisplaynav from "../filterdisplaynav";
import { Link } from "react-router-dom";
import Product from "../Product";
import axios from "axios";
import Pagination from "../pagination";
import Footer from "../footer";
import Filter from "./filter";
import Fictionimg from "../../images/fiction.webp";
import Dramaimg from "../../images/drama.webp";
import Fantasyimg from "../../images/fantacy22.png";
import Horrorimg from "../../images/horror.webp";


const Booksallcollection = () => {
  const [products, setProducts] = useState([]);
  const [pageSize, setPageSize] = useState(6);
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredProducts, setFilteredProducts] = useState([]);

  // eslint-disable-next-line no-unused-vars
  const [viewRowIndex, setViewRowIndex] = useState(null);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/books`)
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
        style={{ textShadow: "2px 3px 2px gray" ,fontSize:"28px"}}
      >
        Books Collection
      </h1>
      <div className="scroll-container">
        <div className="m-md-4 m-2 ">
          <Link to="/fiction" className="text-dark text-decoration-none">
            <img
              src={Fictionimg}
              alt="fiction"
              className=" rounded-circle womenallimgs"
            />
            <p>Fiction</p>
          </Link>
        </div>
        <div className="m-md-4 m-2">
          <Link to="/drama" className="text-dark text-decoration-none">
            <img
              src={Dramaimg}
              alt="drama"
              className=" rounded-circle womenallimgs"
            />
            <p>Drama</p>
          </Link>
        </div>
        <div className="m-md-4 m-2">
          <Link to="/fantasy" className="text-dark text-decoration-none">
            <img
              src={Fantasyimg}
              alt="fantasy"
              className=" rounded-circle womenallimgs"
            />
            <p>Fantasy</p>
          </Link>
        </div>
        <div className="m-md-4 m-2">
          <Link to="/horror" className="text-dark text-decoration-none">
            <img
              src={Horrorimg}
              alt="horror"
              className="rounded-circle womenallimgs"
            />
            <p>Horror</p>
          </Link>
        </div>
       
      </div>
        <nav className="p-2 ps-lg-5 pe-lg-5">
          <Link to="/" className="text-decoration-none text-dark">
            <i className="bi bi-house-fill"></i>
          </Link>
          &nbsp; / Books
        </nav>
        <div className="d-lg-flex justify-content-around p-2 ps-lg-5 pe-lg-5 mb-5">
          <div className="col-lg-2 col-xs-12 col-md-12">
            <Menu />
            <Filter products={products} onFilter={handleFilter} />
          </div>

          <div className="col-xs-12 col-md-12 col-lg-10 ps-lg-3">
            <Filterdisplaynav pageSize={pageSize} setPageSize={setPageSize} productName="Books Collection"/>

            <div className="d-flex flex-wrap  justify-content-around gap-3 mt-5">
              {tableData.length > 0 ? (
                tableData.map((product, index) => (
                  <Product
                    product={product}
                    key={index}
                    rendercomp="books"
                    type="books"
                  />
                ))
              ) : (
                <h1 style={{fontSize:"28px"}}>No products to display</h1>
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

export default Booksallcollection;
