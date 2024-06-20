import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import MyNavbar from '../navbar';
import Footer from '../footer';


const SellerProfile = () => {
  const { sellerId } = useParams();
  const [sellerDetails, setSellerDetails] = useState({});
  const [sellerProducts, setSellerProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch seller details including profile picture URL
    axios.get(`${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/user`)
      .then(res => {
        if (res.data !== "Fail" && res.data !== "Error") {
          const user = res.data.find(item => item.user_id.toString() === sellerId);
          if (user) {
            setSellerDetails({
              userId: user.user_id,
              email: user.email,
              phone: user.phone,
              name: `${user.firstname} ${user.lastname}`,
            });
           
          }
        }
      })
      .catch(err => console.log(err));

    // Fetch products based on sellerId
    axios.get(`${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/allproducts?seller_id=${sellerId}`)
      .then(res => {
        if (res.data !== "Fail" && res.data !== "Error") {
          setSellerProducts(res.data);
        }
        setLoading(false); // Set loading to false once products are fetched
      })
      .catch(err => {
        console.log(err);
        setLoading(false); // Set loading to false in case of error
      });
  }, [sellerId]);

  const renderStarRatings = (rating) => {
    const stars = [];
    const filledStars = Math.floor(rating);
    for (let i = 0; i < 5; i++) {
      stars.push(
        <i key={i} className={`bi ${i < filledStars ? 'bi-star-fill text-warning' : 'bi-star'} me-1`}></i>
      );
    }
    return stars;
  };

  return (
    <>
    <MyNavbar/>
    <div className="container mt-3">
      <div  className="row">
        <div className="col-lg-12">
          <div className="seller-profile-header border">
            <div className='m-5'>             
            <h2 className="seller-name fs-1">
              <i class="bi bi-person-circle fs-1"></i>&nbsp;{sellerDetails.name}</h2>
              {/* <p className='ms-5'>{renderStarRatings(4)}</p> */}
                  <p className='ms-5'><i class="bi bi-envelope"></i>&nbsp;{sellerDetails.email}</p>
                  <p className='ms-5'><i class="bi bi-phone-fill"></i>&nbsp;{sellerDetails.phone}</p>
            </div>
          </div>
        </div>
        </div>
        </div>
        <div className="container mt-5">
        <div className="row">
          <div className="">
            <h3 className="mb-4">Products by {sellerDetails.name}</h3>
            {loading ? (
              <p>Loading...</p>
            ) : sellerProducts.length === 0 ? (
              <p>No products available.</p>
            ) : (
              <div className="d-md-flex  flex-wrap ms-md-5 me-md-5 mb-4 mt-md-3 mt-3 ms-2 me-2">
                {sellerProducts.map(product => (
                  <div key={product.product_id} className=" mb-4">
                    <div className="card productcard h-100 border rounded shadow-sm">
                      <div className="productimgback">
                        <img
                          src={`${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/images/${JSON.parse(product.image)[0]}`}
                          alt={product.name}
                          className="card-img-top"
                          style={{ objectFit: "cover" }}
                        />
                      </div>
                      <div className="card-body bodydiv">
                        {/* <h6 className="card-title" style={{fontSize:"14px"}}>{product.name}</h6> */}
                        <p className="card-text text-success"><b>&#36; {product.price}</b></p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
<Footer/>
    </>
  );
};

export default SellerProfile;
