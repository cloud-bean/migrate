var request = require('request');
var mongoose = require('mongoose');
require('./member.model.js');
var Member = mongoose.model('Member');
var iter=require('./iterateElements');

var saveMemberHandler = function (member, callback) {
  var member_obj = new Member(member);
  console.log(member_obj.toString());
  member_obj.save( function (err) {
      if (err) {
        return callback(err);
      } else {
          console.log(member_obj._id);
          callback(null);
      }
  });
}

/*
* elements 数组
* index 是序号
* handler格式 function (ele, function(err)) 格式
* callback 不带参数的回调函数。
*/

/*var iterateElements = function (elements, index, handler, callback) {
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
}*/

// url是地址,从所有的objects中取出[start:end]
exports.handleMembers = function (url, callback) {
  request.get(url, function (error, response, body) {
    if (error)
      return callback(error);  // 获取books出错，终止
    if (!error && response.statusCode == 200) {
       // console.log(body);
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
