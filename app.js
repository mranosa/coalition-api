var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var app = express();

// TODO: Pull me out to another file
// var port = 3000;
// var server = app.listen(port, () => {
//   console.log(`Example app listening at http://localhost:${port}`)
// })

var Book = mongoose.model('Book', new mongoose.Schema({
  title: { type : String , unique : true, required : true, dropDups: true },
  author: String,
  price: Number
}));

app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.post('/books', function(req, res){    
  new Book(req.body).save((err, book) => {
    if(err) {
      res.status(500).send({ message: err.message });
      return;
    }
    
    res.status(201).json({data: book});
  });
});

app.get('/books/:id', function(req, res){
  // TODO Is it better to promisify this?
  Book.findOne({_id: req.params.id}, (err, book) => {
    if(!book) {
      res.status(404).send({ message: 'Book not found!' }); 
      return;
    }

    if(err) {
      res.status(500).send({ message: err.message }); 
      return;
    }

    res.status(200).json({data: book});
  });
});

module.exports = app;