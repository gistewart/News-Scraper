var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");

// Require axios and cheerio. This makes the scraping possible
var axios = require("axios");
var cheerio = require("cheerio");

var PORT = 3000;

// Require all models
var db = require("./models");

// Initialize Express
var app = express();

// Database configuration
var databaseUrl = "scraper";
var collections = ["scrapedData"];

// Configure middleware

// Use morgan logger for logging requests
app.use(logger("dev"));

// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));

// Connect to the Mongo DB
var MONGODB_URI =
    process.env.MONGODB_URI || "mongodb://localhost/news-scraper";

mongoose.connect(MONGODB_URI);

// old version
// mongoose.connect("mongodb://localhost/populatedb", { useNewUrlParser: true });
// Main route (simple Hello World Message)
app.get("/", function(req, res) {
    res.send("Hello world");
});

// Routes

// A GET route for scraping the Reuters website
app.get("/scrape", function(req, res) {
    // First, we grab the body of the html with axios
    axios.get("https://www.reuters.com/theWire").then(function(response) {
        // Then, we load that into cheerio and save it to $ for a shorthand selector
        var $ = cheerio.load(response.data);

        // Now, we grab the parent selector, and do the following:
        $(".ImageStoryTemplate_image-story-container").each(function(i, element) {
            // Save an empty result object
            var result = {};

            // Add the headline, href, summary of every link, and save them as properties of the result object

            result.title = $(this)
                .children("div")
                .children("h2")
                .text();
            result.link = $(this)
                .children("div")
                .children("h2")
                .children("a")
                .attr("href");
            result.summary = $(this)
                .children("p")
                .text();
            console.log(result);


            // Create a new Article using the `result` object built from scraping
            db.Article.create(result)
                .then(function(dbArticle) {
                    // View the added result in the console
                    console.log(dbArticle);
                })
                .catch(function(err) {
                    // If an error occurred, log it
                    console.log(err);
                });
        });

        // Send a message to the client
        res.send("Scrape Complete");
    });
});




// Route for retrieving all Commentsfrom the db


// Route for saving a new Comment to the db?



// Start the server
app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
});