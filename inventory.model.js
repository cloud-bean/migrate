var mongoose = require('mongoose'),
  Schema = mongoose.Schema;
mongoose.connect('mongodb://localhost/hbg');

var InventorySchema = new Schema({
  location: {
    type: String,   // 位置
    default: ''
  },
  qr_code: {
    type: String,    // 入库编码
    default: ''
  },
  in_time: {
    type: Date,
    default: Data.now
  },
  isRent: {
    type: Boolean,    // 是否借出
    default: false
  },
  skuid: String,      // 书商品编号(jd.com)
  url: String,        // 书网页地址（jd.com）
  name: {
    type: String,       // 图书书名
    required: true
  },
  isbn: String,       // 图书isbn
  jqimg: String,      // 图书封面图片
  price: Number,      // wMaprice
  author: String,     // 图书作者
  pub: String,        // 出版社
  pub-time: Date      // 出版时间

}, {
  collection: 'inventory'
});

var InventoryModel = mongoose.model('Inventory', inventorySchema);

// type:Schema.ObjectID
// ref:
