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
           // If it's a browser request, send them to the new article!
           if (req.headers.accept?.includes('text/html')) {
            return res.redirect(`/blogs/${newBlog._id}`);
        }
        res.status(201).json({message:'Yarn created successfully', blog: newBlog}); //return success response with the created blog

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
           const{page =1, limit = 20, search} = req.query;
           const filter = {state:'published'};

           if(search) filter.title = {$regex: search, $options:'i'};

           const blogs = await Blog.find(filter)
            .populate('author', 'first_name last_name email')
            .sort({createdAt: -1})
                .limit(limit * 1)
                .skip((page - 1) * limit);//find published blogs, populate author details, sort by creation date, and implement pagination
                    
                if(req.headers.accept?.includes('text/html'))
                {
                    return res.render('index',{blogs,page:parseInt(page),
                        search: search || '',
                        user: res.locals.user
                    });//render the community feed page if the request is from a browser, passing the blogs, current page, and search query to the view
                }
                res.json({count: blogs.length,page, blogs}); //return success response with the list of published blogs
        }catch(err)
        {
            console.error("Query error",err.message);
            res.status(500).json({error: err.message}); //return error response if something goes wrong
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
                    { new: true, returnDocument: 'after' }
                ).populate('author', 'first_name last_name email'); //find a blog by its ID and populate the author field with user details
                if (!blog || (blog.state === 'draft' && (!req.user || req.user.id !== blog.author._id.toString()))) {
                    if (req.headers.accept?.includes('text/html')) {
                        return res.status(404).render('404', { message: "This yarn is still being spun (Draft)." });
                    }
                    return res.status(404).json({ message: "Yarn not found." });
                }
        
                if (req.headers.accept?.includes('text/html')) {
                    return res.render('article', { blog });
                }
                res.json(blog); 
            } catch (err) {
                res.status(404).json({ message: "Yarn not found." });
            }
        };
    
        exports.getUserBlogs = async(req,res) =>
        {
            try{
                const blogs = await Blog.find({author: req.user.id}).sort({createdAt: -1}); //find all blogs created by the authenticated user and sort them by creation date
                if(req.headers.accept?.includes('text/html'))
                {
                    return res.render('dashboard',{blogs}); //render the user's blogs page if the request is from a browser
                }
                res.json(blogs);
            }catch(err){
                res.status(500).json({error:err.message})
            }

        };

        exports.renderEditPage = async (req, res) => {
            try {
                const blog = await Blog.findById(req.params.id);
                
                // Security Check: Only the owner can edit!
                if (!blog || blog.author.toString() !== req.user.id) {
                    return res.redirect('/blogs/my-yarns');
                }
                
                res.render('edit', { blog });
            } catch (err) {
                res.redirect('/blogs/my-yarns');
            }
        };//controller to render the edit page for a blog, with a security check to ensure only the owner can access it

        exports.updateBlog = async (req, res) => {
            try {
                const { title, description, state, tags, body } = req.body;
                
                // Find and update, ensuring the user owns it
                const blog = await Blog.findOneAndUpdate(
                    { _id: req.params.id, author: req.user.id },
                    { title, description, state, tags, body },
                    { new: true, runValidators: true }
                );
        
                if (!blog) return res.status(403).json({ message: "Action unauthorized" });
        
                // If from browser, redirect back to the updated story
                if (req.headers.accept?.includes('text/html')) {
                    return res.redirect(`/blogs/${blog._id}`);
                }
        
                res.json({ message: "Yarn updated!", blog });
            } catch (err) {
                res.status(400).json({ error: err.message });
            }
        };//controller to handle updating a blog, with a security check to ensure only the owner can update it

        exports.deleteBlog = async (req, res) => {
            try {
                const blog = await Blog.findOneAndDelete({ 
                    _id: req.params.id, 
                    author: req.user.id 
                });
        
                if (!blog) return res.status(403).json({ message: "Action unauthorized" });
        
                // Redirect back to the studio dashboard
                res.redirect('/blogs/my-yarns');
            } catch (err) {
                res.status(500).json({ error: err.message });
            }
        };//controller to handle deleting a blog, with a security check to ensure only the owner can delete it, and redirects back to the user's blogs page after deletion

