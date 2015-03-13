var mongoose = require('mongoose'),
  Schema = mongoose.Schema;
mongoose.connect('mongodb://localhost/hbg');

var TagSchema = new Schema({
  name: {
    type: String,
    required: true,
    index: true,
    unique: true
}, {
  collection: 'tag'
});

var TagInventorySchema = new Schema({
  tag: {
    type: Schema.ObjectId,
    ref: 'Tag'
  },
  inventory: {
    type: Schema.ObjectId,
    ref: 'Inventory'
  }
}, {
  collection: 'tag'
});


var TagModel = mongoose.model('Tag', TagSchema);
var TagInventoryModel = mongoose.model('TagInventory', TagInventorySchema);
