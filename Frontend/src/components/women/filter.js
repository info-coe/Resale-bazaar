


import React, { useState, useEffect } from "react";

const Filter = ({ products, onFilter }) => {
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedMaterial, setSelectedMaterial] = useState("");
  const [selectedPriceRange, setSelectedPriceRange] = useState("");
  const [selectedColor, setSelectedColor] = useState("");


  const materials = ["Silk", "Cotton", "Pattu" ,"Crepe", "Net", "Georgette", "Rayon", "Polyester", "Wool", "Linen", "Nylon", "Denim", "Leather", "Velvet", "Spandex (Elastane)"];
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
    const storedSize = sessionStorage.getItem("women_selectedSize");
    const storedMaterial = sessionStorage.getItem("women_selectedMaterial");
    const storedPriceRange = sessionStorage.getItem("women_selectedPriceRange");
    const storedColor = sessionStorage.getItem("women_selectedColor");
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

  // const handleSizeSelect = (size) => {
  //   // Toggle the selected size
  //   const newSize = selectedSize === size ? "" : size;
  //   setSelectedSize(newSize);
  //   sessionStorage.setItem("women_selectedSize", newSize);
  // };

  const handleMaterialSelect = (material) => {
    const newMaterial = selectedMaterial === material ? "" : material; // Toggle selection
    setSelectedMaterial(newMaterial);
    sessionStorage.setItem("women_selectedMaterial", newMaterial);
  };


  const handlePriceRangeSelect = (priceRange) => {
    const newPriceRange = selectedPriceRange === priceRange ? "" : priceRange;
    setSelectedPriceRange(newPriceRange);
    sessionStorage.setItem("women_selectedPriceRange", newPriceRange);
  };
  const handleColorSelect = (color) => {
    const newColor = selectedColor === color ? "" : color;
    setSelectedColor(newColor);
    sessionStorage.setItem("women_selectedColor", newColor);
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
        (selectedPriceRange === "below25" && product.price < 25) ||
        (selectedPriceRange === "25to50" && product.price >= 25 && product.price < 50) ||
        (selectedPriceRange === "50to100" && product.price >= 50 && product.price < 100) ||
        (selectedPriceRange === "above100" && product.price >= 100);
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
        <div className="filterdisplaynav card-header  p-3 fs-5">
          <i className="bi bi-sort-down-alt pe-3"></i>
          Filter
        </div>
        <div className="card-body">
        
         
          <div className="mt-4">
      <h1 style={{fontSize:'20px'}}>Material</h1>
      
      <div className="d-flex flex-wrap align-items-start">
  {materials.map((material , index) => (
    <button
      key={index}
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
                className={`btn border m-1 ${selectedPriceRange === "below25" ? "active" : ""}`}
                style={{
                  border: selectedPriceRange === "below25" ?  "1px solid black" : "", 
                  backgroundColor: selectedPriceRange === "below25" ? "lightGrey" : "" 
                }}
                onClick={() => handlePriceRangeSelect("below25")}
              >
                Below &#36;25
              </button>
              <button
                className={`btn border m-1 ${selectedPriceRange === "25to50" ? "active" : ""}`}
                style={{
                  border: selectedPriceRange === "25to50" ? "1px solid black" : "", 
                  backgroundColor: selectedPriceRange === "25to50" ? "lightGrey" : "" 
                }}
                onClick={() => handlePriceRangeSelect("25to50")}
              >
                &#36;25 - &#36;50
              </button>
              <button
                className={`btn border m-1 ${selectedPriceRange === "50to100" ? "active" : ""}`}
                style={{
                  border: selectedPriceRange === "50to100" ? "1px solid black" : "", 
                  backgroundColor: selectedPriceRange === "50to100" ? "lightGrey" : "" 
                }}
                onClick={() => handlePriceRangeSelect("50to100")}
              >
                &#36;50 - &#36;100
              </button>
              <button
                className={`btn border m-1 ${selectedPriceRange === "above100" ? "active" : ""}`}
                style={{
                  border: selectedPriceRange === "above100" ? "1px solid black" : "", 
                  backgroundColor: selectedPriceRange === "above100" ? "lightGrey" : "" 
                }}
                onClick={() => handlePriceRangeSelect("above100")}
              >
                Above &#36;100
              </button>
            </div>
          </div>
         

<div className="mt-4">
  <h1 style={{fontSize:'20px'}}>Color</h1>
  <div className="d-flex flex-row flex-wrap align-items-start">
    {colors.map((color , index) => (
      <div className="d-flex flex-column text-center position-relative" key={index}>
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
