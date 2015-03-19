var request = require('request');
var mongoose = require('mongoose');
var async = require('async');
require('./member.model.js');
var Member = mongoose.model('Member');
var iter=require('./iterateElements');

var saveMemberHandler = function (member, callback) {
  
  var member_obj = new Member(member);
  async.series([
    function (callback) {
        Member.findOne({"card_number": member.card_number}, callback);
    }
  ], function (err, results) {
    if (err)
      return callback(err);

    if (!err && results[0]) {
      console.log(member_obj._id + ' already existed.');
      callback(null);
    } else {
      member_obj.save( function (err) {
        if (err) {
          return callback(err);
        } else {
          console.log(member_obj._id);
          callback(null);
        }
      });
    }
  });
}

// url是地址,从所有的objects中取出[start:end]
exports.handleMembers = function (url, callback) {
  request.get(url, function (error, response, body) {
    if (error)
      return callback(error);  // 获取books出错，终止
    if (!error && response.statusCode == 200) {
      var result = JSON.parse(body);
      if (!result.err) {
        var members = result.members;
        iter.iterateEle(members, 0, saveMemberHandler, function()
        {
          callback(null);
        });
      } else {
        return callback('err in parse member into json'); // 解析json出错，终止
      }
    }
  });
};
