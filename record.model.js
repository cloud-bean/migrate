var mongoose = require('mongoose'),
  Schema = mongoose.Schema;
mongoose.connect('mongodb://localhost/hbg');

var RecordSchema = new Schema({
  inventory: {
    type: Schema.ObjectId,
    ref: 'Inventory',
    required: true
  },
  member: {
    type: Schema.ObjectId,
    ref: 'Member',
    required: true
  },
  start_time: {
    type: Date,
    default: Date.now
  },
  end_time: Date
}, {
  collection: 'record'
});

var RecordModel = mongoose.model('Record', RecordSchema);
