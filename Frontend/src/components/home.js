// import React, { useEffect, useState } from "react";
// import MyNavbar from "./navbar";
// import Footer from "./footer";
// import Curosel from "./curosal";
// import CarouselComponent from "./carouselcomponent";
// import axios from "axios";
// import "react-multi-carousel/lib/styles.css";
// import Product from "./Product";

  
// const Home = () => {
//   const [allProducts, setAllProducts] = useState([]);

//   useEffect(() => {
//     axios
//     .get(`${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/allproducts`)
//       .then((res) => {
//         if (res.data !== "Fail" && res.data !== "Error") {
//           // console.log(res.data);
//           setAllProducts(res.data);
//         }
//       })
//       .catch((error) => {
//         console.log("Error fetching data:", error);
//       });
//   }, []);



//   return (
//     <div className="fullscreen">
//          <MyNavbar />
//       <main>
//       <CarouselComponent />

//       <h1 className="container" style={{fontSize:'28px'}}>Product Categories</h1>
//       <Curosel />
//       <h2 className="container" style={{fontSize:'28px'}}>Featured Products</h2>
    
//      <div className=" d-flex justify-content-center">
//   <div className="d-md-flex flex-wrap gap-4 ms-md-5 me-md-5 mb-4 mt-md-3 mt-3 ms-2 me-2 justify-content-start">
//     {(allProducts.length > 0) ? (
//       <>
//         {allProducts.map((product, index) => (
//           <div key={index}>
//             <Product product={product} admin="home" />
//           </div>
//         ))}
//       </>
//     ) : (
//       <h3 className="text-center mb-4" style={{ fontSize: '28px' }}>No products to display</h3>
//     )}
//   </div>
// </div>

//       </main>
//       <Footer />
//     </div>
//   );
// };

// export default Home;


import React, { useEffect, useState } from "react";
import MyNavbar from "./navbar";
import Footer from "./footer";
import Curosel from "./curosal";
import CarouselComponent from "./carouselcomponent";
import axios from "axios";
import "react-multi-carousel/lib/styles.css";
import Product from "./Product";
import { Link } from "react-router-dom";

const Home = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [startIdx, setStartIdx] = useState(0);
  const productsPerPage = 10;

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/allproducts`)
      .then((res) => {
        if (res.data !== "Fail" && res.data !== "Error") {
          setAllProducts(res.data);
          setDisplayedProducts(res.data.slice(0, productsPerPage)); // Initially display first batch
          setStartIdx(productsPerPage); // Start index for next batch
        }
      })
      .catch((error) => {
        console.log("Error fetching data:", error);
      });
  }, []);

  const loadMoreProducts = () => {
    const nextBatch = allProducts.slice(startIdx, startIdx + productsPerPage);
    setDisplayedProducts((prevProducts) => [...prevProducts, ...nextBatch]);
    setStartIdx(startIdx + productsPerPage);
  };

  return (
    <div className="fullscreen">
      <MyNavbar />
      <main>
        <CarouselComponent />

        <h1 className="container" style={{ fontSize: "28px" }}>Product Categories</h1>
        <Curosel />
        <h2 className="container text-center" style={{ fontSize: "28px" }}>Featured Products</h2>
        {/* Womens Fashion */}
       <div className="d-flex justify-content-between">
       <h4 className="ms-2 ms-md-5">Womens Fashion</h4>
        <div className="d-flex justify-content-end" style={{padding:"5px 50px 10px 10px"}}>
            <Link to="/women" className="text-decoration-none">
              See more
            </Link>
          </div>
       </div>
        <div className="d-flex flex-wrap">
          <div className="d-md-flex flex-wrap gap-4 ms-md-5 me-md-5 mb-4 mt-md-3 mt-3 ms-2 me-2 ">
            {displayedProducts.length > 0 ? (
              <>
                {displayedProducts.filter((item)=>item.product_type==="women").map((product, index) => (
                  <div key={index}>
                    <Product product={product} admin="home" />
                  </div>
                ))}
              </>
            ) : (
              <h3 className="text-center mb-4" style={{ fontSize: "18px" }}>No products to display</h3>
            )}
          </div>
        </div>

       
         
        

         {/* Kids Fashion */}
        
         <div className="d-flex justify-content-between">
         <h4 className="ms-2 ms-md-5">Kids Fashion</h4>
        <div className="d-flex justify-content-end" style={{padding:"5px 50px 10px 10px"}}>
            <Link to="/kids" className="text-decoration-none">
              See more
            </Link>
          </div>
       </div>
        <div className="d-flex flex-wrap">
          <div className="d-md-flex flex-wrap gap-4 ms-md-5 me-md-5 mb-4 mt-md-3 mt-3 ms-2 me-2 ">
            {displayedProducts.length > 0 ? (
              <>
                {displayedProducts.filter((item)=>item.product_type==="kids").map((product, index) => (
                  <div key={index}>
                    <Product product={product} admin="home" />
                  </div>
                ))}
              </>
            ) : (
              <h3 className="text-center mb-4" style={{ fontSize: "18px" }}>No products to display</h3>
            )}
          </div>
        </div>

         {/* Jewellery Collection */}
         
         <div className="d-flex justify-content-between">
         <h4 className="ms-2 ms-md-5">Jewellery</h4>
        <div className="d-flex justify-content-end" style={{padding:"5px 50px 10px 10px"}}>
            <Link to="/jewellery" className="text-decoration-none">
              See more
            </Link>
          </div>
       </div>
        <div className="d-flex flex-wrap">
          <div className="d-md-flex flex-wrap gap-4 ms-md-5 me-md-5 mb-4 mt-md-3 mt-3 ms-2 me-2 ">
            {displayedProducts.length > 0 ? (
              <>
                {displayedProducts.filter((item)=>item.product_type==="jewellery").map((product, index) => (
                  <div key={index}>
                    <Product product={product} admin="home" />
                  </div>
                ))}
              </>
            ) : (
              <h3 className="text-center mb-4" style={{ fontSize: "18px" }}>No products to display</h3>
            )}
          </div>
        </div>

         {/* Books Collection */}
        
         <div className="d-flex justify-content-between">
         <h4 className="ms-2 ms-md-5">Books</h4>
        <div className="d-flex justify-content-end" style={{padding:"5px 50px 10px 10px"}}>
            <Link to="/books" className="text-decoration-none">
              See more
            </Link>
          </div>
       </div>
        <div className="d-flex flex-wrap">
          <div className="d-md-flex flex-wrap gap-4 ms-md-5 me-md-5 mb-4 mt-md-3 mt-3 ms-2 me-2 ">
            {displayedProducts.length > 0 ? (
              <>
                {displayedProducts.filter((item)=>item.product_type==="books").map((product, index) => (
                  <div key={index}>
                    <Product product={product} admin="home" />
                  </div>
                ))}
              </>
            ) : (
              <h3 className="text-center mb-4" style={{ fontSize: "18px" }}>No products to display</h3>
            )}
          </div>
        </div>

      </main>
      <Footer />
    </div>
  );
};

export default Home;