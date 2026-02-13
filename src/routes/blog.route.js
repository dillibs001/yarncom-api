const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blog.controller');
const verifyToken = require('../middleware/verifyToken');

// Public Route: Anyone can browse the community feed
router.get('/', blogController.getAllBlogs);
router.get('/:id', blogController.getBlog);

// Private Route: Only authenticated users can create
router.post('/', verifyToken, blogController.createBlog);

module.exports = router;