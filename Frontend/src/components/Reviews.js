import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaStar } from "react-icons/fa";
import axios from "axios";
import moment from "moment";

const renderStars = (rating) => {
  const stars = [];
  for (let i = 0; i < 5; i++) {
    stars.push(
      <FaStar key={i} color={i < rating ? "#E81F00" : "#e4e5e9"} size={12} />
    );
  }
  return stars;
};

const Reviews = ({ userDetails }) => {
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState(null);
  const [allReviews, setAllReviews] = useState([]);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/reviews`)
      .then((res) => {
        const filteredReviews = res.data.filter((review) =>
          userDetails.some((user) => user.userId === review.seller_id)
        );
        setReviews(filteredReviews.slice(0, 3));
        setAllReviews(filteredReviews);
        setError(null);
      })
      .catch((error) => {
        console.error("Error fetching reviews:", error);
        setError(error.message || "Failed to fetch reviews");
      });
  }, [userDetails]); // Depend on userDetails to trigger useEffect when it changes

  if (error) {
    return <div className="alert alert-danger">Error: {error}</div>;
  }

  return (
    <div className="container mt-4">
      {reviews.length > 0 ? (
        <>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h2>Recent reviews</h2>
            {/* <button
              className="btn btn-primary"
              data-bs-toggle="modal"
              data-bs-target="#exampleModal"
            >
              See more
            </button> */}
          </div>
          <ul className="list-unstyled">
            {reviews.map((review, index) => {
              const userDetail = userDetails.find(
                (user) => user.userId === review.seller_id
              );
              if (!userDetail) return null;

              return (
                <>
                  <h5 className="d-md-flex align-items-center mb-1 fs-6 justify-content-evenly">
                    {renderStars(review.rating)}
                    <span className="ms-4"> by {review.firstname}&nbsp;{review.lastname}</span>
                    <small className="text-muted ms-auto">
                      Posted {moment(review.created_at).fromNow()}
                    </small>
                  </h5>
                  <div className="d-md-flex border-bottom pb-3">
                    <div className="image-preview me-2">
                      {review.images.map((imageUrl, idx) => (
                        <img
                          key={idx}
                          src={`${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/images/${imageUrl}`}
                          alt={`Review ${index} Image ${idx}`}
                          className="img-thumbnail"
                          width="70"
                          height="70"
                        />
                      ))}
                    </div>
                    <div className="me-3">
                      <h5 className="mb-4"></h5>
                      <h6 className="mb-1 ">{review.title}</h6>
                      <p className="mb-0">{review.description}</p>
                    </div>
                  </div>
                </>
              );
            })}
          </ul>
        </>
      ) : (
        <p>No reviews available</p>
      )}

      <div
        className="modal fade"
        id="exampleModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                Reviews
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <ul className="list-unstyled">
                {allReviews.map((review, index) => {
                  const userDetail = userDetails.find(
                    (user) => user.userId === review.seller_id
                  );
                  if (!userDetail) return null;
                  return (
                    <li
                      key={index}
                      className="review-list mb-3 border-bottom pb-3"
                    >
                      <h5 className="mb-1">{userDetail.name}</h5>
                      <h6 className="mb-1">{review.title}</h6>
                      <div className="rating">{renderStars(review.rating)}</div>
                      <p className="mb-0">{review.description}</p>
                      <div className="image-preview mt-2">
                        {review.images.map((imageUrl, idx) => (
                          <img
                            key={idx}
                            src={`${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/images/${imageUrl}`}
                            alt={`Review ${index} Image ${idx}`}
                            className="img-thumbnail"
                            width="70"
                            height="70"
                          />
                        ))}
                      </div>
                      <small className="text-muted">
                        Posted {moment(review.created_at).fromNow()}
                      </small>
                    </li>
                  );
                })}
              </ul>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reviews;
