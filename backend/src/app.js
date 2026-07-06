import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { clerkMiddleware } from '@clerk/express';

import itemsRouter from './routes/items.js';
import usersRouter from './routes/users.js';
import dashboardRouter from './routes/dashboard.js';
import uploadRouter from './routes/upload.js';

dotenv.config();


const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Apply Clerk middleware globally to parse auth sessions
app.use(clerkMiddleware());

// Routes
app.use('/api/items', itemsRouter);
app.use('/api/users', usersRouter);
app.use('/api/dashboard', dashboardRouter);
app.use('/api/upload', uploadRouter);

// Base route check
app.get('/', (req, res) => {
  res.json({ message: 'Lost and Found API is running smoothly' });
});

// 404 Route handler
app.use((req, res, next) => {
  res.status(404).json({ error: 'Route not found' });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
