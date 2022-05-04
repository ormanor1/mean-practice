const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const posts = [
  {
    id: "as35gtsa",
    title: "First Server-side post",
    content: "This is coming from the server!",
  },
  {
    id: "a5sd32sa",
    title: "Second Server-side post",
    content: "This is coming from the server!",
  },
];

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Reqquuested-With,Content-Type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,POST,PATCH,DELETE,OPTIONS "
  );
  next();
});

app.post("/api/posts", (req, res, next) => {
  const post = req.body;
  posts.push(post);
  console.log(posts);

  res.status(201).json({
    message: "Post added successfully",
  });
});

app.get("/api/posts", (req, res, next) => {
  res.status(200).json({
    message: "Posts fetched succesfully!",
    posts: posts,
  });
});

module.exports = app;
