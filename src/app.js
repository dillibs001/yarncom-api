require("dotenv").config(); //load environment variables from .env file

const express = require("express");
const mongoose = require("mongoose"); //import mongoose for database connection
const authRoutes = require("./routes/auth.route"); //import authentication routes
const blogRoutes = require("./routes/blog.route"); //import blog routes

const app = express();
const PORT = process.env.PORT || 3000; //set the port from environment variable or default to 3000

app.use(express.json()); //middleware to parse json bodies

//routes
app.use("/auth", authRoutes); //use the authentication routes for any requests to /auth
app.use('/blogs', blogRoutes); //use the blog routes for any requests to /blogs


app.get("/", (req, res) => {
  res.send("Welcome to Yarncom API!"); //simple route to test if the server is running
});

mongoose
  .connect(process.env.MONGO_URI) //connect to MongoDB using the connection string from environment variables
  .then(() => {
    console.log("Connected to MongoDB");
    //start the server
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  }) //log successful connection to MongoDB and start the server
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err.message);
  }); //log any connection errors

