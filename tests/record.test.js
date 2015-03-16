var mig = require('../index');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/hbg');

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

mig.record.handleRecord(mig_url, finish);
