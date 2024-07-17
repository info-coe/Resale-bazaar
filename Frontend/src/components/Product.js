// import React, { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import axios from "axios";

// const Product = (props) => {
//   //eslint-disable-next-line no-unused-vars
//   const [existingProducts, setExistingProducts] = useState([]);
//   //eslint-disable-next-line no-unused-vars
//   const [isLoggedIn, setIsLoggedIn] = useState(false);

//   props.product.userid = sessionStorage.getItem("user-token");

//   useEffect(() => {
//     axios
//       .get(`${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/addcart`)
//       .then((response) => {
//         if (response.data !== "Fail" && response.data !== "Error") {
//           if (Array.isArray(response.data)) {
//             setExistingProducts(response.data);
//           }
//         }
//       })
//       .catch((error) => {
//         console.error("Error fetching cart items:", error);
//       });

//     if (sessionStorage.getItem("token") !== "admin") {
//       sessionStorage.getItem("user-token") !== null && setIsLoggedIn(true);
//     }
//   }, []);

//   const datta = JSON.parse(props.product.image);
//   // console.log(datta)
//   const firstImage = datta[0]; // Get the first image URL from the parsed JSON data
//   // console.log(firstImage)

//   return (
//     <div className="d-flex justify-content-center">
//       <div className="card productcard">
//         <Link
//           to={"/product/" + props.product.id}
//           state={{ productdetails: props.product, admin: props.admin }}
//         >
//           <div className="text-center productimgback">
//             <img
//               src={firstImage} // Use the first image URL here
//               className="card-img-top"
//               alt="product"
//             />
//           </div>
//         </Link>
//         <div className="card-body">
//           <p className="card-text text-success">
//             <b>&#36; {props.product.price}.00</b>
//           </p>
//           {props.product.size !== "NA" && (
//             <h6 className="card-text" style={{ lineHeight: "8px" }}>
//               {props.product.size}
//             </h6>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Product;



import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Carousel from "react-bootstrap/Carousel";
import "bootstrap/dist/css/bootstrap.min.css";

const Product = (props) => {
  const [existingProducts, setExistingProducts] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [datta, setDatta] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [intervalId, setIntervalId] = useState(null);
  const carouselRef = useRef(null);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/addcart`)
      .then((response) => {
        if (response.data !== "Fail" && response.data !== "Error") {
          if (Array.isArray(response.data)) {
            setExistingProducts(response.data);
          }
        }
      })
      .catch((error) => {
        console.error("Error fetching cart items:", error);
      });

    if (sessionStorage.getItem("token") !== "admin") {
      sessionStorage.getItem("user-token") !== null && setIsLoggedIn(true);
    }

    setDatta(JSON.parse(props.product.image));
  }, [props.product.image]);

  useEffect(() => {
    // Reset active index when `datta` changes
    setActiveIndex(0);
  }, [datta]);

  const handleMouseEnter = () => {
    // Start auto-sliding when mouse enters
    const id = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % datta.length);
    }, 1000); // Slide every 1 second
    setIntervalId(id);
  };

  const handleMouseLeave = () => {
    // Stop auto-sliding when mouse leaves
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
  };

  useEffect(() => {
    return () => {
      // Clean up interval on unmount
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [intervalId]);

  return (
    <div className="d-flex justify-content-center">
      <div
        className="card productcard"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <Link
          to={`/product/${props.product.id}`}
          state={{ productdetails: props.product, admin: props.admin }}
        >
          <div className="text-center productimgback">
            <Carousel
              activeIndex={activeIndex}
              onSelect={(selectedIndex) => setActiveIndex(selectedIndex)}
              controls={false}
              indicators={false}
              interval={null} // Disable automatic sliding
              pause={false}
              className="carousel-custom"
              slide={true}
              wrap={true} // Enable continuous looping
            >
              {datta.map((item, index) => (
                <Carousel.Item key={index} className="carousel-item-custom">
                  {item.endsWith(".mp4") ||
                  item.endsWith(".webm") ||
                  item.endsWith(".mov") ||
                  item.endsWith(".avi") ||
                  item.endsWith(".quicktime") ? (
                    <video
                      src={item}
                      className="d-block w-100"
                      controls
                      muted
                      height="180px"
                      alt={`product-video-${index}`}
                      style={{ objectFit: 'contain' }}
                    >
                      <source src={item} type="video/mp4" />
                      <source src={item} type="video/webm" />
                      <source src={item} type="video/quicktime" />
                      <source src={item} type="video/avi" />
                      <source src={item} type="video/mov" />
                      Your browser does not support the video tag.
                    </video>
                  ) : (
                    <img
                      src={item}
                      className="d-block w-100"
                      alt={`product-image-${index}`}
                      style={{ height: "180px", objectFit: "contain" }}
                    />
                  )}
                </Carousel.Item>
              ))}
            </Carousel>
          </div>
        </Link>
        <div className="card-body">
          <p className="card-text text-success">
            <b>&#36; {props.product.price}.00</b>
          </p>
          {props.product.size !== "NA" && (
            <h6 className="card-text" style={{ lineHeight: "8px" }}>
              {props.product.size}
            </h6>
          )}
        </div>
      </div>
    </div>
  );
};

export default Product;
