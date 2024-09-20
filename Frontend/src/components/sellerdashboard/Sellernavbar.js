import React from 'react'
import { Link } from 'react-router-dom';
// import {  useData } from "../CartContext";
import RBLogo from '../../images/ResaleLogo.png'

export default function Sellernavbar() {
  // const { user } = useData();

  // const handlelogout = () => {
  //   sessionStorage.removeItem("user-token");
  //   sessionStorage.removeItem("token");
  // };

  return (
    <div>
      <nav className="navbar navbar-expand-md  sticky-top d-md-flex justify-content-between ps-md-5 pe-md-5" style={{borderBottom:" 2px solid #ddd" ,boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)"}}>
      <div className="ms-lg-5 ms-md-3 ms-2 bargainlogodiv">
              <Link to="/">
                <img
                  src={RBLogo}
                  alt="logo"
                  // width="112px"
                  className="RBlogo"
                  style={{ objectFit: "contain"  }}
                />
              </Link>
            </div>
        <button
          className="navbar-toggler bg-light m-1"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarTogglerDemo03"
          aria-controls="navbarTogglerDemo03"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse d-md-flex ps-4 ps-md-2 pe-2 mt-2" id="navbarTogglerDemo03">
                <ul className="list-unstyled d-flex gap-5">
                  {/* <li className=''>
                      {user.firstname} {user.lastname}
                  </li> */}
                  <li className=''>
                    <Link
                      to="/sellerproducts"
                      className="text-decoration-none text-dark"
                      // onClick={handlelogout}
                    >
                      Products
                    </Link>
                  </li>
                  <li className=''>
                    <Link
                      to="/shipments"
                      className="text-decoration-none text-dark"
                      // onClick={handlelogout}
                    >
                      Shipments
                    </Link>
                  </li>
                  <li className=''>
                    <Link
                      to="/"
                      className="text-decoration-none text-dark"
                    >
                      Public Store
                    </Link>
                  </li>
                </ul>
              
        </div>
      </nav>
    </div>
  )
}
