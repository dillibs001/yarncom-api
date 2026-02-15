require("dotenv").config(); //load environment variables from .env file

const express = require("express");
const mongoose = require("mongoose"); //import mongoose for database connection
const path = require('path'); // Core Node module for path handling

const cookieParser = require('cookie-parser'); //import cookie-parser to handle cookies in requests

const authRoutes = require("./routes/auth.route"); //import authentication routes
const blogRoutes = require("./routes/blog.route"); //import blog routes

const app = express();
const PORT = process.env.PORT || 3000; //set the port from environment variable or default to 3000

app.set('view engine', 'ejs');//set EJS as the view engine for rendering dynamic HTML pages
app.set('views', path.join(__dirname, 'views'));//set the directory for EJS templates to the "views" folder in the current directory

app.use(express.urlencoded({ extended: true })); //middleware to parse URL-encoded bodies (form submissions)

app.use(cookieParser()); //middleware to parse cookies from incoming requests

app.use(express.json()); //middleware to parse json bodies

//routes
app.use("/auth", authRoutes); //use the authentication routes for any requests to /auth
app.use('/blogs', blogRoutes); //use the blog routes for any requests to /blogs


app.get('/', (req, res) => res.redirect('/blogs'));

if (process.env.NODE_ENV !== 'test') {
  mongoose
      .connect(process.env.MONGO_URI)
      .then(() => {
          console.log("✅ Connected to MongoDB");
          app.listen(PORT, () => {
              console.log(`🚀 Server is running on port ${PORT}`);
          });//start the server after successful database connection
      })
      .catch((err) => {
          console.error("❌ Error connecting to MongoDB:", err.message);
      });//connect to the MongoDB database using the connection string from environment variables, then start the server
}
module.exports = app; //export the app for testing purposes