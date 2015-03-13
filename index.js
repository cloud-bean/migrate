var request = require('request');
var async = require('async');
var jdBook = require('jd-book');
var request = require('request');
var cheerio = require("cheerio");

var baseUrl = 'http://www.cloud-bean.com/book';
var count_url = baseUrl + '/count';
var book_inventory_count = 0;
var start = 0;
var step = 10;

var done_counter = 0;
var config = {
  url: '',
  startStr: 'window.pageConfig={compatible:true,searchType: 1,product:',
  endStr: '};'
}

var preParseStrSlice = function (book_str) {
  return book_str.slice(config.startStr.length, 0 - config.endStr.length);
}

var parseBookInfo = function (htmlbody) {
  var $ = cheerio.load(htmlbody);
  var result = {
    err: null,
    book: {}
  }

  try {
    var book_str = $("script")[0].children[0].data.trim();
    result.book = JSON.parse(preParseStrSlice(book_product_str));
  } catch (err) {
    result.err = 'err when json parse.\n' + err.toString() +preParseStrSlice(book_product_str);
  }

  if (!result.err) // parse the script good.
    return result;

  // or parse the html page.
  try {

    result.err = null;
  } catch (err) {
    result.err = 'err when parse html page.\n' + err.toString() ;
  }
  return result;
}
var saveBookInventory = function (book, callback) {
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
      end = start + step;
      mig_url = baseUrl + '/mig/?start=' + start + '&end=' + end ;
      request.get(mig_url,function (error, response, body) {
        if (!error && response.statusCode == 200) {
            //console.log(body) // Show the HTML for the Google homepage.
            var result = JSON.parse(body);
            if (!result.err) {
              var books = result.books;
              for (var i= 0; i <books.length; i++) {
                // console.log('#' + books[i].id + ' is done!');
                callback(null, books[i]);
              }
            }
          }
      });
      start = end;
    } while(start < count);
};


//
// request.get(count_url, function (err, res, body) {
//   if (!err && res.statusCode == 200) {
//     book_inventory_count = JSON.parse(body).count;
//     handleBooks(book_inventory_count, saveBookInventory);
//   }
// });


var handleEachBook = function (err, _book) {
  async.waterfall([
    // function (callback) {
    //   // request.get(count_url, function (err, res, body) {
    //   //   if (!err && res.statusCode == 200) {
    //   //     book_inventory_count = JSON.parse(body).count;
    //   //     callback(null,book_inventory_count)
    //   //   }
    //   // });
    //   callback(null, 10); // test .
    // },
    // function (count, callback) {
    //   handleBooks(count, callback);
    // },
    function (callback) {
      var url = 'http://item.jd.com/' + _book.pcode + '.html';
      request(url, function (error, response, body) {
        if (error)
          return callback(error);

        if (!error && response.statusCode == 404) {
          return callback('404:not found');
        }

        if (!error && response.statusCode == 200) {
          var product_obj = parseBookInfo(body);

          if (product_obj.err)
            return callback(product_obj.err)

          callback(null, product_obj.book);
        }
      });
    },
    function(book_basic, callback) {
      var inventory = {
          "id": _book.id,
          "inv_code": _book.location,
          "location": "",
          "in_time": _book.in_time,
          "isRent": _book.count - _book.left_count > 0 ? true : false,
          "book": book_basic
      };
      callback(null, inventory);
    },
    function(inventory, callback) {
      // save book_basic to db,
      // save inventory to db.
      console.log(inventory);
      callback(null, 'done');
    }
  ], function(err, result) {
    if (err) console.log(err);
    if (!err) {
      done_counter++;
      console.log(result + done_counter);
    }

  });
};

handleBooks(10, handleEachBook);
