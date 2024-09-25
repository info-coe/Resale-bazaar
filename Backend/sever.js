const express = require("express");
const jwt = require("jsonwebtoken");
const db = require("./db");
const paypal = require("paypal-rest-sdk");
const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY)
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
  GuestBillingAddressQuery,
  GuestShippingAddressQuery,
  GuestOrderQuery,
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
  retrievingAllProductsQueryAll,
  retrievingWomenProductsQuery,
  retrievingWomenProductsQueryAll,
  retrievingKidsProductsQuery,
  retrievingKidsProductsQueryAll,
  retrievingJewelleryProductsQuery,
  retrievingJewelleryProductsQueryAll,
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
  ReviewsQuery,
  updateProductQuery,
  googleLoginQuery,
  updateProductQtyQuery,
  ordersQuery,
  addReviewsQuery,
  reviewsRetrivingJoinQuery,
  shipmentRetrivingJoinQuery,
  offergetQuery,
  fetchFindImagesQuery,
  productsUpdateQuery,
  LikesQuery,
  removeLikeQuery,
  addLikeQuery,
  LikecountQuery,
  checkLikeQuery,
  cancelorderitemQuery,
  updateCartItemsQuantity,
  updateCartItemsQuantityQuery,
  RefundDetailsQuery,
  guestShippingAddress,
  guestBillingAddress,
  guestpaymentStatusQuery,
  userManagementQuery,
  UpdateShopStatusQuery
} = require("./queries");
const cors = require("cors");
const multer = require("multer");
const multerS3 = require("multer-s3");
const path = require("path");
const app = express();
app.use(cors("*"));
app.use(express.json());
app.use(express.static("public"));
const secretKey = "yourSecretKey";
const { v4: uuidv4 } = require("uuid");
const AWS = require("aws-sdk");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const { Upload } = require("@aws-sdk/lib-storage");

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWS_S3_BUCKET_NAME,
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      const filename = `${file.originalname.split(".")[0]}_${uuidv4()}.${file.mimetype.split("/")[1]
        }`;
      cb(null, filename);
    },
  }),
});

// CORS middleware
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  next();
});
app.use(express.json());

let refreshTokens = [];

app.post("/token", (req, res) => {
  const refreshToken = req.body.token;
  if (refreshToken == null) return res.sendStatus(401);
  if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403);
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    const accessToken = generateAccessToken({ name: user.name });
    res.json({ accessToken: accessToken });
  });
});

app.delete("/logout", (req, res) => {
  const tokenToDelete = req.headers["token"];
  refreshTokens = refreshTokens.filter((token) => token !== tokenToDelete);
  res.sendStatus(204);
});

function generateAccessToken({ user }) {
  return jwt.sign({ user }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "24h",
  });
}

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    // console.log(err);
    if (err) return res.sendStatus(403);
    // console.log(req.user, user);
    req.user = user;
    next();
  });
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
    subject: "Verification mail from The Resale Bazaar",
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
      // return res.json(response);
      return res.status(200).json({ message: 'OTP sent' });
    }
    // smtpTransport.close();
  });
});

// app.post("/verify", (req, res) => {
//   let otprecived = req.body.otp;
//   let email = req.body.email;
//   if (savedOTPS[email] == otprecived) {
//     res.send("Verfied");
//   } else {
//     res.status(500).send("Invalid OTP");
//   }
// });


app.post("/verify", (req, res) => {
  const otpReceived = req.body.otp;
  const email = req.body.email;

  if (savedOTPS[email] === otpReceived) {
    res.sendStatus(200); // OTP is valid
  } else {
    res.status(400).send("Invalid OTP"); // OTP is invalid
  }
});

const sendPurchaseConfirmationEmail = (email, subject, message) => {
  const mailOptions = {
    from: process.env.REACT_APP_FROMMAIL,
    to: email,
    subject: subject,
    generateTextFromHTML: true,
    html: message,
  };

  return smtpTransport.sendMail(mailOptions);
};
const sendStatusUpdateEmail  = (email, subject, message) => {
  const mailOptions = {
    from: process.env.REACT_APP_FROMMAIL,
    to: email,
    subject: subject,
    generateTextFromHTML: true,
    html: message,
  };

  return smtpTransport.sendMail(mailOptions);
};
const getUserById = (userId) => {
  return new Promise((resolve, reject) => {
    const query = "SELECT email FROM register WHERE user_id = ?";
    db.query(query, [userId], (error, results) => {
      if (error) {
        return reject(error);
      }
      if (results.length === 0) {
        return reject(new Error('User not found'));
      }
      resolve(results[0]);
    });
  });
};

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
                                db.query(LikesQuery, (err) => {
                                  if (err) throw err;
                                    db.query(GuestBillingAddressQuery, (err) => {
                                      if (err) throw err;
                                      db.query(GuestShippingAddressQuery, (err) => {
                                        if (err) throw err;
                                        db.query(GuestOrderQuery, (err) => {
                                          if (err) throw err;
                                          console.log(
                                            "Database and tables created successfully"
                                          );
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

app.post("/googleLogin", (req, res) => {
  const sql = googleLoginQuery;
  db.query(sql, [req.body.username], (err, data) => {
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

app.post("/user", (req, res) => {
  const sql = loginCheckQuery;
  db.query(sql, [req.body.username, req.body.password], (err, data) => {
    if (err) {
      return res.json("Error");
    }
    if (data.length > 0) {
      const accessToken = generateAccessToken({data})
      // console.log(accessToken)
      const refreshToken = jwt.sign({data}, process.env.REFRESH_TOKEN_SECRET)
      refreshTokens.push(refreshToken)
      // const token = jwt.sign({data}, secretKey, { expiresIn: '1h' });
      return res.json({accessToken, data});
      // return res.json(data);
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
      const accessToken = generateAccessToken({data})
      // console.log(accessToken)
      const refreshToken = jwt.sign({data}, process.env.REFRESH_TOKEN_SECRET)
      refreshTokens.push(refreshToken)
      // const token = jwt.sign({data}, secretKey, { expiresIn: '1h' });
      return res.json({accessToken, data});
      // return res.json(data);
    } else {
      return res.json("Fail");
    }
  });
});

app.get("/admin",authenticateToken, (req, res) => {
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

app.get("/user",authenticateToken, (req, res) => {
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
app.get("/registedusers", (req, res) => {
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
app.post("/users", (req, res) => {
  const sql = "select * from register where user_id = ?";
  db.query(sql, [parseInt(req.body.sellerID)], (err, data) => {
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
  const { product_id, offered_buyer_id, offered_price, product_status } =
    req.body;
  db.query(
    sql,
    [product_id, offered_buyer_id, offered_price, product_status],
    (err, data) => {
      if (err) {
        console.log(err);
        return res.json("Error");
      }
      console.log("data added successfully");
      return res.json(data);
    }
  );
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
  const sql = AddContactSellerQuery;
  const values = [name, email, phone, user_id, comment];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("Error inserting data:", err);
      return res.status(500).json({ error: "Error inserting data" });
    }

    console.log("Data added successfully");
    return res
      .status(200)
      .json({ message: "Data added successfully", data: result });
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
app.get("/allproductsall", (req, res) => {
  const page = parseInt(req.query.page) || 1; // Default to page 1 if not provided
  const limit = parseInt(req.query.limit) || 8; // Default to 8 if not provided
  const offset = (page - 1) * limit;
  const type = req.query.category;
  const accepted = "true";
  const storestatus = "enabled"
  const sql = retrievingAllProductsQueryAll;



  db.query(sql, [accepted,storestatus,type,limit,offset], (err, data) => {
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

app.get("/allproducts", (req, res) => {
  
  const accepted = "true";
  const storestatus = "enabled"

  const sql = retrievingAllProductsQuery;



  db.query(sql, [accepted,storestatus], (err, data) => {
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

app.get("/sellerproductsoffers", (req, res) => {
  const sql = offergetQuery;
  const storestatus = "enabled"

  db.query(sql,[storestatus] ,(err, data) => {
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
  const page = parseInt(req.query.page) || 1; // Default to page 1 if not provided
  const limit = parseInt(req.query.limit) || 8; // Default to 8 if not provided
  const offset = (page - 1) * limit;
  const type = req.query.category;
  const accepted = "true";
  const storestatus = "enabled"


  const sql = retrievingWomenProductsQuery;


  db.query(sql, [type, accepted,storestatus, limit, offset], (err, data) => {
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
//womenall
app.get("/womenall", (req, res) => {
  //  console.log(req)
  const page = parseInt(req.query.page) || 1; // Default to page 1 if not provided
  const limit = parseInt(req.query.limit) || 8; // Default to 8 if not provided
  const offset = (page - 1) * limit;
  const type = req.query.category;
  const accepted = "true";
  const storestatus = "enabled"
  const sql = retrievingWomenProductsQueryAll;


  db.query(sql, [type, accepted,storestatus, limit, offset], (err, data) => {
    // console.log(res.json(data))
    if (err) {
      return res.json("Error");
    }
    if (data.length > 0) {
      return res.json(data);
      // console.log(res.json(data))
    } else {
      return res.json("Fail");
    }
  });
});
//kids
app.get("/kids", (req, res) => {
  //  console.log(req)
  const page = parseInt(req.query.page) || 1; // Default to page 1 if not provided
  const limit = parseInt(req.query.limit) || 8; // Default to 8 if not provided
  const offset = (page - 1) * limit;
  const type = req.query.category;
  const accepted = "true";
  const storestatus = "enabled"

  const sql = retrievingKidsProductsQuery;

  db.query(sql, [type, accepted,storestatus, limit, offset], (err, data) => {
    // console.log(res.json(data))
    if (err) {
      return res.json("Error");
    }
    if (data.length > 0) {
      return res.json(data);
      // console.log(res.json(data))
    } else {
      return res.json("Fail");
    }
  });
});
//kidsAll
app.get("/kidsall", (req, res) => {
  //  console.log(req)
  const page = parseInt(req.query.page) || 1; // Default to page 1 if not provided
  const limit = parseInt(req.query.limit) || 8; // Default to 8 if not provided
  const offset = (page - 1) * limit;
  const type = req.query.category;
  const accepted = "true";
  const storestatus = "enabled"
  const sql = retrievingKidsProductsQueryAll;

  db.query(sql, [type, accepted,storestatus, limit, offset], (err, data) => {
    // console.log(res.json(data))
    if (err) {
      return res.json("Error");
    }
    if (data.length > 0) {
      return res.json(data);
      // console.log(res.json(data))
    } else {
      return res.json("Fail");
    }
  });
});
//jewellery
app.get("/jewellery", (req, res) => {
  const page = parseInt(req.query.page) || 1; // Default to page 1 if not provided
  const limit = parseInt(req.query.limit) || 8; // Default to 8 if not provided
  const offset = (page - 1) * limit;
  const type = req.query.category;
  const accepted = "true";
  const storestatus = "enabled"

  const sql = retrievingJewelleryProductsQuery;

  db.query(sql, [type, accepted,storestatus, limit, offset], (err, data) => {
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
app.get("/jewelleryall", (req, res) => {
  //  console.log(req)
  const page = parseInt(req.query.page) || 1; // Default to page 1 if not provided
  const limit = parseInt(req.query.limit) || 8; // Default to 8 if not provided
  const offset = (page - 1) * limit;
  const type = req.query.category;
  const accepted = "true";
  const storestatus = "enabled"
  const sql = retrievingJewelleryProductsQueryAll;


  db.query(sql, [type, accepted,storestatus, limit, offset], (err, data) => {
    // console.log(res.json(data))
    if (err) {
      return res.json("Error");
    }
    if (data.length > 0) {
      return res.json(data);
      // console.log(res.json(data))
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
  const sql = updateProductQtyQuery;
  db.query(sql, [quantity, product_id], (err, result) => {
    if (err) {
      console.log("Error updating product quantity:", err);
      return resupdateproducts
        .status(500)
        .json({ success: false, error: "Failed to update product quantity" });
    }
    return res
      .status(200)
      .json({
        success: true,
        message: "Product quantity updated successfully",
      });
  });
});

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
    return res.json({
      success: true,
      message: "Order updated successfully",
      result,
    });
  });
});

// add products
app.post("/addproducts", upload.array("media", 11), (req, res) => {
  try {
    const mediaFiles = req.files.map((file) => {
      const urlParts = file.location.split("/");
      const bucketName = urlParts[2].split(".")[0];
      return `https://${bucketName}.s3.amazonaws.com/${urlParts
        .slice(3)
        .join("/")}`;
    });

    const { allMedia, ...productDetails } = req.body;

    const sql = addProductsQuery; // Ensure this query is properly defined
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
      productDetails.notes,
      productDetails.material,
      productDetails.Occasion,
      productDetails.Type,
      productDetails.Brand,
      productDetails.Style,
      productDetails.Season,
      productDetails.Fit,
      productDetails.Length,
      productDetails.accepted_by_admin,
      productDetails.seller_id,
    ];

    db.query(sql, values, (err, result) => {
      if (err) {
        console.error("Error while inserting product:", err);
        return res
          .status(500)
          .json({ message: "Error while inserting product" });
      }
      console.log("Product inserted successfully");
      return res.status(200).json({ message: "Product inserted successfully" });
    });
  } catch (error) {
    console.error("Error in /addproducts route:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

app.put("/handleproducts/:id", upload.array("images", 6), (req, res) => {
  const id = req.params.id;
  // console.log(req.body)
  const {
    name,
    price,
    description,
    location,
    color,
    alteration,
    size,
    measurements,
    condition,
    age,
    quantity,
    occasion,
    material,
    brand,
    type,
    style,
    fit,
    length,
    season,
    notes,
    accepted_by_admin,
  } = req.body;

  const deletedImages = JSON.parse(req.body.deletedImages || "[]");

  // Fetch existing images from the database
  const fetchSql = fetchFindImagesQuery;
  db.query(fetchSql, [id], (err, result) => {
    if (err) {
      console.error("Error fetching existing images:", err);
      return res.status(500).json({ error: "Internal server error" });
    }

    // Parse existing images
    let existingImages = [];
    if (result.length > 0 && result[0].image) {
      existingImages = JSON.parse(result[0].image);
    }

    // Handle uploaded images
    const newImages = req.files.map((file) => {
      const urlParts = file.location.split("/");
      const bucketName = urlParts[2].split(".")[0];
      return `https://${bucketName}.s3.amazonaws.com/${urlParts
        .slice(3)
        .join("/")}`;
    });

    // Filter out deleted images from existing images
    let updatedImages = existingImages.filter(
      (image) => !deletedImages.includes(image)
    );

    // Combine existing images with new images
    updatedImages = [...updatedImages, ...newImages];

    // Construct your SQL query for updating product details
    const updateSql = productsUpdateQuery;

    const values = [
      name,
      price,
      description,
      location,
      color,
      alteration,
      size,
      measurements,
      condition,
      age,
      quantity,
      occasion,
      material,
      brand,
      type,
      style,
      fit,
      length,
      season,
      notes,
      accepted_by_admin,
      JSON.stringify(updatedImages),
      id,
    ];

    // Execute the SQL query to update product details
    db.query(updateSql, values, (err, result) => {
      if (err) {
        console.error("Error updating product:", err);
        return res.status(500).json({ error: "Internal server error" });
      }

      console.log("Product updated successfully");
      return res.status(200).json({ message: "Product updated successfully" });
    });
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
  var productid;
  if (req.body.from === "wish") {
    productid = req.body.product.product_id;
  } else {
    productid = req.body.product.id;
  }

  const sql = addToCartQuery; // Ensure this query is set up to handle the new quantity
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
    req.body.product.quantity, // Make sure quantity is included
    req.body.product.price,
    req.body.product.accepted_by_admin,
    req.body.product.seller_id,
    req.body.product.userid,
  ];

  db.query(sql, [data], (err, result) => {
    if (err) {
      console.error("Error inserting data:", err);
      return res.status(500).send("Error adding product");
    }
    console.log("Product added successfully");
    res.send("Product added successfully");
  });
});

app.get("/addcart", (req, res) => {
  const sql = retrievingCartItemsQuery;
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
  cartItems.forEach((cartItem) => {
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

app.put("/updateorders/:id", (req, res) => {
  const productId = req.params.id;
  const { order_status, refundable_amount, cancel_reason, cancel_comment } = req.body.data;

  const updateOrderStatusQuery = cancelorderitemQuery;

  db.query(updateOrderStatusQuery, [order_status, refundable_amount, cancel_reason, cancel_comment, productId], (error, results) => {
    if (error) {
      console.error("Error updating order status: " + error.message);
      res.status(500).send("Error updating order status");
      return;
    }

    console.log("Order status updated successfully");
    res.status(200).send("Order status updated successfully");
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
  const {
    firstname,
    lastname,
    email,
    country,
    state,
    city,
    address1,
    address2,
    pincode,
    phone,
  } = req.body.billingAddress;
  const token = req.body.token;

  const sql = addBillingAddress;

  const values = [
    firstname,
    lastname,
    email,
    country,
    state,
    city,
    address1,
    address2,
    pincode,
    phone,
    token,
  ];
  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("Error saving billing address:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
    console.log("Billing address saved successfully");
    return res
      .status(200)
      .json({ message: "Billing address saved successfully" });
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
  const {
    firstname,
    lastname,
    email,
    country,
    state,
    city,
    address1,
    address2,
    pincode,
    phone,
  } = req.body.shippingAddress;
  const token = req.body.token;
  // Assuming the token contains the user ID

  const sql = addShippingAddress;
  const values = [
    firstname,
    lastname,
    email,
    country,
    state,
    city,
    address1,
    address2,
    pincode,
    phone,
    token,
  ];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("Error saving shipping address:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
    console.log("Shipping address saved successfully");
    return res
      .status(200)
      .json({ message: "Shipping address saved successfully" });
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

app.put("/saveShippingAddress/:id", (req, res) => {
  const id = req.params.id;
  const {
    firstname,
    lastname,
    email,
    country,
    state,
    city,
    address1,
    address2,
    pincode,
    phone,
  } = req.body;

  const sql = updateShippingAddress;
  const values = [
    firstname,
    lastname,
    email,
    country,
    state,
    city,
    address1,
    address2,
    pincode,
    phone,
    id,
  ];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("Error updating shipping address:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
    console.log("Shipping address updated successfully");
    return res
      .status(200)
      .json({ message: "Shipping address updated successfully" });
  });
});

app.delete("/saveShippingAddress/:id", (req, res) => {
  const id = req.params.id;
  const sql = deleteShippingAddress;

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("Error deleting shipping address:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
    console.log("Shipping address deleted successfully");
    return res
      .status(200)
      .json({ message: "Shipping address deleted successfully" });
  });
});

// Guest Billing Address
app.post("/guestBillingAddress", (req, res) => {
  const {
    firstname,
    lastname,
    email,
    country,
    state,
    city,
    address1,
    address2,
    pincode,
    phone,
  } = req.body.billingAddress;

  const sql = guestBillingAddress;

  const values = [
    firstname,
    lastname,
    email,
    country,
    state,
    city,
    address1,
    address2,
    pincode,
    phone,
  ];
  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("Error saving billing address:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
    console.log("Billing address saved successfully");
    return res
      .status(200)
      .json({ message: "Billing address saved successfully" });
  });
});

// Guest shipping Address
app.post("/guestShippingAddress", (req, res) => {
  const {
    firstname,
    lastname,
    email,
    country,
    state,
    city,
    address1,
    address2,
    pincode,
    phone,
  } = req.body.shippingAddress;

  const sql = guestShippingAddress;
  const values = [
    firstname,
    lastname,
    email,
    country,
    state,
    city,
    address1,
    address2,
    pincode,
    phone
  ];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("Error saving shipping address:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
    console.log("Shipping address saved successfully");
    return res
      .status(200)
      .json({ message: "Shipping address saved successfully" });
  });
});

app.post("/guestupdatepayment", (req, res) => {
  // Check if req.body is an array or object
  const paymentUpdates = Array.isArray(req.body) ? req.body : [req.body];
  
  paymentUpdates.forEach((update) => {
    const {
      product_id,
      payment_status,
      shipment_id,
      order_id,
      ordered_date,
      shipped_date,
      delivered_date,
      order_quantity,
      order_status,
      order_amount,
      customer_first_name,
      customer_last_name,
      customer_email,
      customer_phone,
      product_name,
      seller_ID,
    } = update;
    // Insert into orders table
    const insertOrderSql = guestpaymentStatusQuery; // Replace with your actual query
    db.query(
      insertOrderSql,
      [
        product_id,
        payment_status,
        shipment_id,
        order_id,
        ordered_date,
        shipped_date,
        delivered_date,
        order_quantity,
        order_status,
        order_amount,
        customer_first_name,
        customer_last_name,
        customer_email,
        customer_phone,
      ],
      async (err, result) => {
        if (err) {
          console.error("Error inserting into orders table:", err);
          return res.status(500).json({ error: "Error updating payment status" });
        }
        console.log("Payment status updated successfully for product with ID:", product_id);
        try {
          const seller = await getUserById(seller_ID);

          const buyerEmail = customer_email;
          const sellerEmail = seller.email;

          // Send purchase confirmation email to buyer
          await sendPurchaseConfirmationEmail(
            buyerEmail,
            "Purchase Confirmation from The Resale Bazaar",
            `Thank you for your purchase! Your order for <b>${product_name}</b> has been placed successfully.`
          );
          console.log("Purchase confirmation email sent to buyer successfully");

          // Send product purchased notification email to seller
          await sendPurchaseConfirmationEmail(
            sellerEmail,
            "Your Product Has Been Purchased",
            `Your product <b>${product_name}</b> has been purchased successfully.`
          );
          console.log("Purchase notification email sent to seller successfully");
        } catch (error) {
          console.error("Error sending purchase confirmation email:", error);
        }
      }
    );
  });

  res.status(200).json({ message: 'Payment status updates processed successfully' });
});

app.post("/updatepayment", (req, res) => {
  const payment_status = req.body.payment_status;
  const token = parseInt(req.body.token); // Ensure that token is parsed as an integer
  // console.log(req.body)
  const {
    shipment_id,
    order_id,
    ordered_date,
    shipped_date,
    delivered_date,
    order_quantity,
    order_status,
    order_amount,
    payment_intent_id,
    refundstatus,
    product_id,
    product_name,
    seller_id
  } = req.body;

  // Insert into orders table
  const insertOrderSql = paymentStatusQuery;
  db.query(
    insertOrderSql,
    [
      product_id,
      payment_status,
      token,
      shipment_id,
      order_id,
      ordered_date,
      shipped_date,
      delivered_date,
      order_quantity,
      order_status,
      order_amount,
      payment_intent_id,
      refundstatus
    ],
    async (err, result) => {
      if (err) {
        console.error("Error inserting into orders table:", err);
        return res.status(500).json({ error: "Error updating payment status" });
      }
      console.log("Payment status updated successfully for product with ID:", product_id);

      // Delete entries from cart table where userid matches buyer_id in orders table
      const deleteCartSql = deletecartitemQuery;
      db.query(deleteCartSql, [token, token], async (err, deleteResult) => {
        if (err) {
          console.error("Error deleting from cart table:", err);
          return res.status(500).json({ error: "Error deleting cart items" });
        }
        console.log("Cart items removed successfully");

        try {
          // Fetch buyer's email from database based on token or user ID
          const user = await getUserById(token);
          // Fetch seller's email based on seller ID
          const seller = await getUserById(seller_id);

          const buyerEmail = user.email;
          const sellerEmail = seller.email;

          // Send purchase confirmation email to buyer
          await sendPurchaseConfirmationEmail(
            buyerEmail,
            "Purchase Confirmation from The Resale Bazaar",
            `Thank you for your purchase! Your order for <b>${product_name}</b> has been placed successfully.`
          );
          console.log("Purchase confirmation email sent to buyer successfully");

          // Send product purchased notification email to seller
          await sendPurchaseConfirmationEmail(
            sellerEmail,
            "Your Product Has Been Purchased",
            `Your product <b>${product_name}</b> has been purchased successfully.`
          );
          console.log("Purchase notification email sent to seller successfully");
        } catch (error) {
          console.error("Error sending purchase confirmation email:", error);
        }

        return res.status(200).json({
          success: true,
          message: "Payment status updated, cart items deleted, and emails sent successfully",
        });
      });
    }
  );
});


app.get("/updatepayment", (req, res) => {
  const sql = ordersQuery;

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

app.put("/:productId/updateQuantityAndPrice", (req, res) => {
  const productId = req.params.productId;
  const { quantity } = req.body; // Assuming quantity and price are sent in the request body
  console.log(req.body);
  // Update quantity and price in your database
  const sql = updateCartItemsQuantityQuery;
  const values = [quantity, productId];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("Error updating quantity and price:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
    console.log("Quantity and price updated successfully");
    return res
      .status(200)
      .json({ message: "Quantity and price updated successfully" });
  });
});

app.post("/reviews", upload.array("images", 5), (req, res) => {
  const { rating, description, title, sellerId, buyerId } = req.body;
  // const images = req.files.map(file => file.filename); // Extract filenames from the uploaded files
  try {
    const mediaFiles = req.files.map((file) => {
      const urlParts = file.location.split("/");
      const bucketName = urlParts[2].split(".")[0];
      return `https://${bucketName}.s3.amazonaws.com/${urlParts
        .slice(3)
        .join("/")}`;
    });
    const createdAt = new Date();
    const updatedAt = new Date();
    const query = addReviewsQuery;
    db.query(
      query,
      [
        rating,
        description,
        title,
        JSON.stringify(mediaFiles),
        sellerId,
        buyerId,
        createdAt,
        updatedAt,
      ],
      (err, result) => {
        if (err) {
          console.error("Error inserting review:", err);
          res.status(500).send({ message: "Error inserting review" });
          return;
        }
        res.send({
          message: "Review added successfully",
          reviewId: result.insertId,
        });
      }
    );
  } catch (error) {
    console.error("Error in /reviews route:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

app.get("/reviews", (req, res) => {
  const query = reviewsRetrivingJoinQuery;

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching reviews:", err);
      res.status(500).send({ message: "Error fetching reviews" });
      return;
    }

    const reviews = results.map((review) => ({
      ...review,
      images: JSON.parse(review.images),
    }));

    res.send(reviews);
  });
});
app.get("/shipmentjoin", (req, res) => {
  const query = shipmentRetrivingJoinQuery;

  db.query(query, (err, data) => {
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

app.post("/products/:productId/likes", (req, res) => {
  const { productId } = req.params;
  const { like_userID, likes, action } = req.body;

  const sql = addLikeQuery;
  const sql2 = removeLikeQuery;

  if (action === "liked") {
    // Add the like
    db.query(
      sql,
      [productId, like_userID, likes],
      (insertErr, insertResults) => {
        if (insertErr) {
          console.error("Error adding like:", insertErr);
          return res.status(500).json({ error: "Server error" });
        }
        res.json({ action: "liked", likeCount: likes });
      }
    );
  } else if (action === "unliked") {
    // Remove the like
    db.query(sql2, [productId, like_userID], (delErr, delResults) => {
      if (delErr) {
        console.error("Error removing like:", delErr);
        return res.status(500).json({ error: "Server error" });
      }
      res.json({ action: "unliked", likeCount: likes });
    });
  }
});

app.get("/products/:productId/likes", (req, res) => {
  const { productId } = req.params;
  const sql = LikecountQuery;

  db.query(sql, [productId], (err, result) => {
    if (err) {
      console.error("Error fetching like count:", err);
      return res.status(500).send("Error fetching like count");
    }
    const likeCount = result[0].likeCount;
    res.json({ likeCount });
  });
});

app.get("/products/:productId/likes/user", (req, res) => {
  const { productId } = req.params;
  const { userId } = req.query;
  const sql = checkLikeQuery;
  db.query(sql, [productId, userId], (err, results) => {
    if (err) {
      console.error("Error checking if liked:", err);
      return res.status(500).send("Error checking like status");
    }
    const liked = results.length > 0;
    res.json({ liked });
  });
});


app.get("/refundproducts", (req, res) => {
  const query = RefundDetailsQuery;

  db.query(query, (err, data) => {
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





// app.post('/refund', async (req, res) => {
//   const { paymentIntentId } = req.body;  // Only paymentIntentId is required

//   try {
//     // Process the refund with Stripe
//     const refund = await stripe.refunds.create({
//       payment_intent: paymentIntentId,
//       // amount: 1000, // Optional: Specify the amount if you want to do a partial refund (in cents for USD)
//     });

//     if (refund.status === 'succeeded') {
//       // Handle successful refund (e.g., update your database to mark the transaction as refunded)
//       res.json({ success: true });
//     } else {
//       res.json({ success: false, message: 'Refund failed' });
//     }
//   } catch (error) {
//     console.error('Error processing refund:', error);
//     res.status(500).json({ success: false, message: 'Internal server error' });
//   }
// });

app.post('/refund', async (req, res) => {
  const { paymentIntentId,refundStatus } = req.body;

  if (!paymentIntentId) {
    return res.status(400).json({ success: false, message: 'Payment Intent ID is required.' });
  }

  try {
    // Log paymentIntentId for debugging
    // console.log('Processing refund for Payment Intent ID:', paymentIntentId);

    // Process the refund with Stripe
    const refund = await stripe.refunds.create({
      payment_intent: paymentIntentId,
    });

    if (refund.status === 'succeeded') {
      db.query("UPDATE orders SET refundstatus = ? where payment_intent_id = ?",[refundStatus,paymentIntentId], (err, data) => {
        if (err) {
          return res.json("Error");
        }
      return res.json({ success: true, refundStatus: refund.status });
        
      })
    } else {
      return res.json({ success: false, message: 'Refund processing failed. Please try again later.' });
    }

  } catch (error) {
    console.error('Error processing refund:', error.message);
    if (error.type === 'StripeInvalidRequestError') {
      return res.status(400).json({ success: false, message: 'Invalid Payment Intent ID. Please check and try again.' });
    }
    return res.status(500).json({ success: false, message: 'Internal server error. Please try again later.' });
  }
});

app.get('/usermanagement', (req, res) => {
  const query =userManagementQuery;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).json({ error: 'Database query error' });
    }

    // Directly return the raw results without restructuring
    res.json(results);
  });
});

// app.post('/shopstatus', (req, res) => {
//   const { sellerId, shopstatus ,reason,email,displayName} = req.body;

//   // SQL query to update product status based on the sellerId
//   const query = `
//     UPDATE products
//     SET product_status = ?
//     WHERE seller_id = ?
//   `;


//   db.query(query, [shopstatus, sellerId], (err, results) => {
//     if (err) {
//       console.error('Error updating product status:', err);
//       return res.status(500).json({ message: 'Internal Server Error' });
//     }
//     res.status(200).json({ message: 'Product status updated successfully' });
//   });
// });



// payment
// Replace these with your PayPal Sandbox API credentials

app.post('/shopstatus', (req, res) => {
  const { sellerId, shopstatus, reason, email, displayName } = req.body;

  // SQL query to update product status based on the sellerId
  const query = UpdateShopStatusQuery;

  db.query(query, [shopstatus, sellerId], async (err, results) => {
    if (err) {
      console.error('Error updating product status:', err);
      return res.status(500).json({ message: 'Internal Server Error' });
    }

    // Determine email subject and message content
    const subject = shopstatus === 'enabled' ? 'Your Shop is Now Live!' : 'Your Shop Has Been Disabled';
    const message = `
      <h2>Dear ${displayName},</h2>
      <p>Your shop status has been updated to <strong>${shopstatus}</strong>.</p>
      <p>Reason: ${reason}</p>
      <p>Thank you for your cooperation.</p>
      <p>Best regards,<br> The Resale Bazaar Team</p>
    `;

    // Send the status update email
    try {
      await sendStatusUpdateEmail(email, subject, message);
      console.log("Status update email sent to seller successfully");
    } catch (emailError) {
      console.error("Error sending status update email:", emailError);
      // Optionally handle email sending error
    }

    res.status(200).json({ message: 'Product status updated successfully' });
  });
});



paypal.configure({
  mode: "sandbox",
  client_id: process.env.REACT_APP_PAYPAL_CLIENTID,
  client_secret: process.env.REACT_APP_PAYPAL_CLIENTSECRET,
});

app.post("/createPayment", (req, res) => {
  const cartItems = req.body.cartItems;
  const items = cartItems.map((item) => ({
    name: item.name,
    amount: item.price * item.quantity,
    currency: "USD",
  }));
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
            .reduce((sum, item) => sum + item.price * item.quantity, 0)
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
        res.redirect(
          `${process.env.REACT_APP_HOST}${process.env.REACT_APP_FRONT_END_PORT}/Resale-bazaar/finalcheckoutpage`
        );
      }
    }
  );
});

app.get("/cancel", (req, res) => {
  res.redirect(
    `${process.env.REACT_APP_HOST}${process.env.REACT_APP_FRONT_END_PORT}/Resale-bazaar/`
  );
});

// Stripe payment gateway
// app.post("/paymentStripe", async (req, res) => {
//   const fromPage = req.body.from;
//   const successRedirect = fromPage
//   const product = req.body.product;
//   try {
//     const session = await stripe.checkout.sessions.create({
//       payment_method_types: ["card"],
//       mode: "payment",
//       customer_email: req.body.user_mail,
//       line_items: product.map(item => {
//         return {
//           price_data: {
//             currency: "usd",
//             product_data: {
//               name: item.name,
//             },
//             unit_amount: item.price * 100,
//           },
//           quantity: item.quantity,
//         }
//       }),
//       payment_intent_data: {
//         metadata: {
//           email:  req.body.user_mail,
//         },
//       },
//       success_url: `${process.env.REACT_APP_HOST}${process.env.REACT_APP_FRONT_END_PORT}/${successRedirect}`,
//       cancel_url: `${process.env.REACT_APP_HOST}${process.env.REACT_APP_FRONT_END_PORT}/`,
//     })
//     console.log(payment_intent_data.id)

//     res.json({ url: session.url })
//   } catch (e) {
//     res.status(500).json({ error: e.message })
//   }
// })
app.post("/paymentStripe", async (req, res) => {
  const fromPage = req.body.from;
  const successRedirect = fromPage;
  const product = req.body.product;

  try {
    // Create the Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      customer_email: req.body.user_mail,
      line_items: product.map(item => ({
        price_data: {
          currency: "usd",
          product_data: {
            name: item.name,
          },
          unit_amount: item.price * 100,
        },
        quantity: item.quantity,
      })),
      payment_intent_data: {
        metadata: {
          email: req.body.user_mail,
        },
      },
      success_url: `${process.env.REACT_APP_HOST}${process.env.REACT_APP_FRONT_END_PORT}/${successRedirect}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.REACT_APP_HOST}${process.env.REACT_APP_FRONT_END_PORT}/`,
    });

    // Return the session URL to the frontend
    res.json({ url: session.url });

  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});
app.get('/api/get-session/:session_id', async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.retrieve(req.params.session_id);
    const paymentIntentId = session.payment_intent; // Retrieve PaymentIntent ID
    res.json({ paymentIntentId });
  } catch (error) {
    res.status(500).send('Error retrieving session');
  }
});

app.listen(process.env.REACT_APP_PORT, () => {
  console.log("listening");
});