import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

export default function Adminfooter() {
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000); // Update every second

    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, []);

  const formatDate = (date) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  const formatTime = (date) => {
    const options = { hour: 'numeric', minute: 'numeric', second: 'numeric' };
    return date.toLocaleTimeString('en-US', options);
  };
  return (
    <div className='border'>
      <footer className=''>
        <p className='d-md-flex justify-content-between p-1'>
          <span className='fs-6'>Powered by <Link to="https://infomericainc.com" className='text-decoration-none'>Infomericainc</Link></span>
          <span>{formatDate(currentDateTime)}</span>
          <span>{formatTime(currentDateTime)}</span>
        </p>
      </footer>
    </div>
  )
}
