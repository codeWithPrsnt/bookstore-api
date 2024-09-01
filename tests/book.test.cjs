  const chai =  require('chai');
  const chaiHttp =  require('chai-http');
  const { expect } = chai;

  chai.use(chaiHttp.default);  

  const app = require('../app.js');
  const Book = require('../models/book.js');
  const User = require('../models/user.js');
  const jwt = require('jsonwebtoken');


let token; // To store the JWT token for authenticated requests

describe('Books API', () => {
  before(async () => {
    
    await Book.deleteMany({});
    await User.deleteMany({});

   
    const user = await new User({ username: 'testuser', password: 'testpassword' }).save();
    token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  });

  describe('POST /api/books', () => {
    it('should create a new book', async () => {
      const res = await chai.request(app)
        .post('/api/books')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Book Title',
          author: 'Book Author',
          genre: 'Book Genre',
          publishedDate: '2024-01-01T00:00:00.000Z'
        });

      expect(res).to.have.status(201);
      expect(res.body).to.have.property('_id');
      expect(res.body.title).to.equal('Book Title');
      expect(res.body.author).to.equal('Book Author');
    });

    it('should not create a book without authentication', async () => {
      const res = await chai.request(app)
        .post('/api/books')
        .send({
          title: 'Book Title',
          author: 'Book Author',
          genre: 'Book Genre',
          publishedDate: '2024-01-01T00:00:00.000Z'
        });

      expect(res).to.have.status(401);
      expect(res.body).to.have.property('error');
    });
  });

  describe('GET /api/books', () => {
    it('should get a list of books', async () => {
      await new Book({
        title: 'Another Book Title',
        author: 'Another Author',
        genre: 'Another Genre',
        publishedDate: '2024-01-01T00:00:00.000Z'
      }).save();

      const res = await chai.request(app)
        .get('/api/books')
        .set('Authorization', `Bearer ${token}`);

      expect(res).to.have.status(200);
      expect(res.body).to.be.an('array');
      expect(res.body.length).to.be.greaterThan(0);
    });
  });

  describe('GET /api/books/:id', () => {
    let bookId;

    before(async () => {
      const book = await new Book({
        title: 'Unique Book Title',
        author: 'Unique Author',
        genre: 'Unique Genre',
        publishedDate: '2024-01-01T00:00:00.000Z'
      }).save();
      bookId = book._id;
    });

    it('should get a single book by ID', async () => {
      const res = await chai.request(app)
        .get(`/api/books/${bookId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res).to.have.status(200);
      expect(res.body).to.have.property('_id').eql(bookId.toString());
      expect(res.body.title).to.equal('Unique Book Title');
    });

    it('should return 404 if book does not exist', async () => {
      const res = await chai.request(app)
        .get('/api/books/invalid')
        .set('Authorization', `Bearer ${token}`);

      expect(res).to.have.status(404);
      expect(res.body).to.have.property('error');
    });
  });

  describe('PUT /api/books/:id', () => {
    let bookId;

    before(async () => {
      const book = await new Book({
        title: 'Old Title',
        author: 'Old Author',
        genre: 'Old Genre',
        publishedDate: '2024-01-01T00:00:00.000Z'
      }).save();
      bookId = book._id;
    });

    it('should update a book by ID', async () => {
      const res = await chai.request(app)
        .put(`/api/books/${bookId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Updated Title',
          author: 'Updated Author',
          genre: 'Updated Genre',
          publishedDate: '2024-02-01T00:00:00.000Z'
        });

      expect(res).to.have.status(200);
      expect(res.body.title).to.equal('Updated Title');
      expect(res.body.author).to.equal('Updated Author');
    });

    it('should return 404 if book does not exist', async () => {
      const res = await chai.request(app)
        .put('/api/books/invalid')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Updated Title',
          author: 'Updated Author',
          genre: 'Updated Genre',
          publishedDate: '2024-02-01T00:00:00.000Z'
        });

      expect(res).to.have.status(404);
      expect(res.body).to.have.property('error');
    });
  });

  describe('DELETE /api/books/:id', () => {
    let bookId;

    before(async () => {
      const book = await new Book({
        title: 'Book to Delete',
        author: 'Author',
        genre: 'Genre',
        publishedDate: '2024-01-01T00:00:00.000Z'
      }).save();
      bookId = book._id;
    });

    it('should delete a book by ID', async () => {
      const res = await chai.request(app)
        .delete(`/api/books/${bookId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res).to.have.status(200);
      expect(res.body).to.have.property('message').eql('Book deleted');
    });

    it('should return 404 if book does not exist', async () => {
      const res = await chai.request(app)
        .delete('/api/books/invalid')
        .set('Authorization', `Bearer ${token}`);

      expect(res).to.have.status(404);
      expect(res.body).to.have.property('error');
    });
  });
});

