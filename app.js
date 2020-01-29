const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const morgan = require("morgan");

const app = express();

app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// setting CORS headers
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-with, Content-Type, Accept, Authorization"
  );
  next();
});

// Routes
const productRoutes = require("./api/routes/products");

app.use("/products", productRoutes);

// handling 404 error
app.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
});

// handling 404 & 500 error
app.use((error, req, res, next) => {
  const resStatus = error.status || 500;
  res.status(resStatus).json({
    status: resStatus,
    error: {
      message: error.message
    }
  });
  next();
});

// connecting to mongoDB
mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true }, () => {
  console.log("DB connected");
  console.log(process.env.DB_CONNECT);
});

module.exports = app;
