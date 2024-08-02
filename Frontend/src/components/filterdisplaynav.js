import React from "react";

const Filterdisplaynav = (props) => {
  const pageSize = props.pageSize;
  const setPageSize = props.setPageSize;
  const name=props.productName;
  // const handleRowsChange = (e) => {
  //   const rows = parseInt(e.target.value);
  //   setPageSize(rows);
  // };
  return (
    <>
      <nav className="bg-secondary d-lg-flex justify-content-between text-white d-md-flex justify-content-end ps-lg-3 pe-lg-3 p-2 mb-4">
        <div className="d-md-flex">
          <label className="fs-5 pe-4">{name}</label>
          
        </div>
       
      </nav>
    </>
  );
};

export default Filterdisplaynav;
