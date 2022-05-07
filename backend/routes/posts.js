const express = require("express");
const router = express.Router();
const PostController = require("../controllers/posts");
const checkAuth = require("../middleware/check-auth");

// Create post
router.post("", checkAuth, PostController.createPost);
// Get all posts
router.get("", PostController.fetchPosts);
// Get post by ID
router.get("/:id", PostController.fetchPost);
/// Update post
router.put("/:id", checkAuth, PostController.updatePost);
// Delete post
router.delete("/:id", checkAuth, PostController.deletePost);

module.exports = router;
