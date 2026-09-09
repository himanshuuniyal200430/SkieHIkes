import express from 'express';
import { protect } from '../middleware/auth.js';
import {
  createBooking,
  getBookingStatus,
  getAllBookings,
  getDashboardStats,
  getBookingById,
  updateBookingStatus,
  deleteBooking,
} from '../controllers/bookingController.js';

const router = express.Router();

// Public routes
router.post('/', createBooking);
router.get('/status/:bookingId', getBookingStatus);

// Admin routes
router.get('/dashboard', protect, getDashboardStats);
router.get('/', protect, getAllBookings);
router.get('/:id', protect, getBookingById);
router.patch('/:id/status', protect, updateBookingStatus);
router.delete('/:id', protect, deleteBooking);

export default router;
