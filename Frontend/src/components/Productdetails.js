import React, { useEffect, useState, useRef } from "react";
import { useParams, useLocation, Link, useNavigate } from "react-router-dom";
import MyNavbar from "./navbar";
import Footer from "./footer";
import axios from "axios";
import { useCart } from "./CartContext";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import Reviews from "./Reviews";
import Scrolltotopbtn from "./Scrolltotopbutton";
import Notification from "./Notification";

const responsive = {
  extraLargeDesktop: {
    breakpoint: { min: 1601, max: 2000 },
    items: 3,
  },
  superLargeDesktop: {
    breakpoint: { max: 1600, min: 1201 },
    items: 3,
  },
  desktop: {
    breakpoint: { max: 1200, min: 992 },
    items: 3,
  },
  tablet: {
    breakpoint: { max: 991, min: 768 },
    items: 3,
  },
  mobile: {
    breakpoint: { max: 767, min: 0 },
    items: 2,
  },
};

export default function Productdetails() {
  const [add, setAdd] = useState("0.00");
  const [offerAmout, setOfferAmout] = useState("");
  const [success, setSuccess] = useState(false);
  const [offer, setOffer] = useState([]);
  const { id } = useParams();
  const location = useLocation();
  const { productdetails, admin, userDetails } = location.state || {};
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    comment: "",
  });
  const nameInputRef = useRef(null);
  const commentInputRef = useRef(null);

  const { name, email, phone, comment } = formData;

  const {
    addToCart,
    addToWishlist,
    cartItems,
    wishItems,
    notification,
    setNotification,
    isLoggedIn,
    setIsLoggedIn,
  } = useCart();
  // const [userdetails, setUserDetails] = useState([]);

  // const [offerAlert,setOfferAlert]=useState(null)

  const navigate = useNavigate();
  //  console.log(isLoggedIn)
  if (productdetails) {
    productdetails.userid = sessionStorage.getItem("user-token");
  }

  useEffect(() => {
    if (sessionStorage.getItem("token") !== "admin") {
      sessionStorage.getItem("user-token") !== null && setIsLoggedIn(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const AmountChange = (e) => {
    setAdd(e);
  };
  const handleChange = (e) => {
    setAdd(e.target.value); // Update input value on manual input change
  };

  const handleProductlist = () => {
    axios
      .post(
        `${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/adminaccepted`,
        { accepted_by_admin: "true", id }
      )
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
    setNotification({
      message: "Product added to the store successfully",
      type: "success",
    });
    setTimeout(() => setNotification(null), 3000);
    window.location.href = "/acceptproduct";
  };

  const handleAddToCart = () => {
    if (isLoggedIn) {
      if (cartItems.length > 0) {
        var unique_item = true;
        cartItems.map((item) => {
          if (item.product_id === productdetails.id) {
            setNotification({
              message: "Product already exists in the cart",
              type: "error",
            });
            setTimeout(() => setNotification(null), 3000);
            unique_item = false;
            //eslint-disable-next-line array-callback-return
            return;
          }
          return null;
        });
        unique_item && addToCart(productdetails, "main");
      } else {
        addToCart(productdetails, "main");
      }
    } else {
      let cartItems =
        JSON.parse(sessionStorage.getItem("guest_products")) || [];
      const isProductInCart = cartItems.some(
        (item) => item.id === productdetails.id
      );

      if (isProductInCart) {
        setNotification({
          message: "Product already exists in the cart",
          type: "error",
        });
        setTimeout(() => setNotification(null), 3000);
      } else {
        cartItems.push({ ...productdetails, quantity: 1 });
        sessionStorage.setItem("guest_products", JSON.stringify(cartItems));
        window.location.reload(false);
      }
    }
  };

  const handleAddToWishlist = () => {
    const isProductInWishlist = wishItems.some(
      (item) => item.product_id === productdetails.id
    );
    if (isProductInWishlist) {
      setNotification({
        message: "Product already exists in the wishlist",
        type: "error",
      });
      setTimeout(() => setNotification(null), 3000);
      return; // Exit the function early
    } else if (isLoggedIn) {
      addToWishlist(productdetails);
    } else {
      navigate("/login");
    }
  };
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const productDetailsImgRef = useRef(null);
  const activeSubimageRef = useRef(null);
  const carouselRef = useRef(null);
  // eslint-disable-next-line no-unused-vars
  const [currentSlide, setCurrentSlide] = useState(0);

  const updateProductDetailsImg = (product, index) => {
    const extension = product.split(".").pop().toLowerCase();
    if (["mp4", "webm", "avi", "mov", "quicktime"].includes(extension)) {
      productDetailsImgRef.current.innerHTML = `
        <video
          src=${product}
          controls
          class="productdetailsimg"
        >
          Your browser does not support the video tag.
        </video>
      `;
    } else {
      productDetailsImgRef.current.innerHTML = `
        <img
          src=${product}
          alt="product"
          class="productdetailsimg"
        />
      `;
    }

    // Reset previous active border to grey
    if (activeSubimageRef.current) {
      activeSubimageRef.current.style.border = "1px solid grey";
    }

    // Set new active border to green
    const newActiveSubimage = document.getElementById(`subimage-${index}`);
    if (newActiveSubimage) {
      newActiveSubimage.style.border = "3px solid green";
      activeSubimageRef.current = newActiveSubimage;
    }

    setCurrentSlide(index);
  };

  const handleProductReject = () => {
    const rejectReason = prompt("Enter Product Reject Reason");
    if (rejectReason !== null && rejectReason !== "") {
      console.log("Reason for rejection:", rejectReason);
      axios
        .post(
          `${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/adminrejection`,
          { rejectReason, id }
        )
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
      window.location.href = "/acceptproduct";
    } else {
      console.log("User canceled the prompt.");
    }
  };
  const datta = JSON.parse(productdetails.image);
  const firstImage = datta[0];
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleOffer = () => {
    if (add === "0.00" || add.length === 0) {
      return null;
    } else {
      setSuccess(true);
      axios
        .post(
          `${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/offeredproducts`,
          {
            product_id: id,
            offered_buyer_id: sessionStorage.getItem("user-token"),
            offered_price: add,
            product_status: "Pending",
          }
        )
        .then((res) => {
          console.log(res);
        })
        .catch((err) => console.log(err));
    }
  };

  const filte = offer.filter(
    (cur) =>
      cur.offered_buyer_id === parseInt(sessionStorage.getItem("user-token"))
  );

  const offerExists = filte.some((curr) => {
    return (
      curr.offered_buyer_id ===
        parseInt(sessionStorage.getItem("user-token")) &&
      curr.product_id === productdetails.id
      // &&
      // curr.product_status === "Accepted"
    );
  });

  useEffect(() => {
    // axios
    //   .get(`${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/user`)
    //   .then((res) => {
    //     if (res.data !== "Fail" && res.data !== "Error") {
    //       const filteredUserDetails = res.data.filter(
    //         (item) => item.user_id === productdetails.seller_id
    //       );
    //       const userDetails = filteredUserDetails.map((item) => ({
    //         userId: item.user_id,
    //         email: item.email,
    //         phone: item.phone,
    //         name: item.firstname + " " + item.lastname,
    //         shopname: item.shopname,
    //       }));
    //       setUserDetails(userDetails);
    //     }
    //   })
    //   .catch((err) => console.log(err));
    axios
      .get(
        `${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/offeredproducts`
      )
      .then((e) => {
        if (e.data !== "Fail" && e.data !== "Error") {
          setOffer(e.data);
        }
      })
      .catch((error) => console.log(error));
  }, [offer, handleOffer, productdetails.seller_id]);

  const navigates = useNavigate();
  const handleViewProfile = (sellerId) => {
    navigates(`/sellerprofile/${sellerId}`, { state: { userDetails } });
  };

  useEffect(() => {
    fetchLikeCount();
    checkIfLiked();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchLikeCount = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/products/${productdetails.id}/likes`
      );
      setLikeCount(response.data.likeCount);
    } catch (error) {
      console.error("Error fetching like count:", error);
    }
  };

  const checkIfLiked = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/products/${productdetails.id}/likes/user`,
        {
          params: { userId: sessionStorage.getItem("user-token") },
        }
      );
      setLiked(response.data.liked);
    } catch (error) {
      console.error("Error checking if liked:", error);
    }
  };

  const toggleLike = async (productId) => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    try {
      let newLikeCount = likeCount;
      // eslint-disable-next-line no-unused-vars
      let action = "";

      if (liked) {
        newLikeCount -= 1;
        await axios.post(
          `${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/products/${productId}/likes`,
          {
            like_userID: sessionStorage.getItem("user-token"),
            likes: newLikeCount,
            action: "unliked",
          }
        );
        action = "unliked";
      } else {
        newLikeCount += 1;
        await axios.post(
          `${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/products/${productId}/likes`,
          {
            like_userID: sessionStorage.getItem("user-token"),
            likes: newLikeCount,
            action: "liked",
          }
        );
        // eslint-disable-next-line no-unused-vars
        action = "liked";
      }

      setLiked(!liked);
      setLikeCount(newLikeCount);
    } catch (error) {
      console.error("Error toggling like:", error);
      setNotification({
        message: "Failed to update like status. Please try again later.",
        type: "error",
      });
      setTimeout(() => setNotification(null), 3000);
    }
  };
  const handleInputChange = (e) => {
    const { id, value, selectionStart } = e.target;
    let updatedValue = value;

    if (id === "name") {
      updatedValue = capitalizeFirstLetterOfEveryWord(value);
    } else if (id === "comment") {
      updatedValue = capitalizeFirstLetter(value);
    }

    setFormData((prevFormData) => ({ ...prevFormData, [id]: updatedValue }));

    // Restore cursor position
    if (id === "name") {
      requestAnimationFrame(() => {
        nameInputRef.current.setSelectionRange(selectionStart, selectionStart);
      });
    } else if (id === "comment") {
      requestAnimationFrame(() => {
        commentInputRef.current.setSelectionRange(
          selectionStart,
          selectionStart
        );
      });
    }
  };
  const capitalizeFirstLetterOfEveryWord = (str) => {
    return str.replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const capitalizeFirstLetter = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };
  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .post(
        `${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/contactseller`,
        {
          name,
          email,
          phone,
          comment,
          user_id: productdetails.seller_id,
        }
      )
      .then((res) => {
        setNotification({
          message: "Data added successfully",
          type: "success",
        });
        setTimeout(() => {
          setNotification(null);
          window.location.reload(false);
        }, 3000);
      })
      .catch((err) => {
        console.error("Error posting data:", err);
      });
  };
  return (
    <div className="fullscreen">
      <MyNavbar />
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
      <main>
        <nav className="p-2 ps-lg-5 pe-lg-5">
          <Link to="/" className="text-decoration-none text-dark">
            <i className="bi bi-house-fill"></i>
          </Link>
          &nbsp; /{" "}
          <Link
            to={"/" + productdetails.product_type}
            className="text-decoration-none text-dark"
          >
            {productdetails.product_type}{" "}
          </Link>
          /{" "}
          <Link
            to={"/" + productdetails.category}
            className="text-decoration-none text-dark"
          >
            {productdetails.category}
          </Link>{" "}
          / {productdetails.name}
        </nav>
        <div className="p-2 ps-lg-5 pe-lg-5 d-lg-flex">
          <div className="p-2 ps-lg-4 pe-lg-4 d-flex flex-column  col-lg-5">
            <div
              className="ms-auto me-auto text-center productdetailsimgdiv"
              ref={productDetailsImgRef}
            >
              {/* Initial display of firstImage */}
              <img
                src={firstImage}
                alt="product"
                className="productdetailsimg"
              />
            </div>

            <div className="ps-5 ps-md-3 ms-md-4 mt-3">
              <svg
                className={`heart ${liked ? "liked" : ""}`}
                viewBox="0 0 24 24"
                onClick={() => toggleLike(productdetails.id)}
              >
                <path d="M12,21.35L10.55,20.03C5.4,15.36 2,12.27 2,8.5C2,5.41 4.42,3 7.5,3C9.24,3 10.91,3.81 12,5.08C13.09,3.81 14.76,3 16.5,3C19.58,3 22,5.41 22,8.5C22,12.27 18.6,15.36 13.45,20.03L12,21.35Z"></path>
              </svg>
              <span className="like-count">{likeCount} likes</span>
            </div>

            <div className="ms-auto me-auto">
              <Carousel
                responsive={responsive}
                className="mt-2 productdetailscarousel"
                ref={carouselRef}
                beforeChange={(nextSlide) => setCurrentSlide(nextSlide)}
              >
                {datta.map((product, index) => (
                  <div
                    className="card m-3"
                    key={index}
                    id={`subimage-${index}`}
                    onClick={() => updateProductDetailsImg(product, index)}
                    style={{
                      border:
                        currentSlide === index
                          ? "3px solid green"
                          : "1px solid grey",
                      position: "relative",
                    }}
                  >
                    {["mp4", "webm", "avi", "mov", "quicktime"].includes(
                      `${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/images/${product}`
                        .split(".")
                        .pop()
                        .toLowerCase()
                    ) ? (
                      <div
                        style={{
                          position: "relative",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          height: "110px",
                        }}
                      >
                        <video
                          style={{
                            cursor: "pointer",
                            maxWidth: "100%",
                            height: "100%",
                            objectFit: "contain",
                            alignSelf: "center",
                            padding: "3px",
                          }}
                        >
                          <source src={product} type="video/mp4" />
                          Your browser does not support the video tag.
                        </video>
                        <i
                          className="bi bi-play-btn-fill"
                          style={{
                            position: "absolute",
                            fontSize: "2rem",
                            color: "white",
                            pointerEvents: "none",
                          }}
                        ></i>
                      </div>
                    ) : (
                      <img
                        src={product}
                        alt="images"
                        style={{
                          cursor: "pointer",
                          maxWidth: "100%",
                          height: "110px",
                          objectFit: "contain",
                          alignSelf: "center",
                          padding: "3px",
                        }}
                      />
                    )}
                  </div>
                ))}
              </Carousel>
            </div>
          </div>
          <div className="ps-md-3 p-2 col-lg-7 detailsdiv">
            <h3 className="">{productdetails.name}</h3>
            <p>{productdetails.description}</p>
            <p className="fs-4">
              <b>&#36; {productdetails.price}</b>
            </p>

            {productdetails.quantity > 0 ? (
              admin !== "admin" ? (
                <>
                  <div className="">
                    <div className="container">
                      {sessionStorage.getItem("token") === "admin" ? null : (
                        <div className="row ">
                          <div className="col-12 col-md-7 mb-2 mt-2 ">
                            <button
                              type="submit"
                              className="btn btn-secondary w-100"
                              onClick={handleAddToCart}
                            >
                              <b>ADD TO CART</b>
                            </button>
                          </div>
                          <div className="col-12 col-md-7 mb-2">
                            <button
                              type="button"
                              className="btn btn-outline-secondary w-100"
                              onClick={handleAddToWishlist}
                            >
                              <b> ADD TO WISHLIST</b>
                            </button>
                          </div>

                          {/*Button trigger modal*/}

                          <div className="col-12 col-md-7 mb-2">
                            {offerExists ? (
                              <div className="text-center">
                                <i
                                  className="bi bi-check-lg fs-3"
                                  style={{ width: "2em" }}
                                ></i>
                                <button
                                  type="button"
                                  className="btn mb-2  w-10"
                                >
                                  <b>MAKE OFFER</b>
                                </button>
                              </div>
                            ) : productdetails.seller_id ===
                              sessionStorage.getItem("user-token") ? (
                              <button
                                onClick={() =>
                                  setNotification({
                                    message: "This Product Belongs to You",
                                    type: "error",
                                  })
                                }
                                type="button"
                                className="btn mb-2 btn-outline-secondary w-100"
                              >
                                <b>MAKE OFFER</b>
                              </button>
                            ) : (
                              <button
                                type="button"
                                className="btn mb-2 btn-outline-secondary w-100"
                                data-bs-toggle="modal"
                                data-bs-target="#exampleModal"
                              >
                                <b>MAKE OFFER</b>
                              </button>
                            )}

                            <div
                              className="modal fade"
                              id="exampleModal"
                              tabIndex="-1"
                              aria-labelledby="exampleModalLabel"
                              aria-hidden="true"
                            >
                              <div className="modal-dialog modal-dialog-centered">
                                <div className="modal-content">
                                  <div className="modal-header">
                                    <p className="modal-title fs-5 text-center col-11">
                                      <b> Make an offer</b>
                                    </p>
                                    <div className="col-1">
                                      <button
                                        type="button"
                                        className="btn-close d-lg-hidden col-1 justify-center"
                                        data-bs-dismiss="modal"
                                        aria-label="Close"
                                      ></button>
                                    </div>
                                  </div>
                                  {/*modal box */}

                                  {isLoggedIn ? (
                                    <div
                                      className="modal-body"
                                      style={{ display: success ? "none" : "" }}
                                    >
                                      <img
                                        src={`${firstImage}`}
                                        alt="Small"
                                        className="img-fluid mb-3 mx-auto d-block"
                                        style={{
                                          maxWidth: "100%",
                                          maxHeight: "150px",
                                        }}
                                      />
                                      <span style={{ fontSize: "0.75rem" }}>
                                        {/* Enter Your Offer */}
                                        {add === "0.00" || add.length === 0 ? (
                                          <span style={{ color: "red" }}>
                                            Please Select Any One Off
                                          </span>
                                        ) : (
                                          <span>Enter Your Offer</span>
                                        )}
                                      </span>
                                      <div className="border p-2 position-relative mb-3">
                                        <div className="row g-0 align-items-center">
                                          <div className="col-auto">
                                            <b className="p-2 fs-5">&#36;</b>
                                          </div>
                                          <div className="col">
                                            <input
                                              type="text"
                                              placeholder="40.00"
                                              value={add}
                                              onChange={handleChange}
                                              style={{
                                                outline: "none",
                                                border: "none",
                                              }}
                                            />
                                          </div>
                                        </div>
                                      </div>

                                      <div className="row">
                                        <div
                                          onClick={() =>
                                            AmountChange(
                                              productdetails.price -
                                                (
                                                  productdetails.price * 0.2
                                                ).toFixed(2)
                                            )
                                          }
                                          className="col-4 mb-2 position-relative "
                                          onChange={AmountChange}
                                        >
                                          <span
                                            className="position-absolute start-50 translate-middle-x text-center small"
                                            style={{
                                              fontSize: "0.75rem",
                                              padding: "3px",
                                            }}
                                          >
                                            20% Off
                                          </span>
                                          <button
                                            onClick={() => setOfferAmout("20%")}
                                            type="button"
                                            value="34.00"
                                            className="btn border-secondary p-3 w-100"
                                            style={{
                                              paddingTop: "2rem",
                                              backgroundColor:
                                                offerAmout === "20%" &&
                                                add.length !== 0
                                                  ? "rgba(38, 109, 28, 0.19)"
                                                  : null,
                                            }}
                                          >
                                            <b style={{ fontSize: ".95rem" }}>
                                              &#36;
                                              {productdetails.price -
                                                (
                                                  productdetails.price * 0.2
                                                ).toFixed(2)}
                                            </b>
                                          </button>
                                        </div>

                                        <div
                                          className="col-4 mb-2 position-relative"
                                          onClick={() =>
                                            AmountChange(
                                              productdetails.price -
                                                (
                                                  productdetails.price * 0.15
                                                ).toFixed(2)
                                            )
                                          }
                                        >
                                          <span
                                            className="position-absolute top-0 start-50 translate-middle-x text-center small"
                                            style={{
                                              fontSize: "0.75rem",
                                              padding: "3px",
                                            }}
                                          >
                                            15% Off
                                          </span>
                                          <button
                                            onClick={() => setOfferAmout("15%")}
                                            type="button"
                                            className="btn border-secondary p-3 w-100"
                                            style={{
                                              paddingTop: "2rem",
                                              backgroundColor:
                                                offerAmout === "15%"
                                                  ? "rgba(38, 109, 28, 0.19)"
                                                  : null,
                                            }}
                                          >
                                            <b style={{ fontSize: ".95rem" }}>
                                              &#36;
                                              {productdetails.price -
                                                (
                                                  productdetails.price * 0.15
                                                ).toFixed(2)}
                                            </b>
                                          </button>
                                        </div>
                                        <div
                                          className="col-4 mb-2 position-relative"
                                          onClick={() =>
                                            AmountChange(
                                              productdetails.price -
                                                (
                                                  productdetails.price * 0.1
                                                ).toFixed(2)
                                            )
                                          }
                                        >
                                          <span
                                            className="position-absolute top-0 start-50 translate-middle-x text-center small"
                                            style={{
                                              fontSize: "0.75rem",
                                              padding: "3px",
                                            }}
                                          >
                                            10% Off
                                          </span>
                                          <button
                                            onClick={() => setOfferAmout("10%")}
                                            type="button"
                                            className="btn border-secondary p-3 w-100"
                                            style={{
                                              paddingTop: "2rem",
                                              backgroundColor:
                                                offerAmout === "10%"
                                                  ? "rgba(38, 109, 28, 0.19)"
                                                  : null,
                                            }}
                                          >
                                            <b style={{ fontSize: ".95rem" }}>
                                              &#36;
                                              {productdetails.price -
                                                (
                                                  productdetails.price * 0.1
                                                ).toFixed(2)}
                                            </b>
                                          </button>
                                        </div>
                                      </div>
                                    </div>
                                  ) : null}
                                  {/*success */}
                                  <div
                                    className="text-center"
                                    style={{ display: success ? "" : "none" }}
                                  >
                                    <i className="bi bi-check2-circle text-success fs-1"></i>
                                  </div>
                                  <div className="modal-footer">
                                    {isLoggedIn ? (
                                      <button
                                        onClick={handleOffer}
                                        style={{
                                          display: success ? "none" : "",
                                        }}
                                        type="button"
                                        className="btn btn-secondary w-100"
                                      >
                                        Send Offer
                                      </button>
                                    ) : (
                                      <button
                                        disabled
                                        type="button"
                                        className="btn btn-secondary w-100"
                                      >
                                        PLease Login
                                      </button>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={handleProductlist}
                    className="btn  btn-outline-secondary mt-3 mb-3"
                  >
                    ADD TO PRODUCT LIST
                  </button>
                  &nbsp;
                  <button
                    type="button"
                    className="btn  btn-danger mt-3 mb-3"
                    onClick={handleProductReject}
                  >
                    Reject
                  </button>
                </>
              )
            ) : (
              <>
                <h5 className="text-danger" style={{ fontWeight: "800" }}>
                  Out of Stock
                </h5>
              </>
            )}

            <br />
            <div>
              <h4>Product Details</h4>
            </div>
            <div className="">
              <div>
                {productdetails.location !== "NA" && (
                  <div className="">
                    <i className="bi bi-feather"></i>{"  "}
                    <span className="">
                      Product located in{"  "}
                    </span>
                    <span className="">
                      {productdetails.location}
                    </span>
                  </div>
                )}
                {productdetails.color !== "NA" && (
                  <div className="">
                    <i className="bi bi-feather"></i>{"  "}
                    <span className="">
                      {productdetails.color}
                    </span>
                    <span className="">
                      {"  "}color
                    </span>
                  </div>
                )}
                {productdetails.alteration !== "NA" && (
                  <div className="">
                    <i className="bi bi-feather"></i>{"  "}
                    <span className="">
                      Can it be altered? {"  "}
                    </span>
                    <span className="">
                      {productdetails.alteration}
                    </span>
                  </div>
                )}
              </div>
              <div>
                {productdetails.size !== "NA" && (
                  <div className="">
                    <i className="bi bi-feather"></i>{"  "}
                    <span className="">
                      Size{"  "}
                    </span>
                    <span className="">
                      {productdetails.size}
                    </span>
                  </div>
                )}
                {productdetails.measurements !== "NA" && (
                  <div className="">
                    <i className="bi bi-feather"></i>{"  "}
                    <span className="">
                      Measurement (In Inches){"  "}
                    </span>
                    <span className="">
                      {productdetails.measurements}
                    </span>
                  </div>
                )}
                {productdetails.material !== null &&
                  productdetails.material !== "NA" && (
                    <div className="">
                    <i className="bi bi-feather"></i>{"  "}
                      <span className="">
                        Material{"  "}
                      </span>
                      <span className="">
                        {productdetails.material}
                      </span>
                    </div>
                  )}
              </div>
              <div>
                {productdetails.occasion !== null &&
                  productdetails.occasion !== "NA" && (
                    <div className="">
                    <i className="bi bi-feather"></i>{"  "}
                      <span className="">
                        Occasion{"  "}
                      </span>
                      <span className="">
                        {productdetails.occasion}
                      </span>
                    </div>
                  )}
                {productdetails.type !== null &&
                  productdetails.type !== "NA" && (
                    <div className="">
                    <i className="bi bi-feather"></i>{"  "}
                      <span className="">
                        {productdetails.type}{"  "}
                      </span>
                      <span className="">
                        type{"  "}
                      </span>
                    </div>
                  )}
                {productdetails.brand !== null &&
                  productdetails.brand !== "NA" && (
                    <div className="">
                    <i className="bi bi-feather"></i>{"  "}
                      <span className="">
                        <b>Brand</b>
                      </span>
                      <span className="">
                        {productdetails.brand}
                      </span>
                    </div>
                  )}
              </div>
              <div>
                {productdetails.style !== null &&
                  productdetails.style !== "NA" && (
                    <div className="">
                    <i className="bi bi-feather"></i>{"  "}
                      <span className="">
                        Product is {productdetails.style}{"  "}
                      </span>
                      <span className="">
                        style
                      </span>
                    </div>
                  )}
                {productdetails.season !== null &&
                  productdetails.season !== "NA" && (
                    <div className="">
                    <i className="bi bi-feather"></i>{"  "}
                      <span className="">
                        Product is suitable for {productdetails.season}{"  "}
                      </span>
                      <span className="">
                        season
                      </span>
                    </div>
                  )}
                {/* {productdetails.fit !== null && productdetails.fit !== "NA" && (
                  <div className="">
                    <span className="">
                      <b>Fit</b>
                    </span>
                    <span className="">
                      {productdetails.fit}
                    </span>
                  </div>
                )} */}
              </div>
              <div>
                {productdetails.length !== null &&
                  productdetails.length !== "NA" && (
                    <div className="">
                    <i className="bi bi-feather"></i>{"  "}
                      <span className="">
                        Length (In Meters){"  "}
                      </span>
                      <span className="">
                        {productdetails.length}
                      </span>
                    </div>
                  )}
                {productdetails.condition !== "NA" && (
                  <div className="">
                    <i className="bi bi-feather"></i>{"  "}
                    <span className="">
                      Product is in {productdetails.condition}{"  "}
                    </span>
                    <span className="">
                      condition
                    </span>
                  </div>
                )}
                {productdetails.source !== "NA" && (
                  <div className="">
                    <i className="bi bi-feather"></i>{"  "}
                    <span className="">
                      Source{"  "}
                    </span>
                    <span className="">
                      {productdetails.source}
                    </span>
                  </div>
                )}
              </div>
              <div>
                {productdetails.age !== "NA" && (
                  <div className="">
                    <i className="bi bi-feather"></i>{"  "}
                    <span className="">
                      Aged{"  "}
                    </span>
                    <span className="">
                      {productdetails.age}
                    </span>
                  </div>
                )}
                <div className="">
                <i className="bi bi-feather"></i>{"  "}
                  <span className="">
                    Product ID{"  "}
                  </span>
                  <span className="">{id}</span>
                </div>
                <div className="">
                <i className="bi bi-feather"></i>{"  "}
                  <span className="">
                    Available quantity{"  "}
                  </span>
                  <span className="">
                    {productdetails.quantity}
                  </span>
                </div>
              </div>
            </div>
            <div className="col-12 col-md-8 mt-3">
              <div className="user-details border shadow-sm p-3 bg-body rounded">
                {userDetails.map((user, index) => (
                  <div
                    className="d-md-flex flex-wrap justify-content-between m-2"
                    key={index}
                  >
                    <div>
                      <p>
                        <i className="bi bi-person-circle fs-5"></i>
                        &nbsp;
                        {user.shopname === "" ||
                        user.shopname === null ||
                        user.shopname === undefined
                          ? user.name
                          : user.shopname}
                      </p>
                    </div>
                    <div>
                      <button
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => handleViewProfile(user.userId)}
                      >
                        Visit Shop
                      </button>
                      <button
                        className="btn btn-sm btn-primary ms-2"
                        data-bs-toggle="modal"
                        data-bs-target="#exampleModal2"
                      >
                        Contact to Seller
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              {productdetails.notes !== null && (
                <div className="p-2">
                  <b>Notes:</b> {productdetails.notes}
                </div>
              )}
              <Reviews userDetails={userDetails} />
            </div>
          </div>
        </div>
        <div
          className="modal fade"
          id="exampleModal2"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">
                  Contact to Seller
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="name" className="form-label fw-bold">
                      Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="name"
                      value={name}
                      onChange={handleInputChange}
                      placeholder="Enter Your Name"
                      ref={nameInputRef}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label fw-bold">
                      Email
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      name="email"
                      value={email}
                      onChange={handleInputChange}
                      placeholder="Enter Your Email"
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="phone" className="form-label fw-bold">
                      Phone
                    </label>
                    <input
                      type="tel"
                      className="form-control"
                      id="phone"
                      name="phone"
                      value={phone}
                      onChange={handleInputChange}
                      placeholder="Enter Your Phone Number"
                      pattern="[0-9]{10}"
                      title="10 digit numeric value only"
                      minLength={10}
                      maxLength={10}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="comment" className="form-label fw-bold">
                      Comment
                    </label>
                    <textarea
                      type="text"
                      className="form-control"
                      id="comment"
                      value={comment}
                      onChange={handleInputChange}
                      placeholder="Enter Comment"
                      ref={commentInputRef}
                    />
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      data-bs-dismiss="modal"
                    >
                      Close
                    </button>
                    <button type="submit" className="btn btn-primary">
                      Save
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <Scrolltotopbtn />
    </div>
  );
}
