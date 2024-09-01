import express from 'express';
import bodyParser from 'body-parser';
import authRoutes from './routes/authRoutes.js';
import bookRoutes from './routes/bookRoutes.js';
import { handleError } from './utils/errorHandler.js';
import connectDB from './config/db.js';
import limiter from './utils/limiter.js';

import 'dotenv/config';

const app = express();
app.use(bodyParser.json());


connectDB();
app.use(limiter)
app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);
app.use(handleError);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
  });
  
  
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

export default app;