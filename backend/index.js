const bodyParser = require("body-parser");
const express = require("express");

const signUp = require("./routes/users/signup");
const login = require("./routes/users/login");
const logged = require("./routes/users/logged");
const user = require("./routes/users/user");
const editUser = require("./routes/users/editUser");
const cartUser = require("./routes/users/userCart");
const productItems = require("./routes/products/productItem");
const editProduct = require("./routes/products/editProduct");
const addProduct = require("./routes/products/addProduct");
const reviewProduct = require("./routes/products/reviewProduct");
const boughtProducts = require("./routes/products/confirmedPayment");
const adminUsers = require("./routes/admin/adminUsers");
const adminOrders = require("./routes/admin/adminOrders");

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*"); // Set the 'Access-Control-Allow-Origin' header to allow requests from any origin ('*')
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE"); // Set the 'Access-Control-Allow-Methods' header to allow specific HTTP methods
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization"); // Set the 'Access-Control-Allow-Headers' header to allow specific request headers
  next();
});

app.use(signUp);
app.use(login);
app.use(logged);
app.use(user);
app.use(editUser);
app.use(cartUser);
app.use(productItems);
app.use(editProduct);
app.use(addProduct);
app.use(reviewProduct);
app.use(boughtProducts);
app.use(adminUsers);
app.use(adminOrders);

app.use((error, req, res, next) => {
  const status = error.status || 500;
  const message = error.message || "Something went wrong.";
  res.status(status).json({ message: message });
});

app.listen(8080);
