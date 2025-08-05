import express from 'express';
import {
  createReview,
  getCourseReviews,
  updateReview,
  deleteReview,
  getUserReviews,
} from '../controllers/review.controller.js';
import authenticate from '../middlewares/auth.js';

const router = express.Router();

// Course review routes
router.post('/courses/:courseId/reviews', authenticate, createReview);
router.get('/courses/:courseId/reviews', getCourseReviews);
router.put('/reviews/:id', authenticate, updateReview);
router.delete('/reviews/:id', authenticate, deleteReview);

// User review routes
router.get('/user/reviews', authenticate, getUserReviews);

export default router; 