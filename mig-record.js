var request = require('request');
var mongoose = require('mongoose');
var async = require('async');
require('./member.model.js');
require('./inventory.model.js');
require('./record.model.js');
mongoose.connect('mongodb://localhost/hbg');
var Member = mongoose.model('Member');
var Inventory = mongoose.model('Inventory');
var Record = mongoose.model('Record');


var saveRecordHandler = function (record, callback) {
  //  console.log(record);
  async.series([
    function (callback) {
      Member.findOne({"pre_id": record.member}, callback);
    },
    function(callback) {
      Inventory.findOne({"pre_id": record.inventory}, callback);
    }
  ],
  function(err, results) {
    var new_record = {
        "inventory": results[1],
        "member": results[0],
        "status": record.status,
        "start_date": record.start_date,
        "return_date": record.return_date };
    var record_obj = new Record(new_record);
    record_obj.save(function (err) {
      if (err) {
       return callback(err);
      } else {
         callback(null);
      }
    });
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

// url是地址,从所有的objects中取出[start:end]
var handleRecord = function (url, callback) {
  request.get(url, function (error, response, body) {
    if (error)
      return callback(error);  // 获取books出错，终止
    if (!error && response.statusCode == 200) {
        var result = JSON.parse(body);
        //console.log(result);
        if (!result.err) {  // ?
          var records = result.records;
          iterateElements(records, 0, saveRecordHandler, function()
          {
            callback(null);
          });
        } else {
            return callback('err in parse member into json'); // 解析json出错，终止
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
mig_url = baseUrl + '/mig_records/';

handleRecord(mig_url, finish);
