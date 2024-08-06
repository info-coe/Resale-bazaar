import React, { useEffect, useState } from 'react';
import axios from 'axios';
import MyNavbar from '../navbar';
import Footer from '../footer';
import Scrolltotopbtn from '../Scrolltotopbutton';
// import InfiniteScroll from "react-infinite-scroll-component";
import OfferedProduct from './offeredproduct';


const Offers = () => {
    const [offers, setOffers] = useState([]);
    const [approvedOffers, setApprovedOffers] = useState([]);
    const userToken = sessionStorage.getItem("user-token");
    useEffect(() => {
        axios.get(`${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/sellerproductsoffers`)
        .then((response) => {
            if (response.data !== "Fail" && response.data !== "Error") {
                setOffers(response.data);
                const customerApprovedOffers = response.data.filter(offer =>
                    offer.offered_buyer_id.toString() === userToken && offer.product_status === 'Accepted'
                );
                setApprovedOffers(customerApprovedOffers);
            }
        })
        .catch((err) => {
            console.log('error', err);
        });
    }, [userToken]);

    const handleAccept = (offerId) => {
        axios.post(`${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/offers/${offerId}/accept`)
        .then((response) => {
            const updatedOffer = response.data;
            setOffers(offers.map(offer => (offer.id === updatedOffer.id ? { ...offer, product_status: 'Accepted' } : offer)));

            if (updatedOffer && updatedOffer.offered_buyer_id && updatedOffer.offered_buyer_id.toString() === userToken) {
                setApprovedOffers([...approvedOffers, updatedOffer]);
            }
            window.location.reload(false);
        })
        .catch((error) => {
            console.error('Error accepting offer:', error);
        });
    };

    const handleReject = (offerId) => {
        axios.post(`${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/offers/${offerId}/reject`)
        .then((response) => {
            const updatedOffer = response.data;
            setOffers(offers.map(offer => (offer.id === updatedOffer.id ? { ...offer, product_status: 'Rejected' } : offer)));
            window.location.reload(false);
        })
        .catch((error) => {
            console.error('Error rejecting offer:', error);
        });
    };

    const sellerOffers = offers.filter(offer => offer.seller_id.toString() === userToken);
    const customerOffers = offers.filter(offer => offer.offered_buyer_id.toString() === userToken);

    

    const renderOffersTable = (offers, isSellerOffers) => (
        <div className="table-responsive mt-4">
            <table id="dynamic-table" className="table table-striped table-hover dataTable no-footer" role="grid" aria-describedby="dynamic-table_info">
                <thead>
                    <tr>
                        <th>Product</th>
                        <th>Image</th>
                        <th>Original Price</th>
                        <th>Offer Price</th>
                        <th>Status</th>
                        <th>Actions</th>
                        {isSellerOffers.product_status === 'Pending' && (<th>Actions</th>)}
                    </tr>
                </thead>
                <tbody>
                    {offers.map(offer => (
                        <tr key={offer.id}>
                            <td>{offer.name}</td>
                            <td>
                                <div style={{ width: "70px", height: "60px" }}>
                                    <img
                                        src={JSON.parse(offer.image)[0]}
                                        alt={offer.name}
                                        style={{ maxWidth: "100%", maxHeight: "100%", backgroundSize: "contain" }}
                                    />
                                </div>
                            </td>
                            <td>&#36; {offer.price}</td>
                            <td>&#36; {offer.offered_price}</td>
                            <td>{offer.product_status}</td>
                            {isSellerOffers && offer.product_status === 'Pending' && (
                                <td>
                                    <button className="btn btn-success btn-sm me-2" onClick={() => handleAccept(offer.id)}>Accept</button>
                                    <button className="btn btn-danger btn-sm" onClick={() => handleReject(offer.id)}>Reject</button>
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

    const renderApprovedOffersCards = (offers) => (
        // <InfiniteScroll
        //     dataLength={offers.length}
        //     next={() => setPage((prevPage) => prevPage + 1)}
        //     hasMore={hasMore}
        //     loader={
        //         <div className="centered-message">
        //             <i className="bi bi-arrow-clockwise spin-icon"></i>
        //         </div>
        //     }
        //     endMessage={
        //         <div className="centered-message">
        //             <p>No more products to display</p>
        //         </div>
        //     }
        // >
            <div className="product-grid container">
                {offers.length > 0 ? (
                    offers.map((offer) => (
                        <div key={offer.id} className='pt-4'>
                            <OfferedProduct product={offer}/>
                        </div>
                    ))
                ) : (
                    <h2 style={{ fontSize: "18px" }}>No products to display</h2>
                )}
            </div>
        // </InfiniteScroll>
    );

    return (
        <div className='fullscreen'>
            <MyNavbar />
            <main>
                <div className="container mt-4">
                    <h1 className="mb-4 text-center">Offers</h1>

                    {(sellerOffers.length > 0 || customerOffers.length > 0 || approvedOffers.length > 0) ? (
                        <div>
                            <ul className="nav nav-tabs" id="offersTabs" role="tablist">
                                <li className="nav-item" role="presentation">
                                    <button className="nav-link active" id="seller-offers-tab" data-bs-toggle="tab" data-bs-target="#seller-offers" type="button" role="tab" aria-controls="seller-offers" aria-selected="true">Incoming Requests</button>
                                </li>
                                <li className="nav-item" role="presentation">
                                    <button className="nav-link" id="customer-offers-tab" data-bs-toggle="tab" data-bs-target="#customer-offers" type="button" role="tab" aria-controls="customer-offers" aria-selected="false">Outgoing Requests</button>
                                </li>
                                <li className="nav-item" role="presentation">
                                    <button className="nav-link" id="approved-offers-tab" data-bs-toggle="tab" data-bs-target="#approved-offers" type="button" role="tab" aria-controls="approved-offers" aria-selected="false">Approved Offers</button>
                                </li>
                            </ul>
                            <div className="tab-content" id="offersTabsContent">
                                <div className="tab-pane fade show active" id="seller-offers" role="tabpanel" aria-labelledby="seller-offers-tab">
                                    {renderOffersTable(sellerOffers, true)}
                                </div>
                                <div className="tab-pane fade" id="customer-offers" role="tabpanel" aria-labelledby="customer-offers-tab">
                                    {renderOffersTable(customerOffers, false)}
                                </div>
                                <div className="tab-pane fade" id="approved-offers" role="tabpanel" aria-labelledby="approved-offers-tab">
                                    {renderApprovedOffersCards(approvedOffers)}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center">No offers found.</div>
                    )}
                </div>
            </main>
            <Footer />
            <Scrolltotopbtn />
        </div>
    );
};

export default Offers;
