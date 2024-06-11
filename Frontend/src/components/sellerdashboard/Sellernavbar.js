import React from 'react'
import { Link } from 'react-router-dom';
import {  useData } from "../CartContext";

export default function Sellernavbar() {
  const { user } = useData();

  const handlelogout = () => {
    sessionStorage.removeItem("user-token");
    sessionStorage.removeItem("token");
  };

  return (
    <div>
      <nav className="navbar navbar-expand-md bg-dark sticky-top d-md-flex justify-content-between">
        <div className="ms-3">
          <Link to="/" className=''>
            <img
              src="https://bargain-boutique.com/wp-content/uploads/2023/03/Bargain-Boutique-Logo-1.png"
              alt="logo"
              height="45px"
              width="120px"
              className='bg-light p-1'
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
                <ul className="list-unstyled d-flex  gap-5">
                  <li className='ms-3 '>
                    <Link
                      to="/addnewproduct"
                      className="text-decoration-none text-white"
                    >
                      Add New Product
                    </Link>
                  </li>
                  <li className=''>
                      {user.firstname} {user.lastname}
                  </li>
                  <li className=''>
                    <Link
                      to="/login"
                      className="text-decoration-none text-white"
                      onClick={handlelogout}
                    >
                      Log Out
                    </Link>
                  </li>
                  <li className=''>
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
