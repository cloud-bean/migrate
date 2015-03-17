var bmk = require('benchmark');
var mongoose = require('mongoose');
var util = require('../index');
var suite = new bmk.Suite();

mongoose.connect(process.env.MONGOHQ_URL || "mongodb://localhost/hbg");



var baseUrl = 'http://localhost:8000/book';
var start = 0;
var end = 100;
var mig_url = baseUrl + '/mig_books/?start=' + start + '&end=' + end ;

// result:
// forloop x 8,150 ops/sec ±12.26% (62 runs sampled)
// iter x 6,728 ops/sec ±18.00% (52 runs sampled)
// Fastest is forloop

// iter x 6,312 ops/sec ±6.97% (58 runs sampled)
// forloop x 7,110 ops/sec ±10.08% (57 runs sampled)
// Fastest is forloop

var iterCase = function () {
  var finish = function(err) { };
  util.inventory.handleBooks(mig_url, finish);
};

var forCase = function () {
  var finish = function(err) { };
  util.inventory.handleBooksWithForloop(mig_url, finish);
};

suite.add('iter', function () {
  iterCase();
}).add('forloop', function () {
  forCase();
}).on('cycle', function (event) {
  console.log(String(event.target));
}).on('complete', function () {
  console.log('Fastest is ' + this.filter('fastest').pluck('name'));
}).run({'async': true});
