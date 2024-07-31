

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
//           <div className="product-grid container">
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
import { useLocation, useNavigate } from 'react-router-dom';
import Footer from './footer';
import Scrolltotopbtn from './Scrolltotopbutton';

const Search = () => {
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();

  // Extract the search term from URL query parameters
  const params = new URLSearchParams(location.search);
  const searchTerm = params.get('q') || '';

  // Function to fetch all products
  const fetchAllProducts = () => {
    axios
      .get(`${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/allproducts`)
      .then((res) => {
        if (res.data !== 'Fail' && res.data !== 'Error') {
          setAllProducts(res.data);
        }
      })
      .catch((error) => {
        console.log('Error fetching data:', error);
      });
  };

  // Function to normalize words to their base form
  const normalizeWord = (word) => {
    return word.replace(/es$/, '').replace(/s$/, '');
  };

  // Filter products based on searchTerm
  useEffect(() => {
    if (searchTerm && searchTerm.trim() !== '') {
      const lowerCaseTerm = searchTerm.toLowerCase();
      const normalizedTerm = normalizeWord(lowerCaseTerm);
      const results = allProducts.filter((product) => (
        product.name.toLowerCase().includes(lowerCaseTerm) ||
        product.color.toLowerCase().includes(lowerCaseTerm) ||
        product.price.toString().includes(lowerCaseTerm) ||
        product.size.toLowerCase().includes(lowerCaseTerm) ||
        product.name.toLowerCase().includes(normalizedTerm)
      ));
      setFilteredProducts(results);
    } else {
      setFilteredProducts([]);
      // Optionally redirect to home if no search term
      navigate('/');
    }
  }, [searchTerm, allProducts, navigate]);

  // Fetch all products on component mount
  useEffect(() => {
    fetchAllProducts();
  }, []);

  return (
    <div className="fullscreen">
      <MyNavbar />
      <main>
        {searchTerm && searchTerm.trim() !== '' && (
          <>
            <h6 className="container mt-3" style={{ fontSize: '20px' }}>Search Results for: "{searchTerm}"</h6>

            <div className="d-flex justify-content-center">
              <div className="product-grid container">
                {(filteredProducts.length > 0) ? (
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
          </>
        )}
      </main>
      <Footer />
      <Scrolltotopbtn />
    </div>
  );
};

export default Search;
