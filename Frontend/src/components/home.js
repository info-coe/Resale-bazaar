

import React, { useEffect, useState } from "react";
import MyNavbar from "./navbar";
import Footer from "./footer";
import Curosel from "./curosal";
import CarouselComponent from "./carouselcomponent";
import axios from "axios";
import "react-multi-carousel/lib/styles.css";
import Product from "./Product";
import { Link } from "react-router-dom";

const Home = () => {
  // eslint-disable-next-line no-unused-vars     
  const [allProducts, setAllProducts] = useState([]);
  const [displayedProducts, setDisplayedProducts] = useState([]);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/allproducts`)
      .then((res) => {
        if (res.data !== "Fail" && res.data !== "Error") {
          setAllProducts(res.data);
          setDisplayedProducts(res.data); // Initially display first batch
        }
      })
      .catch((error) => {
        console.log("Error fetching data:", error);
      });
  }, []);

  const filterAndSliceProducts = (type) => {
    return displayedProducts.filter(item => item.product_type === type).reverse().slice(0, 10);
  };

  const womenProducts = filterAndSliceProducts("women");
  const kidsProducts = filterAndSliceProducts("kids");
  const jewelleryProducts = filterAndSliceProducts("jewellery");
  // const booksProducts = filterAndSliceProducts("books");

  return (
    <div className="fullscreen">
      <MyNavbar />
      <main>
        <CarouselComponent />

        <h1 className="container" style={{ fontSize: "28px" }}>Product Categories</h1>
        <Curosel />
        <h2 className="container text-center" style={{ fontSize: "28px" }}>Featured Products</h2>

        {/* Womens Fashion */}
        {womenProducts.length > 0 && (
          <>
            <div className="d-flex justify-content-between mt-5 bg-light p-2 ms-md-5 me-md-5 ms-2 me-2">
              <h4 className="ms-2 ms-md-5">Womens Fashion</h4>
              <div className="d-flex justify-content-end" style={{ padding: "5px 50px 10px 10px" }}>
                <Link to="/women" className="text-decoration-none">
                  See more
                </Link>
              </div>
            </div>
            <div className="">
              <div className="d-md-flex flex-wrap ms-md-5 me-md-5 mb-4 mt-md-3 mt-3 ms-2 me-2">
                {womenProducts.map((product, index) => (
                  <div key={index}>
                    <Product product={product} admin="home" />
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Kids Fashion */}
        {kidsProducts.length > 0 && (
          <>
            <div className="d-flex justify-content-between mt-5 bg-light p-2 ms-md-5 me-md-5 ms-2 me-2">
              <h4 className="ms-2 ms-md-5">Kids Fashion</h4>
              <div className="d-flex justify-content-end" style={{ padding: "5px 50px 10px 10px" }}>
                <Link to="/kids" className="text-decoration-none">
                  See more
                </Link>
              </div>
            </div>
            <div className="">
              <div className="d-md-flex flex-wrap ms-md-5 me-md-5 mb-4 mt-md-3 mt-3 ms-2 me-2">
                {kidsProducts.map((product, index) => (
                  <div key={index}>
                    <Product product={product} admin="home" />
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Jewellery Collection */}
        {jewelleryProducts.length > 0 && (
          <>
            <div className="d-flex justify-content-between mt-5 bg-light p-2 ms-md-5 me-md-5 ms-2 me-2">
              <h4 className="ms-2 ms-md-5">Jewellery</h4>
              <div className="d-flex justify-content-end" style={{ padding: "5px 50px 10px 10px" }}>
                <Link to="/jewellery" className="text-decoration-none">
                  See more
                </Link>
              </div>
            </div>
            <div className="">
              <div className="d-md-flex flex-wrap   ms-md-5 me-md-5 mb-4 mt-md-3 mt-3 ms-2 me-2">
                {jewelleryProducts.map((product, index) => (
                  <div key={index}>
                    <Product product={product} admin="home" />
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Books Collection */}
        {/* {booksProducts.length > 0 && (
          <>
            <div className="d-flex justify-content-between mt-5 bg-light p-2">
              <h4 className="ms-2 ms-md-5">Books</h4>
              <div className="d-flex justify-content-end" style={{ padding: "5px 50px 10px 10px" }}>
                <Link to="/books" className="text-decoration-none">
                  See more
                </Link>
              </div>
            </div>
            <div className="d-flex flex-wrap justify-content-center">
              <div className="d-md-flex flex-wrap ms-md-5 me-md-5 mb-4 mt-md-3 mt-3 ms-2 me-2">
                {booksProducts.map((product, index) => (
                  <div key={index}>
                    <Product product={product} admin="home" />
                  </div>
                ))}
              </div>
            </div>
          </>
        )} */}
      </main>
      <Footer />
    </div>
  );
};

export default Home;