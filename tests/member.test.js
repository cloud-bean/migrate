var mig = require('../index');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/hbg-dev');

var finish = function(err) {
  if (!err) {
    console.log("Done all calls!");
  } else {
    console.warn(err);
  }
  mongoose.disconnect();  // 否则终端不退出
};


var baseUrl = 'http://localhost:8000/member';
mig_url = baseUrl + '/migrate/';

mig.member.handleMembers(mig_url, finish);
