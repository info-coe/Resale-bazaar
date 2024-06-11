import React from "react";

const Filterdisplaynav = (props) => {
  const pageSize = props.pageSize;
  const setPageSize = props.setPageSize;
  const name=props.productName;

  const handleRowsChange = (e) => {
    const rows = parseInt(e.target.value);
    setPageSize(rows);
  };
  return (
    <>
      <nav className="bg-secondary d-lg-flex justify-content-between text-white d-md-flex justify-content-end ps-lg-3 pe-lg-3 p-2">
        <div className="d-md-flex">
          <label className="fs-5 pe-4">{name}</label>
          
        </div>
        <div className="d-md-flex">
          <label className="fs-5 pe-4">Display</label>
         
          <select
            name="dynamic-table_length"
            aria-controls="dynamic-table"
            className="form-select"
            id="rowsDropdown"
            onChange={handleRowsChange}
            value={pageSize}
          >
            <option value="3">3</option>
            <option value="6">6</option>
            <option value="9">9</option>
            <option value="15">15</option>
          </select>
        </div>
      </nav>
    </>
  );
};

export default Filterdisplaynav;
