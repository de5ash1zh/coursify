import express from 'express';
import authenticate from '../middlewares/auth.js';

import restrictTo from '../middlewares/restrictTo.js';
import createCourse from '../controllers/course.controller.js';

const router = express.Router();

// POST /api/v1/courses (instructors only)
router.post('/', authenticate, restrictTo('INSTRUCTOR', 'ADMIN'), createCourse);

export default router;
