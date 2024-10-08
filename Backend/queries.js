const createDatabaseQuery = `CREATE DATABASE IF NOT EXISTS ${process.env.REACT_APP_DB_DATABASE}`;
const useDatabaseQuery = `USE ${process.env.REACT_APP_DB_DATABASE}`;
var CryptoJS = require("crypto-js");
const adminPassword = CryptoJS.MD5("admin").toString();
// console.log(adminPassword)

const createAdminTableQuery = `
CREATE TABLE IF NOT EXISTS admin (
    admin_id INT NOT NULL AUTO_INCREMENT,
    firstname VARCHAR(60) NOT NULL,
    lastname VARCHAR(60) NOT NULL,
    phone BIGINT(10) NOT NULL,
    email VARCHAR(60) NOT NULL,
    password VARCHAR(60) NOT NULL,
    UNIQUE INDEX admin_id_UNIQUE (admin_id ASC),
    UNIQUE INDEX phone_UNIQUE (phone ASC),
    UNIQUE INDEX email_UNIQUE (email ASC));
`

const insertAdminTableQuery = `
INSERT IGNORE INTO admin 
  (firstname, email, password) 
VALUES 
  ("admin", "admin@admin", "${adminPassword}");
`

const createRegisterTableQuery = `
CREATE TABLE IF NOT EXISTS register (
    user_id INT NOT NULL AUTO_INCREMENT,
    firstname VARCHAR(60) NOT NULL,
    lastname VARCHAR(60) NOT NULL,
     shopname VARCHAR(90) NULL,
    phone BIGINT(10) NOT NULL,
    email VARCHAR(60) NOT NULL,
    password VARCHAR(60) NOT NULL,
    UNIQUE INDEX user_id_UNIQUE (user_id ASC),
    UNIQUE INDEX phone_UNIQUE (phone ASC),
    UNIQUE INDEX email_UNIQUE (email ASC),
    PRIMARY KEY (user_id));
`;

const productsList = `
CREATE TABLE IF NOT EXISTS products (
    id INT NOT NULL AUTO_INCREMENT,
    product_type VARCHAR(60) NOT NULL,
    category VARCHAR(90) NOT NULL,
    name VARCHAR(90) NOT NULL,
    image JSON,
    description MEDIUMTEXT NOT NULL,
    location VARCHAR(45) NOT NULL,
    color VARCHAR(60) NOT NULL,
    alteration VARCHAR(45) NOT NULL,
    size VARCHAR(45) NOT NULL,
    measurements TINYTEXT NOT NULL,
    \`condition\` VARCHAR(255) NOT NULL,
    language VARCHAR(45) NULL,
    quantity INT NOT NULL,
    price INT NOT NULL,
    notes LONGTEXT NULL,
    material VARCHAR(90) NOT NULL,
    occasion VARCHAR(90) NULL,
    type VARCHAR(90) NULL,
    brand VARCHAR(90) NULL,
    product_condition VARCHAR(90) NULL,
    style VARCHAR(90) NULL,
    season VARCHAR(90) NULL,
    fit VARCHAR(90) NULL,
    length VARCHAR(90) NULL,
    source VARCHAR(45) NOT NULL,
    age VARCHAR(45) NOT NULL,
    accepted_by_admin VARCHAR(60) NOT NULL,
    rejection_reason TINYTEXT NULL,
    seller_id INT NOT NULL,
    likes BIGINT(10) NULL,
    shop_status VARCHAR(60) NULL DEFAULT 'enabled',
    UNIQUE INDEX id_UNIQUE (id ASC),
    FOREIGN KEY (seller_id) REFERENCES register(user_id),
    PRIMARY KEY (id)
)AUTO_INCREMENT=10001;
`;


const cartproducts = `
CREATE TABLE IF NOT EXISTS cart (
    id INT NOT NULL AUTO_INCREMENT,
    product_id INT NOT NULL,
    product_type VARCHAR(60) NOT NULL,
    category VARCHAR(90) NOT NULL,
    name VARCHAR(90) NOT NULL,
    image JSON,
    description MEDIUMTEXT NOT NULL,
    location VARCHAR(45) NOT NULL,
    color VARCHAR(60) NOT NULL,
    alteration VARCHAR(45) NOT NULL,
    size VARCHAR(45) NOT NULL,
    measurements TINYTEXT NOT NULL,
  \`condition\` VARCHAR(255) NULL,  
    quantity INT NOT NULL,   
    price INT NOT NULL,
    accepted_by_admin VARCHAR(60) NOT NULL,
    seller_id INT NULL,
    userid  INT NULL, 
    UNIQUE INDEX id_UNIQUE (id ASC));
`;

const ordersproducts = `
 CREATE TABLE IF NOT EXISTS orders (
  id INT NOT NULL AUTO_INCREMENT,
    product_id INT NOT NULL,
    payment_status TINYINT(4) NULL,
    buyer_id INT NULL, 
    shipment_id VARCHAR(45) NULL,
    order_id VARCHAR(45) NULL,
    ordered_date DATE NULL,
    shipped_date DATE NULL,
    delivered_date DATE NULL,
    order_quantity INT NULL,
    order_status VARCHAR(255)NOT NULL,
    order_amount INT  NULL,
    refundable_amount INT NULL,
    cancel_reason MEDIUMTEXT NULL,
    cancel_comment LONGTEXT NULL,
    payment_intent_id VARCHAR(455) NULL,
    refundstatus TINYINT(4) NULL,
    UNIQUE INDEX id_UNIQUE (id ASC));
`


const wishproducts = `
CREATE TABLE IF NOT EXISTS wish (
  id INT NOT NULL AUTO_INCREMENT,
  product_id INT NOT NULL,
  product_type VARCHAR(60) NOT NULL,
  category VARCHAR(90) NOT NULL,
  name VARCHAR(90) NOT NULL,
  image JSON,
  description MEDIUMTEXT NOT NULL,
  location VARCHAR(45) NOT NULL,
  color VARCHAR(60) NOT NULL,
  alteration VARCHAR(45) NOT NULL,
  size VARCHAR(45) NOT NULL,
  measurements TINYTEXT NOT NULL,
  \`condition\` VARCHAR(255) NULL,
  price INT NOT NULL,
  accepted_by_admin VARCHAR(60) NOT NULL,
  seller_id INT NULL,
  userid  INT NULL, 
  UNIQUE INDEX id_UNIQUE (id ASC));
`;

const offeredProducts = `
CREATE TABLE IF NOT EXISTS offered_products (
  id INT NOT NULL AUTO_INCREMENT,
  product_id INT NOT NULL,
  offered_buyer_id INT NOT NULL,
  offered_price INT NOT NULL,
  product_status VARCHAR(45) NOT NULL,
  PRIMARY KEY (id));
`

const createSellerAccount = `
CREATE TABLE IF NOT EXISTS selleraccount (
    account_id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(60) NOT NULL,
    email VARCHAR(60) NOT NULL,
    remittance VARCHAR(45) NOT NULL,
    instagram VARCHAR(60) NULL,
    phone BIGINT(10) NOT NULL,
    upi_id VARCHAR(60) NOT NULL,
    description TINYTEXT NULL,
    UNIQUE INDEX account_id_UNIQUE (account_id ASC));
  
`;

const contactinfo = `
  CREATE TABLE IF NOT EXISTS contact (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(45) NOT NULL,
    email VARCHAR(60) NOT NULL,
    enquiry VARCHAR(90)NOT NULL,
    UNIQUE INDEX id_UNIQUE (id ASC),
    UNIQUE INDEX email_UNIQUE (email ASC));
`;

const addressinfo1 = `
CREATE TABLE IF NOT EXISTS billing_address (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  firstname VARCHAR(255) NOT NULL,
  lastname VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  country VARCHAR(255) NOT NULL,
  state VARCHAR(255) NOT NULL,
  city VARCHAR(255) NOT NULL,
  address1 VARCHAR(255) NOT NULL,
  address2 VARCHAR(255),
  pincode VARCHAR(20) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  user_id INT NULL
);
`;

const addressinfo2 = `
CREATE TABLE IF NOT EXISTS shipping_address (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  firstname VARCHAR(255) NOT NULL,
  lastname VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  country VARCHAR(255) NOT NULL,
  state VARCHAR(255) NOT NULL,
  city VARCHAR(255) NOT NULL,
  address1 VARCHAR(255) NOT NULL,
  address2 VARCHAR(255),
  pincode VARCHAR(20) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  user_id INT NULL
);
`;

const ContactData = `
CREATE TABLE IF NOT EXISTS contactseller (
  id SERIAL PRIMARY KEY,
  seller_id INTEGER NOT NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone BIGINT(10) NOT NULL,
  comment LONGTEXT NULL
);
`
const ReviewsQuery = `
CREATE TABLE IF NOT EXISTS review (
  id SERIAL PRIMARY KEY,
  rating  INTEGER NOT NULL,
  description  VARCHAR(255) NOT NULL,
  title  VARCHAR(255) NOT NULL,
  images JSON,
  seller_id INTEGER NOT NULL,
  buyer_id INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
` 
const LikesQuery = `
  CREATE TABLE IF NOT EXISTS likes (
  id SERIAL PRIMARY KEY,   
  likes INT NOT NULL,
  like_user_id INT NOT NULL,
  like_product_id INT NOT NULL
);
`

const GuestBillingAddressQuery = `
  CREATE TABLE IF NOT EXISTS guest_billing_address (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  firstname VARCHAR(255) NOT NULL,
  lastname VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  country VARCHAR(255) NOT NULL,
  state VARCHAR(255) NOT NULL,
  city VARCHAR(255) NOT NULL,
  address1 VARCHAR(255) NOT NULL,
  address2 VARCHAR(255),
  pincode VARCHAR(20) NOT NULL,
  phone VARCHAR(20) NOT NULL
);
`

const GuestShippingAddressQuery = `
  CREATE TABLE IF NOT EXISTS guest_shipping_address (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  firstname VARCHAR(255) NOT NULL,
  lastname VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  country VARCHAR(255) NOT NULL,
  state VARCHAR(255) NOT NULL,
  city VARCHAR(255) NOT NULL,
  address1 VARCHAR(255) NOT NULL,
  address2 VARCHAR(255),
  pincode VARCHAR(20) NOT NULL,
  phone VARCHAR(20) NOT NULL
);
`

const GuestOrderQuery = `
  CREATE TABLE IF NOT EXISTS Guest_orders (
    id INT NOT NULL AUTO_INCREMENT,
    product_id INT NOT NULL,
    payment_status TINYINT(4) NULL,
    shipment_id VARCHAR(45) NULL,
    order_id VARCHAR(45) NULL,
    ordered_date DATE NULL,
    shipped_date DATE NULL,
    delivered_date DATE NULL,
    order_quantity INT NULL,
    order_status VARCHAR(255)NOT NULL,
    order_amount INT  NULL,
    customer_first_name VARCHAR(255) NOT NULL,
    customer_last_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(90) NOT NULL,
    customer_phone BIGINT(10) NOT NULL,
    UNIQUE INDEX id_UNIQUE (id ASC)
  );
`

const loginCheckQuery = "SELECT * FROM register WHERE `email` = ? AND `password` = ?";
const adminLoginQuery = "SELECT * FROM admin WHERE `email` = ? AND `password` = ?";
const retrievingUsersQuery = "SELECT * FROM register";
const addUserQuery = "INSERT INTO register set ?";
const updateUserQuery = "UPDATE register SET ? WHERE email = ?";
const retrievingSellersQuery = "select * from selleraccount";
const addingSellerAccountQuery = "INSERT INTO selleraccount SET ?";
const adminAcceptedProductsQuery = "select * from products WHERE `accepted_by_admin` = (?)";
const adminApprovalQuery = "UPDATE products SET accepted_by_admin = ? WHERE id = ?";
const adminRejectionQuery = "UPDATE products SET rejection_reason = ? WHERE id = ?";
const retrievingAllProductsQueryAll = "select * from products WHERE `accepted_by_admin` = (?) and `shop_status` = (?) and `seller_id`=(?) ORDER BY id LIMIT ? OFFSET ?";
const retrievingAllProductsQuery = "select * from products WHERE `accepted_by_admin` = (?) and `shop_status` = (?)";

const retrievingWomenProductsQuery = "SELECT * FROM products WHERE `category` =(?)AND `accepted_by_admin` = (?) and `shop_status` = (?) ORDER BY id LIMIT ? OFFSET ?";
const retrievingWomenProductsQueryAll = "SELECT * FROM products WHERE `product_type` =(?) AND `accepted_by_admin` = (?) and `shop_status` = (?) ORDER BY id LIMIT ? OFFSET ?";
// const retrievingKidsProductsQuery = "select * from products WHERE `product_type` = (?) AND `accepted_by_admin` = (?)";
const retrievingKidsProductsQuery = "SELECT * FROM products WHERE `category` =(?) AND `accepted_by_admin` = (?) and `shop_status` = (?)  ORDER BY id LIMIT ? OFFSET ?";
const retrievingKidsProductsQueryAll = "SELECT * FROM products WHERE `product_type` =(?) AND `accepted_by_admin` = (?) and `shop_status` = (?) ORDER BY id LIMIT ? OFFSET ?";
// const retrievingKidsProductsQueryAll = "select * from products WHERE `product_type` = (?) AND `accepted_by_admin` = (?)";
// const retrievingKidsProductsQuery = "SELECT * FROM products WHERE `product_type` =(?)AND `accepted_by_admin` = (?)";

const retrievingJewelleryProductsQuery = "SELECT * FROM products WHERE `category` =(?)AND `accepted_by_admin` = (?) and `shop_status` = (?) ORDER BY id LIMIT ? OFFSET ?";
const retrievingJewelleryProductsQueryAll = "SELECT * FROM products WHERE `product_type` =(?) AND `accepted_by_admin` = (?) and `shop_status` = (?) ORDER BY id LIMIT ? OFFSET ?";

const retrievingBooksProductsQuery = "select * from products WHERE `product_type` = (?) AND `accepted_by_admin` = (?)";
const addProductsQuery = `INSERT INTO products (product_type, category, name, description, image, location, color, alteration, size, measurements, \`condition\`, source, age, quantity, price, notes, material, occasion, type, brand, style, season, fit, length, accepted_by_admin, seller_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
const addToCartQuery = "INSERT INTO cart (`product_id`, `product_type`, `category`, `name`, `image`, `description`, `location`, `color`, `alteration`, `size`, `measurements`, \`condition\`,`quantity`, `price`, `accepted_by_admin`, `seller_id`, `userid`) values (?)";
const retrievingCartItemsQuery = "select * from cart";
const updateCartItemsQuery = "UPDATE cart SET userid = ? WHERE id = ?";
const deleteCartItemsQuery = "DELETE FROM cart WHERE id = ?";
const updateCartItemsQuantityQuery = "UPDATE cart SET quantity = ? WHERE id = ?"
const deleteOrderItemsQuery = "DELETE FROM orders WHERE product_id = ? and buyer_id = ?";
const addToWishlistQuery = "INSERT INTO wish (`product_id`, `product_type`, `category`, `name`, `image`, `description`, `location`, `color`, `alteration`, `size`, `measurements`, \`condition\`, `price`, `accepted_by_admin`, `seller_id`, `userid`) values (?)";
const retrievingWishlistItemsQuery = "select * from wish";
const deleteWishlistItemsQuery = "DELETE FROM wish WHERE id = ?";
const retrieveContactusQuery = "Select * from contact";
const addContactusQuery = "INSERT INTO contact (`name`,`email`,`enquiry`) VALUES(?)";
const addBillingAddress = `INSERT INTO billing_address (firstname, lastname, email, country, state, city, address1, address2, pincode, phone, user_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
const addShippingAddress = `INSERT INTO shipping_address (firstname, lastname, email, country, state, city, address1, address2, pincode, phone, user_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
const updateShippingAddress = `UPDATE shipping_address SET firstname = ?, lastname = ?, email = ?, country = ?, state = ?, city = ?, address1 = ?, address2 = ?, pincode = ?, phone = ? WHERE id = ?`;
const deleteShippingAddress = "DELETE FROM shipping_address WHERE id = ?"
const paymentStatusQuery = "INSERT INTO orders (product_id, payment_status, buyer_id, shipment_id, order_id, ordered_date, shipped_date, delivered_date,order_quantity,order_status,order_amount,payment_intent_id, refundstatus) VALUES (?, ?, ?, ?, ?, ?, ?, ?,?,?,?,?,?)";
const deleteProductsQuery = "DELETE FROM  products WHERE id=?";
const deletecartitemQuery = "DELETE FROM cart WHERE userid = ? AND EXISTS (SELECT 1 FROM orders WHERE buyer_id = ?)"
const cancelorderitemQuery = `UPDATE orders SET order_status = ?, refundable_amount = ?, cancel_reason = ?,cancel_comment = ? WHERE order_id = ?`;
const guestpaymentStatusQuery = "INSERT INTO guest_orders (product_id, payment_status, shipment_id, order_id, ordered_date, shipped_date, delivered_date,order_quantity,order_status,order_amount, customer_first_name,customer_last_name,customer_email,customer_phone) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
const getbillingAddress= "Select * from billing_address"
const getshippingAddress= "Select * from shipping_address"
const retrievingAdminQuery = "SELECT * FROM admin";
const udpateAdminQuery = "UPDATE admin SET ? WHERE email = ?";
const retrievingSellerProductsQuery = "select * from products";
const offeredProductsQuery = "INSERT INTO offered_products (`product_id`,`offered_buyer_id`,`offered_price`,`product_status`) VALUES(?,?,?,?)";
const retrievingOfferedProductsQuery = "select * from offered_products";
const updatedOfferProductAcceptedQuery = "UPDATE offered_products SET product_status = 'Accepted' WHERE id = ?";
const updatedOfferProductRejectQuery  = "UPDATE offered_products SET product_status = 'Rejected' WHERE id = ?"
const AddContactSellerQuery = "INSERT INTO contactseller (name, email, phone, seller_id, comment) VALUES (?, ?, ?, ?,?)";
const retrievingContactSellerQuery = "select * from contactseller" 
const updateOrderShippmentQuery = "UPDATE orders SET shipped_date = ? WHERE shipment_id = ?"
const updateOrderDeliveredQuery = "UPDATE orders SET delivered_date = ? WHERE shipment_id = ?"
const updateOrderDeliveredandShippementQuery = "UPDATE orders SET shipped_date = ?, delivered_date = ? WHERE shipment_id = ?"
const updateProductQuery= `UPDATE products SET name = ?, price = ?, description = ?, location = ?, color = ?, alteration = ?, size = ?, measurements = ?, \`condition\` = ?, age = ?,quantity = ?, occasion = ?, material = ?, type = ?, brand = ?, style = ?, fit = ?, length = ?, season = ?, notes = ? WHERE id = ?`
const googleLoginQuery ="SELECT * FROM register WHERE `email` = ?"
const updateProductQtyQuery="UPDATE products SET quantity = ? WHERE id = ?"
const ordersQuery = "Select * from orders"
const addReviewsQuery='INSERT INTO review (rating, description, title, images ,seller_id,buyer_id,created_at, updated_at) VALUES (?, ?, ?, ?,?,?,?,?)'
const reviewsRetrivingJoinQuery=` SELECT review.*, register.firstname, register.lastname FROM review INNER JOIN register ON review.buyer_id = register.user_id;`
const shipmentRetrivingJoinQuery=`SELECT * FROM products INNER JOIN  orders ON orders.product_id = products.id;`
const offergetQuery = `SELECT * FROM products INNER JOIN  offered_products ON offered_products.product_id = products.id and products.shop_status = (?)`
const fetchFindImagesQuery='SELECT image FROM products WHERE id = ?'
const productsUpdateQuery=`UPDATE products SET name = ?, price = ?, description = ?, location = ?, color = ?, alteration = ?, size = ?, measurements = ?, \`condition\` = ?, age = ?, quantity = ?, occasion = ?,  material = ?, brand = ?, type = ?, style = ?, fit = ?, length = ?, season = ?, notes = ?, accepted_by_admin= ?, image = ? WHERE id = ?`
// const cartpaymentupdateQuery = "UPDATE cart SET payment_status = ?, buyer_id = ? WHERE id = ?";
const addLikeQuery = 'INSERT INTO likes (like_product_id, like_user_id, likes) VALUES (?, ?, ?)';
const removeLikeQuery = 'DELETE FROM likes WHERE like_product_id = ? AND like_user_id = ?';
const LikecountQuery = 'SELECT COUNT(*) AS likeCount FROM likes WHERE like_product_id = ?';
const checkLikeQuery = 'SELECT * FROM likes WHERE like_product_id = ? AND like_user_id = ?';
const userManagementQuery =  `SELECT r.*, p.* FROM register r INNER JOIN products p ON r.user_id = p.seller_id `;
const UpdateShopStatusQuery =`UPDATE products SET shop_status = ? WHERE seller_id = ?`
const RefundDetailsQuery ="SELECT products.*, orders.*, register.* FROM products INNER JOIN orders ON products.id = orders.product_id INNER JOIN register ON orders.buyer_id = register.user_id WHERE orders.order_status = 'cancelled'"
const guestShippingAddress = `INSERT INTO guest_shipping_address (firstname, lastname, email, country, state, city, address1, address2, pincode, phone) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
const guestBillingAddress = `INSERT INTO guest_billing_address (firstname, lastname, email, country, state, city, address1, address2, pincode, phone) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

module.exports = {
  createAdminTableQuery,
  insertAdminTableQuery,
  createRegisterTableQuery,
  createDatabaseQuery,
  useDatabaseQuery,
  productsList,
  createSellerAccount,
  cartproducts,
  wishproducts,
  offeredProducts,
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
  udpateAdminQuery,
  retrievingAdminQuery,
  deleteOrderItemsQuery,
  retrievingSellerProductsQuery,
  offeredProductsQuery,
  retrievingOfferedProductsQuery,
  updateShippingAddress,
  deleteShippingAddress,
  updatedOfferProductAcceptedQuery,
  updatedOfferProductRejectQuery,
  AddContactSellerQuery,
  retrievingContactSellerQuery,
  ContactData,
  updateOrderShippmentQuery,
  updateOrderDeliveredQuery,
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
  addLikeQuery,
  removeLikeQuery,
  LikecountQuery,
  checkLikeQuery,
  cancelorderitemQuery,
  updateCartItemsQuantityQuery,
  RefundDetailsQuery,
  guestShippingAddress,
  guestBillingAddress,
  guestpaymentStatusQuery,
  userManagementQuery,
  UpdateShopStatusQuery
};
