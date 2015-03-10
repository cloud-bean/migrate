# What
get the books inventory list .

## how

* request to the url http://domain/books/?format=json
* foreach book
	* store the book info to MonogoDB

## config

* BaseUrl: http://domain/books/
* strat: 0
* end: 100

combine the params to http://domain/books/?start=xx&end=yy

通过参数设定从url地址获取所有的book纪录的json个数的数据，这些数据只取从start到end这么多个，太多了处理不过来

* model: 对应MongoDB中的那个数据模型
* callback: 回调函数

## model

获取的数据sample:

```
{
		"err": false,
		"books": {
        "19": {
            "count": 5,
            "left_count": 5,
            "pcode": "11242172",
            "tag": null,
            "isbn": "7539105002112",
            "name": "不一样的卡梅拉·第二季（套装全12册）",
            "sub_number": 1,
            "in_time": "2014-09-30T05:46:55Z",
            "location": "1-1"
        },
        "20": {
            "count": 1,
            "left_count": 0,
            "pcode": "11242172",
            "tag": null,
            "isbn": "7539105002112",
            "name": "不一样的卡梅拉·第二季（套装全12册）",
            "sub_number": 2,
            "in_time": "2014-09-30T05:47:12Z",
            "location": "1-23-1"
        }
		},
		"err": false,
}
```
** model in MongoDB **


## next()

* store to mongoDB
* use jd-book module
    * get the book's basic info from jd.com
    * store to MongoDB
