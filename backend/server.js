import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import packageRoutes from './routes/packages.js';
import bookingRoutes from './routes/bookings.js';
import adminRoutes from './routes/admin.js';
import contactRoutes from './routes/contact.js';
import galleryRoutes from './routes/gallery.js';
import faqRoutes from './routes/faq.js';
import { seedAdmin } from './controllers/adminController.js';
import cookieParser from 'cookie-parser';

// __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
const allowedOrigins = [
  'https://matrikatoursandtravels.onrender.com',
  'https://matrikatoursandtravels.com',
  process.env.FRONTEND_URL,
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // allow requests with no origin (e.g. mobile apps, curl, Postman)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS blocked: ${origin}`));
    }
  },
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded images statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/packages', packageRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/faq', faqRoutes);

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'Trek Booking API is running' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Server error',
  });
});

const PORT = process.env.PORT || 5000;

// Start server first so it passes health checks and doesn't crash on deploy
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

// Database connection with error control and retry logic
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/trek_booking');
    console.log('MongoDB connected successfully');
    await seedAdmin(); // creates default admin if none exists
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    console.log('Server is running, but database connection failed. Retrying in 5 seconds...');
    // Retry connection after 5 seconds instead of crashing
    setTimeout(connectDB, 5000);
  }
};

connectDB();
