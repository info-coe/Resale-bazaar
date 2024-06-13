import React from 'react'
import { Link } from 'react-router-dom';
import RBLogo from '../../images/RB-logo5.png'
// import {  useData } from "../CartContext";

export default function Adminnavbar() {
  // const { user } = useData();

  const handlelogout = () => {
    sessionStorage.removeItem("user-token");
    sessionStorage.removeItem("token");
  };

  return (
    <div>
      <nav className="navbar navbar-expand-md bg-dark sticky-top d-md-flex justify-content-between">
      <div className="ms-lg-5 ms-md-3 ms-2 bargainlogodiv bg-light">
              <Link to="/">
                <img
                  src={RBLogo}
                  alt="logo"
                  // width="112px"
                  className="RBlogo"
                  style={{ objectFit: "contain" }}
                />
              </Link>
            </div>
        <button
          className="navbar-toggler bg-light"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarTogglerDemo03"
          aria-controls="navbarTogglerDemo03"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse d-md-flex ps-2 pe-2 mt-2 text-white" id="navbarTogglerDemo03">
                <ul className="list-unstyled d-flex gap-md-5 gap-5">
                  
                  <li className='ms-5'>
                      Admin
                  </li>
                  <li>
                    <Link
                      to="/login"
                      className="text-decoration-none text-white"
                      onClick={handlelogout}
                    >
                      Log Out
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/"
                      className="text-decoration-none text-white"
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
