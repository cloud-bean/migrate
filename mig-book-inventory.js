var request = require('request');
var mongoose = require('mongoose');
require('./inventory.model.js');
mongoose.connect('mongodb://localhost/hbg');
var Inventory = mongoose.model('Inventory');

var savebookHandler = function (book, next) {
  // todo: save tags and tag-inventory link.
  var tags = [];
  for(var i=0; i<book.tags.length; i++) {
      tags.push({"name":book.tags[i]});
  }
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
    "pub_date": book.pub_date,     // 出版时间
    "pre_id": book.id,            // 原来数据中的id
    "tags": tags  // 直接存一个数组。
  };

  var inventory_obj = new Inventory(inventory);
  inventory_obj.save( function (err) {
    if (err) {
      return next(err);
    } else {
      console.log(inventory_obj._id);
      next(null);
    }
  });
}

/*
* elements 数组
* index 是序号
* handler格式 function (ele, function(err)) 格式
* callback 不带参数的回调函数。
*/

var iterateElements = function (elements, index, handler, callback) {
  if (index == elements.length)
     return callback();
  // do database call with element
  var ele = elements[index];
  handler(ele, function (err) {
    if (err) {
      console.log(err);  // 迭代的处理函数中出现错误，打印并继续迭代。
    }
    iterateElements(elements, index + 1, handler, callback);
  });
}

// url是图书的url地址，包含start和end参数，从所有的objects中取出[start:end]
var handleBooks = function (url, callback) {
  request.get(url, function (error, response, body) {
    if (error)
      return callback(error);  // 获取books出错，终止
    if (!error && response.statusCode == 200) {
        var result = JSON.parse(body);
        if (!result.err) {
          var books = result.books;
          iterateElements(books, 0, savebookHandler, function()
          {
            callback(null);
          });
        } else {
            return callback('err in parse body into json'); // 解析json出错，终止
        }
    }
  });
};

var finish = function(err) {
  if (!err) {
    console.log("Done all calls!");
  } else {
    console.warn(err);
  }
  mongoose.disconnect();  // 否则终端不退出
};


var baseUrl = 'http://localhost:8000/book';
var start = 0;
var end = 100;
mig_url = baseUrl + '/mig_books/?start=' + start + '&end=' + end ;

handleBooks(mig_url, finish);
