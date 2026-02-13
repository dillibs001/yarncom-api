const mongoose = require('mongoose'); //import mongoose for MongoDB interactions

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true,'Every yarn needs a title!'],
        unique: true,
        trim: true
    },//required title field, must be unique and trimmed of whitespace
    description: {
        type: String,
        trim: true
    },//optional description field for a brief summary of the blog post
    author:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true,'Every yarn needs an author!']
    },//reference to the User model, required for associating the blog with its author
    state:{type: String, enum : ['draft', 'published'], default: 'draft'},
    read_count: {type: Number, default: 0},//default read count is 0
    reading_time: {type: Number, default: 0}, //default reading time is 0 minutes
    tags: [{type: String, trim: true}], //array of tags for categorization
    body:{type: String, required: [true,'Every yarn needs a body!']}
}, {timestamps: true}); //automatically add createdAt and updatedAt fields

blogSchema.pre('save', async function(){
    if(this.body){
        const wordsPerMinute = 200; //average reading speed
        const words = this.body.split(/\s+/).length; //count the number of words in the body
        this.reading_time = Math.ceil(words / wordsPerMinute);//calculate reading time in minutes and round up to the nearest whole number
    }
   
});//pre-save hook to calculate reading time based on the body content

const Blog = mongoose.model('Blog', blogSchema); //create the Blog model using the defined schema

module.exports = Blog; //export the Blog model for use in other parts of the application