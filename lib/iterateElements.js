/*
* elements 数组
* index 是序号
* handler格式 function (ele, function(err)) 格式
* callback 不带参数的回调函数。
*/
exports.iterateEle = function (elements, index, handler, callback) {
  if (index == elements.length)
    return callback();

  var ele = elements[index];

  handler(ele, function(err) {
    if (err) {
	    console.log(err); // 迭代处理函数中出现错误，打印并继续迭代。
    }
    exports.iterateEle(elements, index + 1, handler, callback);
	});
};

/*
* 非递归版，在tests/benchmark.js中测试结果显示，forEachEle 更快。
*/
exports.forEachEle = function (elements, index, handler, callback) {
  var succ = 0,
      fail = 0;

  for (; index < elements.length; index++) {
    var ele = elements[index];
    handler(ele, function(err) {
      if (err) {
        fail++;
  	    console.log(err); // 迭代处理函数中出现错误，打印并继续迭代。
      } else {
        succ++;
      }
      if (succ+fail === elements.length) {
        return callback();
      }
    });
  }
};
