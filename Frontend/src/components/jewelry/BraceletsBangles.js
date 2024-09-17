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

const BraceletsBangles = () => {
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
        `${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/jewellery?limit=${pageSize}&page=${pageNum}&category=Bangles`
      );

      if (res.data !== "Fail" && res.data !== "Error") {
        const filterProducts = res.data;

        const existingProductIds = new Set(
          products.map((product) => product.id)
        );

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
          /&nbsp; Bangles
        </nav>
        <div className="d-lg-flex justify-content-around p-2 ps-lg-5 pe-lg-5">
          <div className="col-lg-2 col-xs-12 col-md-12">
            <Menu />
            <Filter products={products} onFilter={handleFilter} />
          </div>

          <div className="col-xs-12 col-md-12 col-lg-10 ps-lg-3">
            <Filterdisplaynav
              pageSize={pageSize}
              setPageSize={() => { }}
              productName="Bangles"
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

export default BraceletsBangles;

