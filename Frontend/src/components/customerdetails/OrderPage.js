import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const OrderPage = () => {
  const location = useLocation();
  const { productdetails ,filteredProducts} = location.state || {};
  const orderData = productdetails || {}; // Ensure orderData is defined
  const productData = filteredProducts || {}
  const [orderStages, setOrderStages] = useState([]);
  useEffect(() => {
    // Example logic to determine order stages based on order data
    const stages = [
      { title: 'Order Placed', isCompleted: orderData.order_id !== null },
      { title: 'Shipped', isCompleted: orderData.shipment_id !== null },
      { title: 'Arrived', isCompleted: false }, // Example: Add logic based on actual data
      { title: 'Delivered', isCompleted: orderData.delivered_date !== null }
    ];

    setOrderStages(stages);
  }, [orderData]);
  const styles = `
    .progress-dot-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      position: relative;
    }
    .progress-dot {
      display: flex;
      flex-direction: column;
      align-items: center;
      position: relative;
      z-index: 1;
    }
    .dot {
      width: 40px;
      height: 40px;
      background-color: #ddd;
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      position: relative;
      z-index: 1;
    }
    .dot.active {
      background-color: #651FFF;
    }
    .connector {
      height: 6px;
      background-color: #ddd;
      flex-grow: 1;
      position: relative;
      z-index: 0;
    }
    .connector.active {
      background-color: #651FFF;
    }
    .label {
      font-size: 12px;
      text-align: center;
      color: #777;
      white-space: nowrap;
      margin-top: -60px;
    }
  `;

  return (
    <div className="container py-5">
      <style>{styles}</style>
      <div className="card shadow">
        <div className="card-body">
          <div className="row align-items-center">
            <div className="col">
              <h5 className="mb-0">ORDER <span className="text-primary"></span></h5>
              <h1>{productData.name}</h1>
            </div>
            <div className="col text-end">
              <p className="mb-0">Expected Arrival <span className="fw-bold">{orderData.expected_arrival_date}</span></p>
              <p>USPS <span className="fw-bold">{orderData.usps_tracking_number}</span></p>
            </div>
          </div>

          <div className="progress-dot-bar mt-4 mb-4">
            {orderStages.map((stage, index) => (
              <React.Fragment key={index}>
                <div className={`progress-dot ${stage.isCompleted ? 'active' : ''}`}>
                  <div className={`dot ${stage.isCompleted ? 'active' : ''}`}>
                    <div className="label">{stage.title}</div>
                  </div>
                </div>
                {index < orderStages.length - 1 && (
                  <div className={`connector ${stage.isCompleted && orderStages[index + 1].isCompleted ? 'active' : ''}`}></div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderPage;
