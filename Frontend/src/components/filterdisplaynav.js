import React from "react";

const Filterdisplaynav = (props) => {
  const name=props.productName;
  return (
    <>
      <nav className="filterdisplaynav d-lg-flex justify-content-between d-md-flex justify-content-end ps-lg-3 pe-lg-3 p-2 mb-4">
        <div className="d-md-flex">
          <label className="fs-5 pe-4">{name}</label>
        </div>
      </nav>
    </>
  );
};

export default Filterdisplaynav;
