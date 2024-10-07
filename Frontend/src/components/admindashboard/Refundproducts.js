import React, { useEffect, useState } from 'react';
import Adminnavbar from './Adminnavbar';
import axios from 'axios';
import Adminpagination from './Adminpagination';
import Notification from "../Notification"
import Footer from '../footer';


const Refundproducts = () => {
  const [refundproducts, setRefundProducts] = useState([]);
  const [pageSize, setPageSize] = useState(25);
  const [currentPage, setCurrentPage] = useState(1);
  // eslint-disable-next-line no-unused-vars
  const [viewRowIndex, setViewRowIndex] = useState(null);
  const [notification, setNotification] = useState(null);


  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/refundproducts`)
      .then((res) => {
        if (res.data !== 'Fail' && res.data !== 'Error') {
          setRefundProducts(res.data);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    setCurrentPage(1);
    setViewRowIndex(null);
  }, [pageSize]);

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const tableData = refundproducts.slice(startIndex, endIndex);

 
  const handleRefund = async (productId, paymentIntentId) => {
  //  console.log(paymentIntentId)
    try {
  
      if (!paymentIntentId) {
        setNotification({
          message: "Refund payment intent ID is missing.",
          type: "error",
          
        });
        setTimeout(() => {
          setNotification(null);
        }, 3000);

        return;
      }
  
    
  
      const response = await axios.post(`${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/refund`, {
        productId: productId,
        paymentIntentId: paymentIntentId,
        refundStatus:true,
      });
  
      if (response.data.success) {
        setNotification({
          message: "Refund processed successfully!",
          type: "success",
        });
        setTimeout(() => {
          setNotification(null);
          window.location.reload(false); 
        }, 3000); 
       
      } else {
        setNotification({
          message: "Refund failed:",
          type: "error",
        });
        setTimeout(() => {
          setNotification(null);
        }, 3000);
      }
    } catch (error) {
      console.error('Error processing refund:', error);
      setNotification({
        message: "An error occurred while processing the refund. Please try again later.",
        type: "error",
      });
    }
  };
  
  

  return (
    <div className="fullscreen">
      <Adminnavbar />
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
      <div className="">
        {/* <div className="col-md-2 selleraccordion">
          <Adminmenu />
        </div> */}
        <div className="container">
          <div className="fullscreen2">
          <div className="text-center p-3">
              <h6> <i><span className="" style={{color:"blue" , fontSize:"25px"}}>Admin</span></i> Dashboard</h6>
              </div>
              <div className="m-2 ps-md-4">
                <h1 style={{ fontSize: "28px" }}>Refund</h1>
              </div>
            <main>
              <div className=" m-md-3 rounded">
                <div className="table-responsive p-md-3">
                  <table
                    id="dynamic-table"
                    className="table table-striped table-bordered table-hover dataTable no-footer"
                    role="grid"
                    aria-describedby="dynamic-table_info"
                  >
                    <thead className="">
                      <tr role="row">
                        <th className="p-3">Product Id</th>
                        <th className="sorting p-3" tabIndex="0" aria-controls="dynamic-table">
                          Product Image
                        </th>
                        <th className="sorting p-3" tabIndex="0" aria-controls="dynamic-table">
                          Product Name
                        </th>
                        <th className="hidden-480 sorting p-3" tabIndex="0" aria-controls="dynamic-table">
                          Buyer Name
                        </th>
                        <th className="hidden-480 sorting p-3" tabIndex="0" aria-controls="dynamic-table">
                          Refund Amount
                        </th>
                        <th className="hidden-480 sorting p-3" rowSpan="1" colSpan="1">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {tableData.length > 0 ? (
                        tableData.map((item, index) => (
                          <tr key={index}>
                            <td>{item.id}</td>
                            <td>
                              <div className="text-center" style={{ width: '100px', height: '100px' }}>
                                <img
                                  src={`${JSON.parse(item.image)[0]}`}
                                  alt="product"
                                  style={{ maxWidth: '100%', height: '100px', objectFit: 'contain' }}
                                />
                              </div>
                            </td>
                            <td>{item.name}</td>
                            <td>{item.firstname + ' ' + item.lastname}</td>
                            <td>&#36;{item.refundable_amount}</td>
                            <td>
                              <button
                                className="btn btn-danger"
                                onClick={() => handleRefund(item.id, item.payment_intent_id)}
                                disabled={Boolean(item.refundstatus) === true}
                              >
                                {Boolean(item.refundstatus) === true ? 'Refunded' : 'Refund'}
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={12} className="text-center">
                            No Data To Display
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                <Adminpagination
                  stateData={refundproducts}
                  pageSize={pageSize}
                  setPageSize={setPageSize}
                  setViewRowIndex={setViewRowIndex}
                  currentPage={currentPage}
                  setCurrentPage={setCurrentPage}
                />
              </div>
            </main>
            {/* <Adminfooter /> */}
          </div>
        </div>
       
      </div>
      <Footer/>
    </div>
  );
};

export default Refundproducts;
