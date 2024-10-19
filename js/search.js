(function() {
  function dynamicallyLoadScript(url) {
    var script = document.createElement("script");  // create a script DOM node
    script.src = url;  // set its src to the provided URL
    document.head.appendChild(script);  // add it to the end of the head section of the page (could change 'head' to 'body' to add it to the end of the body section instead)
  }

  function showResults(results, store) {
    var searchResults = document.getElementById('search-results');

    if (results.length) { // If there are results...
      var appendString = '';

      for (var i = 0; i < results.length; i++) {  // Iterate over them and generate html
        var item = store[results[i].ref];
        appendString += '<li><a href="' + item.url + '"><h3>' + item.title + '</h3></a>';
        appendString += '<p>' + item.content.substring(0, 250) + '...</p></li>';
      }

      searchResults.innerHTML = appendString;
    } else {
      searchResults.innerHTML = '<li>No results found</li>';
    }
  }

  function getQuery(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split('&');

    for (var i = 0; i < vars.length; i++) {
      var pair = vars[i].split('=');

      if (pair[0] === variable) {
        return decodeURIComponent(pair[1].replace(/\+/g, '%20'));
      }
    }
  }

  var searchTerm = getQuery('query');

  if (searchTerm) {
    document.getElementById('search').setAttribute("value", searchTerm);

    // Initalize lunr.js with the fields to search.
    // The title field is given more weight with the "boost" parameter
    var idx = lunr(function () {
      this.field('id');
      this.field('title', { boost: 10 });
      this.field('authors');
      this.field('content');

      for (var key in window.store) { // Add the JSON we generated from the site content to Lunr.js.
        this.add({
          'id': key,
          'title': window.store[key].title,
          'authors': window.store[key].authors,
          'content': window.store[key].content
        });
      }
    });

    dynamicallyLoadScript(https://unpkg.com/lunr/lunr.js)
    var results = idx.search(searchTerm); // Perform search with Lunr.js
    showResults(results, window.store);
  }
})();
