import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Carousel from "react-bootstrap/Carousel";

import womendesktop from "../images/women-banner.jpg"
import kidsdesktop from "../images/kids-banner.jpg";
import womenmobile from "../images/women-banner.jpg";
import womentablet from "../images/women-banner.jpg";
import kidsmobile from "../images/kids-banner.jpg";
import kidstablet from "../images/kids-banner.jpg";
import jewellerydesktop from "../images/jewellery-banner.jpg";
import jewellerymobile from "../images/jewellery-banner.jpg";
import jewellerytablet from "../images/jewellery-banner.jpg";
import booksdesktop from "../images/books-banner.jpg";
import booksmobile from "../images/books-banner.jpg";
import bookstablet from "../images/books-banner.jpg";

function CarouselComponent() {
  const windowWidth = window.innerWidth;
  const isMobile = windowWidth <= 767;
  const isTablet = windowWidth >= 768 && windowWidth <= 1024;
  return (
    <div>
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


