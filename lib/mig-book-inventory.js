var request = require('request');
var mongoose = require('mongoose');
var iter=require('./iterateElements');
require('./inventory.model.js');
var Inventory = mongoose.model('Inventory');

var savebookHandler = function (book, next) {
  var tags = [];
  for(var i=0; i<book.tags.length; i++) {
    tags.push({"name": book.tags[i]});
  }
  var inventory = {
    "location": "",
    "in_time": book.in_time,
    "isRent": book.count - book.left_count > 0 ? true : false,
    "inv_code": book.location,
    "skuid": book.pcode,      // 书商品编号(jd.com)
    "url": book.url ,        // 书网页地址（jd.com）
    "name": book.name ,
    "isbn": book.isbn,       // 图书isbn
    "img": book.img,      // 图书封面图片
    "price": book.price,      // 图书售价
    "author": book.author ,     // 图书作者
    "pub": book.publication ,        // 出版社
    "pub_date": book.pub_date,     // 出版时间
    "pre_id": book.id,            // 原来数据中的id
    "tags": tags  // 直接存一个对象数组
  };

  var inventory_obj = new Inventory(inventory);
  inventory_obj.save( function (err) {
    if (err) {
      return next(err);
    } else {
      console.log("inventory: " + inventory_obj._id);
      next(null);
    }
  });
}

// url是图书的url地址，包含start和end参数，从所有的objects中取出[start:end]
// 设计start和end的原因是因为图书库存纪录较大，所以分批次，一次弄大概100条。
exports.handleBooks = function (url, callback) {
  request.get(url, function (error, response, body) {
    if (error)
      return callback(error);  // 获取books出错，终止
    if (!error && response.statusCode == 200) {
      var result = JSON.parse(body);
      if (!result.err) {
        var books = result.books;
        iter.iterateEle(books, 0, savebookHandler, function()
        {
          callback(null);
        });
      } else {
        return callback('err in parse body into json'); // 解析json出错，终止
      }
    }
  });
};
