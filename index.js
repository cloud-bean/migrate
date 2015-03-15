var request = require('request');
var async = require('async');
var jdBook = require('jd-book');
var request = require('request');
var cheerio = require("cheerio");

var baseUrl = 'http://www.cloud-bean.com/book';
var baseUrl = 'http://localhost:8000/book';
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


var saveBookInventory = function (err, book) {
    //console.log(book);
    var inventory = {
        "location": "",
        "in_time": book.in_time,
        "isRent": book.count - book.left_count > 0 ? true:false,
        "inv_code": book.location,
        "skuid": book.pcode,      // 书商品编号(jd.com)
        "url": book.url ,        // 书网页地址（jd.com）
        "name": book.name ,
        "isbn": book.isbn,       // 图书isbn
        "img": book.jqimg,      // 图书封面图片
        "price": book.price,      // wMaprice
        "author": book.author ,     // 图书作者
        "pub": book.publication ,        // 出版社
        "pub_date": book.pub_date     // 出版时间
    };

    console.log(inventory);


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


// var handleEachBookWithWaterfall = function (err, _book) {
//   async.waterfall([
//     // function (callback) {
//     //   // request.get(count_url, function (err, res, body) {
//     //   //   if (!err && res.statusCode == 200) {
//     //   //     book_inventory_count = JSON.parse(body).count;
//     //   //     callback(null,book_inventory_count)
//     //   //   }
//     //   // });
//     //   callback(null, 10); // test .
//     // },
//     // function (count, callback) {
//     //   handleBooks(count, callback);
//     // },
//     function (callback) {
//       var url = 'http://item.jd.com/' + _book.pcode + '.html';
//       request(url, function (error, response, body) {
//         if (error)
//           return callback(error);
//
//         if (!error && response.statusCode == 404) {
//           return callback('404:not found');
//         }
//
//         if (!error && response.statusCode == 200) {
//           var product_obj = parseBookInfo(body);
//
//           if (product_obj.err)
//             return callback(product_obj.err)
//
//           callback(null, product_obj.book);
//         }
//       });
//     },
//     function(book_basic, callback) {
//       var inventory = {
//           "id": _book.id,
//           "inv_code": _book.location,
//           "location": "",
//           "in_time": _book.in_time,
//           "isRent": _book.count - _book.left_count > 0 ? true : false,
//           "book": book_basic
//       };
//       callback(null, inventory);
//     },
//     function(inventory, callback) {
//       // save book_basic to db,
//       // save inventory to db.
//       console.log(inventory);
//       callback(null, 'done');
//     }
//   ], function(err, result) {
//     if (err) console.log(err);
//     if (!err) {
//       done_counter++;
//       console.log(result + done_counter);
//     }
//
//   });
// };

handleBooks(10, saveBookInventory);
