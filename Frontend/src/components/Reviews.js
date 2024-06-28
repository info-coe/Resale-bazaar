
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

const Reviews = ({ userDetails, productdetails }) => {
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState(null);
  const [allReviews, setAllReviews] = useState([]);
  const [reviewLimit, setReviewLimit] = useState(3);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const reviewResponse = await axios.get(`${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/reviews`);
        if (reviewResponse.data !== "Fail" && reviewResponse.data !== "Error") {
          const filteredReviews = reviewResponse.data.filter((review) =>
            userDetails.some((user) => user.userId === review.seller_id) 
          );
          setReviews(filteredReviews);
          setAllReviews(filteredReviews);
          setError(null);
        }
      } catch (error) {
        console.error("Error fetching reviews:", error);
        setError(error.message || "Failed to fetch reviews");
      }
    };

    fetchReviews();
  }, [userDetails, productdetails?.seller_id]);

  const handleSeeMore = () => {
    setReviewLimit(allReviews.length); // Display all reviews
  };

  if (error) {
    return <div className="alert alert-danger">Error: {error}</div>;
  }

  return (
    <div className="container mt-4">
      {reviews.length > 0 ? (
        <>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h2>Recent reviews</h2>
           
              <button className="btn" onClick={handleSeeMore}>
                See more
              </button>
          
          </div>
          <ul className="list-unstyled">
            {reviews.slice(0, reviewLimit).map((review, index) => {
              const userDetail = userDetails.find(
                (user) => user.userId === review.seller_id
              );
              if (!userDetail) return null;

              return (
                <li key={index} className="border-bottom pb-3 mb-3">
                  <h5 className="d-md-flex align-items-center mb-1 fs-6 justify-content-evenly">
                    {renderStars(review.rating)}
                    <span className="ms-4">
                      {review.firstname} {review.lastname}
                    </span>
                    <small className="text-muted ms-auto">
                      Posted {moment(review.created_at).fromNow()}
                    </small>
                  </h5>
                  <div className="d-md-flex">
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
                      <h6 className="mb-1">{review.title}</h6>
                      <p className="mb-0">{review.description}</p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </>
      ) : (
        <p>No reviews available</p>
      )}
    </div>
  );
};

export default Reviews;
