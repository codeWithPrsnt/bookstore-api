import express from 'express';
const router = express.Router();
import {createBook,getBook,getBooks,updateBook,deleteBook} from '../controllers/bookController.js';
import authenticate from '../middleware/authenticate.js';

router.post('/', authenticate, createBook);
router.get('/', getBooks);
router.get('/:id', getBook);
router.put('/:id', authenticate, updateBook);
router.delete('/:id', authenticate, deleteBook);

export default router;
