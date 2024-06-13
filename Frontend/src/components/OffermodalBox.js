import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
// import { FaCheck } from 'react-icons/fa';

const OfferModal = () => {
  const [show, setShow] = useState(false);
  const [offer, setOffer] = useState('');

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleAmountClick = (amount) => {
    setOffer(`$${amount}`);
  };

  return (
    <>
      <Button variant="outline-secondary" className="w-100 mb-2" onClick={handleShow}>
        <b>MAKE OFFER</b>
      </Button>

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title className="mx-auto">Modal title</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <img
            src="https://via.placeholder.com/50"
            className="img-fluid mb-3"
            alt="Small"
          />
          <input
            type="text"
            value={offer}
            onChange={(e) => setOffer(e.target.value)}
            className="form-control mb-3"
            placeholder="Enter amount"
          />
          <div className="d-flex justify-content-between mb-3">
            <Button
              variant="outline-primary"
              className="flex-grow-1 mx-1"
              onClick={() => handleAmountClick(10)}
            >
              $10
            </Button>
            <Button
              variant="outline-primary"
              className="flex-grow-1 mx-1"
              onClick={() => handleAmountClick(20)}
            >
              $20
            </Button>
            <Button
              variant="outline-primary"
              className="flex-grow-1 mx-1"
              onClick={() => handleAmountClick(50)}
            >
              $50
            </Button>
          </div>
          <Button variant="primary" className="w-100">
            Send Offer
          </Button>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default OfferModal;
