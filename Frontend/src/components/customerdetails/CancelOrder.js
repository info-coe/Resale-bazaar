// import React from 'react';
// import MyNavbar from '../navbar';
// import Footer from '../footer';

// const CancelOrder = () => {
//   return (
//     <div className='fullscreen'>
//       <MyNavbar />
//       <main className='container mt-4'>
//         <h6 className='mt-3 mb-3'>Request Cancellation</h6>
//         <div className='d-md-flex justify-content-between bg-light  p-2 p-md-4 border'>
//           <div>
//             <img src="https://images.meesho.com/images/products/329628447/9fhyn_1200.jpg" width="100" height="100" alt="productIMG" />
//           </div>
//           <div>
//             <p>Georgette Embroidered Elegant Purple Color Sreee</p>
//             <p><b>QTY:</b> 1</p>
//           </div>
//           <div>
//             <p><b>Color:</b> Purple</p>
//           </div>
//           <div>
//             <p><b>Price:</b> $50</p>
//           </div>
//         </div>
//         <h6 className='mt-3 mb-3'>Reason for Cancellation</h6>
//         <form className='bg-light p-2 p-md-4 border mb-4' style={{ lineHeight: "35px" }}>
//           <input type="radio" name="cancel" id="quality-issues" value="quality-issues" style={{ width: "18px", height: "18px" }} />&nbsp;
//           <label htmlFor="quality-issues" > I want to cancel due to product quality issues</label><br />

//           <input type="radio" name="cancel" id="price-decreased" value="price-decreased" style={{ width: "18px", height: "18px" }} />&nbsp;
//           <label htmlFor="price-decreased"> Price for the product has decreased</label><br />

//           <input type="radio" name="cancel" id="change-address" value="change-address" style={{ width: "18px", height: "18px" }} />&nbsp;
//           <label htmlFor="change-address"> I want to change address for the order</label><br />

//           <input type="radio" name="cancel" id="purchased-elsewhere" value="purchased-elsewhere" style={{ width: "18px", height: "18px" }} />&nbsp;
//           <label htmlFor="purchased-elsewhere"> I have purchased the product elsewhere</label><br />

//           <input type="radio" name="cancel" id="changed-mind" value="changed-mind" style={{ width: "18px", height: "18px" }} />&nbsp;
//           <label htmlFor="changed-mind"> I have changed my mind</label><br />

//           <input type="radio" name="cancel" id="delivery-time" value="delivery-time" style={{ width: "18px", height: "18px" }} />&nbsp;
//           <label htmlFor="delivery-time"> Expected delivery time is very long</label><br />

//           <input type="radio" name="cancel" id="change-phone-number" value="change-phone-number" style={{ width: "18px", height: "18px" }} />&nbsp;
//           <label htmlFor="change-phone-number"> I want to change my phone number</label><br />

//           <input type="radio" name="cancel" id="found-better-product" value="found-better-product" style={{ width: "18px", height: "18px" }} />&nbsp;
//           <label htmlFor="found-better-product">I found a better product</label><br />


//           <textarea className='form-control mt-3' placeholder='Comments (optional)'></textarea>

//           <button className='btn btn-warning mt-3 mb-3' type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasBottom" aria-controls="offcanvasBottom">Submit Request</button>

//         </form>

//         {/* <button class="btn btn-primary" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasBottom" aria-controls="offcanvasBottom">Toggle bottom offcanvas</button> */}

//         <div class="offcanvas offcanvas-bottom" tabindex="-1" id="offcanvasBottom" aria-labelledby="offcanvasBottomLabel">
//           <div class="offcanvas-header">
//             <h5 class="offcanvas-title" id="offcanvasBottomLabel">Request Cancellation</h5>
//             <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
//           </div>
//           <div class="offcanvas-body">
//             If you cancel now, you may not be able to avail deal again. Do you still want to cancel?

//            <div>
//            <button className='btn btn-warning m-1 mt-2'>Don't cancel</button>
//            <button className='btn btn-danger m-1 mt-2'>Cancel Order</button>
//            </div>

//           </div>
//         </div>
//       </main>
//       <Footer />
//     </div>
//   );
// };

// export default CancelOrder;

// import React, {useState, useEffect } from 'react';
// import MyNavbar from '../navbar';
// import Footer from '../footer';
// import { useLocation, useNavigate } from "react-router-dom";
// import axios from 'axios';

// const CancelOrder = () => {
//   const location = useLocation();
//   const product = location.state.filteredProducts;
//   const navigate = useNavigate();
//   const [reason, setReason] = useState("");
//   useEffect(() => {
//     const offcanvasElement = document.getElementById('offcanvasBottom');

//     const handleShow = () => {
//       document.body.classList.add('offcanvas-open');
//     };

//     const handleHide = () => {
//       document.body.classList.remove('offcanvas-open');
//     };

//     offcanvasElement.addEventListener('show.bs.offcanvas', handleShow);
//     offcanvasElement.addEventListener('hidden.bs.offcanvas', handleHide);

//     // Cleanup event listeners on component unmount
//     return () => {
//       offcanvasElement.removeEventListener('show.bs.offcanvas', handleShow);
//       offcanvasElement.removeEventListener('hidden.bs.offcanvas', handleHide);
//     };
//   }, []);
//   const handleCancelOrder = () => {
//     if (!reason) {
//       alert("Please select a reason for cancellation.");
//       return;
//     }

//     const confirmation = window.confirm(
//       "Are you sure you want to cancel the order?"
//     );
//     if (confirmation) {
//       // Update the product quantity
//       axios
//         .post(
//           `${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/updateproducts`,
//           {
//             product_id: parseInt(product.id),
//             quantity: product.quantity + product.order_quantity
//           }
//         )
//         .then(() => {
//           // Update the order status
//           axios
//             .put(
//               `${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/updateorders/${product.order_id}`,
//               {
//                 data: {
//                   order_status: "cancelled",
//                 //   order_amount: product.price * product.order_quantity,
//                   refundable_amount:product.price * product.order_quantity,
//                   cancel_reason:reason
//                 }
//               }
//             )
//             .then(() => {
//               alert("Order cancelled successfully and Refund amount send you.");
//               navigate("/orders");
//             })
//             .catch((error) => {
//               console.error("Error updating order status:", error);
//             });
//         })
//         .catch((error) => {
//           console.error("Error updating product quantity:", error);
//         });
//     }
//   };
//   return (
//     <div className='fullscreen'>
//       <MyNavbar />
//       <main className='container mt-4'>
//         <h6 className='mt-3 mb-3'>Request Cancellation</h6>
//         <div className='d-md-flex justify-content-between bg-light  p-2 p-md-4 border'>
//   <div>
//   <img  src={`${JSON.parse(product.image)[0]}`}
//                 alt={product.name}
//                width="100" height="100" />
// </div>
// <div>
//   <p>{product.name}</p>
//   <p><b>QTY:</b> {product.order_quantity}</p>
// </div>
// <div>
//   <p><b>Color:</b> {product.color}</p>
// </div>
// <div>
//   <p><b>Price:</b> ${product.price * product.order_quantity}</p>
// </div>
//         </div>

//         <h6 className='mt-3 mb-3'>Reason for Cancellation</h6>
//         <form className='bg-light p-2 p-md-4 border mb-4' style={{ lineHeight: "35px" }}>
//           <input type="radio" name="cancel" id="quality-issues" value="quality-issues" style={{ width: "18px", height: "18px" }} />&nbsp;
//           <label htmlFor="quality-issues" > I want to cancel due to product quality issues</label><br />

//           <input type="radio" name="cancel" id="price-decreased" value="price-decreased" style={{ width: "18px", height: "18px" }} />&nbsp;
//           <label htmlFor="price-decreased"> Price for the product has decreased</label><br />

//           <input type="radio" name="cancel" id="change-address" value="change-address" style={{ width: "18px", height: "18px" }} />&nbsp;
//           <label htmlFor="change-address"> I want to change address for the order</label><br />

//           <input type="radio" name="cancel" id="purchased-elsewhere" value="purchased-elsewhere" style={{ width: "18px", height: "18px" }} />&nbsp;
//           <label htmlFor="purchased-elsewhere"> I have purchased the product elsewhere</label><br />

//           <input type="radio" name="cancel" id="changed-mind" value="changed-mind" style={{ width: "18px", height: "18px" }} />&nbsp;
//           <label htmlFor="changed-mind"> I have changed my mind</label><br />

//           <input type="radio" name="cancel" id="delivery-time" value="delivery-time" style={{ width: "18px", height: "18px" }} />&nbsp;
//           <label htmlFor="delivery-time"> Expected delivery time is very long</label><br />

//           <input type="radio" name="cancel" id="change-phone-number" value="change-phone-number" style={{ width: "18px", height: "18px" }} />&nbsp;
//           <label htmlFor="change-phone-number"> I want to change my phone number</label><br />

//           <input type="radio" name="cancel" id="found-better-product" value="found-better-product" style={{ width: "18px", height: "18px" }} />&nbsp;
//           <label htmlFor="found-better-product">I found a better product</label><br />

//           <textarea className='form-control mt-3' placeholder='Comments (optional)'></textarea>

//           <button className='btn btn-warning mt-3 mb-3' type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasBottom" aria-controls="offcanvasBottom">Submit Request</button>
//         </form>

//         <div className="offcanvas offcanvas-bottom" tabIndex="-1" id="offcanvasBottom" aria-labelledby="offcanvasBottomLabel">
//           <div className="offcanvas-header">
//             <h5 className="offcanvas-title" id="offcanvasBottomLabel">Request Cancellation</h5>
//             <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
//           </div>
//           <div className="offcanvas-body">
//             If you cancel now, you may not be able to avail deal again. Do you still want to cancel?
//             <div>
//               <button className='btn btn-warning m-1 mt-2'>Don't cancel</button>
//               <button className='btn btn-danger m-1 mt-2' onClick={handleCancelOrder}>Cancel Order</button>
//             </div>
//           </div>
//         </div>
//       </main>
//       <Footer />
//     </div>
//   );
// };

// export default CancelOrder;

// import React, { useState, useEffect } from 'react';
// import MyNavbar from '../navbar';
// import Footer from '../footer';
// import { useLocation, useNavigate } from "react-router-dom";
// import axios from 'axios';

// const CancelOrder = () => {
//   const location = useLocation();
//   const product = location.state?.filteredProducts ?? {};
//   const navigate = useNavigate();
//   const [reason, setReason] = useState("");
//   const [comments, setComments] = useState("");

//   useEffect(() => {
//     const offcanvasElement = document.getElementById('offcanvasBottom');

//     const handleShow = () => {
//       document.body.classList.add('offcanvas-open');
//     };

//     const handleHide = () => {
//       document.body.classList.remove('offcanvas-open');
//     };

//     offcanvasElement.addEventListener('show.bs.offcanvas', handleShow);
//     offcanvasElement.addEventListener('hidden.bs.offcanvas', handleHide);

//     // Cleanup event listeners on component unmount
//     return () => {
//       offcanvasElement.removeEventListener('show.bs.offcanvas', handleShow);
//       offcanvasElement.removeEventListener('hidden.bs.offcanvas', handleHide);
//     };
//   }, []);

//   const handleCancelOrder = () => {
//     if (!reason) {
//       alert("Please select a reason for cancellation.");
//       return;
//     }

//     const confirmation = window.confirm(
//       "Are you sure you want to cancel the order?"
//     );
//     if (confirmation) {
//       // Update the product quantity
//       axios
//         .post(
//           `${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/updateproducts`,
//           {
//             product_id: parseInt(product.id),
//             quantity: product.quantity + product.order_quantity
//           }
//         )
//         .then(() => {
//           // Update the order status
//           axios
//             .put(
//               `${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/updateorders/${product.order_id}`,
//               {
//                 data: {
//                   order_status: "cancelled",
//                   refundable_amount: product.price * product.order_quantity,
//                   cancel_reason: reason
//                 }
//               }
//             )
//             .then(() => {
//               alert("Order cancelled successfully and refund amount sent to you.");
//               navigate("/orders");
//             })
//             .catch((error) => {
//               console.error("Error updating order status:", error);
//             });
//         })
//         .catch((error) => {
//           console.error("Error updating product quantity:", error);
//         });
//     }
//   };

//   return (
//     <div className='fullscreen'>
//       <MyNavbar />
//       <main className='container mt-4'>
//         <h6 className='mt-3 mb-3'>Request Cancellation</h6>
//         <div className='d-md-flex justify-content-between bg-light p-2 p-md-4 border'>
//           <div>
//             <img src={`${JSON.parse(product.image)[0]}`} alt={product.name} width="100" height="100" />
//           </div>
//           <div>
//             <p>{product.name}</p>
//             <p><b>QTY:</b> {product.order_quantity}</p>
//           </div>
//           <div>
//             <p><b>Color:</b> {product.color}</p>
//           </div>
//           <div>
//             <p><b>Price:</b> ${product.price * product.order_quantity}</p>
//           </div>
//         </div>

//         <h6 className='mt-3 mb-3'>Reason for Cancellation</h6>
//         <form className='bg-light p-2 p-md-4 border mb-4' style={{ lineHeight: "35px" }}>
//           {[
//             { id: "quality-issues", label: "I want to cancel due to product quality issues" },
//             { id: "price-decreased", label: "Price for the product has decreased" },
//             { id: "change-address", label: "I want to change address for the order" },
//             { id: "purchased-elsewhere", label: "I have purchased the product elsewhere" },
//             { id: "changed-mind", label: "I have changed my mind" },
//             { id: "delivery-time", label: "Expected delivery time is very long" },
//             { id: "change-phone-number", label: "I want to change my phone number" },
//             { id: "found-better-product", label: "I found a better product" }
//           ].map(({ id, label }) => (
//             <div key={id}>
//               <input 
//                 type="radio" 
//                 name="cancel" 
//                 id={id} 
//                 value={id} 
//                 style={{ width: "18px", height: "18px" }} 
//                 onChange={(e) => setReason(e.target.value)} 
//               />&nbsp;
//               <label htmlFor={id}>{label}</label><br />
//             </div>
//           ))}

//           <textarea 
//             className='form-control mt-3' 
//             placeholder='Comments (optional)' 
//             value={comments}
//             onChange={(e) => setComments(e.target.value)}
//           ></textarea>

//           <button 
//             className='btn btn-warning mt-3 mb-3' 
//             type="button" 
//             data-bs-toggle="offcanvas" 
//             data-bs-target="#offcanvasBottom" 
//             aria-controls="offcanvasBottom"
//           >
//             Submit Request
//           </button>
//         </form>

//         <div className="offcanvas offcanvas-bottom" tabIndex="-1" id="offcanvasBottom" aria-labelledby="offcanvasBottomLabel">
//           <div className="offcanvas-header">
//             <h5 className="offcanvas-title" id="offcanvasBottomLabel">Request Cancellation</h5>
//             <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
//           </div>
//           <div className="offcanvas-body">
//             If you cancel now, you may not be able to avail deal again. Do you still want to cancel?
//             <div>
//               <button className='btn btn-warning m-1 mt-2'>Don't cancel</button>
//               <button className='btn btn-danger m-1 mt-2' onClick={handleCancelOrder}>Cancel Order</button>
//             </div>
//           </div>
//         </div>
//       </main>
//       <Footer />
//     </div>
//   );
// };

// export default CancelOrder;

import React, { useState, useEffect } from 'react';
import MyNavbar from '../navbar';
import Footer from '../footer';
import { useLocation, useNavigate } from "react-router-dom";
import axios from 'axios';

const CancelOrder = () => {
  const location = useLocation();
  const product = location.state?.filteredProducts ?? {};
  const navigate = useNavigate();
  const [reason, setReason] = useState("");
  const [comments, setComments] = useState("");

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
      alert("Please select a reason for cancellation.");
      return;
    }

    const confirmation = window.confirm(
      "Are you sure you want to cancel the order?"
    );
    if (confirmation) {
      // Update the product quantity
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
              alert("Order cancelled successfully and refund amount sent to you.");
              navigate("/orders");
            })
            .catch((error) => {
              console.error("Error updating order status:", error);
            });
        })
        .catch((error) => {
          console.error("Error updating product quantity:", error);
        });
    }
  };

  const productImage = product.image ? JSON.parse(product.image) : [];

  return (
    <div className='fullscreen'>
      <MyNavbar />
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
            <p>{product.name}</p>
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
              <button className='btn btn-warning m-1 mt-2'>Don't cancel</button>
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


