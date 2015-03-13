var mongoose = require('mongoose'),
  Schema = mongoose.Schema;
mongoose.connect('mongodb://localhost/hbg');

var MemberSchema = new Schema({
  phone_Number: {
    type: String,
    required: true
  },
  baby_name: {
    type: String,
    required: true
  },
  baby_birthday: Date,
  isBoy: Boolean,  // sexual
  card_Number: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  active_time: {
    type: Date,
    default: Date.now
  },
  valid_days: Number,
  level: {  	// 会员类型 0,1,2
    type: Number,
    enum: [0, 1, 2]
  },
  parent_name: String,
  address: String,
  email: {
    type: String,
    match: /.+\@.+\..+/
  } ,
  weixin: String,
  other: String,  // 备注
  head_photo: String // 头像
}, {
  collection: 'member'
});

var MemeberModel = mongoose.model('Member', MemberSchema);
