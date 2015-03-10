# What
get the books inventory list .

## how

* request to the url http://domain/books/?format=json
* foreach book
	* store the book info to MonogoDB

## config

* url: http://domain/book/
* format: json
* strat: 0
* end: 100

通过参数设定从url地址获取所有的book纪录的json个数的数据，这些数据只取从start到end这么多个，太多了处理不过来

* model: 对应mongoDB中的那个数据模型
* callback: 回调函数

## do 

* store to mongoDB
* use jd-book module
    * get the book's basic info from jd.com
    * store to MongoDB


