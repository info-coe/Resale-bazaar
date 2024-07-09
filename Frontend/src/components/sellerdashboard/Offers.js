import React, { useEffect, useState } from 'react';
import axios from 'axios';
import MyNavbar from '../navbar';
import Footer from '../footer';

const Offers = () => {
    const [offers, setOffers] = useState([]);
    const userToken = sessionStorage.getItem("user-token");

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/sellerproductsoffers`)
        .then((response) => {
            setOffers(response.data);
        }).catch((err) => {
            console.log('error', err);
        });
    }, []);

    const handleAccept = async (offerId) => {
        try {
            const response = await axios.post(`${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/offers/${offerId}/accept`);
            const updatedOffer = response.data;
            setOffers(offers.map(offer => (offer.id === updatedOffer.id ? { ...offer, product_status: 'Accepted' } : offer)));
            window.location.reload(false)
        } catch (error) {
            console.error('Error accepting offer:', error);
        }
    };

    const handleReject = async (offerId) => {
        try {
            const response = await axios.post(`${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/offers/${offerId}/reject`);
            const updatedOffer = response.data;
            setOffers(offers.map(offer => (offer.id === updatedOffer.id ? { ...offer, product_status: 'Rejected' } : offer)));
            window.location.reload(false)

        } catch (error) {
            console.error('Error rejecting offer:', error);
        }
    };

    const sellerOffers = offers.filter(offer => offer.seller_id.toString() === userToken);
    const customerOffers = offers.filter(offer => offer.offered_buyer_id.toString() === userToken);

    return (
        <div className='fullscreen'>
            <MyNavbar />
            <main>
                <div className="container mt-4">
                    <h1 className="mb-4 text-center">Customer Offers</h1>

                    {sellerOffers.length > 0 && (
                        <div className="table-responsive mt-4">
                            <h2>Seller Offers</h2>
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
                                    {sellerOffers.map(offer => (
                                        <tr key={offer.id}>
                                            <td>{offer.name}</td>
                                            <td>
                                                <div style={{ width: "70px", height: "60px" }}>
                                                    <img
                                                        src={JSON.parse(offer.image)[0]}
                                                        alt={offer.productName}
                                                        style={{ maxWidth: "100%", maxHeight: "100%", backgroundSize: "contain" }}
                                                    />
                                                </div>
                                            </td>
                                            <td>&#36; {offer.offered_price}</td>
                                            <td>{offer.product_status}</td>
                                            {offer.product_status === 'Pending' && (
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
                    )}

                    {customerOffers.length > 0 && (
                        <div className="table-responsive mt-4">
                            <h2>Customer Offers</h2>
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
                                    {customerOffers.map(offer => (
                                        <tr key={offer.id}>
                                            <td>{offer.name}</td>
                                            <td>
                                                <div style={{ width: "70px", height: "60px" }}>
                                                    <img
                                                        src={JSON.parse(offer.image)[0]}
                                                        alt={offer.productName}
                                                        style={{ maxWidth: "100%", maxHeight: "100%", backgroundSize: "contain" }}
                                                    />
                                                </div>
                                            </td>
                                            <td>&#36; {offer.offered_price}</td>
                                            <td>{offer.product_status}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {sellerOffers.length === 0 && customerOffers.length === 0 && (
                        <div className="text-center">No offers found.</div>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Offers;
