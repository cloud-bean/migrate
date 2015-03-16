var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

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
  start_date: {
    type: Date,
    default: Date.now
  },
  status: String,    // R 借阅中， A 已经归还
  return_date: Date
}, {
  collection: 'record'
});

var RecordModel = mongoose.model('Record', RecordSchema);
