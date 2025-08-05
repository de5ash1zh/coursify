import express from 'express';
import {
  createFreeEnrollment,
  getEnrollmentHistory,
  getEnrollmentById,
} from '../controllers/payment.controller.js';
import authenticate from '../middlewares/auth.js';

const router = express.Router();

// Free enrollment routes (no payment required)
router.post('/', authenticate, createFreeEnrollment);
router.get('/history', authenticate, getEnrollmentHistory);
router.get('/:id', authenticate, getEnrollmentById);

export default router; 