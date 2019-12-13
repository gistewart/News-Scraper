var express = require("express");
// var logger = require("morgan");
var mongoose = require("mongoose");

var PORT = 3000;

// Require all models
// var db = require("./models");

// Initialize Express
var app = express();

// Configure middleware

// Use morgan logger for logging requests
// app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));

// Connect to the Mongo DB
var MONGODB_URI =
    process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

mongoose.connect(MONGODB_URI);

// old version
// mongoose.connect("mongodb://localhost/populatedb", { useNewUrlParser: true });


// Routes

// Route for retrieving all Notes from the db


// Route for retrieving all Users from the db


// Route for saving a new Note to the db and associating it with a User


// Route to get all User's and populate them with their notes


// Start the server
app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
});