const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blog.controller');
const {protect,getUserIfLoggedIn} = require('../middleware/auth.middleware');

// Public Route: Anyone can browse the community feed
router.get('/', getUserIfLoggedIn,blogController.getAllBlogs);
router.get('/:id', getUserIfLoggedIn,blogController.getBlog);

//require protected to see the page 
router.get('/my-yarns',protect,blogController.getUserBlogs)

//create form
router.get('/create', protect, (req,res) => {
    res.render('create'); //renders create.ejs form
})

// Private Route: Only authenticated users can create
router.post('/', protect, blogController.createBlog);

module.exports = router;