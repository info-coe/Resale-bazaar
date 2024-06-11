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



const Horror= () => {
  const [products, setProducts] = useState([]);
  const [pageSize, setPageSize] = useState(6);
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredProducts,setFilteredProducts]= useState([])

  // eslint-disable-next-line no-unused-vars
  const [viewRowIndex, setViewRowIndex] = useState(null);
  

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/books`)
      .then((res) => {
        if (res.data !== "Fail" && res.data !== "Error") {
          const filterProducts = res.data.filter(
            (item) => item.category === "horror"
          );
          setProducts(filterProducts);
          setFilteredProducts(filterProducts);
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
      <nav className="p-2 ps-lg-5 pe-lg-5">
          <Link to="/" className="text-decoration-none text-dark">
            <i className="bi bi-house-fill"></i>
          </Link>
          &nbsp; /{" "}
          <Link to="/books" className="text-decoration-none text-dark">
            Books
          </Link>{" "}
          /&nbsp; Horror
        </nav>
        <div className="d-lg-flex justify-content-around p-2 ps-lg-5 pe-lg-5 mb-5">
          <div className="col-lg-2 col-xs-12 col-md-12">
            <Menu />
            <Filter products={products} onFilter={handleFilter} />
          </div>

          <div className="col-xs-12 col-md-12 col-lg-10 ps-lg-3">
            <Filterdisplaynav pageSize={pageSize} setPageSize={setPageSize} productName="Horror Books"/>

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

export default Horror;
