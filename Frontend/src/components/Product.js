import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import Carousel from "react-bootstrap/Carousel";

const truncateName = (name, maxLength) => {
  if (name.length > maxLength) {
    return name.substring(0, maxLength) + "...";
  }
  return name;
};

const Product = (props) => {
  // eslint-disable-next-line no-unused-vars
  const [existingProducts, setExistingProducts] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [carouselIndex, setCarouselIndex] = useState({});
  const [sliding, setSliding] = useState({});
  const [showIndicators, setShowIndicators] = useState({});
  const [userDetails, setUserDetails] = useState([]);

  props.product.userid = sessionStorage.getItem("user-token");

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

    axios
      .post(
        `${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/users`,
        { sellerID: props.product.seller_id }
      )
      .then((res) => {
        if (res.data !== "Fail" && res.data !== "Error") {
          const userDetails = res.data.map((item) => ({
            userId: item.user_id,
            email: item.email,
            phone: item.phone,
            name: item.firstname + " " + item.lastname,
            shopname: item.shopname,
          }));
          setUserDetails(userDetails);
        }
      })
      .catch((error) => {
        console.error("Error fetching seller details:", error);
      });
  }, [props.product.image, props.product.seller_id]);

  const datta = JSON.parse(props.product.image);

  const handleMouseEnter = (id) => {
    setShowIndicators((prevState) => ({
      ...prevState,
      [id]: true,
    }));
    setSliding((prevState) => ({
      ...prevState,
      [id]: true,
    }));
  };

  const handleMouseLeave = (id) => {
    setShowIndicators((prevState) => ({
      ...prevState,
      [id]: false,
    }));
    setSliding((prevState) => ({
      ...prevState,
      [id]: false,
    }));
    setCarouselIndex((prevState) => ({
      ...prevState,
      [id]: 0,
    }));
  };

  const handleSelect = (selectedIndex, id) => {
    setCarouselIndex((prevState) => ({
      ...prevState,
      [id]: selectedIndex,
    }));
  };

  const getMaxLength = () => {
    if (window.innerWidth <= 575.98) {
      return 19;
    }
    return 25;
  };

  const [maxLength, setMaxLength] = useState(getMaxLength);

  useEffect(() => {
    const handleResize = () => {
      setMaxLength(getMaxLength());
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const truncatedName = truncateName(props.product.name, maxLength);

  return (
    <div className="d-flex justify-content-center">
      <div
        className="card productcard product-card"
        style={{ opacity: props.product.quantity === 0 ? 0.5 : 1 }}
      >
        <Link
          to={"/product/" + props.product.id}
          state={{
            productdetails: props.product,
            admin: props.admin,
            userDetails: userDetails,
          }}
        >
          <div
            className="text-center productimgback position-relative"
            onMouseEnter={() => handleMouseEnter(props.product.id)}
            onMouseLeave={() => handleMouseLeave(props.product.id)}
          >
            <Carousel
              activeIndex={carouselIndex[props.product.id] || 0}
              interval={sliding[props.product.id] ? 1000 : null}
              controls={false}
              indicators={showIndicators[props.product.id] || false}
              onSelect={(selectedIndex) =>
                handleSelect(selectedIndex, props.product.id)
              }
              pause={false}
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
                      height="220px"
                      alt={`product-video-${index}`}
                      style={{ objectFit: "contain" }}
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
                      alt={`product-${index}`}
                      style={{ height: "220px", objectFit: "cover" }}
                    />
                  )}
                </Carousel.Item>
              ))}
            </Carousel>
            {props.product.quantity === 0 && (
             <div
             className="position-absolute top-50 start-50 translate-middle text-white bg-black px-2 py-1 rounded"
             style={{ fontSize: "1.2rem", fontWeight: "bold" }}
           >
           Sold
           </div>
           
            )}
          </div>
        </Link>
        <div className="card-body">
          {userDetails.length > 0 && (
            <p
              className="card-text fw-bold"
              style={{
                lineHeight: "20px",
                marginTop: "-5px",
                fontSize: "14px",
                color: "rgb(86, 101, 115 )",
              }}
            >
              {userDetails[0].shopname}
            </p>
          )}
          <p
            style={{
              fontSize: "13px",
              marginTop: "-10px",
              color: "rgb(93, 109, 126 )",
            }}
          >
            {truncatedName}
          </p>

          <p
            className="card-text"
            style={{ lineHeight: "15px", marginTop: "-8px" }}
          >
            <b>&#36; {props.product.price}.00</b>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Product;
