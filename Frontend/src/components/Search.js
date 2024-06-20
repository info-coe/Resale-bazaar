

import React, { useState, useEffect } from 'react';
import Product from './Product';
import axios from 'axios';
import MyNavbar from './navbar';
import { useLocation } from 'react-router-dom';
import Footer from './footer';

const Search = () => {
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const { state } = useLocation();
  const searchTerm = state.termToSearch;

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

  // Fetch all products on component mount
  useEffect(() => {
    fetchAllProducts();
  }, []);

  return (
    <div className="fullscreen">
        <MyNavbar />
      <main>
        <h6 className="container mt-3" style={{ fontSize: '20px' }}>Search Results for: "{searchTerm}"</h6>

        <div className="d-flex justify-content-center">
          <div className="d-md-flex flex-wrap gap-4 ms-md-5 me-md-5 mb-4 mt-md-3 mt-3 ms-2 me-2 justify-content-start">
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

      </main>
      <Footer/>
    </div>
  );
};

export default Search;
