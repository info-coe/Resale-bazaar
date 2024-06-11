import React, { useState, useEffect } from "react";

const Filter = ({ products, onFilter }) => {
  const [selectedPriceRange, setSelectedPriceRange] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("");

  const languages = [
    "English",
    "Hindi",
    "Telugu",
    "Tamil",
    "Kannada",
    "Marathi",
  ];

  useEffect(() => {
    const storedPriceRange = sessionStorage.getItem("books_selectedPriceRange");

    if (storedPriceRange) {
      setSelectedPriceRange(storedPriceRange);
    }
  }, []);

  const handlePriceRangeSelect = (priceRange) => {
    const newPriceRange = selectedPriceRange === priceRange ? "" : priceRange;
    setSelectedPriceRange(newPriceRange);
    sessionStorage.setItem("books_selectedPriceRange", newPriceRange);
  };

  const handleLanguageSelect = (language) => {
    const newLanguage = selectedLanguage === language ? "" : language;
    setSelectedLanguage(newLanguage);
  };

  // Define a function to handle the filtered products
  const handleFilteredProducts = (filtered) => {
    // Call the onFilter function to handle the filtered products without causing a re-render
    onFilter(filtered);
  };

  useEffect(() => {
    const filtered = products.filter((product) => {
      const matchPriceRange =
        !selectedPriceRange ||
        (selectedPriceRange === "below500" && product.price < 500) ||
        (selectedPriceRange === "500to1000" && product.price >= 500 && product.price < 1000) ||
        (selectedPriceRange === "1000to2000" && product.price >= 1000 && product.price < 2000) ||
        (selectedPriceRange === "above2000" && product.price >= 2000);
      
      const matchLanguage = !selectedLanguage || product.language.toLowerCase() === selectedLanguage.toLowerCase();

      return matchPriceRange && matchLanguage;
    });
    
    // Instead of updating state directly here, call a function to handle the filtered products
    handleFilteredProducts(filtered);
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPriceRange, selectedLanguage, products]);

  return (
    <div className="card mt-4 mb-5">
      <div className="card-header bg-secondary text-white p-3 fs-5">
        <i className="bi bi-sort-down-alt pe-3"></i>
        Filter
      </div>
      <div className="card-body">
        <div className="mt-2">
          <h1 style={{fontSize:'20px'}}>Price</h1>
          <div className="d-flex  flex-wrap align-items-start">
            <button
              className={`btn border m-1 ${selectedPriceRange === "below500" ? "active" : ""}`}
              style={{
                border: selectedPriceRange === "below500" ?  "1px solid black" : "", 
                backgroundColor: selectedPriceRange === "below500" ? "lightGrey" : "" 
              }}
              onClick={() => handlePriceRangeSelect("below500")}
            >
              Below ₹500
            </button>
            <button
              className={`btn border m-1 ${selectedPriceRange === "500to1000" ? "active" : ""}`}
              style={{
                border: selectedPriceRange === "500to1000" ? "1px solid black" : "", 
                backgroundColor: selectedPriceRange === "500to1000" ? "lightGrey" : "" 
              }}
              onClick={() => handlePriceRangeSelect("500to1000")}
            >
              ₹500 - ₹1000
            </button>
            <button
              className={`btn border m-1 ${selectedPriceRange === "1000to2000" ? "active" : ""}`}
              style={{
                border: selectedPriceRange === "1000to2000" ? "1px solid black" : "", 
                backgroundColor: selectedPriceRange === "1000to2000" ? "lightGrey" : "" 
              }}
              onClick={() => handlePriceRangeSelect("1000to2000")}
            >
              ₹1000 - ₹2000
            </button>
            <button
              className={`btn border m-1 ${selectedPriceRange === "above2000" ? "active" : ""}`}
              style={{
                border: selectedPriceRange === "above2000" ? "1px solid black" : "", 
                backgroundColor: selectedPriceRange === "above2000" ? "lightGrey" : "" 
              }}
              onClick={() => handlePriceRangeSelect("above2000")}
            >
              Above ₹2000
            </button>
          </div>
        </div>
        <div className="mt-4">
          <h1 style={{fontSize:'20px'}}>Languages</h1>
          <div className="d-flex flex-wrap align-items-start">
            {languages.map((language) => (
              <button
                key={language}
                className={`btn border m-1 ${selectedLanguage.toLowerCase() === language.toLowerCase() ? "active" : ""}`}
                style={{
                  border: selectedLanguage.toLowerCase() === language.toLowerCase() ? "1px solid black" : "", 
                  backgroundColor: selectedLanguage.toLowerCase() === language.toLowerCase() ? "lightGrey" : "" 
                }}
                onClick={() => handleLanguageSelect(language)}
              >
                {language}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Filter;
