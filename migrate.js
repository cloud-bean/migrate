/**
 * 使用lib进行数据库移植
 */
var async = require('async');
var mongoose = require('mongoose');
var util = require('get-book-inventory');
// var util = require('./index.js');
mongodb_conn_str = process.env.MGLIB_CONN_STRING || "mongodb://localhost/hbg-dev";
mongoose.connect(mongodb_conn_str, function (err) {
    if (err) 
        console.log('conn faild:' + err);   
});

var start = 0,
    end   = 2000;

var config = {
    "baseurl": process.env.MIG_BASE_URL || "http://localhost:8000",
    "bookurl": "/book/mig_books/?start=" + start + "&end=" + end,
    "memberurl": "/member/migrate/",
    "recordurl": "/book/mig_records"
};

var bookurl   = config.baseurl + config.bookurl,
    memberurl =  config.baseurl + config.memberurl,
    recordurl =  config.baseurl + config.recordurl;

var finish = function(err) {
  if (!err) {
    console.log("Done all calls!");
  } else {
    console.warn(err);
  }
  mongoose.disconnect();  // 任务完成后，断开数据库连接，否则终端不退出
};


async.waterfall([ // 依次执行，如果异常错误则执行finish回调函数。
  function (callback) {
    util.inventory.handleBooks(bookurl, callback);
  },
  function (callback) {
    util.member.handleMembers(memberurl, callback);
  },
  function (callback) {
    util.record.handleRecord(recordurl, callback);
  }
],function (err, result) {
  finish(err);
});
