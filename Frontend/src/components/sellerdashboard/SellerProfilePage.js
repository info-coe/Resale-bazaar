import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import MyNavbar from '../navbar';
import Footer from '../footer';
import 'bootstrap/dist/css/bootstrap.min.css';

const SellerProfile = () => {
  const { sellerId } = useParams();
  const [sellerDetails, setSellerDetails] = useState({});
  const [sellerProducts, setSellerProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    user_id: sellerId, 
    name: '',
    email: '',
    phone: '',
    comment:""
  });
  
  const { name, email, phone,comment } = formData;
  
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };
  const handleSubmit = () => {
  // Basic validation
  if (!name || !email || !phone) {
    alert("Please fill out all required fields");
    return;
  }

  axios.post(`${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/contactseller`, {
    name,
    email,
    phone,
    comment,
    user_id: sellerId 
  })
  .then(res => {
    alert('Data added successfully')
    setFormData({ name: '', email: '', phone: '', comment: '' }); 
  }).catch(err => {
    console.error('Error posting data:', err);
    // Handle error
  });
};

  
  
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

    axios.get(`${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/allproducts/`)
      .then(res => {
        if (res.data !== "Fail" && res.data !== "Error") {
          const filteredProducts = res.data.filter(product => product.seller_id.toString() === sellerId);
          setSellerProducts(filteredProducts);
        }
        setLoading(false);
      })
      .catch(err => {
        console.log(err);
        setLoading(false);
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
        <div className="row">
          <div className="col-lg-12">
            <div className="seller-profile-header border">
              <div className='m-5'>
                <h2 className="seller-name fs-1">
                  <i className="bi bi-person-circle fs-1"></i>&nbsp;{sellerDetails.name}
                </h2>
                {/* <p className='ms-5'>{renderStarRatings(4)}</p> */}
                <button className="btn btn-primary ms-5" data-bs-toggle="modal" data-bs-target="#exampleModal">
                  Contact Seller
                </button>
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
              <div className="d-flex flex-wrap justify-content-center ms-md-5 me-md-5 mb-4 mt-md-3 mt-3 ms-2 me-2">
                {sellerProducts.map(product => (
                  <div className="card productcard" key={product.id}>
                    <Link to={"/product/" + product.id} state={{ productdetails: product }}>
                      <div className="text-center productimgback">
                        <img
                          src={`${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/images/${JSON.parse(product.image)[0]}`}
                          className="card-img-top"
                          alt="product"
                        />
                      </div>
                    </Link>
                    <div className="card-body">
                      <p className="card-text text-success">
                        <b>&#36; {product.price}.00</b>
                      </p>
                      {product.size !== "NA" &&
                        <h6 className="card-text" style={{ lineHeight: "8px" }}>{product.size}</h6>
                      }
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLabel">Modal title</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div className="modal-body">
        <form>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">Name</label>
            <input type="text" className="form-control" id="name" value={name} onChange={handleInputChange} />
          </div>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email</label>
            <input type="email" className="form-control" id="email" value={email} onChange={handleInputChange} />
          </div>
          <div className="mb-3">
            <label htmlFor="phone" className="form-label">Phone</label>
            <input type="text" className="form-control" id="phone" value={phone} onChange={handleInputChange} />
          </div>
          <div className="mb-3">
            <label htmlFor="comment" className="form-label">Comment</label>
            <textarea  type="text" className="form-control" id="comment" value={comment} onChange={handleInputChange} />
          </div>
        </form>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
        <button type="button" class="btn btn-primary"  onClick={handleSubmit}>Save</button>
      </div>
    </div>
  </div>
</div>

      <Footer/>
    </>
  );
};

export default SellerProfile;
