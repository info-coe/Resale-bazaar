import React from "react";

const Pagination = (props) => {
  const { stateData, setViewRowIndex, pageSize, currentPage, setCurrentPage } =
    props;
  const totalPages = Math.ceil(stateData.length / pageSize);
  const pagesToShow = 3; // Number of page buttons to show at a time

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
      <div className="d-md-flex justify-content-center">
        <div className="pe-3">
          <div
            className="dataTables_info"
            id="dynamic-table_info"
            role="status"
            aria-live="polite"
          >
            Showing {stateData.length > 0 ? startIndex : 0} to {endIndex} of{" "}
            {stateData.length} entries
          </div>
        </div>
        {/* Additional content goes here */}
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
      </div>
    );
  };

  const startIndex = (currentPage - 1) * pageSize + 1;
  const endIndex = Math.min(currentPage * pageSize, stateData.length);

  return (
    <div className="d-md-flex text-center justify-content-center w-100 bg-secondary text-white mb-3 p-1 mt-3">
      <nav className="mt-2">{generatePageNumbers()}</nav>
    </div>
  );
};

export default Pagination;
