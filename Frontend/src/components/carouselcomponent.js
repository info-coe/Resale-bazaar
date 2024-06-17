import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Carousel from "react-bootstrap/Carousel";

import womendesktop from "../images/RB-slide3.JPEG"
import kidsdesktop from "../images/RB-slide2.JPEG"
import womenmobile from "../images/RB-slide3.JPEG";
import womentablet from "../images/RB-slide3.JPEG";
import kidsmobile from "../images/RB-slide2.JPEG";
import kidstablet from "../images/RB-slide2.JPEG";
import jewellerydesktop from "../images/RB-slide4.jpg";
import jewellerymobile from "../images/RB-slide4.jpg";
import jewellerytablet from "../images/RB-slide4.jpg";
import booksdesktop from "../images/RB-Books-banner.jpg";
import booksmobile from "../images/RB-Books-banner.jpg";
import bookstablet from "../images/RB-Books-banner.jpg";

function CarouselComponent() {
  const windowWidth = window.innerWidth;
  const isMobile = windowWidth <= 767;
  const isTablet = windowWidth >= 768 && windowWidth <= 1024;
  return (
    <div className=" ms-md-5 me-md-5 mb-4 mt-md-3 mt-3 ms-2 me-2">
    <Carousel>
    <Carousel.Item>
      <div className='image-container'>
      <img
              className="d-block"
              style={{ width: "100%", height: "100%", objectFit: "cover",backgroundRepeat:"no-repeat"}}
              src={isMobile ? womenmobile : (isTablet ? womentablet : womendesktop)}
              alt="First slide"
            />
      </div>
      
      <Carousel.Caption>
        {/* <h5 className='bannerHead' >Womens Fashion</h5> */}
      </Carousel.Caption>
    </Carousel.Item>
    <Carousel.Item>
    <div className='image-container'>
            <img
              className="d-block"
              style={{ width: "100%", height: "100%", objectFit: "cover",backgroundRepeat:"no-repeat"}}
              src={isMobile ? kidsmobile : (isTablet ? kidstablet : kidsdesktop)}
              alt="First slide"
            />
      </div>

      <Carousel.Caption>
        {/* <h5 className='bannerHead' >Kids Fashion</h5> */}
      </Carousel.Caption>
    </Carousel.Item>
    <Carousel.Item>
    <div className='image-container'>

    <img
              className="d-block"
              style={{ width: "100%", height: "100%", objectFit: "cover",backgroundRepeat:"no-repeat"}}
              src={isMobile ? jewellerymobile : (isTablet ? jewellerytablet : jewellerydesktop)}
              alt="First slide"
            />
      </div>

      <Carousel.Caption>
        {/* <h5 className='bannerHead' >Jewellery</h5> */}
       
      </Carousel.Caption>
    </Carousel.Item>
    <Carousel.Item>
    <div className='image-container'>

            <img
              className="d-block"
              style={{ width: "100%", height: "100%", objectFit: "cover",backgroundRepeat:"no-repeat"}}
              src={isMobile ? booksmobile : (isTablet ? bookstablet : booksdesktop)}
              alt="First slide"
            />
      </div>

      <Carousel.Caption>
        {/* <h5 className='bannerHead' >Books Collection</h5> */}
       
      </Carousel.Caption>
    </Carousel.Item>
  </Carousel>
  </div>
  )
}

export default CarouselComponent


