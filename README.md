# What
get the books inventory list .

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

```
- "inv_id"     // 入库原来id
- "count"      // 同一本书总数, 大于1的，统计了一共90个。
- "left_count" // 库存余数
+ "in_time"  // 入库时间
+ "location" // 对应的格子位置
+ "inv_code" // 入库条码 format: 10410000xxxx
+ "isRented"   // 是否借出
+ "book"     // 对应另一个Model: Book

Book中：
"name"
"pcode"
"isbn"
... by jd-book module.
```

## 与原来数据库改变的地方
* 一模一样的书现在通过入库的自制的条形码来唯一地区分，不存在同一本书了。所以不需要统计同一本书的总数和库存余数。
* 过渡阶段需要统计出哪些书的入库编号一样，但是数量不是1个的，需要每个都贴上自制的条形码。

## 过渡阶段，对接hbg系统的解决办法
1. 所有inv_code合法的都直接转出进行操作
2. 没有自制条码的，贴码，在系统中进行入库操作。
3. 有自制条码，但是系统说找不到的或者图书信息错误的，登记本子上，技术员手动修改。

[hbg](https://github.com/cloud-bean/hbg)

## next()

* store to mongoDB
* use jd-book module
    * get the book's basic info from jd.com
    * store to MongoDB
