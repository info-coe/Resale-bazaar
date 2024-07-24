

// import React, { useState, useEffect } from 'react';
// import Product from './Product';
// import axios from 'axios';
// import MyNavbar from './navbar';
// import { useLocation } from 'react-router-dom';
// import Footer from './footer';
// import Scrolltotopbtn from './Scrolltotopbutton';

// const Search = () => {
//   const [filteredProducts, setFilteredProducts] = useState([]);
//   const [allProducts, setAllProducts] = useState([]);
//   const { state } = useLocation();
//   const searchTerm = state.termToSearch;

//   // Function to fetch all products
//   const fetchAllProducts = () => {
//     axios
//       .get(`${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/allproducts`)
//       .then((res) => {
//         if (res.data !== 'Fail' && res.data !== 'Error') {
//           setAllProducts(res.data);
//         }
//       })
//       .catch((error) => {
//         console.log('Error fetching data:', error);
//       });
//   };

//   // Filter products based on searchTerm
//   useEffect(() => {
//     if (searchTerm) {
//       const lowerCaseTerm = searchTerm.toLowerCase();
//       const results = allProducts.filter((product) => (
//         product.name.toLowerCase().includes(lowerCaseTerm) ||
//         product.color.toLowerCase().includes(lowerCaseTerm) ||
//         product.price.toString().includes(lowerCaseTerm) ||
//         product.size.toLowerCase().includes(lowerCaseTerm)
//       ));
//       setFilteredProducts(results);
//     } else {
//       setFilteredProducts([]);
//     }
//   }, [searchTerm, allProducts]);

//   // Fetch all products on component mount
//   useEffect(() => {
//     fetchAllProducts();
//   }, []);

//   return (
//     <div className="fullscreen">
//         <MyNavbar />
//       <main>
//         <h6 className="container mt-3" style={{ fontSize: '20px' }}>Search Results for: "{searchTerm}"</h6>

//         <div className="d-flex justify-content-center">
//           <div className="product-grid container ">
//             {(filteredProducts.length > 0) ? (
//               filteredProducts.map((product, index) => (
//                 <div key={index}>
//                   <Product product={product} admin="home" />
//                 </div>
//               ))
//             ) : (
//               <h6 className="text-center mb-4" style={{ fontSize: '20px' }}>No products match your search</h6>
//             )}
//           </div>
//         </div>

//       </main>
//       <Footer/>
//       <Scrolltotopbtn/>
//     </div>
//   );
// };

// export default Search;

import React, { useState, useEffect } from 'react';
import Product from './Product';
import axios from 'axios';
import MyNavbar from './navbar';
import { useLocation } from 'react-router-dom';
import Footer from './footer';
import Scrolltotopbtn from './Scrolltotopbutton';

const Search = () => {
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const { state } = useLocation();
  const searchTerm = state.termToSearch;
  const productsPerPage = 8;

  // Function to fetch all products
  const fetchAllProducts = (page) => {
    setIsLoading(true);
    axios
      .get(`${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/allproducts?page=${page}&limit=${productsPerPage}`)
      .then((res) => {
        if (res.data !== 'Fail' && res.data !== 'Error') {
          setAllProducts((prevProducts) => [...prevProducts, ...res.data]);
        }
        setIsLoading(false);
      })
      .catch((error) => {
        console.log('Error fetching data:', error);
        setIsLoading(false);
      });
  };

  // Filter products based on searchTerm
  useEffect(() => {
    if (searchTerm) {
      const lowerCaseTerm = searchTerm.toLowerCase();
      const results = allProducts.filter((product) => (
        product.name.toLowerCase().includes(lowerCaseTerm) ||
        product.color.toLowerCase().includes(lowerCaseTerm) ||
        product.price.toString().includes(lowerCaseTerm) ||
        product.size.toLowerCase().includes(lowerCaseTerm)
      ));
      setFilteredProducts(results);
    } else {
      setFilteredProducts([]);
    }
  }, [searchTerm, allProducts]);

  // Fetch initial products on component mount
  useEffect(() => {
    fetchAllProducts(currentPage);
  }, [currentPage]);

  // Handle scroll event for infinite scrolling
  const handleScroll = () => {
    if (window.innerHeight + document.documentElement.scrollTop + 1 >= document.documentElement.scrollHeight && !isLoading) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isLoading]);

  return (
    <div className="fullscreen">
      <MyNavbar />
      <main>
        <h6 className="container mt-3" style={{ fontSize: '20px' }}>Search Results for: "{searchTerm}"</h6>

        <div className="d-flex justify-content-center">
          <div className="product-grid container">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product, index) => (
                <div key={index}>
                  <Product product={product} admin="home" />
                </div>
              ))
            ) : (
              <h6 className="text-center mb-4" style={{ fontSize: '20px' }}>No products match your search</h6>
            )}
          </div>
        </div>

        {isLoading && (
          <div className="centered-message">
            <i className="bi bi-arrow-clockwise spin-icon"></i>
          </div>
        )}
      </main>
      <Footer />
      <Scrolltotopbtn />
    </div>
  );
};

export default Search;
