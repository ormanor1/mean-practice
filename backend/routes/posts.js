const express = require("express");

const router = express.Router();

const Post = require("../models/post");
const checkAuth = require("../middleware/check-auth");

router.post("", checkAuth, (req, res, next) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    creator: req.userData.userId,
  });
  post.save().then((createdPost) => {
    res.status(201).json({
      message: "Post added successfully",
      postId: createdPost._id,
    });
  });
});
// Get all Posts
router.get("", (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const postQuery = Post.find();
  let fetchedPosts;

  if (pageSize && currentPage) {
    postQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }

  postQuery
    .then((documents) => {
      fetchedPosts = documents;
      return Post.count();
    })
    .then((count) => {
      res.status(200).json({
        message: "Posts fetched succesfully!",
        posts: fetchedPosts,
        maxPosts: count,
      });
    })
    .catch((err) => {
      console.error(err);
    });
});
// Get post by ID
router.get("/:id", (req, res, next) => {
  Post.findById(req.params.id).then((post) => {
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({
        message: "Post not found!",
      });
    }
  });
});

router.put("/:id", checkAuth, (req, res, next) => {
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    creator: req.userData.userId,
  });

  Post.updateOne(
    { _id: req.params.id, creator: req.userData.userId },
    post
  ).then((result) => {
    if (result.nModifie > 0) {
      res.status(200).json({ message: "Update successful!" });
    } else {
      res.status(401).json({ message: "Unauthorized" });
    }
  });
});

router.delete("/:id", checkAuth, (req, res, next) => {
  Post.deleteOne({ _id: req.params.id, creator: req.userData.userId }).then(
    (result) => {
      if (result.deletedCount > 0) {
        res.status(200).json({ message: "Post deleted" });
      } else {
        res.status(401).json({ message: "Unauthorized" });
      }
    }
  );
});

module.exports = router;
