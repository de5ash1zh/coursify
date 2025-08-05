import express from 'express';
import {
  createEnrollment,
  getUserEnrollments,
  updateEnrollmentProgress,
  getEnrollmentById,
} from '../controllers/enrollment.controller.js';
import authenticate from '../middlewares/auth.js';

const router = express.Router();

// Enrollment routes
router.post('/', authenticate, createEnrollment);
router.get('/:id', authenticate, getEnrollmentById);
router.put('/:id/progress', authenticate, updateEnrollmentProgress);

export default router; 