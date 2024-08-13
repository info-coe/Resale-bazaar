// import React, { useEffect, useState } from 'react'
// import Adminfooter from './Adminfooter'
// import Adminmenu from './Adminmenu'
// import Adminnavbar from './Adminnavbar'
// import axios from 'axios'
// import Adminpagination from './Adminpagination'

// const Refundproducts = () => {
// const [refundproducts,setRefundProducts] = useState([])
// const [pageSize, setPageSize] = useState(25);
// const [currentPage, setCurrentPage] = useState(1);
// // eslint-disable-next-line no-unused-vars
// const [viewRowIndex, setViewRowIndex] = useState(null);

//     useEffect(()=>{
//             axios.get(`${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/refundproducts`).then((res)=>{
//                   if(res.data !== "Fail" && res.data !== "Error"){
//                     setRefundProducts(res.data)
//                   }
//             }).catch((err)=>{
//                 console.log(err)
//             })
//     },[])
//     useEffect(() => {
//         setCurrentPage(1);
//         setViewRowIndex(null);
//       }, [pageSize]);
    
//       const startIndex = (currentPage - 1) * pageSize;
//       const endIndex = startIndex + pageSize;
//       const tableData = refundproducts.slice(startIndex, endIndex);
//   return (
//     <div className="fullscreen">
//     <Adminnavbar />
//     <div className="d-md-flex">
//       <div className="col-md-2 selleraccordion">
//         <Adminmenu />
//       </div>
//       <div className="col-md-10 ">
//         <div className="fullscreen2">
//           <main>
//             <div className="border m-3 rounded">
//               <div className="table-responsive p-3">
//                 <table
//                   id="dynamic-table"
//                   className="table table-striped table-bordered table-hover dataTable no-footer"
//                   role="grid"
//                   aria-describedby="dynamic-table_info"
//                 >
//                   <thead className="">
//                     <tr role="row">
//                       <th className='p-3'>Product Id</th>
//                       <th
//                         className="sorting p-3"
//                         tabIndex="0"
//                         aria-controls="dynamic-table"
//                         rowSpan="1"
//                         colSpan="1"
//                         aria-label="ID: activate to sort column ascending"
//                       >
//                         Product Image
//                       </th>
//                       <th
//                         className="sorting p-3"
//                         tabIndex="0"
//                         aria-controls="dynamic-table"
//                         rowSpan="1"
//                         colSpan="1"
//                         aria-label="Address:activate to sort column ascending"
//                       >
//                         Product Name
//                       </th>
//                       <th
//                         className="hidden-480 sorting p-3"
//                         tabIndex="0"
//                         aria-controls="dynamic-table"
//                         rowSpan="1"
//                         colSpan="1"
//                         aria-label="City: activate to sort column ascending"
//                       >
//                         Buyer Name
//                       </th>
//                       <th
//                         className="hidden-480 sorting p-3"
//                         tabIndex="0"
//                         aria-controls="dynamic-table"
//                         rowSpan="1"
//                         colSpan="1"
//                         aria-label="City: activate to sort column ascending"
//                       >
//                         Refund Amount
//                       </th>
                    
//                       <th
//                         className="hidden-480 sorting p-3"
//                         rowSpan="1"
//                         colSpan="1"
//                         aria-label="Status"
//                       >
//                         Action
//                       </th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                   {tableData.length > 0 ? (
//                         tableData.map((item, index) => (
//                           <tr key={index}>
//                             <td>{item.id}</td>
//                             <td>
//                               {" "}
//                                 <div className="text-center" style={{width:"100px",height:"100px"}}>
//                                 <img
//                                    src={`${JSON.parse(item.image)[0]}`}
//                                   alt="product"
//                                   style={{maxWidth:"100%",height:"100px",objectFit:"contain"}}
//                                 />
//                                 </div>
//                             </td>
//                             <td>{item.name}</td>
//                             <td>{item.firstname + " "+ item.lastname}</td>
//                             <td>&#36;{item.refundable_amount}</td>
//                             <td>
//                             </td>
//                           </tr>
//                         ))
//                       ) : (
//                         <tr>
//                           <td colSpan={12} className="text-center">
//                             No Data To Display
//                           </td>
//                         </tr>
//                       )}
//                   </tbody>
//                 </table>
//               </div>

//               <Adminpagination
//                 stateData={refundproducts}
//                 pageSize={pageSize}
//                 setPageSize={setPageSize}
//                 setViewRowIndex={setViewRowIndex}
//                 currentPage={currentPage}
//                 setCurrentPage={setCurrentPage}
//               />
//             </div>
//           </main>
//           <Adminfooter />
//         </div>
//       </div>
//     </div>
  
//   </div>
//   )
// }

// export default Refundproducts

// import React, { useEffect, useState } from 'react';
// import Adminfooter from './Adminfooter';
// import Adminmenu from './Adminmenu';
// import Adminnavbar from './Adminnavbar';
// import axios from 'axios';
// import Adminpagination from './Adminpagination';

// const Refundproducts = () => {
//   const [refundproducts, setRefundProducts] = useState([]);
//   const [pageSize, setPageSize] = useState(25);
//   const [currentPage, setCurrentPage] = useState(1);
//   // eslint-disable-next-line no-unused-vars
//   const [viewRowIndex, setViewRowIndex] = useState(null);

//   useEffect(() => {
//     axios
//       .get(`${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/refundproducts`)
//       .then((res) => {
//         if (res.data !== 'Fail' && res.data !== 'Error') {
//           setRefundProducts(res.data);
//         }
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   }, []);

//   useEffect(() => {
//     setCurrentPage(1);
//     setViewRowIndex(null);
//   }, [pageSize]);

//   const startIndex = (currentPage - 1) * pageSize;
//   const endIndex = startIndex + pageSize;
//   const tableData = refundproducts.slice(startIndex, endIndex);

//   const handleRefund = async (productId, paymentIntentId) => {
//     try {
//       const response = await axios.post(`${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/refund`, {
//         productId: productId,
//         paymentIntentId: paymentIntentId,
//       });

//       if (response.data.success) {
//         alert('Refund processed successfully!');
//         // Optionally, refresh the refund products list or update the UI
//       } else {
//         alert('Refund failed: ' + response.data.message);
//       }
//     } catch (error) {
//       console.error('Error processing refund:', error);
//       alert('An error occurred while processing the refund.');
//     }
//   };

//   return (
//     <div className="fullscreen">
//       <Adminnavbar />
//       <div className="d-md-flex">
//         <div className="col-md-2 selleraccordion">
//           <Adminmenu />
//         </div>
//         <div className="col-md-10">
//           <div className="fullscreen2">
//             <main>
//               <div className="border m-3 rounded">
//                 <div className="table-responsive p-3">
//                   <table
//                     id="dynamic-table"
//                     className="table table-striped table-bordered table-hover dataTable no-footer"
//                     role="grid"
//                     aria-describedby="dynamic-table_info"
//                   >
//                     <thead className="">
//                       <tr role="row">
//                         <th className="p-3">Product Id</th>
//                         <th className="sorting p-3" tabIndex="0" aria-controls="dynamic-table">
//                           Product Image
//                         </th>
//                         <th className="sorting p-3" tabIndex="0" aria-controls="dynamic-table">
//                           Product Name
//                         </th>
//                         <th className="hidden-480 sorting p-3" tabIndex="0" aria-controls="dynamic-table">
//                           Buyer Name
//                         </th>
//                         <th className="hidden-480 sorting p-3" tabIndex="0" aria-controls="dynamic-table">
//                           Refund Amount
//                         </th>
//                         <th className="hidden-480 sorting p-3" rowSpan="1" colSpan="1">
//                           Action
//                         </th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {tableData.length > 0 ? (
//                         tableData.map((item, index) => (
//                           <tr key={index}>
//                             <td>{item.id}</td>
//                             <td>
//                               <div className="text-center" style={{ width: '100px', height: '100px' }}>
//                                 <img
//                                   src={`${JSON.parse(item.image)[0]}`}
//                                   alt="product"
//                                   style={{ maxWidth: '100%', height: '100px', objectFit: 'contain' }}
//                                 />
//                               </div>
//                             </td>
//                             <td>{item.name}</td>
//                             <td>{item.firstname + ' ' + item.lastname}</td>
//                             <td>&#36;{item.refundable_amount}</td>
//                             <td>
//                               <button
//                                 className="btn btn-danger"
//                                 onClick={() => handleRefund(item.id, item.payment_intent_id)}
//                               >
//                                 Refund
//                               </button>
//                             </td>
//                           </tr>
//                         ))
//                       ) : (
//                         <tr>
//                           <td colSpan={12} className="text-center">
//                             No Data To Display
//                           </td>
//                         </tr>
//                       )}
//                     </tbody>
//                   </table>
//                 </div>

//                 <Adminpagination
//                   stateData={refundproducts}
//                   pageSize={pageSize}
//                   setPageSize={setPageSize}
//                   setViewRowIndex={setViewRowIndex}
//                   currentPage={currentPage}
//                   setCurrentPage={setCurrentPage}
//                 />
//               </div>
//             </main>
//             <Adminfooter />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Refundproducts;


import React, { useEffect, useState } from 'react';
import Adminfooter from './Adminfooter';
import Adminmenu from './Adminmenu';
import Adminnavbar from './Adminnavbar';
import axios from 'axios';
import Adminpagination from './Adminpagination';
import Notification from "../Notification"


const Refundproducts = () => {
  const [refundproducts, setRefundProducts] = useState([]);
  const [pageSize, setPageSize] = useState(25);
  const [currentPage, setCurrentPage] = useState(1);
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

  const checkRefundStatus = async (paymentIntentId) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/refund-status/${paymentIntentId}`);
      if (response.data.success) {
        return response.data.refundStatus;
      } else {
        console.error('Refund status check failed:', response.data.message);
        return null;
      }
    } catch (error) {
      console.error('Error checking refund status:', error);
      return null;
    }
  };

  const handleRefund = async (productId, paymentIntentId) => {
   console.log(paymentIntentId)
    try {
  
      if (!paymentIntentId) {
        setNotification({
          message: "Refund payment intent ID is missing.",
          type: "error",
        });
        return;
      }
  
      // Check the current refund status (assuming checkRefundStatus is defined elsewhere)
      const currentStatus = await checkRefundStatus(paymentIntentId);
      if (currentStatus === 'succeeded' || currentStatus === 'canceled') {
        setNotification({
          message: "Refund already processed or canceled.",
          type: "error",
        });
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
        // Update the product status in the UI
        setRefundProducts((prevProducts) =>
          prevProducts.map((product) =>
            product.id === productId
              ? { ...product, refundStatus: 'succeeded' }
              : product
          )
        );
      } else {
        alert('Refund failed: ' + response.data.message);
      }
    } catch (error) {
      console.error('Error processing refund:', error);
      alert('An error occurred while processing the refund. Please try again later.');
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
      <div className="d-md-flex">
        <div className="col-md-2 selleraccordion">
          <Adminmenu />
        </div>
        <div className="col-md-10">
          <div className="fullscreen2">
            <main>
              <div className="border m-3 rounded">
                <div className="table-responsive p-3">
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
                                disabled={item.refundstatus === 'true'}
                              >
                                {item.refundstatus === 'true' ? 'Refunded' : 'Refund'}
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
            <Adminfooter />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Refundproducts;
