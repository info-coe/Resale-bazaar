const express = require("express");
const jwt = require('jsonwebtoken')
const db = require("./db");
const paypal = require("paypal-rest-sdk");
const {
  createDatabaseQuery,
  createAdminTableQuery,
  insertAdminTableQuery,
  createRegisterTableQuery,
  useDatabaseQuery,
  productsList,
  offeredProducts,
  createSellerAccount,
  cartproducts,
  wishproducts,
  contactinfo,
  addressinfo1,
  addressinfo2,
  loginCheckQuery,
  adminLoginQuery,
  retrievingUsersQuery,
  addUserQuery,
  updateUserQuery,
  retrievingSellersQuery,
  addingSellerAccountQuery,
  adminAcceptedProductsQuery,
  adminApprovalQuery,
  adminRejectionQuery,
  retrievingAllProductsQuery,
  retrievingWomenProductsQuery,
  retrievingKidsProductsQuery,
  retrievingJewelleryProductsQuery,
  retrievingBooksProductsQuery,
  addProductsQuery,
  deleteProductsQuery,
  addToCartQuery,
  retrievingCartItemsQuery,
  updateCartItemsQuery,
  deleteCartItemsQuery,
  addToWishlistQuery,
  retrievingWishlistItemsQuery,
  deleteWishlistItemsQuery,
  retrieveContactusQuery,
  addContactusQuery,
  addBillingAddress,
  addShippingAddress,
  paymentStatusQuery,
  ordersproducts,
  deletecartitemQuery,
  getbillingAddress,
  getshippingAddress,
  retrievingAdminQuery,
  udpateAdminQuery,
  deleteOrderItemsQuery,
  retrievingSellerProductsQuery,
  offeredProductsQuery,
  retrievingOfferedProductsQuery,
  updateShippingAddress,
  deleteShippingAddress,
  updatedOfferProductAcceptedQuery,
  updatedOfferProductRejectQuery,
  ContactData,
  AddContactSellerQuery,
  retrievingContactSellerQuery,
  updateOrderDeliveredQuery,
  updateOrderShippmentQuery,
  updateOrderDeliveredandShippementQuery,
  ReviewsQuery
} = require("./queries");
const cors = require("cors");
const multer = require('multer');
const path = require('path');
const app = express();
app.use(cors("*"));
app.use(express.json());
app.use(express.static('public'));
const secretKey = 'yourSecretKey';
const { v4: uuidv4 } = require('uuid');

// Define storage for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/images'); // Destination directory for uploaded files
  },
  // filename: (req, file, cb) => {
  //   const uniqueSuffix = Date.now(); // Generate a unique identifier
  //   const fileExtension = path.extname(file.originalname); // Get the file extension
  //   const filename = `file_${uniqueSuffix}${fileExtension}`; // Construct the filename with extension
  //   cb(null, filename); // Callback to set the filename
  // }
  filename: (req, file, cb) => {
    const fileExtension = path.extname(file.originalname); // Get the file extension
    const filename = `file_${uuidv4()}${fileExtension}`; // Generate a unique filename with UUID
    cb(null, filename); // Callback to set the filename
  }
});

// Multer upload instance
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 200 // Limit file size to 20MB (adjust as needed)
  },
  fileFilter: (req, file, cb) => {
    // Validate file type here if needed
    cb(null, true); // Accept the file
  }
});
// CORS middleware
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  next();
});
app.use(express.json());

let refreshTokens = []

app.post('/token', (req, res) => {
  const refreshToken = req.body.token
  if (refreshToken == null) return res.sendStatus(401)
  if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403)
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403)
    const accessToken = generateAccessToken({ name: user.name })
    res.json({ accessToken: accessToken })
  })
})

app.delete('/logout', (req, res) => {
  const tokenToDelete = req.headers['token'];
  refreshTokens = refreshTokens.filter(token => token !== tokenToDelete)
  res.sendStatus(204)
})

function generateAccessToken({ user }) {
  return jwt.sign({ user }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '24h' })
}

function authenticateToken(req, res, next) {

  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  if (token == null) return res.sendStatus(401)

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    console.log(err)
    if (err) return res.sendStatus(403)
    console.log(req.user, user);
    req.user = user
    next()
  })
}

var nodemailer = require("nodemailer");

let savedOTPS = {};

var smtpTransport = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  service: "Gmail",
  auth: {
    type: "OAuth2",
    user: process.env.REACT_APP_USER, // Your gmail address.
    // Not @developer.gserviceaccount.com
    clientId: process.env.REACT_APP_CLIENTID,
    clientSecret: process.env.REACT_APP_CLIENTSECRET,
    refreshToken: process.env.REACT_APP_REFRESH_TOKEN,
  },
});

app.post("/sendotp", (req, res) => {
  let email = req.body.email;
  let digits = "0123456789";
  let limit = 4;
  let otp = "";
  for (i = 0; i < limit; i++) {
    otp += digits[Math.floor(Math.random() * 10)];
  }

  var mailOptions = {
    from: process.env.REACT_APP_FROMMAIL,
    to: `${email}`,
    subject: "Verification mail to register for The Resale Bazaar fashion",
    generateTextFromHTML: true,
    html: `<b>Hello user, Please use this otp ${otp} for verification</b>`,
  };

  smtpTransport.sendMail(mailOptions, function (error, response) {
    if (error) {
      response.send("couldn't send");
    } else {
      savedOTPS[email] = otp;
      setTimeout(() => {
        delete savedOTPS.email;
      }, 60000);
      return res.json(response);
    }
    smtpTransport.close();
  });
});

app.post("/verify", (req, res) => {
  let otprecived = req.body.otp;
  let email = req.body.email;
  if (savedOTPS[email] == otprecived) {
    res.send("Verfied");
  } else {
    res.status(500).send("Invalid OTP");
  }
});

db.query(createDatabaseQuery, (err) => {
  if (err) throw err;
  db.query(useDatabaseQuery, (err) => {
    if (err) throw err;
    db.query(createAdminTableQuery, (err) => {
      if (err) throw err;
      db.query(insertAdminTableQuery, (err) => {
        if (err) throw err;
        db.query(createRegisterTableQuery, (err) => {
          if (err) throw err;
          db.query(productsList, (err) => {
            if (err) throw err;
            db.query(createSellerAccount, (err) => {
              if (err) throw err;
              db.query(cartproducts, (err) => {
                if (err) throw err;
                db.query(wishproducts, (err) => {
                  if (err) throw err;
                  db.query(contactinfo, (err) => {
                    if (err) throw err;
                    db.query(addressinfo1, (err) => {
                      if (err) throw err;
                      db.query(addressinfo2, (err) => {
                        if (err) throw err;
                        db.query(ordersproducts, (err) => {
                          if (err) throw err;
                          db.query(offeredProducts, (err) => {
                            if (err) throw err;
                            db.query(ContactData, (err) => {
                              if (err) throw err;

                         
                            db.query(ReviewsQuery, (err) => {
                              if (err) throw err;
                              console.log("Database and tables created successfully");

                                console.log("Database and tables created successfully");
                            
                            });
                          });
                          });
                        });
                      });
                    });
                  });
                });
              });
            });
          });
        });
      });
    });
  });
});

// app.post("/",(req,res)=>{
//       const accessToken = generateAccessToken({home:"home"})
//       // console.log(accessToken)
//       const refreshToken = jwt.sign({home:"home"}, process.env.REFRESH_TOKEN_SECRET)
//       refreshTokens.push(refreshToken)
//       // const token = jwt.sign({data}, secretKey, { expiresIn: '1h' });
//       return res.json({accessToken});
// });

app.post("/user", (req, res) => {
  const sql = loginCheckQuery;
  db.query(sql, [req.body.username, req.body.password], (err, data) => {
    if (err) {
      return res.json("Error");
    }
    if (data.length > 0) {
      // const accessToken = generateAccessToken({data})
      // // console.log(accessToken)
      // const refreshToken = jwt.sign({data}, process.env.REFRESH_TOKEN_SECRET)
      // refreshTokens.push(refreshToken)
      // // const token = jwt.sign({data}, secretKey, { expiresIn: '1h' });
      // return res.json({accessToken, data});
      return res.json(data);
    } else {
      return res.json("Fail");
    }
  });
});

app.post("/admin", (req, res) => {
  const sql = adminLoginQuery;
  db.query(sql, [req.body.username, req.body.password], (err, data) => {
    if (err) {
      return res.json("Error");
    }
    if (data.length > 0) {
      // const accessToken = generateAccessToken({data})
      // // console.log(accessToken)
      // const refreshToken = jwt.sign({data}, process.env.REFRESH_TOKEN_SECRET)
      // refreshTokens.push(refreshToken)
      // // const token = jwt.sign({data}, secretKey, { expiresIn: '1h' });
      // return res.json({accessToken, data});
      return res.json(data);
    } else {
      return res.json("Fail");
    }
  });
});

app.get("/admin", (req, res) => {
  const sql = retrievingAdminQuery;
  db.query(sql, (err, data) => {
    if (err) {
      return res.json("Error");
    }
    if (data.length > 0) {
      return res.json(data);
    } else {
      return res.json("Fail");
    }
  });
});

app.get("/user", (req, res) => {
  const sql = retrievingUsersQuery;
  db.query(sql, (err, data) => {
    if (err) {
      return res.json("Error");
    }
    if (data.length > 0) {
      return res.json(data);
    } else {
      return res.json("Fail");
    }
  });
});

app.post("/offers/:offerId/accept", (req, res) => {
  const { offerId } = req.params;
  const sql = updatedOfferProductAcceptedQuery;
  db.query(sql, [offerId], (err, data) => {
    if (err) {
      console.error("Error accepting offer:", err);
      return res.status(500).json({ message: "Internal server error" });
    }
    console.log("Offer accepted successfully");
    return res.json({ message: "Offer accepted successfully" });
  });
});
app.post("/offers/:offerId/reject", (req, res) => {
  const { offerId } = req.params;
  const sql = updatedOfferProductRejectQuery;
  db.query(sql, [offerId], (err, data) => {
    if (err) {
      console.error("Error rejecting offer:", err);
      return res.status(500).json({ message: "Internal server error" });
    }
    console.log("Offer rejected successfully");
    return res.json({ message: "Offer rejected successfully" });
  });
});

app.post("/offeredproducts", (req, res) => {
  const sql = offeredProductsQuery;
  const { product_id, offered_buyer_id, offered_price, product_status } = req.body;
  db.query(sql, [product_id, offered_buyer_id, offered_price, product_status], (err, data) => {
    if (err) {
      console.log(err);
      return res.json("Error");
    }
    console.log("data added successfully");
    return res.json(data);
  });
});

app.get("/offeredproducts", (req, res) => {
  const sql = retrievingOfferedProductsQuery;
  db.query(sql, (err, data) => {
    if (err) {
      return res.json("Error");
    }
    if (data.length > 0) {
      return res.json(data);
    } else {
      return res.json("Fail");
    }
  });
});

app.post("/contactseller", (req, res) => {
  const { name, email, phone, user_id, comment } = req.body; // Destructure values from req.body
  const sql = AddContactSellerQuery
  const values = [name, email, phone, user_id, comment];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("Error inserting data:", err);
      return res.status(500).json({ error: "Error inserting data" });
    }

    console.log("Data added successfully");
    return res.status(200).json({ message: "Data added successfully", data: result });
  });
});

app.get("/contactseller", (req, res) => {
  const sql = retrievingContactSellerQuery;
  db.query(sql, (err, data) => {
    if (err) {
      return res.json("Error");
    }
    if (data.length > 0) {
      return res.json(data);
    } else {
      return res.json("Fail");
    }
  });
});

app.post("/register", (req, res) => {
  const sql = addUserQuery;
  const values = req.body;
  db.query(sql, [values], (err, data) => {
    if (err) {
      console.log(err);
      return res.json("Error");
    }
    console.log("data added successfully");
    return res.json(data);
  });
});

app.post("/updateuser", (req, res) => {
  const email = req.body.email;
  const newData = req.body;
  const sql = updateUserQuery;

  db.query(sql, [newData, email], (err, data) => {
    if (err) {
      console.log(err);
      return res.json(err);
    }
    console.log("Data updated successfully");
    return res.json(data);
  });
});

app.post("/updateadmin", (req, res) => {
  const email = req.body.email;
  const newData = req.body;
  const sql = udpateAdminQuery;

  db.query(sql, [newData, email], (err, data) => {
    if (err) {
      console.log(err);
      return res.json(err);
    }
    console.log("Data updated successfully");
    return res.json(data);
  });
});

app.get("/selleraccount", (req, res) => {
  const sql = retrievingSellersQuery;
  db.query(sql, (err, data) => {
    if (err) {
      return res.json("Error");
    }
    if (data.length > 0) {
      return res.json(data);
    } else {
      return res.json("Fail");
    }
  });
});
app.post("/selleraccount", (req, res) => {
  const sql = addingSellerAccountQuery;
  const values = req.body;

  db.query(sql, [values], (err, data) => {
    if (err) {
      console.log(err);
      return res.json("Error");
    }
    console.log("data added successfully");
    return res.json(data);
  });
});

// admin to be accepted products
app.get("/adminproducts", (req, res) => {
  const sql = adminAcceptedProductsQuery;
  const accepted = ["false"];

  db.query(sql, [accepted], (err, data) => {
    if (err) {
      // console.log(err)
      return res.json("Error");
    }
    if (data.length > 0) {
      return res.json(data);
    } else {
      return res.json("Fail");
    }
  });
});

app.post("/adminaccepted", (req, res) => {
  const accepted_by_admin = req.body.accepted_by_admin;
  const id = req.body.id;
  const sql = adminApprovalQuery;

  db.query(sql, [accepted_by_admin, id], (err, data) => {
    if (err) {
      console.log(err);
      return res.json(err);
    }
    console.log("Data updated successfully");
    return res.json(data);
  });
});

app.post("/adminrejection", (req, res) => {
  const rejection_reason = req.body.rejectReason;
  const id = req.body.id;
  const sql = adminRejectionQuery;

  db.query(sql, [rejection_reason, id], (err, data) => {
    if (err) {
      console.log(err);
      return res.json(err);
    }
    console.log("Data updated successfully");
    return res.json(data);
  });
});


// all products
app.get("/allproducts", (req, res) => {
  const sql = retrievingAllProductsQuery;
  const accepted = "true";

  db.query(sql, [accepted], (err, data) => {
    if (err) {
      return res.json("Error");
    }
    if (data.length > 0) {
      return res.json(data);
    } else {
      return res.json("Fail");
    }
  });
});

app.get("/sellerproducts", (req, res) => {
  const sql = retrievingSellerProductsQuery;


  db.query(sql, (err, data) => {
    if (err) {
      return res.json("Error");
    }
    if (data.length > 0) {
      return res.json(data);
    } else {
      return res.json("Fail");
    }
  });
});
// women
app.get("/women", (req, res) => {
  const sql = retrievingWomenProductsQuery;

  const type = "women";
  const accepted = "true";

  db.query(sql, [type, accepted], (err, data) => {
    if (err) {
      return res.json("Error");
    }
    if (data.length > 0) {
      return res.json(data);
    } else {
      return res.json("Fail");
    }
  });
});

//kids
app.get("/kids", (req, res) => {
  const sql = retrievingKidsProductsQuery;

  const type = "kids";
  const accepted = "true";

  db.query(sql, [type, accepted], (err, data) => {
    if (err) {
      return res.json("Error");
    }
    if (data.length > 0) {
      return res.json(data);
    } else {
      return res.json("Fail");
    }
  });
});
//jewellery
app.get("/jewellery", (req, res) => {
  const sql = retrievingJewelleryProductsQuery;

  const type = "jewellery";
  const accepted = "true";

  db.query(sql, [type, accepted], (err, data) => {
    if (err) {
      return res.json("Error");
    }
    if (data.length > 0) {
      return res.json(data);
    } else {
      return res.json("Fail");
    }
  });
});

///books
app.get("/books", (req, res) => {
  const sql = retrievingBooksProductsQuery;

  const type = "books";
  const accepted = "true";

  db.query(sql, [type, accepted], (err, data) => {
    if (err) {
      return res.json("Error");
    }
    if (data.length > 0) {
      return res.json(data);
    } else {
      return res.json("Fail");
    }
  });
});

app.post("/updateproducts", (req, res) => {
  const { product_id, quantity } = req.body;

  // Perform the update operation in the database 
  const sql = "UPDATE products SET quantity = ? WHERE id = ?";
  db.query(sql, [quantity, product_id], (err, result) => {
    if (err) {
      console.log("Error updating product quantity:", err);
      return res.status(500).json({ success: false, error: "Failed to update product quantity" });
    }
    return res.status(200).json({ success: true, message: "Product quantity updated successfully" });
  });
});

// app.post("/updateOrder",(req, res) => {
//   const shipped_date = req.body.shipped_date;
//   const shipment_id = req.body.shipment_id;
//   const sql = "UPDATE orders SET shipped_date = ? WHERE shipment_id = ?";
//   db.query(sql, [shipped_date, shipment_id], (err, result) => {
//     if (err) {
//       console.error("Error updating order:", err);
//       res.status(500).json({ error: "Error updating order" });
//       return;
//     }
//     return res.json(result);
//   })
// })
app.post("/updateOrder", (req, res) => {
  const { shipment_id, shipped_date, delivered_date } = req.body;

  let sql;
  let values = [];

  if (shipped_date && delivered_date) {
    sql = updateOrderDeliveredandShippementQuery;
    values = [shipped_date, delivered_date, shipment_id];
  } else if (shipped_date) {
    sql = updateOrderShippmentQuery;
    values = [shipped_date, shipment_id];
  } else if (delivered_date) {
    sql = updateOrderDeliveredQuery;
    values = [delivered_date, shipment_id];
  } else {
    return res.status(400).json({ error: "No date provided for update" });
  }

  // Execute the SQL query
  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("Error updating order:", err);
      return res.status(500).json({ error: "Error updating order" });
    }
    return res.json({ success: true, message: "Order updated successfully", result });
  });
});

// add products
// app.post("/addproducts",upload.array('images', 10), (req, res) => {
//   console.log(req)
//   const images = req.files.map(file => file.filename);
//   const sql = addProductsQuery;

//   const values = [
//     req.body.producttype,
//     req.body.category,
//     req.body.productname,
//     req.body.productdescription,
//     JSON.stringify(images),
//     req.body.location,
//     req.body.color,
//     req.body.alteration,
//     req.body.size,
//     req.body.measurements,
//     req.body.condition,
//     req.body.source,
//     req.body.age,
//     req.body.language,
//     req.body.quantity,
//     req.body.price,
//     req.body.material,
//     req.body.Occasion,
//     req.body.Type,
//     req.body.Brand,
//     req.body.Product_Condition,
//     req.body.Style,
//     req.body.Season,
//     req.body.Fit,
//     req.body.Length,
//     req.body.accepted_by_admin,
//     req.body.seller_id,
//   ];

//   db.query(sql, values, (err, result) => {
//     if (err) {
//       console.error("Error while inserting product:", err);
//       return res.status(500).json({ message: "Error while inserting product" });
//     }
//     console.log("Product inserted successfully");
//     return res.status(200).json({ message: "Product inserted successfully" });
//   });
// });

// app.post('/addproducts', upload.fields([
//   { name: 'images', maxCount: 10 }, // Handle up to 10 images
//   { name: 'video', maxCount: 1 }    // Handle 1 video
// ]), (req, res) => {
//   // Handle file uploads and retrieve filenames
//   const images = req.files['images'].map(file => file.filename); // Map filenames from 'images' field
//   const video = req.files['video'] ? req.files['video'][0].filename : null; // Retrieve filename from 'video' field if exists

//   // Construct SQL query for inserting product data
//   const sql = addProductsQuery
//   const values = [
//     req.body.producttype,
//     req.body.category,
//     req.body.productname,
//     req.body.productdescription,
//     JSON.stringify({ images, video }), 
//     req.body.location,
//     req.body.color,
//     req.body.alteration,
//     req.body.size,
//     req.body.measurements,
//     req.body.condition,
//     req.body.source,
//     req.body.age,
//     req.body.quantity,
//     req.body.price,
//     req.body.material,
//     req.body.occasion,
//     req.body.type,
//     req.body.brand,
//     req.body.style,
//     req.body.season,
//     req.body.fit,
//     req.body.length,
//     req.body.accepted_by_admin,
//     req.body.seller_id
//   ];

//   // Execute SQL query to insert product data into database
//   db.query(sql, values, (err, result) => {
//     if (err) {
//       console.error("Error while inserting product:", err);
//       return res.status(500).json({ message: "Error while inserting product" });
//     }
//     console.log("Product inserted successfully");
//     return res.status(200).json({ message: "Product inserted successfully" });
//   });
// });

app.post('/addproducts', upload.array('media', 11), (req, res) => {
  const mediaFiles = req.files.map(file => file.filename); // Extract filenames from the uploaded files
  // const mediaFiles = req.files.map(file => {
  //   const uniqueFilename = `${uuidv4()}-${file.originalname}`; // Example: uuid-v4-filename.jpg
  //   return uniqueFilename;
  // });

  // Extract additional product details from the request body
  const { allMedia, ...productDetails } = req.body;

  // Construct the SQL query for inserting product data
  const sql = addProductsQuery;
  const values = [
    productDetails.producttype,
    productDetails.category,
    productDetails.productname,
    productDetails.productdescription,
    JSON.stringify(mediaFiles), // Store the combined media array as JSON string
    productDetails.location,
    productDetails.color,
    productDetails.alteration,
    productDetails.size,
    productDetails.measurements,
    productDetails.condition,
    productDetails.source,
    productDetails.age,
    productDetails.quantity,
    productDetails.price,
    productDetails.material,
    productDetails.occasion,
    productDetails.type,
    productDetails.brand,
    productDetails.style,
    productDetails.season,
    productDetails.fit,
    productDetails.length,
    productDetails.accepted_by_admin,
    productDetails.seller_id
  ];

  // Execute the SQL query to insert product data into the database
  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("Error while inserting product:", err);
      return res.status(500).json({ message: "Error while inserting product" });
    }
    console.log("Product inserted successfully");
    return res.status(200).json({ message: "Product inserted successfully" });
  });
});



app.delete("/handleproducts/:id", (req, res) => {
  const productId = req.params.id;

  // Construct the DELETE SQL query
  const query = deleteProductsQuery;

  // Execute the query with the provided product ID
  db.query(query, [productId], (error, results) => {
    if (error) {
      console.error("Error deleting product: " + error.message);
      res.status(500).send("Error deleting product");
      return;
    }

    console.log("Product deleted successfully");
    res.status(200).send("Product deleted successfully");
  });
});

app.post("/addcart", (req, res) => {
  // const productData = req.body;
  var productid;
  if (req.body.from === "wish") {
    productid = req.body.product.product_id;
  } else {
    productid = req.body.product.id;
  }

  const sql = addToCartQuery;
  const data = [
    productid,
    req.body.product.product_type,
    req.body.product.category,
    req.body.product.name,
    req.body.product.image,
    req.body.product.description,
    req.body.product.location,
    req.body.product.color,
    req.body.product.alteration,
    req.body.product.size,
    req.body.product.measurements,
    req.body.product.worn,
    req.body.product.price,
    req.body.product.accepted_by_admin,
    req.body.product.seller_id,
    req.body.product.userid,
  ];

  db.query(sql, [data], (err, result) => {
    console.log(err);
    if (err) {
      console.error("Error inserting data:", err);
      return res.status(500).send("Error adding product");
    }
    console.log("Product added successfully");
    res.send("Product added successfully");
  });
});

app.get("/addcart", (req, res) => {
  const sql = retrievingCartItemsQuery
  db.query(sql, (err, data) => {
    if (err) {
      return res.json("Error");
    }
    if (data.length > 0) {
      return res.json(data);
    } else {
      return res.json("Fail");
    }
  });
});

app.post("/editcart", (req, res) => {
  const token = req.body.token; // Assuming token contains the user's ID or email
  const cartItems = req.body.cartItems;

  // Assuming token contains the user's ID or email
  if (!token) {
    return res.status(400).json({ error: "Token is missing" });
  }

  const sql = updateCartItemsQuery;

  // Loop through each cart item and update the userid
  cartItems.forEach(cartItem => {
    const itemId = cartItem.id;

    db.query(sql, [token, itemId], (err, result) => {
      if (err) {
        console.error("Error updating data:", err);
        return res.status(500).json({ error: "Error updating cart" });
      }
      console.log("Data updated successfully");
    });
  });

  // Assuming you want to send a response after all items are updated
  return res.json({ message: "Cart updated successfully" });
});

app.delete("/products/:id", (req, res) => {
  const productId = req.params.id;

  // Construct the DELETE SQL query
  const query = deleteCartItemsQuery;

  // Execute the query with the provided product ID
  db.query(query, [productId], (error, results) => {
    if (error) {
      console.error("Error deleting product: " + error.message);
      res.status(500).send("Error deleting product");
      return;
    }

    console.log("Product deleted successfully");
    res.status(200).send("Product deleted successfully");
  });
});
app.delete("/updateorders/:id", (req, res) => {
  const productId = req.params.id;
  const orderId = req.body.orderid;

  // Construct the DELETE SQL query
  const query = deleteOrderItemsQuery;

  // Execute the query with the provided product ID
  db.query(query, [productId, orderId], (error, results) => {
    if (error) {
      console.error("Error deleting product: " + error.message);
      res.status(500).send("Error deleting product");
      return;
    }

    console.log("Product deleted successfully");
    res.status(200).send("Product deleted successfully");
  });
});

app.get("/wishlist", (req, res) => {
  const sql = retrievingWishlistItemsQuery;
  db.query(sql, (err, data) => {
    if (err) {
      return res.json("Error");
    }
    if (data.length > 0) {
      return res.json(data);
    } else {
      return res.json("Fail");
    }
  });
});

app.post("/addwishlist", (req, res) => {
  // const productData = req.body;
  const sql = addToWishlistQuery;
  const data = [
    req.body.id,
    req.body.product_type,
    req.body.category,
    req.body.name,
    req.body.image,
    req.body.description,
    req.body.location,
    req.body.color,
    req.body.alteration,
    req.body.size,
    req.body.measurements,
    req.body.worn,
    req.body.price,
    req.body.accepted_by_admin,
    req.body.seller_id,
    req.body.userid,
  ];

  db.query(sql, [data], (err, result) => {
    console.log(err);
    if (err) {
      console.error("Error inserting data:", err);
      return res.status(500).send("Error adding product");
    }
    res.send("Product added successfully");
  });
});

app.delete("/wishlist/:id", (req, res) => {
  const productId = req.params.id;

  // Construct the DELETE SQL query
  const query = deleteWishlistItemsQuery;

  // Execute the query with the provided product ID
  db.query(query, [productId], (error, results) => {
    if (error) {
      console.error("Error deleting product: " + error.message);
      res.status(500).send("Error deleting product");
      return;
    }
    res.status(200).send("Product deleted successfully");
  });
});

app.get("/contact", (req, res) => {
  const sql = retrieveContactusQuery;

  db.query(sql, (err, data) => {
    if (err) {
      return res.json("Error");
    }
    if (data.length > 0) {
      return res.json(data);
    } else {
      return res.json("Fail");
    }
  });
});

app.post("/contact", (req, res) => {
  const sql = addContactusQuery;
  const values = [req.body.name, req.body.email, req.body.enquiry];
  db.query(sql, [values], (err, data) => {
    if (err) {
      console.log(err);
      return res.json("Error");
    }
    console.log("data added successfully");
    return res.json(data);
  });
});

app.post("/saveBillingAddress", (req, res) => {
  const { firstname, lastname, email, country, state, city, address1, address2, pincode, phone } = req.body.billingAddress;
  const token = req.body.token

  const sql = addBillingAddress;

  const values = [firstname, lastname, email, country, state, city, address1, address2, pincode, phone, token];
  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("Error saving billing address:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
    console.log("Billing address saved successfully");
    return res.status(200).json({ message: "Billing address saved successfully" });
  });
});

app.get("/saveBillingAddress", (req, res) => {
  const sql = getbillingAddress;



  db.query(sql, (err, data) => {
    if (err) {
      return res.json("Error");
    }
    if (data.length > 0) {
      return res.json(data);
    } else {
      return res.json("Fail");
    }
  });
});



app.post("/saveShippingAddress", (req, res) => {
  const { firstname, lastname, email, country, state, city, address1, address2, pincode, phone } = req.body.shippingAddress;
  const token = req.body.token
  // Assuming the token contains the user ID

  const sql = addShippingAddress;
  const values = [firstname, lastname, email, country, state, city, address1, address2, pincode, phone, token];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("Error saving shipping address:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
    console.log("Shipping address saved successfully");
    return res.status(200).json({ message: "Shipping address saved successfully" });
  });
});




app.get("/saveShippingAddress", (req, res) => {
  const sql = getshippingAddress;

  db.query(sql, (err, data) => {
    if (err) {
      return res.json("Error");
    }
    if (data.length > 0) {
      return res.json(data);
    } else {
      return res.json("Fail");
    }
  });
});

app.put('/saveShippingAddress/:id', (req, res) => {
  const id = req.params.id;
  const { firstname, lastname, email, country, state, city, address1, address2, pincode, phone } = req.body;

  const sql = updateShippingAddress;
  const values = [firstname, lastname, email, country, state, city, address1, address2, pincode, phone, id];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('Error updating shipping address:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    console.log('Shipping address updated successfully');
    return res.status(200).json({ message: 'Shipping address updated successfully' });
  });
});

app.delete('/saveShippingAddress/:id', (req, res) => {
  const id = req.params.id;
  const sql = deleteShippingAddress;

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error('Error deleting shipping address:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    console.log('Shipping address deleted successfully');
    return res.status(200).json({ message: 'Shipping address deleted successfully' });
  });
});

app.post("/updatepayment", (req, res) => {
  const payment_status = req.body.payment_status;
  const token = parseInt(req.body.token); // Ensure that token is parsed as an integer
  const { shipment_id, order_id, ordered_date, shipped_date, delivered_date } = req.body;

  // Insert into orders table
  const insertOrderSql = paymentStatusQuery;
  db.query(insertOrderSql, [req.body.product_id, payment_status, token, shipment_id, order_id, ordered_date, shipped_date, delivered_date], (err, result) => {
    if (err) {
      console.error("Error inserting into orders table:", err);
      return res.status(500).json({ error: "Error updating payment status" });
    }
    console.log("Payment status updated successfully for product with ID:");

    // Delete entries from cart table where userid matches buyer_id in orders table
    const deleteCartSql = deletecartitemQuery;
    db.query(deleteCartSql, [token, token], (err, deleteResult) => {
      if (err) {
        console.error("Error deleting from cart table:", err);
        return res.status(500).json({ error: "Error deleting cart items" });
      }
      console.log("Cart items removed successfully");
      return res.status(200).json({ success: true, message: "Payment status updated and corresponding cart items deleted successfully" });
    });
  });
});

app.get("/updatepayment", (req, res) => {
  const sql = "Select * from orders";

  db.query(sql, (err, data) => {
    if (err) {
      return res.json("Error");
    }
    if (data.length > 0) {
      return res.json(data);
    } else {
      return res.json("Fail");
    }
  });
});

app.put('/:productId/allproducts', (req, res) => {
  const productId = req.params.productId;
  const { likeCount } = req.body; // Assuming likeCount is sent in the request body

  // Update like count in your database
  const sql = 'UPDATE products SET likes = ? WHERE id = ?';
  const values = [likeCount, productId];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('Error updating like count:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    console.log('Like count updated successfully');
    return res.status(200).json({ message: 'Like count updated successfully' });
  });
});


app.post('/reviews', upload.array('images', 5), (req, res) => {
  const { rating, description, title ,sellerId ,buyerId} = req.body;
  const images = req.files.map(file => file.filename); // Extract filenames from the uploaded files
  const createdAt = new Date(); 
  const updatedAt = new Date();
  const query = 'INSERT INTO review (rating, description, title, images ,seller_id,buyer_id,created_at, updated_at) VALUES (?, ?, ?, ?,?,?,?,?)';
  db.query(query, [rating, description, title, JSON.stringify(images),sellerId,buyerId,createdAt, updatedAt], (err, result) => {
    if (err) {
      console.error('Error inserting review:', err);
      res.status(500).send({ message: 'Error inserting review' });
      return;
    }
    res.send({ message: 'Review added successfully', reviewId: result.insertId });
  });
});



app.get('/reviews', (req, res) => {
  const query = `
    SELECT 
      review.*, 
      register.firstname, 
      register.lastname
    FROM 
      review
    INNER JOIN 
      register 
    ON 
      review.buyer_id = register.user_id;
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching reviews:', err);
      res.status(500).send({ message: 'Error fetching reviews' });
      return;
    }

    const reviews = results.map(review => ({
      ...review,
      images: JSON.parse(review.images),
    }));

    res.send(reviews);
  });
});





// payment
// Replace these with your PayPal Sandbox API credentials
paypal.configure({
  mode: "sandbox",
  client_id: process.env.REACT_APP_PAYPAL_CLIENTID,
  client_secret: process.env.REACT_APP_PAYPAL_CLIENTSECRET,
});

app.post("/createPayment", (req, res) => {
  const cartItems = req.body.cartItems;
  const items = cartItems.map((item) => ({
    name: item.name,
    amount: item.price,
    currency: "USD",
  }));
  // console.log(items)
  const create_payment_json = {
    intent: "sale",
    payer: {
      payment_method: "paypal",
    },

    redirect_urls: {
      return_url: `${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/success`,
      cancel_url: `${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/cancel`,
    },
    transactions: [
      {
        item_list: {
          name: items.name,
        },
        amount: {
          currency: "USD",
          total: cartItems
            .reduce((sum, item) => sum + item.price, 0)
            .toFixed(2),
        },
        description: "Purchase from Shopping Cart.",
      },
    ],
  };

  paypal.payment.create(create_payment_json, (error, payment) => {
    if (error) {
      console.error(
        "Error creating payment:",
        error.response ? error.response.details : error.message
      );
      res.status(500).json({ error: "Error creating payment" });
    } else {
      for (let i = 0; i < payment.links.length; i++) {
        if (payment.links[i].rel === "approval_url") {
          res.json({ redirectUrl: payment.links[i].href });
          return;
        }
      }
      res.status(500).json({ error: "Approval URL not found" });
    }
  });
});

app.get("/success", (req, res) => {
  const payerId = req.query.PayerID;
  const paymentId = req.query.paymentId;

  const execute_payment_json = {
    payer_id: payerId,
  };

  paypal.payment.execute(
    paymentId,
    execute_payment_json,
    function (error, payment) {
      if (error) {
        console.error(
          "Error executing payment:",
          error.response ? error.response.details : error.message
        );
        res.status(500).send("Error executing payment");
      } else {

        res.redirect(`${process.env.REACT_APP_HOST}3000/Resale-bazaar/finalcheckoutpage`);
      }
    }
  );
});

app.get("/cancel", (req, res) => {

  res.redirect(`${process.env.REACT_APP_HOST}3000/Resale-bazaar/`);
});

app.listen(process.env.REACT_APP_PORT, () => {
  console.log("listening");
});
