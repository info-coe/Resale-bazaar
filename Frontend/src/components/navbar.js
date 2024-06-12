
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useCart, useData } from "./CartContext";
import axios from "axios";
import Wishlistemptyimg from '../images/wishlistemptyimg.png'
// import RBLogo from '../images/RB-logo.jpg'
import RBLogo from '../images/RB-logo4.png'
import SearchBar from "./Searchbar";


const MyNavbar = () => {
  const [products, setProducts] = useState([]);
  const { user } = useData();
  console.log(user)
  const {
    cartItems,
    calculateTotalPrice,
    // removeFromCart,
    setCartItems,
    // incrementQuantity,
    // decrementQuantity,
    wishItems,
    removeFromWishlist,
    moveFromWishlistToCart,
    selectedWishlistItems,
    handleCheckboxChange,
  } = useCart();
  // console.log(wishItems)
  // const totalPrice = calculateTotalPrice();

  // Create refs for dropdown menus
  // const womenDropdownRef = useRef(null);
  // const kidsDropdownRef = useRef(null);
  // const jewelryDropdownRef = useRef(null);
  // const booksDropdownRef = useRef(null);

  // Function to handle hover event for dropdowns
  // const handleDropdownHover = (ref) => {
  //   if (ref.current) {
  //     ref.current.classList.add("show");
  //   }
  // };

  // Function to handle mouse leave event for dropdowns
  // const handleDropdownLeave = (ref) => {
  //   if (ref.current) {
  //     ref.current.classList.remove("show");
  //   }
  // };
  const handleMoveSelectedToCart = () => {
    moveFromWishlistToCart();
  };

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    if (sessionStorage.getItem("token") !== null) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, [setIsLoggedIn]);

  const handlelogout = () => {
    sessionStorage.removeItem("user-token");
    sessionStorage.removeItem("token");
    axios
      .delete(`${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/logout`, {
        headers: {
          'Content-Type': 'application/json',
          token: `${sessionStorage.getItem("accessToken")}`
        },
      })
      .then((response) => {
        sessionStorage.removeItem("accessToken");
        // console.log("Product removed from cart:");
      })
      .catch((error) => {
        console.error("Error removing product from cart:", error);
      });
    setIsLoggedIn(false);
    if (sessionStorage.getItem("user-token") === null) {
      setCartItems([]);
      calculateTotalPrice();
    }
  };

  const [sellers, setSellers] = useState([]);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/selleraccount`)
      .then((res) => {
        if (res.data !== "Error" && res.data !== "Fail") {
          res.data.map((item) => {
            if (item.email === user.email) {
              return setSellers(item);
            }
            return null;
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });

    axios
      .get(`${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/addcart`)
      .then((response) => {
        if (response.data !== "Fail" && response.data !== "Error") {
          if (sessionStorage.getItem("user-token") !== null) {
            sessionStorage.getItem("token") === "user" &&
              setCartItems(
                response.data.filter(
                  (item) =>
                    item.userid.toString() ===
                    sessionStorage.getItem("user-token")
                  // item.payment_status === null
                )
              );
          }
          // else {
          //   setCartItems(response.data.filter((item) => item.userid === null));
          // }
        }
      })
      .catch((error) => {
        console.error("Error fetching cart items:", error);
      });
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/adminproducts`)
      .then((res) => {
        // console.log(res.data);

        if (res.data !== "Fail" && res.data !== "Error") {
          setProducts(res.data.filter((item) => item.rejection_reason === null && item.accepted_by_admin === "false"));
        }
      })
      .catch((err) => console.log(err));
  }, []);


  return (
    <>
      <div className="gradientnav sticky-top">
        <nav className="navbar navbar-expand-md navbar-light bg-white  d-md-flex justify-content-between">
          <div className="d-flex">
            {/* <button
          className="navbar-toggler ms-2 custom-navbar-toggler"
         
          data-bs-toggle="offcanvas"
          data-bs-target="#offcanvasWithBothOptions"
          aria-controls="offcanvasWithBothOptions"
        >
          <span className="navbar-toggler-icon"></span>
        </button> */}
            <div className="ms-lg-5 ms-1 bargainlogodiv">
              <Link to="/">
                <img
                  // src="https://bargain-boutique.com/wp-content/uploads/2023/03/Bargain-Boutique-Logo-1.png"
                  src={RBLogo}
                  alt="logo"
                  // height="50px"
                  width="130px"
                  style={{ objectFit: "contain" }}
                />
              </Link>
            </div>
          </div>


          {/* <div className="offcanvas offcanvas-start w-75" data-bs-scroll="true" tabIndex="-1" id="offcanvasWithBothOptions" aria-labelledby="offcanvasWithBothOptionsLabel">
          <div className="offcanvas-header">
            <h5 className="offcanvas-title" id="offcanvasWithBothOptionsLabel">
              <Link to="/">
                <img
                  src="https://bargain-boutique.com/wp-content/uploads/2023/03/Bargain-Boutique-Logo-1.png"
                  alt="logo"
                  height="50px"
                  width="120px"
                />
              </Link>
            </h5>
            <button type="button" className="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
          </div>
          <div className="offcanvas-body d-md-flex justify-content-around">
           
            <div
              className=" d-md-flex ps-2 pe-2 mt-2"
            
            >
              <ul className="list-unstyled d-md-flex  gap-md-3 position-relative navbarul">
                <li
                  className="nav-item dropdown"
                  onMouseEnter={() => handleDropdownHover(womenDropdownRef)}
                  onMouseLeave={() => handleDropdownLeave(womenDropdownRef)}
                >
                  <Link
                    className="nav-link"
                    to="/women"
                    id="navbarDropdownWomen"
                    role="button"
                    aria-haspopup="true"
                    aria-expanded="false"
                  >
                    WOMENS
                  </Link>
                  <div
                    className="dropdown-menu hovermenus"
                    aria-labelledby="navbarDropdownWomen"
                    ref={womenDropdownRef}
                  >
                    <Link className="dropdown-item" to="/highendcouture">
                      High end Couture
                    </Link>
                    <Link className="dropdown-item" to="/sarees">
                      Sarees
                    </Link>
                    <Link className="dropdown-item" to="/lehenga">
                      Lehenga
                    </Link>
                    <Link className="dropdown-item" to="/dresses">
                      Dresses
                    </Link>
                    <Link className="dropdown-item" to="/twinningoutfits">
                      Twinning Outfits
                    </Link>
                  </div>
                </li>
                <li
                  className="nav-item dropdown"
                  onMouseEnter={() => handleDropdownHover(kidsDropdownRef)}
                  onMouseLeave={() => handleDropdownLeave(kidsDropdownRef)}
                >
                  <Link
                    className="nav-link"
                    to="/kids"
                    id="navbarDropdownKids"
                    role="button"
                    aria-haspopup="true"
                    aria-expanded="false"
                  >
                    KIDS
                  </Link>
                  <div
                    className="dropdown-menu hovermenus"
                    aria-labelledby="navbarDropdownKids"
                    ref={kidsDropdownRef}
                  >
                    <Link className="dropdown-item" to="/girl">
                      Girl
                    </Link>
                    <Link className="dropdown-item" to="/boy">
                      Boy
                    </Link>
                  </div>
                </li>
                <li
                  className="nav-item dropdown"
                  onMouseEnter={() => handleDropdownHover(jewelryDropdownRef)}
                  onMouseLeave={() => handleDropdownLeave(jewelryDropdownRef)}
                >
                  <Link
                    className="nav-link"
                    to="/jewellery"
                    id="navbarDropdownKids"
                    role="button"
                    aria-haspopup="true"
                    aria-expanded="false"
                  >
                    JEWELLERY
                  </Link>
                  <div
                    className="dropdown-menu hovermenus"
                    aria-labelledby="navbarDropdownKids"
                    ref={jewelryDropdownRef}
                  >
                    <Link className="dropdown-item" to="/necklaces">
                    Necklaces
                    </Link>
                    <Link className="dropdown-item" to="/bangles">
                    Bangles
                      </Link>
                      <Link className="dropdown-item" to="/earrings">
                      Earrings
                      </Link>
                      <Link className="dropdown-item" to="/rings">
                       Rings
                      </Link>
                  </div>
                </li>
                <li
                  className="nav-item dropdown"
                  onMouseEnter={() => handleDropdownHover(booksDropdownRef)}
                  onMouseLeave={() => handleDropdownLeave(booksDropdownRef)}
                >
                  <Link
                    className="nav-link"
                    to="/books"
                    id="navbarDropdownKids"
                    role="button"
                    aria-haspopup="true"
                    aria-expanded="false"
                  >
                    BOOKS
                  </Link>
                  <div
                    className="dropdown-menu hovermenus"
                    aria-labelledby="navbarDropdownKids"
                    ref={booksDropdownRef}
                  >
                      <Link className="dropdown-item" to="/fiction">
                    Fiction                    
                    </Link>
                    <Link className="dropdown-item" to="/drama">
                     Drama
                    </Link>
                    <Link className="dropdown-item" to="/fantasy">
                     Fantasy
                    </Link>
                    <Link className="dropdown-item" to="/horror">
                      Horror
                    </Link>
                  </div>
                </li>
              </ul>
            </div>
           
          </div>
        </div> */}
          <SearchBar />
          <div className="d-flex me-1 me-lg-3 authdiv">
            <div className="d-md-flex ps-2 pe-2">

              <div className="">
                {isLoggedIn && user.email === "admin@admin" ? (
                  null
                ) : (
                  <>
                    <div className="d-flex">
                      <div className="mt-1" style={{ width: "110px" }}>
                        <Link to={
                          sessionStorage.getItem("token") !== null
                            ? "/selleraccount"
                            : "/login"
                        } className="text-decoration-none  btn btn-dark"
                          style={{ fontWeight: '500' }}
                        >
                          SELL NOW
                        </Link>
                      </div>
                      <button
                        className="btn cartBtn "
                      >
                        <Link
                          to="/cartitems"
                          className="text-decoration-none text-dark"

                        >
                          <i className="bi bi-cart3 fs-4 position-relative" >
                            {cartItems.length > 0 && (
                              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-success" style={{ fontSize: "12px" }}>
                                {cartItems.length}
                                <span className="visually-hidden">unread messages</span>
                              </span>
                            )}
                          </i>
                        </Link>
                      </button>
                      {user.email === "admin@admin" ? (
                        null
                      ) : (

                        <button
                          className="btn cartBtn"
                          data-bs-toggle="modal"
                          data-bs-target="#myModal2"
                        >
                          {" "}
                          <i className="bi bi-heart-fill fs-4 position-relative">
                            {" "}

                            {/* {wishItems.length > 0 && (
                              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-success">
                                {wishItems.length}
                                <span className="visually-hidden">
                                  unread messages
                                </span>
                              </span>
                            )} */}
                          </i>
                        </button>

                      )}
                    </div>
                  </>
                )}

              </div>
            </div>
            <div className="d-md-flex ps-2 pe-2 mt-2">
              {isLoggedIn ? (
                <div className="button-group ">
                  <button
                    type="button"
                    className="btn btn-secondary me-2 rounded-circle d-flex align-items-center"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <span className="text-white">
                      <i className="bi bi-person-fill fs-6"></i>
                    </span>
                  </button>

                  <ul className="dropdown-menu dropdown-menu-end p-1 persondropdown">
                    <li className="p-1">
                      <button className="dropdown-item" type="button">
                        Hello, {user.firstname}
                      </button>
                    </li>

                    {user.email === "admin@admin" ? (
                      <li className="p-1">
                        <Link
                          to="/acceptproduct"
                          className="text-decoration-none text-dark ps-3"
                        >
                          <i className="bi bi-file-earmark-person-fill fs-6 position-relative">
                            {" "}
                            Accept Product
                            {products.length > 0 && (
                              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-success">
                                {products.length}
                                <span className="visually-hidden">
                                  unread messages
                                </span>
                              </span>
                            )}

                          </i>{" "}

                        </Link>
                      </li>
                    ) : null}
                    {sellers.length !== 0 ? (
                      <li className="p-1">
                        <Link
                          to="/sellerproducts"
                          className="text-decoration-none text-dark ps-3"
                        >
                          <i className="bi bi-file-earmark-person-fill"></i>{" "}
                          Administration
                        </Link>
                      </li>
                    ) : null}


                    <li className="p-1">
                      <Link
                        to="/customerinfo"
                        className="text-decoration-none text-dark ps-3"
                      >
                        <i className="bi bi-person-fill-gear"></i> My Account
                      </Link>
                    </li>
                    <li className="p-1">
                      <Link
                        to="/login"
                        className="text-decoration-none text-dark ps-3"
                        onClick={handlelogout}
                      >
                        <i className="bi bi-box-arrow-right"></i> Log Out
                      </Link>
                    </li>
                  </ul>
                </div>
              ) : (
                <>
                  <div className="d-flex gap-2">

                    <div className="mt-1" style={{ width: "80px" }}>
                      <Link to="/register" className="text-decoration-none text-dark"
                        style={{ fontWeight: '500' }}
                      >
                        SIGN UP
                      </Link>
                    </div>
                    <div className="mt-1">
                      <Link to="/login" className="text-decoration-none text-dark"
                        style={{ fontWeight: '500' }}
                      >
                        LOGIN
                      </Link>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </nav>



      </div>
      {/* wishmodal */}
      <div className="modal" id="myModal2">
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>

            <div className="modal-body" id="showmod"></div>

            <table className="table table-hover ">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Action</th>
                  <th>Product Image</th>
                  <th>Product Name</th>
                  <th>Price</th>
                </tr>
              </thead>
              <tbody>
                {wishItems.length > 0 ? (
                  wishItems.map((product, index) => (
                    <tr key={index}>
                      <td>
                        <button
                          type="button"
                          className="btn-close w-50"
                          onClick={() => removeFromWishlist(product.id)}
                        ></button>
                      </td>
                      <td>
                        <input
                          type="checkbox"
                          checked={selectedWishlistItems.includes(product.product_id)}
                          onChange={() => handleCheckboxChange(product.product_id)}
                        />
                      </td>
                      <td>
                        <img
                          src={`${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/images/${JSON.parse(product.image)[0]}`}
                          alt={product.name}
                          style={{ maxWidth: "50px", maxHeight: "80px" }}
                        />
                      </td>
                      <td className="text-secondary">{product.name}</td>
                      <td>{product.price}</td>
                    </tr>
                  ))) : (
                  <tr>
                    <td colSpan={5} className="text-center">
                      <img src={Wishlistemptyimg} alt="Your Cart is Empty" width="200" height="200" style={{ objectFit: "contain" }} />
                    </td>
                  </tr>
                )
                }
              </tbody>
            </table>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-danger"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              <button
                className="btn btn-primary"
                onClick={handleMoveSelectedToCart}
                disabled={selectedWishlistItems.length === 0}
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MyNavbar;

