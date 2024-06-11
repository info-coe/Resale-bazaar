import React from "react";

const Adminpagination = (props) => {
  const {
    stateData,
    setViewRowIndex,
    pageSize,
    setPageSize,
    currentPage,
    setCurrentPage,
  } = props;
  const totalPages = Math.ceil(stateData.length / pageSize);
  const pagesToShow = 3;

  const handleRowsChange = (e) => {
    const rows = parseInt(e.target.value);
    setPageSize(rows);
  };

  const handleFirstClick = () => {
    setCurrentPage(1);
    setViewRowIndex(null);
  };

  const handlePreviousClick = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      setViewRowIndex(null);
    }
  };

  const handleNextClick = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      setViewRowIndex(null);
    }
  };

  const handleLastClick = () => {
    setCurrentPage(totalPages > 0 ? totalPages : 1);
    setViewRowIndex(null);
  };

  const handlePageClick = (page) => {
    setCurrentPage(page);
    setViewRowIndex(null);
  };

  const generatePageNumbers = () => {
    const pages = [];
    const middleRange = Math.floor(pagesToShow / 2);
    let start = Math.max(currentPage - middleRange, 1);
    let end = Math.min(start + pagesToShow - 1, totalPages);

    if (end - start + 1 < pagesToShow) {
      start = Math.max(end - pagesToShow + 1, 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(
        <li
          key={i}
          className={`page-item ${i === currentPage ? "active" : ""}`}
        >
          <button className="page-link" onClick={() => handlePageClick(i)}>
            {i}
          </button>
        </li>
      );
    }

    return (
      <div className="d-md-flex justify-content-center gap-5">
        <ul className="pagination d-flex flex-wrap justify-content-center">
          <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
            <button className="page-link" onClick={handleFirstClick}>
              <i className="bi bi-skip-backward-fill"></i>
            </button>
          </li>
          <li
            className={`page-item ${
              currentPage === 1 || stateData.length === 0 ? "disabled" : ""
            }`}
          >
            <button className="page-link" onClick={handlePreviousClick}>
              <i className="bi bi-caret-left-fill"></i>
            </button>
          </li>
          {pages}
          <li
            className={`page-item ${
              currentPage === totalPages || stateData.length === 0
                ? "disabled"
                : ""
            }`}
          >
            <button className="page-link" onClick={handleNextClick}>
              <i className="bi bi-caret-right-fill"></i>
            </button>
          </li>
          <li
            className={`page-item ${
              currentPage === totalPages || stateData.length === 0
                ? "disabled"
                : ""
            }`}
          >
            <button className="page-link" onClick={handleLastClick}>
              <i className="bi bi-skip-forward-fill"></i>
            </button>
          </li>
        </ul>

        <div>
          <div className="d-flex  text-center">
            <label className="fs-5 pe-2">Show</label>

            <select
              name="dynamic-table_length"
              aria-controls="dynamic-table"
              className="form-select"
              id="rowsDropdown"
              onChange={handleRowsChange}
              value={pageSize}
            >
              <option value="3">3</option>
              <option value="10">10</option>
              <option value="15">15</option>
              <option value="20">20</option>
              <option value="25">25</option>
            </select>
            <label className="fs-5 ps-2">items</label>
          </div>
        </div>
      </div>
    );
  };
  // eslint-disable-next-line no-unused-vars
  const startIndex = (currentPage - 1) * pageSize + 1;
  // eslint-disable-next-line no-unused-vars
  const endIndex = Math.min(currentPage * pageSize, stateData.length);

  return (
    <div className="d-md-flex text-center justify-content-center w-100 bg-secondary text-white mt-3 p-1">
      <nav className="mt-2">{generatePageNumbers()}</nav>
    </div>
  );
};

export default Adminpagination;
