import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import MyNavbar from '../navbar';
import Footer from '../footer';
import Scrolltotopbtn from '../Scrolltotopbutton';

const OrderPage = () => {
  const location = useLocation();
  const { filteredProducts} = location.state || {};
  const productData = filteredProducts || {}
  const [orderStages, setOrderStages] = useState([]);

  useEffect(() => {
    const stages = [
      { title: 'Order Placed', isCompleted: productData.ordered_date !== null },
      { title: 'Shipped', isCompleted: productData.shipped_date !== null },
      { title: 'Arrived', isCompleted:  productData.delivered_date !== null  }, 
      { title: 'Delivered', isCompleted: productData.delivered_date !== null }
    ];
    setOrderStages(stages);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
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
    <>
    <MyNavbar/>
    <div className="container py-5">
      <style>{styles}</style>
      <div className="card shadow p-4">
        <div className="card-body">
          <div className="row align-items-center">
            <div className="col">
              <h5 className="mb-0">ORDER ID &nbsp;<span className="text-primary">{productData.order_id}</span></h5>
              <h3>{productData.name}</h3>
            </div>
            <div className="col text-end">
              <p className="mb-0">Expected Arrival <span className="fw-bold">{productData.expected_arrival_date}</span></p>
              <p>USPS <span className="fw-bold">{productData.usps_tracking_number}</span></p>
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
    <Footer/>
    <Scrolltotopbtn/>
    </>
  );
};

export default OrderPage;
