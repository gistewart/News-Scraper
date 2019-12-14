//requires our db to access our models
const db = require("../models");
var axios = require("axios");
var cheerio = require("cheerio");

//exports a function that will accept the app we pass
module.exports = function(app) {
  // Main route (simple Hello World Message)
  app.get("/", function(req, res) {
    res.send("Hello world");
  });

  // A GET route for scraping the Reuters website
  app.get("/scrape", function(req, res) {
    // First, we grab the body of the html with axios
    axios.get("https://www.reuters.com/theWire").then(function(response) {
      // Then, we load that into cheerio and save it to $ for a shorthand selector
      var $ = cheerio.load(response.data);
      //   db.Article.remove({});

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
        // console.log(result);

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
      //   res.json(dbArticle);
      res.send("Scrape Complete");
    });
  });

  // Route for getting all Articles from the db
  app.get("/articles", function(req, res) {
    db.Article.find({})
      .then(function(dbArticle) {
        // If all Articles are successfully found, send them back to the client
        res.json(dbArticle);
      })
      .catch(function(err) {
        // If an error occurs, send the error back to the client
        res.json(err);
      });
  });

  // Route for retrieving all Comments from the db

  // Route for saving a new Comment to the db?
};
