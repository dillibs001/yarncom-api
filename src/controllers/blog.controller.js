const Blog = require('../models/blog.model'); //import the Blog model to interact with the database

exports.createBlog = async (req, res) => {
    try {
        const { title, description, state, tags, body } = req.body; //destructure the request body to get blog details

        const newBlog = await Blog.create({
            title, 
            description,
            state,
            tags,
            body,
            author : req.user.id, //set the author to the authenticated user's ID
        });
        res.status(201).json({message:'Blog created successfully', blog: newBlog}); //return success response with the created blog

    }
    catch(err)
    {
        res.status(400).json({error: err.message}); //return error response if something goes wrong
    }

};

//get all published blogs(yarns)
exports.getAllBlogs = async(req,res) =>
    {
        try
        {
            const blogs = await Blog.find({state: 'published'}).populate('author', 'first_name last_name email').sort({createdAt: -1}); //find all published blogs, populate the author field with user details, and sort by creation date in descending order
            res.json({ count: blogs.length, blogs });//return success response with the count of blogs and the blogs themselves
        } catch (err) {
            res.status(500).json({ error: err.message });
        }


    };
    
    //get a single blog(yarn)    
    exports.getBlog = async(req,res)=>
        {
            try
            {
                const blog = await Blog.findByIdAndUpdate(
                    req.params.id, 
                     { $inc: { read_count: 1 } },
                    { new: true }
                ).populate('author', 'first_name last_name email'); //find a blog by its ID and populate the author field with user details
                if(!blog)
                {
                    return res.status(404).json({message: 'Blog not found'}); //return error if blog is not found
                }
                res.json(blog); //return success response with the blog details
            }
            catch(err)
            {
                res.status(404).json({message:"Yarn(blog) not found"}); //return error response if something goes wrong
            }
        }
    
        

