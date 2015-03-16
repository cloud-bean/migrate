/**
 * 使用lib进行数据库移植
 */
var mongoose=require('mongoose');


var util = require('./index');

var config = {"database":"mongodb://localhost/hbg","baseurl":"http://www.cloud-bean.com","bookurl":"/book/mig_books/","memberurl":"/member/migrate/","recordurl":"/book/mig_records"};

var start = 0 ,end =20;

mongoose.connect(config.database);
bookurl = config.baseurl+config.bookurl+"?"+"start="+start+"&end="+end;
memberurl =  config.baseurl+config.memberurl;
recordurl =  config.baseurl+config.recordurl+"?"+"start="+start+"&end="+end;

//console.log(bookurl);
//console.log(memberurl);
//console.log(recordurl);

var callback = function(err){
    console.error(err);
};

//util.inventory.handleBooks(bookurl,callback);
//util.member.handleMembers(memberurl,callback);
util.record.handleRecord(recordurl,callback);

