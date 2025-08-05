import express from 'express';
import {
  createCourse,
  updateCourse,
  deleteCourse,
  getCourses,
  getCourseById,
  createLesson,
  updateLesson,
  deleteLesson,
} from '../controllers/course.controller.js';
import authenticate from '../middlewares/auth.js';
import restrictTo from '../middlewares/restrictTo.js';

const router = express.Router();

// Course routes
router.post('/', authenticate, restrictTo('INSTRUCTOR', 'ADMIN'), createCourse);
router.get('/', getCourses);
router.get('/:id', getCourseById);
router.put('/:id', authenticate, restrictTo('INSTRUCTOR', 'ADMIN'), updateCourse);
router.delete('/:id', authenticate, restrictTo('INSTRUCTOR', 'ADMIN'), deleteCourse);

// Lesson routes
router.post('/:courseId/lessons', authenticate, restrictTo('INSTRUCTOR', 'ADMIN'), createLesson);
router.put('/lessons/:id', authenticate, restrictTo('INSTRUCTOR', 'ADMIN'), updateLesson);
router.delete('/lessons/:id', authenticate, restrictTo('INSTRUCTOR', 'ADMIN'), deleteLesson);

export default router;
