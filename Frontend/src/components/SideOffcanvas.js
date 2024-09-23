import React from "react";
import { Link } from "react-router-dom";

const SideOffcanvas = ({isLoggedIn}) => {
  return (
    <>
      <div>
        <Link
          to={
            sessionStorage.getItem("token") !== null
              ? "/addnewproduct"
              : "/login"
          }

          className="text-decoration-none btn btn-secondary w-100 m-1"
          style={{ fontWeight: "500" }}
        >
          Sell now
        </Link>
        {isLoggedIn ?( 
         null
        ):( <>          
        <Link
          to="/register"
          className="text-decoration-none btn btn-secondary w-100 m-1"
          style={{ fontWeight: "500" }}
        >
          Sign up
        </Link>
        <Link
          to="/login"
          className="text-decoration-none btn btn-secondary w-100 m-1"
          style={{ fontWeight: "500" }}
        >
          Log in
        </Link>
        </>
) }
       
      </div>
    </>
  );
};

export default SideOffcanvas;
