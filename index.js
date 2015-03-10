var request = require('request');
var jdBook = require('jd-book');
var Book = require('./book.model');
var baseUrl = 'http://www.cloud-bean.com/book';
var count_url = baseUrl + '/count';
var book_inventory_count = 0;
var start = 0;
var step = 10;


var saveBookInventory = function (book) {
    var inventory = {
        "inv_code": book.location,
        "location": "",
        "in_time": book.in_time,
        "isRent": book.count - book.left_count > 0 ? true:false
    };
    var url = 'http://item.jd.com/' + book.pcode + '.html';
    jdBook.getbook({"url": url}, function (err, data) {
        //todo: save to db, model is book-basic
        // save bookBasicObj , then inventory.
        if (err)
          return null;
        console.log(data);
        Book.bookSave(data, function (err, book) {
            if (err) console.log('save basic book info failed.');
            // inventory.book = book;
            // console.log(inventory);
            console.log(book);
        });

        //Book.save(data, function (err, book) {
        //});
    });
};


var handleBooks = function (count, callback) {
    do {
        start += step;
        end = start + step;
        mig_url = baseUrl + '/mig/?start=' + start + '&end=' + end ;
        request.get(mig_url,function (error, response, body) {
          if (!error && response.statusCode == 200) {
              //console.log(body) // Show the HTML for the Google homepage.
              var result = JSON.parse(body);
              if (!result.err) {
                var books = result.books;
                for (var i=0; i<books.length; i++) {
                  // console.log('#' + books[i].id + ' is done!');
                  callback(books[i]);
                }
              }
            }
        });
    } while(start<count)
};


//
// request.get(count_url, function (err, res, body) {
//   if (!err && res.statusCode == 200) {
//     book_inventory_count = JSON.parse(body).count;
//     handleBooks(book_inventory_count, saveBookInventory);
//   }
// });

handleBooks(1, saveBookInventory);
