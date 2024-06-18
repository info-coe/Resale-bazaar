import React from "react";
import kidsurl from "../images/kids22.jpeg";
import womenurl from "../images/RB-women.jfif";
import jeweleryurl from "../images/jewelry.jpg";
import booksurl from "../images/books.jpg";
import { Link } from "react-router-dom";

// const breakPoints = [
//   { width: 1, itemsToShow: 1 },
//   { width: 550, itemsToShow: 2 },
//   { width: 768, itemsToShow: 2 },
//   { width: 992, itemsToShow: 3 },
//   { width: 1200, itemsToShow: 4 },
// ];

function Curosel() {
  return (
    <>
      <div className=" text-center d-flex flex-wrap justify-content-evenly mt-4 mb-4 ">
        {/* <Carousel  className="custom-carousel "> */}
          <Link to="/kids" className="text-decoration-none ">
            <div className="custom-item m-3">
              <div className="zoomAnimation position-relative text-center carouselslide">
                <img src={kidsurl} alt="Kids pic" />
                <h5
                  className="position-absolute fw-bold text-white"
                  style={{
                    bottom: "10%",
                    width: "100%",
                    left: 0,
                    right: 0,
                    margin: "auto",
                    textShadow: "2px 3px 2px black",
                    
                  }}
                >
                  KIDS
                </h5>
              </div>
            </div>
          </Link>
          <Link to="/women" className="text-decoration-none ">
            <div className="custom-item m-3">
              <div className="zoomAnimation position-relative text-center carouselslide">
                <img 
                src={womenurl} 
                alt="Women pic" />
                <h5
                  className="position-absolute fw-bold text-white"
                  style={{
                    bottom: "10%",
                    width: "100%",
                    left: 0,
                    right: 0,
                    margin: "auto",
                    textShadow: "2px 3px 2px black",
                   
                  }}
                >
                  WOMEN
                </h5>
              </div>
            </div>
          </Link>
          <Link to="/jewellery" className="text-decoration-none ">
            <div className="custom-item m-3">
              <div className="zoomAnimation position-relative text-center carouselslide">
                <img src={jeweleryurl} alt="Jewellery pic" />

                <h5
                  className="position-absolute fw-bold text-white"
                  style={{
                    bottom: "10%",
                    width: "100%",
                    left: 0,
                    right: 0,
                    margin: "auto",
                    textShadow: "2px 3px 2px black",
                  }}
                >
                  JEWELLERY
                </h5>
              </div>
            </div>
          </Link>
          <Link to="/books" className="text-decoration-none ">
            <div className="custom-item m-3">
              <div className="zoomAnimation position-relative text-center carouselslide">
                <img 
                src={booksurl} 
                alt="Books pic" />
                <h5
                  className="position-absolute fw-bold text-white"
                  style={{
                    bottom: "10%",
                    width: "100%",
                    left: 0,
                    right: 0,
                    margin: "auto",
                    textShadow: "2px 3px 2px black",
                  }}
                >
                  BOOKS
                </h5>
              </div>
            </div>
          </Link>
        {/* </Carousel> */}
      </div>
    </>
  );
}

export default Curosel;
