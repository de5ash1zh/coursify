import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Create free enrollment (no payment required)
const createFreeEnrollment = async (req, res) => {
  try {
    const { courseId } = req.body;
    const userId = req.user.userId;

    if (!courseId) {
      return res.status(400).json({
        message: 'Course ID is required',
      });
    }

    // Check if course exists and is not deleted
    const course = await prisma.course.findFirst({
      where: {
        id: parseInt(courseId),
        deletedAt: null,
      },
    });

    if (!course) {
      return res.status(404).json({
        message: 'Course not found',
      });
    }

    // Check if user is already enrolled
    const existingEnrollment = await prisma.enrollment.findFirst({
      where: {
        userId,
        courseId: parseInt(courseId),
      },
    });

    if (existingEnrollment) {
      return res.status(409).json({
        message: 'You are already enrolled in this course',
      });
    }

    // Create enrollment directly (no payment required)
    const enrollment = await prisma.enrollment.create({
      data: {
        userId,
        courseId: parseInt(courseId),
        progress: {
          completedLessons: [],
          currentLesson: null,
          completedAt: null,
        },
      },
      include: {
        course: {
          include: {
            instructor: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    res.status(201).json({
      message: 'Enrollment successful! Course is now free.',
      enrollment,
    });
  } catch (error) {
    console.error('Create Enrollment Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get enrollment history for user
const getEnrollmentHistory = async (req, res) => {
  try {
    const userId = req.user.userId;

    const enrollments = await prisma.enrollment.findMany({
      where: {
        userId,
      },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            instructor: {
              select: {
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        enrollmentDate: 'desc',
      },
    });

    res.json({
      enrollments,
      total: enrollments.length,
    });
  } catch (error) {
    console.error('Get Enrollment History Error:', error);
    res.status(500).json({
      message: 'Failed to fetch enrollment history',
      error: error.message,
    });
  }
};

// Get enrollment by ID
const getEnrollmentById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const enrollment = await prisma.enrollment.findFirst({
      where: {
        id: parseInt(id),
        userId,
      },
      include: {
        course: {
          include: {
            instructor: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if (!enrollment) {
      return res.status(404).json({
        message: 'Enrollment not found',
      });
    }

    res.json({ enrollment });
  } catch (error) {
    console.error('Get Enrollment Error:', error);
    res.status(500).json({
      message: 'Failed to fetch enrollment',
      error: error.message,
    });
  }
};

export {
  createFreeEnrollment,
  getEnrollmentHistory,
  getEnrollmentById,
}; 