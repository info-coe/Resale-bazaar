import React from "react";
import { Link } from "react-router-dom";

export default function Menu() {
  return (
    <>
      <div className="bg-secondary text-white text-center p-2 fs-4">
        <h1 className="fs-4">Categories</h1>
      </div>
      <div className="mb-4 menumain">
        <div className="accordion accordion-flush" id="accordionFlushExample">
          <div className="accordion-item">
            <h2 className="accordion-header" id="flush-headingTwo">
              <button
                className="accordion-button collapsed p-2"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#flush-collapseTwo"
                aria-expanded="false"
                aria-controls="flush-collapseTwo"
              >
                <div>
                  <span>
                    {" "}
                    <b>WOMENS</b>
                  </span>
                </div>
              </button>
            </h2>
            <div
              id="flush-collapseTwo"
              className="accordion-collapse collapse"
              aria-labelledby="flush-headingTwo"
              data-bs-parent="#accordionFlushExample"
            >
              <div className="accordion-body p-0">
                <ul className="list-group">
                  <Link
                    to="/highendcouture"
                    className="text-decoration-none text-dark"
                  >
                    <li className="list-group-item">High end Couture</li>
                  </Link>
                  <Link to="/sarees" className="text-decoration-none text-dark">
                    <li className="list-group-item">Sarees</li>
                  </Link>
                  <Link
                    to="/lehenga"
                    className="text-decoration-none text-dark"
                  >
                    <li className="list-group-item">Lehengas</li>
                  </Link>
                  <Link
                    to="/dresses"
                    className="text-decoration-none text-dark"
                  >
                    <li className="list-group-item">Dresses</li>
                  </Link>
                  <Link
                    to="/twinningoutfits"
                    className="text-decoration-none text-dark"
                  >
                    <li className="list-group-item">Twinning Outfits</li>
                  </Link>
                </ul>
              </div>
            </div>
          </div>
          <div className="accordion-item">
            <h2 className="accordion-header" id="flush-headingThree">
              <button
                className="accordion-button collapsed p-2"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#flush-collapseThree"
                aria-expanded="false"
                aria-controls="flush-collapseThree"
              >
                <div>
                  <span>
                    {" "}
                    <b>KIDS</b>
                  </span>
                </div>
              </button>
            </h2>
            <div
              id="flush-collapseThree"
              className="accordion-collapse collapse"
              aria-labelledby="flush-headingThree"
              data-bs-parent="#accordionFlushExample"
            >
              <div className="accordion-body p-0">
                <ul className="list-group">
                  <Link to="/girl" className="text-decoration-none text-dark">
                    <li className="list-group-item">Girl</li>
                  </Link>
                  <Link to="/boy" className="text-decoration-none text-dark">
                    <li className="list-group-item">Boy</li>
                  </Link>
                </ul>
              </div>
            </div>
          </div>

          <div className="accordion-item">
            <h2 className="accordion-header" id="flush-headingFour">
              <button
                className="accordion-button collapsed p-2"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#flush-collapseFour"
                aria-expanded="false"
                aria-controls="flush-collapseFour"
              >
                <div>
                  <span>
                    {" "}
                    <b>JEWELLERY</b>
                  </span>
                </div>
              </button>
            </h2>
            <div
              id="flush-collapseFour"
              className="accordion-collapse collapse"
              aria-labelledby="flush-headingFour"
              data-bs-parent="#accordionFlushExample"
            >
              <div className="accordion-body p-0">
                <ul className="list-group">
                <Link
                    to="/necklaces"
                    className="text-decoration-none text-dark"
                  >
                    <li className="list-group-item">Necklaces</li>
                  </Link>
                  <Link
                    to="/bangles"
                    className="text-decoration-none text-dark"
                  >
                    <li className="list-group-item">Bangles</li>
                  </Link>
                  <Link
                    to="/earrings"
                    className="text-decoration-none text-dark"
                  >
                    <li className="list-group-item">Earrings</li>
                  </Link>
                  <Link
                    to="/rings"
                    className="text-decoration-none text-dark"
                  >
                    <li className="list-group-item">Rings</li>
                  </Link>
                </ul>
              </div>
            </div>
          </div>

          <div className="accordion-item">
            <h2 className="accordion-header" id="flush-headingFive">
              <button
                className="accordion-button collapsed p-2"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#flush-collapseFive"
                aria-expanded="false"
                aria-controls="flush-collapseFive"
              >
                <div>
                  <span>
                    {" "}
                    <b>BOOKS</b>
                  </span>
                </div>
              </button>
            </h2>
            <div
              id="flush-collapseFive"
              className="accordion-collapse collapse"
              aria-labelledby="flush-headingFive"
              data-bs-parent="#accordionFlushExample"
            >
              <div className="accordion-body p-0">
                <ul className="list-group">
                <Link
                    to="/fiction"
                    className="text-decoration-none text-dark"
                  >
                    <li className="list-group-item">Fiction</li>
                  </Link>
                  <Link
                    to="/drama"
                    className="text-decoration-none text-dark"
                  >
                    <li className="list-group-item">Drama</li>
                  </Link>
                  <Link
                    to="/fantasy"
                    className="text-decoration-none text-dark"
                  >
                    <li className="list-group-item">Fantasy</li>
                  </Link>
                  <Link
                    to="/horror"
                    className="text-decoration-none text-dark"
                  >
                    <li className="list-group-item">Horror</li>
                  </Link>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
