//requires our db to access our models
const db = require("../models");
var axios = require("axios");
var cheerio = require("cheerio");
var mongojs = require("mongojs");

//exports a function that will accept the app we pass
module.exports = function(app) {
  // A GET route for scraping the Reuters website
  app.get("/scrape", function(req, res) {
    // First, we grab the body of the html with axios
    axios.get("https://www.reuters.com/theWire").then(function(response) {
      // Then, we load that into cheerio and save it to $ for a shorthand selector
      var $ = cheerio.load(response.data);

      const resultsArray = [];
      // Now, we grab the parent selector, and do the following:
      $(".ImageStoryTemplate_image-story-container").each(function(i, element) {
        // Save an empty result object
        var result = {};
        // Add the headline, href, summary of every link, and save them as properties of the result object
        result.link = $(this)
          .children("div")
          .children("h2")
          .children("a")
          .attr("href");
        result.summary = $(this)
          .children("div")
          .children("p")
          .text();
        result.title = $(this)
          .children("div")
          .children("h2")
          .text();
        result.image = $(this)
          .children("span")
          .children("a")
          .children("img")
          .attr("src");

        resultsArray.push(result);
        console.log(resultsArray);
      });

      // Create a new Article using the `result` object built from scraping
      db.Article.insertMany(resultsArray, { ordered: false })
        .then(function(dbArticle) {
          // View the added result in the console
          console.log(dbArticle);
          // res.send(dbArticle);
        })
        .catch(function(err) {
          // If an error occurred, log it
          console.log("********ERRRRRRR*******", err);
          res.send(err.result);
        });

      // Send a message to the client
      //   res.json(dbArticle);
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

  // Route for marking an article as 'saved' in the Articles collection
  app.put("/saved/:id", function(req, res) {
    console.log(req.body);
    db.Article.update(
      {
        _id: mongojs.ObjectID(req.params.id)
      },
      {
        $set: {
          saved: true
        }
      },

      function(error, removed) {
        // Log any errors from mongojs
        if (error) {
          console.log(error);
          res.send(error);
        } else {
          // Otherwise, send the mongojs response to the browser
          // This will fire off the success function of the ajax request
          console.log(removed);
          res.send(removed);
        }
      }
    );
  });

  // Route for getting all UNSAVED Articles from the db
  app.get("/unsaved", function(req, res) {
    db.Article.find({ saved: false })
      .then(function(dbArticle) {
        // If all Articles are successfully found, send them back to the client
        res.json(dbArticle);
      })
      .catch(function(err) {
        // If an error occurs, send the error back to the client
        res.json(err);
      });
  });

  // Route for getting all SAVED Articles from the db
  app.get("/saved", function(req, res) {
    db.Article.find({ saved: true })
      .then(function(dbArticle) {
        // If all Articles are successfully found, send them back to the client
        res.json(dbArticle);
      })
      .catch(function(err) {
        // If an error occurs, send the error back to the client
        res.json(err);
      });
  });

  // Route for deleting an Article from the db
  app.get("/deleteArticle/:id", function(req, res) {
    db.Article.remove(
      {
        _id: mongojs.ObjectID(req.params.id)
      },
      function(error, removed) {
        // Log any errors from mongojs
        if (error) {
          console.log(error);
          res.send(error);
        } else {
          // Otherwise, send the mongojs response to the browser
          // This will fire off the success function of the ajax request
          console.log(removed);
          res.send(removed);
        }
      }
    );
  });

  // Route for saving a Note to the db and associating it with an Article
  app.post("/savenote/:id", function(req, res) {
    // Create a new Note in the database
    db.Note.create(req.body)
      .then(function(dbNote) {
        return db.Article.findOneAndUpdate(
          {
            _id: mongojs.ObjectID(req.params.id)
          },
          { $push: { notes: dbNote._id } },
          { new: true }
        );
      })
      .then(function(dbArticle) {
        // If the Article was updated successfully, send it back to the client
        res.json(dbArticle);
      })
      .catch(function(err) {
        // If an error occurs, send it back to the client
        res.json(err);
      });
  });

  // Route for retrieving all Comments from the db
  app.get("/populated/:id", function(req, res) {
    // Find selected article
    db.Article.find({
      _id: mongojs.ObjectID(req.params.id)
    })
      // Specify that we want to populate this article with any associated notes
      .populate("notes")
      .then(function(dbArticle) {
        // If able to successfully find and associate all Articles and Notes, send them back to the client
        res.json(dbArticle);
      })
      .catch(function(err) {
        // If an error occurs, send it back to the client
        res.json(err);
      });
  });

  // Route for deleting a posted note from an Article
  app.post("/deleteNote/:id", function(req, res) {
    console.log(req.body);
    db.Article.update(
      {
        _id: mongojs.ObjectID(req.params.id)
      },
      // { $pull: { notes: dbNote._id } },
      {
        $set: {
          notes: []
        }
      },

      function(error, updated) {
        // Log any errors from mongojs
        if (error) {
          console.log(error);
          res.send(error);
        } else {
          // Otherwise, send the mongojs response to the browser
          // This will fire off the success function of the ajax request
          console.log(updated);
          res.send(updated);
        }
      }
    );
  });
};
