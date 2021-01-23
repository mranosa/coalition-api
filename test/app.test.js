var chai = require('chai'),
  expect = require('chai').expect,
  chaiHttp = require('chai-http'),
  app = require('../app'),
  mongoose = require('mongoose'),
  db_url = 'mongodb://localhost:27017/coalition-test',
  port = 3001;

chai.use(chaiHttp);

describe('Books API', function() {
  var server;
  var createdBook;
  var book = {
      title: "title 1",
      author: "author 1", 
      price: 20
    };

  before(function(done) {
    mongoose.connect(db_url, {useCreateIndex: true , useNewUrlParser: true, useUnifiedTopology: true});
    server = app.listen(port);

    // clear database before testing
    mongoose.connection.on('connected', (err, conn) => {
      for (var i in mongoose.connection.collections) {
        mongoose.connection.collections[i].deleteMany({});
      }
      done();
    });
  });

  after(function() {
    server.close();
    mongoose.disconnect()
  });

  it('should ensure that api is up', function(done) {
    chai.request(app)
      .get('/')
      .end(function(err, res) {
        expect(res).to.have.status(200);
        done();
      });
  });

  // create
  it('should POST /books, valid request', function(done) {
    chai.request(app)
      .post('/books')
      .send(book)
      .end((err, res) => {
        expect(res.status).to.equal(201);
        expect(res.body.data.title).to.equal(book.title);

        createdBook = res.body.data;

        done();
    });
  });

  it('should POST /books, invalid request', function(done) {
    chai.request(app)
      .post('/books')
      .send({
        non_existent_param: "fail"
      })
      .end((err, res) => {
        expect(res.status).to.equal(500);
        done();
      });
  });

  // get
  it('should GET /books/:id, valid request', function(done) {
    chai.request(app)
      .get(`/books/${createdBook._id}`)
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.data.title).to.equal(book.title);
      done();
    });
  });

  it('should GET /books/:id, non existent request', function(done) {
    var non_existent_id = 123412341234;
    chai.request(app)
      .get(`/books/${non_existent_id}`)
      .end((err, res) => {
        expect(res.status).to.equal(404);
        done();
      });
  });

  it('should GET /books/:id, empty request', function(done) {
    chai.request(app)
      .get(`/books/`)
      .end((err, res) => {
        expect(res.status).to.equal(404);
        done();
      });
  });

  it('should GET /books/:id, invalid request', function(done) {
    chai.request(app)
      .get(`/books/asdfasdf****asdfasdf___________asdf`)
      .end((err, res) => {
        expect(res.status).to.equal(404);
        done();
      });
  });

  // TODO add code coverage
  // TODO add github actions

  // TODO update
  // TODO delete
  // TODO list
});