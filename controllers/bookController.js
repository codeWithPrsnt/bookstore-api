import Book from '../models/book.js';
import { validateBook } from '../utils/validation.js';
import paginate from '../utils/pagination.js';
import logger from '../utils/logger.js';

// Create a new book
export const createBook = async (req, res) => {
  try {
    const { error } = validateBook(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });
    logger.info('Creating a new book', { data: req.body });
    const book = new Book(req.body);
    await book.save();
    res.status(201).json(book);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Read all books with pagination
export const getBooks = async (req, res) => {
  try {
    const { skip, limit } = paginate(req.query);
    const { title, author, genre } = req.query;
    const query = {};
    if (title) query.title = new RegExp(title, 'i');
    if (author) query.author = new RegExp(author, 'i');
    if (genre) query.genre = new RegExp(genre, 'i');
    const books = await Book.find(query).skip(skip).limit(Number(limit));
    res.json(books);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Read a single book
export const getBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).send('Book not found');
    res.json(book);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a book
export const updateBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!book) return res.status(404).send('Book not found');
    res.json(book);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a book
export const deleteBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) return res.status(404).send('Book not found');
    res.json({ message: 'Book deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
