var request = require('request');
// var mongoose = require('mongoose');

var baseUrl = 'http://localhost:8000/book';
var count_url = baseUrl + '/count';
var mig_url = baseUrl + '/mig/?start=0&end=10';

request.get(count_url, function (err, res, body) {
  if (!err && res.statusCode == 200) {
    console.log("count:" + JSON.parse(body).count);
  }
});

request.get(mig_url,function (error, response, body) {
  if (!error && response.statusCode == 200) {
      //console.log(body) // Show the HTML for the Google homepage.
      var result = JSON.parse(body);
      if (!result.err) {
        var books = result.books;
        for (var i=0; i<books.length; i++) {
          console.log(books[i]);
        }
      }
    }
});
