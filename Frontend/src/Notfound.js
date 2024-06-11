import React from "react";
import { Link } from "react-router-dom";

export default function Notfound() {
  return (
    <div className="text-center m-5 p-5">
      <h1>4😭4</h1>
      <h5>OOPS! PAGE NOT FOUND</h5>
      <p><i>Sorry, but the page you are looking for does not exist or is temporarily unavailable.</i></p>
      <Link to="/"><button type="button" className="btn btn-warning rounded-5">Back to homepage</button></Link>
    </div>
  );
}
