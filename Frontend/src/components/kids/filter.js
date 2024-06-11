
import React, { useState, useEffect } from "react";

const Filter = ({ products, onFilter }) => {
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedMaterial, setSelectedMaterial] = useState("");
  const [selectedPriceRange, setSelectedPriceRange] = useState("");
  const [selectedColor, setSelectedColor] = useState("");


  const materials = ["Silk", "Cotton", "Crepe", "Net", "Georgette", "Rayon", "Polyester", "Wool", "Linen", "Nylon", "Denim", "Leather", "Velvet", "Spandex (Elastane)"];
  const colors = [
    { name: "Red", code: "#ff0000" },
    { name: "Blue", code: "#0000ff" },
    { name: "Green", code: "#00ff00" },
    { name: "Yellow", code: "#ffff00" },
    { name: "Black", code: "#000000" },
    { name: "White", code: "#ffffff" },
    { name: "Orange", code: "#ffa500" },
    { name: "Purple", code: "#800080" },
    { name: "Pink", code: "#ffc0cb" },
    { name: "Brown", code: "#a52a2a" }
  ];
  

  useEffect(() => {
    const storedSize = sessionStorage.getItem("kids_selectedSize");
    const storedMaterial = sessionStorage.getItem("kids_selectedMaterial");
    const storedPriceRange = sessionStorage.getItem("kids_selectedPriceRange");
    const storedColor = sessionStorage.getItem("kids_selectedColor");
    if (storedSize) {
      setSelectedSize(storedSize);
    }
    if (storedMaterial) {
      setSelectedMaterial(storedMaterial);
    }
    if (storedPriceRange) {
      setSelectedPriceRange(storedPriceRange);
    }
    if (storedColor) {
      setSelectedColor(storedColor);
    }
  }, []);

  const handleSizeSelect = (size) => {
    // Toggle the selected size
    const newSize = selectedSize === size ? "" : size;
    setSelectedSize(newSize);
    sessionStorage.setItem("kids_selectedSize", newSize);
  };

  const handleMaterialSelect = (material) => {
    const newMaterial = selectedMaterial === material ? "" : material; // Toggle selection
    setSelectedMaterial(newMaterial);
    sessionStorage.setItem("kids_selectedMaterial", newMaterial);
  };


  const handlePriceRangeSelect = (priceRange) => {
    const newPriceRange = selectedPriceRange === priceRange ? "" : priceRange;
    setSelectedPriceRange(newPriceRange);
    sessionStorage.setItem("kids_selectedPriceRange", newPriceRange);
  };
  const handleColorSelect = (color) => {
    const newColor = selectedColor === color ? "" : color;
    setSelectedColor(newColor);
    sessionStorage.setItem("kids_selectedColor", newColor);
  };
  // Define a function to handle the filtered products
const handleFilteredProducts = (filtered) => {
  // Call the onFilter function to handle the filtered products without causing a re-render
  onFilter(filtered);
};

 
  useEffect(() => {
    const filtered = products.filter((product) => {
      const matchSize = !selectedSize || product.size === selectedSize;
      const matchMaterial = !selectedMaterial || product.material === selectedMaterial;
      const matchPriceRange =
        !selectedPriceRange ||
        (selectedPriceRange === "below500" && product.price < 500) ||
        (selectedPriceRange === "500to1000" && product.price >= 500 && product.price < 1000) ||
        (selectedPriceRange === "1000to2000" && product.price >= 1000 && product.price < 2000) ||
        (selectedPriceRange === "above2000" && product.price >= 2000);
      const matchColor =
        !selectedColor ||
        product.color.toLowerCase().includes(selectedColor.toLowerCase());
      return matchSize && matchMaterial && matchPriceRange && matchColor;
    });
    // Instead of updating state directly here, call a function to handle the filtered products
    handleFilteredProducts(filtered);
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSize, selectedMaterial, selectedPriceRange, selectedColor, products]);



  return (
    <>
      <div className="card mt-4 mb-5">
        <div className="card-header bg-secondary text-white p-3 fs-5">
          <i className="bi bi-sort-down-alt pe-3"></i>
          Filter
        </div>
        <div className="card-body">
          <h1 style={{fontSize:'20px'}}>Size</h1>
          <div className="d-flex flex-wrap">
            {["0-2 Years", "2-4 Years", "4-6 Years", "6-8 Years", "8-10 Years","10-15 Years"].map((size) => (
              <button
                key={size}
                className={`btn border m-1  ${selectedSize === size ? "active" : ""}`}
                style={{
                border: selectedSize === size ? "1px solid black" : "", 
                backgroundColor: selectedSize === size ? "lightGrey" : "" 
              }}
                onClick={() => handleSizeSelect(size)}
              >
                {size}
              </button>
            ))}
          </div>
         
          <div className="mt-4">
      <h1 style={{fontSize:'20px'}}>Material</h1>
     
      <div className="d-flex flex-wrap align-items-start">
  {materials.map((material) => (
    <button
      key={material}
      className={`btn border m-1 ${selectedMaterial === material ? "active" : ""}`}
      style={{
        border: selectedMaterial === material ? "1px solid black" : "", 
        backgroundColor: selectedMaterial === material ? "lightGrey" : "" 
      }}
      onClick={() => handleMaterialSelect(material)}
    >
      {material}
    </button>
  ))}
      </div>
          </div>

          <div className="mt-4">
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
                Below &#8377;500
              </button>
              <button
                className={`btn border m-1 ${selectedPriceRange === "500to1000" ? "active" : ""}`}
                style={{
                  border: selectedPriceRange === "500to1000" ? "1px solid black" : "", 
                  backgroundColor: selectedPriceRange === "500to1000" ? "lightGrey" : "" 
                }}
                onClick={() => handlePriceRangeSelect("500to1000")}
              >
                &#8377;500 - &#8377;1000
              </button>
              <button
                className={`btn border m-1 ${selectedPriceRange === "1000to2000" ? "active" : ""}`}
                style={{
                  border: selectedPriceRange === "1000to2000" ? "1px solid black" : "", 
                  backgroundColor: selectedPriceRange === "1000to2000" ? "lightGrey" : "" 
                }}
                onClick={() => handlePriceRangeSelect("1000to2000")}
              >
                &#8377;1000 - &#8377;2000
              </button>
              <button
                className={`btn border m-1 ${selectedPriceRange === "above2000" ? "active" : ""}`}
                style={{
                  border: selectedPriceRange === "above2000" ? "1px solid black" : "", 
                  backgroundColor: selectedPriceRange === "above2000" ? "lightGrey" : "" 
                }}
                onClick={() => handlePriceRangeSelect("above2000")}
              >
                Above &#8377;2000
              </button>
            </div>
          </div>
          <div className="mt-4">
  <h1 style={{fontSize:'20px'}}>Color</h1>
  <div className="d-flex flex-row flex-wrap align-items-start">
    {colors.map((color) => (
      <div className="d-flex flex-column text-center position-relative">
        <button
          key={color.name}
          className={`btn ${selectedColor === color.name ? "active" : ""}`}
          style={{ 
            backgroundColor: color.code, 
            width: selectedColor === color.name ? "35px" : "30px", 
            height: selectedColor === color.name ? "35px" : "30px", 
            margin: "9px", 
            border: selectedColor === color.name ? "3px solid black" : "1px solid black",
            borderColor: selectedColor === color.name ? "black" : "grey",
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: color.name === "Black" ? "white" : "inherit" // Set icon color to white only for black background
          }}
          onClick={() => handleColorSelect(color.name)}
        >
          {selectedColor === color.name && <i className="bi bi-check-lg fs-4 ms-4 mt-5 position-absolute translate-middle"></i>}
        </button>
      </div>
    ))}
  </div>
</div>

        </div>
      </div>
    </>
  );
};

export default Filter;


