import React from 'react'
import { Link } from 'react-router-dom';
import RBLogo from '../../images/ResaleLogo.png'
// import {  useData } from "../CartContext";

export default function Adminnavbar() {
  // const { user } = useData();

  // const handlelogout = () => {
  //   sessionStorage.removeItem("user-token");
  //   sessionStorage.removeItem("token");
  // };

  return (
    <div>
      <nav className="navbar navbar-expand-md sticky-top d-md-flex justify-content-between ps-md-5 pe-md-5" style={{ borderBottom: " 2px solid #ddd", boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)" }}>
        <div className="ms-lg-5 ms-md-3 ms-2 bargainlogodiv">
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
        <div className="collapse d-md-flex ps-2 pe-2 mt-2" id="navbarTogglerDemo03">
          <ul className="list-unstyled d-flex align-items-center gap-md-5 gap-3">

            {/* <li className='ms-5'>
              Admin
            </li> */}
            <li>
             
              <div className="btn-group">
                <button type="button" className="btn border-0  dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                Products Catalog
                </button>
                <ul className="dropdown-menu" style={{lineHeight:"30px"}}>
                  <li><Link className="dropdown-item" to="/acceptproduct">Approval Products</Link></li>
                  <li><Link className="dropdown-item" to="/productmanagement">Products Management</Link></li>
                  <li><Link className="dropdown-item" to="/usersmanagement">User Management</Link></li>
                  
                </ul>
              </div>
            </li>
            <li>
              <Link
                to="/refundsproduct"
                className="text-decoration-none text-dark"
              >
                Refund
              </Link>
            </li>
            <li>
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
