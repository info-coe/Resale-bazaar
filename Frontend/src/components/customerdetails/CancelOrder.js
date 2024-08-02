import React, { useState, useEffect } from 'react';
import MyNavbar from '../navbar';
import Footer from '../footer';
import { useLocation, useNavigate } from "react-router-dom";
import axios from 'axios';
import Notification from '../Notification';

const CancelOrder = () => {
  const location = useLocation();
  const product = location.state?.filteredProducts ?? {};
  const navigate = useNavigate();
  const [reason, setReason] = useState("");
  const [comments, setComments] = useState("");
  const [notification, setNotification] = useState(null);


  useEffect(() => {
    const offcanvasElement = document.getElementById('offcanvasBottom');

    const handleShow = () => {
      document.body.classList.add('offcanvas-open');
    };

    const handleHide = () => {
      document.body.classList.remove('offcanvas-open');
    };

    offcanvasElement.addEventListener('show.bs.offcanvas', handleShow);
    offcanvasElement.addEventListener('hidden.bs.offcanvas', handleHide);

    // Cleanup event listeners on component unmount
    return () => {
      offcanvasElement.removeEventListener('show.bs.offcanvas', handleShow);
      offcanvasElement.removeEventListener('hidden.bs.offcanvas', handleHide);
    };
  }, []);

  const handleCancelOrder = () => {
    if (!reason) {
      setNotification({ message: 'Please select a reason for cancellation.', type: 'error' });
      setTimeout(() => setNotification(null), 3000);
      return;
    }

    // const confirmation = window.confirm(
    //   "Are you sure you want to cancel the order?"
    // );
    // if (confirmation) {
    //   // Update the product quantity
      axios
        .post(
          `${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/updateproducts`,
          {
            product_id: parseInt(product.id),
            quantity: product.quantity + product.order_quantity
          }
        )
        .then(() => {
          // Update the order status
          axios
            .put(
              `${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/updateorders/${product.order_id}`,
              {
                data: {
                  order_status: "cancelled",
                  refundable_amount: product.price * product.order_quantity,
                  cancel_reason: reason,
                  cancel_comment:comments
                }
              }
            )
            .then(() => {
              setNotification({ message: `Order cancelled successfully and refund amount ${product.price * product.order_quantity} will be reflectedto your account in 3-5 Business Days.`, type: 'success' });
              // setTimeout(() => setNotification(null), 3000);
              // navigate("/orders");
               // Use a timeout to ensure the notification is visible before navigating
          setTimeout(() => {
            setNotification(null);
            navigate("/orders");
          }, 3000);
        // })
            })
            .catch((error) => {
              console.error("Error updating order status:", error);
            });
        })
        .catch((error) => {
          console.error("Error updating product quantity:", error);
        });
    // }
  };

  const productImage = product.image ? JSON.parse(product.image) : [];

  return (
    <div className='fullscreen'>
      <MyNavbar />
      {notification && <Notification message={notification.message} type={notification.type} onClose={() => setNotification(null)} />}

      <main className='container mt-4'>
        <h6 className='mt-3 mb-3'>Request Cancellation</h6>
        <div className='d-md-flex justify-content-between bg-light p-2 p-md-4 border'>
          <div>
            {productImage.length > 0 ? (
              <img src={productImage[0]} alt={product.name} width="100" height="100" />
            ) : (
              <p>No image available</p>
            )}
          </div>
          <div>
            <p><b>Name:</b>{product.name}</p>
            <p><b>QTY:</b> {product.order_quantity}</p>
          </div>
          <div>
            <p><b>Color:</b> {product.color}</p>
          </div>
          <div>
            <p><b>Price:</b> ${product.price * product.order_quantity}</p>
          </div>
        </div>

        <h6 className='mt-3 mb-3'>Reason for Cancellation</h6>
        <form className='bg-light p-2 p-md-4 border mb-4' style={{ lineHeight: "35px" }}>
          {[
            { id: "quality-issues", label: "I want to cancel due to product quality issues" },
            { id: "price-decreased", label: "Price for the product has decreased" },
            { id: "change-address", label: "I want to change address for the order" },
            { id: "purchased-elsewhere", label: "I have purchased the product elsewhere" },
            { id: "changed-mind", label: "I have changed my mind" },
            { id: "delivery-time", label: "Expected delivery time is very long" },
            { id: "change-phone-number", label: "I want to change my phone number" },
            { id: "found-better-product", label: "I found a better product" }
          ].map(({ id, label }) => (
            <div key={id}>
              <input 
                type="radio" 
                name="cancel" 
                id={id} 
                value={id} 
                style={{ width: "18px", height: "18px" }} 
                onChange={(e) => setReason(e.target.value)} 
              />&nbsp;
              <label htmlFor={id}>{label}</label><br />
            </div>
          ))}

          <textarea 
            className='form-control mt-3' 
            placeholder='Comments (optional)' 
            value={comments}
            onChange={(e) => setComments(e.target.value)}
          ></textarea>

          <button 
            className='btn btn-warning mt-3 mb-3' 
            type="button" 
            data-bs-toggle="offcanvas" 
            data-bs-target="#offcanvasBottom" 
            aria-controls="offcanvasBottom"
          >
            Submit Request
          </button>
        </form>

        <div className="offcanvas offcanvas-bottom" tabIndex="-1" id="offcanvasBottom" aria-labelledby="offcanvasBottomLabel">
          <div className="offcanvas-header">
            <h5 className="offcanvas-title" id="offcanvasBottomLabel">Request Cancellation</h5>
            <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
          </div>
          <div className="offcanvas-body">
            If you cancel now, you may not be able to avail deal again. Do you still want to cancel?
            <div>
              <button className='btn btn-warning m-1 mt-2' type="button"  data-bs-dismiss="offcanvas" aria-label="Close">Don't cancel</button>
              <button className='btn btn-danger m-1 mt-2' onClick={handleCancelOrder}>Cancel Order</button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CancelOrder;


