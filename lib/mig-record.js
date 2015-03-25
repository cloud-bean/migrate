var request = require('request');
var mongoose = require('mongoose');
var async = require('async');
var iter=require('./iterateElements');
require('./member.model.js');
require('./inventory.model.js');
require('./record.model.js');
var Member = mongoose.model('Member');
var Inventory = mongoose.model('Inventory');
var Record = mongoose.model('Record');


var saveRecordHandler = function (record, callback) {
  async.series([
    function (callback) {
      Member.findOne({"pre_id": record.member}, callback);
    },
    function(callback) {
      Inventory.findOne({"pre_id": record.inventory}, callback);
    }
  ],
  function(err, results) {
    if (!err && results[0] && results[1]) {
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
          console.log("record: " + record_obj._id);
          callback(null);
        }
      });
    } else { // if findOne no matches , there is no err. but return with null.
      var msg = "err:";
      if (!results[0]) {
        msg += "member with id:" + record.member + " not found! ";
      }
      if (!results[1]) {
        msg += "inventory with id:" + record.inventory + "not found!";
      }
      return callback("#record id:[" + record.id + "] " + msg);
    }
  });
}

// url是地址,从所有的objects中取出[start:end]
exports.handleRecord = function (url, callback) {
  request.get(url, function (error, response, body) {
    if (error)
      return callback(error);  // 获取books出错，终止
    if (!error && response.statusCode == 200) {
      var result = JSON.parse(body);
      if (!result.err) {  // ?
        var records = result.records;
        iter.iterateEle(records, 0, saveRecordHandler, function()
        {
          callback(null);
        });
      } else {
        return callback('err in parse member into json'); // 解析json出错，终止
      }
    }
  });
};
