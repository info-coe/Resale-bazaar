import React, { useEffect, useState } from "react";
import MyNavbar from "./navbar";
import Footer from "./footer";
import Curosel from "./curosal";
import CarouselComponent from "./carouselcomponent";
import axios from "axios";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import Product from "./Product";
const responsive = {
  extraLargeDesktop: {
    breakpoint: { min: 1601 , max:2000},
    items: 4
  },
    superLargeDesktop: {
      breakpoint: { max: 1600, min: 1201 },
      items: 4
    },
    desktop: {
      breakpoint: { max: 1200, min: 992 },
      items: 3
    },
    tablet: {
      breakpoint: { max: 991, min: 768 },
      items: 3
    },
    mobile: {
      breakpoint: { max: 767, min: 0 },
      items: 1
    }
  };
  
const Home = () => {
  const [allProducts, setAllProducts] = useState([]);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/allproducts`)
      .then((res) => {
        if (res.data !== "Fail" && res.data !== "Error") {
          // console.log(res.data);
          setAllProducts(res.data);
        }
      })
      .catch((error) => {
        console.log("Error fetching data:", error);
      });
  }, []);

  // console.log(allProducts);

  return (
    <div className="fullscreen">
      <MyNavbar />
      <main>
      <CarouselComponent />

      <h1 className="p-2" style={{fontSize:'28px'}}>Product Categories</h1>
      <Curosel />
      <h2 className="p-2" style={{fontSize:'28px'}}>Featured Products</h2>
      <div className=" mt-4">
        {(allProducts.length>0) ? (
                <Carousel 
                responsive={responsive}
                >
        {allProducts.map((product, index) => (
          <div className=""  key={index}>
              <Product product={product} admin="home"/>
            </div>
            ))}
        </Carousel>
        ) : (<h3 className="text-center mb-4" style={{fontSize:'28px'}}>No products to display</h3>)
        }

      </div>
      </main>
      <Footer />
    </div>
  );
};

export default Home;
