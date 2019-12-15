$(document).ready(function() {
  //When the 'Scrape all articles' button is clicked
  $(document).on("click", "#scrape-articles", function(data) {
    console.log("Scrape articles button clicked");
    $.get("/scrape", function(data) {
      displayArticles(data);
    });
  });

  function displayArticles() {
    $("#article-container").empty();
    $.getJSON("/articles", function(data) {
      console.log(data);
      for (var i = 0; i < data.length; i++) {
        $("#article-container").prepend(
          "<tr><td>" +
            data[i].title +
            "</td><td><button class='save-article-btn btn btn-info btn-sm' article-id='" +
            data[i]._id +
            "'>Save Article</button></td><tr>"
        );
      }
    });
  }

  // $(document).on("click", ".save-article-btn", function(data) {
  //   var thisID = $(this).attr("article-id");
  //   $.ajax({
  //     type: "GET",
  //     url: "/delete/" + thisID
  //   });
  // });

  // When a Save Article button is clicked
  $(document).on("click", ".save-article-btn", function(data) {
    var thisID = $(this).attr("article-id");
    $.ajax({
      type: "PUT",
      url: "/saved/" + thisID
    });
    displayUnsavedArticles();
  });

  function displayUnsavedArticles() {
    $("#article-container").empty();
    $.getJSON("/unsaved", function(data) {
      // console.log(data);
      for (var i = 0; i < data.length; i++) {
        $("#article-container").prepend(
          "<tr><td>" +
            data[i].title +
            "</td><td><button class='save-article-btn btn btn-info' article-id='" +
            data[i]._id +
            "'>Save Article</button></td><tr>"
        );
      }
    });
  }

  //When the 'View saved articles' button is clicked
  $(document).on("click", "#saved-articles", function(data) {
    console.log("Saved button clicked");
    $.get("/saved", function(data) {
      displaySavedArticles(data);
    });
  });

  function displaySavedArticles() {
    $("#article-container").empty();
    $.getJSON("/saved", function(data) {
      // console.log(data);
      for (var i = 0; i < data.length; i++) {
        $("#article-container").prepend(
          "<tr><td>" +
            data[i].title +
            "</td><td><button class='save-article-btn btn btn-info' article-id='" +
            data[i]._id +
            "'>Save Article</button></td><tr>"
        );
      }
    });
  }
});
