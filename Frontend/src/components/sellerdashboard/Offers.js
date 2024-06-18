// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import MyNavbar from '../navbar';
// import Footer from '../footer';

// const Offers = () => {
//   const [offers, setOffers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [activeTab, setActiveTab] = useState('Pending'); 
//   const [seller, setSeller] = useState([]);

//   useEffect(() => {
//     const fetchOffers = async () => {
//       try {
//         const response = await axios.get(`${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/offeredproducts`);
//         if (Array.isArray(response.data)) {
//           setOffers(response.data);
//         } else {
//           console.error('Unexpected response format:', response.data);
//         }
//         setLoading(false);
//       } catch (error) {
//         console.error('Error fetching offers:', error);
//         setLoading(false);
//       }
//     };

//     fetchOffers();
//   }, []);

//   useEffect(() => {
//     const fetchSellers = async () => {
//       try {
//         const response = await axios.get(`${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/sellerproducts`);
//         if (Array.isArray(response.data)) {
//           setSeller(response.data);
//         } else {
//           console.error('Unexpected response format:', response.data);
//         }
//       } catch (error) {
//         console.error('Error fetching sellers:', error);
//       }
//     };

//     fetchSellers();
//   }, []);

//   const filtered = offers.map(offer => {
//     const sellerInfo = seller.find(s => s.id === offer.product_id);
//     if (sellerInfo) {
//       return {
//         productName: sellerInfo.name,
//         offeredPrice: offer.offered_price,
//         product_status: offer.product_status,
//         Product_image : sellerInfo.image,
//         id: offer.id
//       };
//     }
//     return null;
//   }).filter(item => item !== null);

//   const handleAccept = async (offerId) => {
//     try {
//       const response = await axios.post(`${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/offers/${offerId}/accept`);
//       const updatedOffer = response.data;
//       setOffers(offers.map(offer => (offer.id === updatedOffer.id ? updatedOffer : offer)));
//     } catch (error) {
//       console.error('Error accepting offer:', error);
//     }
//   };

//   const handleReject = async (offerId) => {
//     try {
//       const response = await axios.post(`${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/offers/${offerId}/reject`);
//       const updatedOffer = response.data;
//       setOffers(offers.map(offer => (offer.id === updatedOffer.id ? updatedOffer : offer)));
//     } catch (error) {
//       console.error('Error rejecting offer:', error);
//     }
//   };

//   const filteredOffers = filtered.filter(offer => offer.product_status === activeTab);

//   if (loading) {
//     return <div className="container mt-4">Loading...</div>;
//   }

//   return (
//     <>
//       <MyNavbar/>
//       <div className="container mt-4">
//         <h1 className="mb-4 text-center">Customer Offers</h1>
//         <ul className="nav nav-tabs">
//           <li className="nav-item">
//             <button
//               className={`nav-link ${activeTab === 'Pending' ? 'active' : ''}`}
//               onClick={() => setActiveTab('Pending')}
//             >
//               Pending
//             </button>
//           </li>
//           <li className="nav-item">
//             <button
//               className={`nav-link ${activeTab === 'Accepted' ? 'active' : ''}`}
//               onClick={() => setActiveTab('Accepted')}
//             >
//               Accepted
//             </button>
//           </li>
//           <li className="nav-item">
//             <button
//               className={`nav-link ${activeTab === 'Rejected' ? 'active' : ''}`}
//               onClick={() => setActiveTab('Rejected')}
//             >
//               Rejected
//             </button>
//           </li>
//         </ul>
//         <div className="table-responsive mt-4">
//           <table
//             id="dynamic-table"
//             className="table table-striped table-hover dataTable no-footer"
//             role="grid"
//             aria-describedby="dynamic-table_info"
//           >
//             <thead>
//               <tr>
//                 <th>Product</th>
//                 <th>Image</th>
//                 <th>Offer Amount</th>
//                 <th>Status</th>
//                 {activeTab === 'Pending' && <th>Actions</th>}
//               </tr>
//             </thead>
//             <tbody>
//               {filteredOffers.length === 0 ? (
//                 <tr>
//                   <td colSpan={activeTab === 'Pending' ? '5' : '4'} className="text-center">
//                     {activeTab === 'Pending' ? 'No pending offers found.' : 'No offers found.'}
//                   </td>
//                 </tr>
//               ) : (
//                 filteredOffers.map(offer => (
//                   <tr key={offer.id}>
//                     <td>{offer.productName}</td>
//                     <td>
//                     <div style={{width:"70px", height:"60px" }}>
//                    <img
//                       src={`${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/images/${JSON.parse(offer.Product_image)[0]}`}
//                       alt={offer.name}
//                       style={{ maxWidth: "100%", maxHeight: "100%" ,backgroundSize:"contain"}}
//                     />
//                    </div>
//                     </td>
//                     <td>&#8377; {offer.offeredPrice}</td>
//                     <td>{offer.product_status}</td>
//                     {activeTab === 'Pending' && (
//                       <td>
//                         <button
//                           className="btn btn-success btn-sm me-2"
//                           onClick={() => handleAccept(offer.id)}
//                         >
//                           Accept
//                         </button>
//                         <button
//                           className="btn btn-danger btn-sm"
//                           onClick={() => handleReject(offer.id)}
//                         >
//                           Reject
//                         </button>
//                       </td>
//                     )}
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>
//       <Footer/>
//     </>
//   );
// };

// export default Offers;
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import MyNavbar from '../navbar';
import Footer from '../footer';

const Offers = () => {
    const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Pending'); 
  const [seller, setSeller] = useState([]);

  const fetchOffers = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/offeredproducts`);
      if (Array.isArray(response.data)) {
        setOffers(response.data);
      } else {
        console.error('Unexpected response format:', response.data);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching offers:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  useEffect(() => {
    const fetchSellers = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/sellerproducts`);
        if (Array.isArray(response.data)) {
          setSeller(response.data);
        } else {
          console.error('Unexpected response format:', response.data);
        }
      } catch (error) {
        console.error('Error fetching sellers:', error);
      }
    };

    fetchSellers();
  }, []);

  const filtered = offers.map(offer => {
    const sellerInfo = seller.find(s => s.id === offer.product_id);
    if (sellerInfo) {
      return {
        productName: sellerInfo.name,
        offeredPrice: offer.offered_price,
        product_status: offer.product_status,
        id: offer.id,
        Product_image : sellerInfo.image,
        SellerId:sellerInfo.seller_id

      };
    }
    return null;
  }).filter(item => item !== null);

  const handleAccept = async (offerId) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/offers/${offerId}/accept`);
      const updatedOffer = response.data;
      setOffers(offers.map(offer => (offer.id === updatedOffer.id ? { ...offer, product_status: 'Accepted' } : offer)));
      fetchOffers();
    } catch (error) {
      console.error('Error accepting offer:', error);
    }
  };
  
  const handleReject = async (offerId) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/offers/${offerId}/reject`);
      const updatedOffer = response.data;
      setOffers(offers.map(offer => (offer.id === updatedOffer.id ? { ...offer, product_status: 'Rejected' } : offer)));
      fetchOffers();
    } catch (error) {
      console.error('Error rejecting offer:', error);
    }
  };
  

  const filteredOffers = filtered.filter(offer => offer.product_status === activeTab);

  if (loading) {
    return <div className="container mt-4">Loading...</div>;
  }
  const userToken = sessionStorage.getItem("user-token");
  console.log(filteredOffers)
  const sellerOffers = filteredOffers.filter(offer => offer.SellerId.toString() === userToken);
  const customerOffers = filtered.filter(offer => offer.SellerId.toString() !== userToken);
  return (
    <>
      <MyNavbar />
      <div className="container mt-4">
        <h1 className="mb-4 text-center">Customer Offers</h1>
        {sellerOffers.length > 0 ? (
          <div className="table-responsive mt-4">
            <table id="dynamic-table" className="table table-striped table-hover dataTable no-footer" role="grid" aria-describedby="dynamic-table_info">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Image</th>
                  <th>Offer Amount</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {sellerOffers.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center">No offers found.</td>
                  </tr>
                ) : (
                  sellerOffers.map(offer => (
                    <tr key={offer.id}>
                      <td>{offer.productName}</td>
                      <td>
                      <div style={{width:"70px", height:"60px" }}>
                   <img
                     src={`${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/images/${JSON.parse(offer.Product_image)[0]}`}
                     alt={offer.name}
                     style={{ maxWidth: "100%", maxHeight: "100%" ,backgroundSize:"contain"}}
                   />
                  </div>       
                      </td>
                      <td>&#8377; {offer.offeredPrice}</td>
                      <td>{offer.product_status}</td>
                      {offer.product_status === 'Pending' && (
                        <td>
                          <button className="btn btn-success btn-sm me-2" onClick={() => handleAccept(offer.id)}>Accept</button>
                          <button className="btn btn-danger btn-sm" onClick={() => handleReject(offer.id)}>Reject</button>
                        </td>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="table-responsive mt-4">
            <table id="dynamic-table" className="table table-striped table-hover dataTable no-footer" role="grid" aria-describedby="dynamic-table_info">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Image</th>
                  <th>Offer Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {customerOffers.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="text-center">No offers found.</td>
                  </tr>
                ) : (
                  customerOffers.map(offer => (
                    <tr key={offer.id}>
                      <td>{offer.productName}</td>
                      <td>
                   <div style={{width:"70px", height:"60px" }}>
                   <img
                     src={`${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/images/${JSON.parse(offer.Product_image)[0]}`}
                     alt={offer.name}
                     style={{ maxWidth: "100%", maxHeight: "100%" ,backgroundSize:"contain"}}
                   />
                  </div>                  
                      </td>
                      <td>&#8377; {offer.offeredPrice}</td>
                      <td>{offer.product_status}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default Offers;