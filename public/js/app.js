$(document).ready(function() {
  //When the scrape articles button is clicked
  $(document).on("click", "#scrape-articles", function(data) {
    console.log("I've been clicked");
    $.get("/scrape", function(data) {
      displayArticles(data);
    });
  });

  function displayArticles() {
    $.getJSON("/articles", function(data) {
      console.log(data);
      for (var i = 0; i < data.length; i++) {
        $("#article-container").prepend(
          "<tr><td>" + data[i].title + "</td></tr>"
        );
      }
    });
  }
});
