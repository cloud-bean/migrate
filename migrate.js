/**
 * 使用lib进行数据库移植
 */
var async = require('async');
var mongoose = require('mongoose');
var util = require('./index');

mongoose.connect(process.env.MONGOHQ_URL || "mongodb://localhost/hbg");

var start = 0,
    end   = 20;

var config = {
    "baseurl": "http://www.cloud-bean.com",
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
