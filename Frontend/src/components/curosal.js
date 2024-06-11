import React from "react";
import Carousel from "react-elastic-carousel";
import kidsurl from "../images/kids22.jpeg";
import womenurl from "../images/womencarousel.jpg";
import jeweleryurl from "../images/jewelry.jpg";
import booksurl from "../images/books.jpg";
import { Link } from "react-router-dom";

const breakPoints = [
  { width: 1, itemsToShow: 1 },
  { width: 550, itemsToShow: 2 },
  { width: 768, itemsToShow: 2 },
  { width: 992, itemsToShow: 3 },
  { width: 1200, itemsToShow: 4 },
];

function Curosel() {
  return (
    <>
      <div className=" mt-4 mb-4 ">
        <Carousel breakPoints={breakPoints} className="custom-carousel ">
          <Link to="/kids" className="text-decoration-none d-flex justify-content-center">
            <div className="custom-item">
              <div className="m-3 position-relative text-center carouselslide">
                <img src={kidsurl} alt="Kids pic" />
                <h4
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
                </h4>
              </div>
            </div>
          </Link>
          <Link to="/women" className="text-decoration-none d-flex justify-content-center">
            <div className="custom-item">
              <div className="m-3 position-relative text-center carouselslide">
                <img 
                src={womenurl} 
                alt="Women pic" />
                <h4
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
                </h4>
              </div>
            </div>
          </Link>
          <Link to="/jewellery" className="text-decoration-none d-flex justify-content-center">
            <div className="custom-item">
              <div className="m-3 position-relative text-center carouselslide">
                <img src={jeweleryurl} alt="Jewellery pic" />

                <h4
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
                </h4>
              </div>
            </div>
          </Link>
          <Link to="/books" className="text-decoration-none d-flex justify-content-center">
            <div className="custom-item">
              <div className="m-3 position-relative text-center carouselslide">
                <img 
                src={booksurl} 
                alt="Books pic" />
                <h4
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
                </h4>
              </div>
            </div>
          </Link>
        </Carousel>
      </div>
    </>
  );
}

export default Curosel;
