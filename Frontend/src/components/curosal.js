import React from "react";
import kidsurl from "../images/kids22.jpeg";
import womenurl from "../images/RB-women.jfif";
import jeweleryurl from "../images/jewelry.jpg";
import { Link } from "react-router-dom";



function Curosel() {
  return (
    <>
      <div className=" text-center d-flex flex-wrap justify-content-evenly mt-4 mb-4 ">
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
         
      </div>
    </>
  );
}

export default Curosel;
