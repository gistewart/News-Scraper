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
      // console.log(data);
      for (var i = 0; i < data.length; i++) {
        $("#article-container").prepend(
          "<tr><td><h5><a href ='" +
            data[i].link +
            "'>" +
            data[i].title +
            "</a></h5>" +
            "<h6>" +
            data[i].summary +
            "</h6>" +
            "<td></td>" +
            "</td><td><button class='save-article-btn btn btn-info btn-sm' article-id='" +
            data[i]._id +
            "'>Save Article</button></td><tr>"
        );
      }
    });
  }

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
          "<tr><td><h5><a href ='" +
            data[i].link +
            "'>" +
            data[i].title +
            "</a></h5>" +
            "<h6>" +
            data[i].summary +
            "</h6>" +
            "<td></td>" +
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
      console.log(data);
      for (var i = 0; i < data.length; i++) {
        $("#article-container").prepend(
          "<tr><td><h5><a href ='" +
            data[i].link +
            "'>" +
            data[i].title +
            "</a></h5>" +
            "<h6>" +
            data[i].summary +
            "</h6>" +
            "<td></td>" +
            "</td><td><button class='article-notes-btn btn btn-secondary btn-sm' article-id='" +
            data[i]._id +
            "'>Article Notes</button></td><td><button class='delete-from-saved-btn btn btn-danger btn-sm' article-id='" +
            data[i]._id +
            "'>Delete from Saved</button></td><tr>"
        );
      }
    });
  }

  let articleNoteID;

  //When the 'Article Notes' button is clicked
  $(document).on("click", ".article-notes-btn", function(data) {
    // console.log("Article Notes button clicked");
    $("#posted-notes").val("");
    articleNoteID = $(this).attr("article-id");
    // console.log("Article note ID: " + articleNoteID);
    $.ajax({
      type: "GET",
      url: "/populated/" + articleNoteID
    }).then(function(data) {
      console.log(data);
      if (data) {
        $("#posted-notes").val(data[0].notes[0].comment);
      }
    });
    $(".article-modal").modal("show");
  });

  // When the 'Save Note' button is clicked
  $(document).on("click", "#save-note-btn", function(data) {
    console.log("Save note button clicked");
    $.ajax({
      type: "POST",
      url: "/savenote/" + articleNoteID,
      data: {
        comment: $("#commentID").val()
      }
    });
    $("#commentID").val("");
  });
});
