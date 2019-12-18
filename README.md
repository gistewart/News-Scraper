# News-Scraper

## Project Functionality

This is a full-stack Node.js app that allows a user to view recent news headlines from the Reuters website (with links to the articles); save an article headline; and view, post and delete article notes. The primary purpose of this project is to demonstrate the usefulness of MongoDB, a document-oriented NoSQL database.

## Project Challenges

The main challenges of this project, and the solutions used, were as follows:

1. data scraping method: Axios, a Javascript library for performing HTTP requests, was used inside a `GET` request, to retrieve the headline, summary and link of each of the articles.
2. data scraping for the right data: chained `.children` methods were used to isolate the right HTML content, then Mongoose was used to add `documents` to the Articles `collection`.
3. display of number of new articles scraped on each scrape: the asychronous nature of the `GET` request and creation of articles in the db made this task problematic - pushing the article results into an array as they are being scraped, then using the Mongoose `insertMany` method on that array, resulted in Mongoose reporting the number of new articles or `documents` added to the database each time.
4. assocation of notes to articles: this was achieved via the schema design for the `Article` model and notes were displayed for each article using the `.populate` method on a `GET` request. This was an example of object-document mapping, or ODM.
5. response routing: the server is designed to handle multiple GET, PUT and POST requests using the Express.js framework.

## Project Usefulness

There are 5 main areas of note:

1. It uses MongoDB and Mongoose.js to create 2 collections - `Articles` and `Notes`
2. It uses Express.js, the most widely used Node.js server framework, to build a server on the back end
3. It uses the Path package to get the correct file path for HTML requests.
4. It uses the jQuery library including click events, together with routes between the client and the server, to save and delete `Articles` and `Notes`
5. Heroku is configured for deployment of the application

## How to get started

On page load, the user selects the `Scrape all articles` button. A modal will show the number of new articles added to the db. The user can then click on an article link, save an article, view a list of saved articles, view, save and delete notes associated with an article, and delete an article from the saved articles list. Clicking on the `Scrape all articles` again re-starts the process.

## How to get help

[Express.js](https://expressjs.com/)
[jQuery Official Website](https://jquery.com/)
[MongoDB Website](https://www.mongodb.com/)
[Robo 3T Website](https://robomongo.org/download)
[MongoJS Documentation](https://www.npmjs.com/package/mongojs)
[Mongoose Documentation](http://mongoosejs.com/docs/guide.html)

## Project maintenance and contributions

This is not an original app. Instead, this project was prepared as part of my course work at Georgia Tech's Full Stack Coding Boot Camp (Oct 2019 to Jan 2020).

## Deployed link

https://news-scraper-21026.herokuapp.com/
