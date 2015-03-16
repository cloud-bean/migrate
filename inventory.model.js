var mongoose = require('mongoose'),
Schema = mongoose.Schema;
mongoose.connect('mongodb://localhost/test');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
    console.log('connected!');
});
var InventorySchema = new Schema({
    location: {
	type: String,     // 库存位置
	default: ''
    },
    inv_code: {         // 入库编码	
	type: String,
	default: ''
    },
    in_time: {          // 入库时间
	type: Date,
	default: Date.now
    },
    isRent: {
	type: Boolean,    // 是否借出
	default: false
    },
    skuid: {            // 书商品编号(jd.com)
	type: String,
	default: ''
    },
    url: {              // 书网页地址（jd.com）
	type: String,
	default: ''
    },
    name: {             // 图书书名
	type: String,
	required: true
    },
    isbn: String,       // 图书isbn
    img: String,        // 图书封面图片
    price: Number,      // wMaprice
    author: String,     // 图书作者
    pub_by: String,     // 出版社
    pub_date: Date      // 出版时间

}, {
    collection: 'inventory'
});


exports.Inventory=mongoose.model('Inventory', InventorySchema);

