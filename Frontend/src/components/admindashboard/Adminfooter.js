import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom";

export default function Adminfooter() {
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000); // Update every second

    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, []);

  const formatDate = (date) => {
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "America/New_York",
    };
    return new Intl.DateTimeFormat("en-US", options).format(date);
  };

  const formatTime = (date) => {
    const options = {
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      timeZone: "America/New_York", // Example: Eastern Time Zone
    };
    return new Intl.DateTimeFormat("en-US", options).format(date);
  };
  return (
    <div className="border">
      <footer className="">
        <div className="d-md-flex justify-content-around text-center p-1">
          <p className="fs-6">
            Powered by{" "}
            {/* <Link
              to="https://infomericainc.com"
              className="text-decoration-none"
            > */}
              TheResaleBazaar
            {/* </Link> */}
          </p>
          <p>{formatDate(currentDateTime)}</p>
          <p>{formatTime(currentDateTime)}</p>
        </div>
      </footer>
    </div>
  );
}
