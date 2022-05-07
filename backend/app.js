const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const postsRoutes = require("./routes/posts");
const usersRoutes = require("./routes/users");

const app = express();

mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_ATLAS_USER}:${process.env.MONGO_ATLAS_PASSWORD}@cluster0.mf780.mongodb.net/node-angular?retryWrites=true&w=majority`
  )
  .then(() => {
    console.log("Connected to DB!");
  })
  .catch((err) => {
    console.error(`Error is ${err}`);
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Reqquuested-With,Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,POST,PATCH,DELETE,OPTIONS,PUT"
  );
  next();
});

app.use("/api/posts", postsRoutes);
app.use("/api/users", usersRoutes);

module.exports = app;
