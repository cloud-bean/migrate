var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/hbg');

var bookSchema = new mongoose.Schema({
  name: String,
  skuid: String,
  href: String,
  jqimg: String,
  wMaprice: String,
  wMeprice: String,
  cat:[]
}, {
  collection: 'book'
});

var bookModel = mongoose.model('Book', bookSchema);

var newBook = function (book) {
  return {
    name: book.name,
    skuid: book.skuid,
    href: book.herf,
    jqimg: book.jqimg,
    wMaprice: book.wMaprice,
    wMeprice: book.wMeprice,
    cat: book.cat
  }

};

module.exports.bookSave = function (book, callback) {
  bookModel(newBook(book)).save(function (err, book) {
    if (err) {
      return callback(err);
    }
    callback(null, book);
  });
};

// Book.get = function(skuid, callback) {
//   bookModel.findOne({skuid: skuid}, function(err, book) {
//     if (err) callback(err);
//     callback(null, book);
//   });
// };
