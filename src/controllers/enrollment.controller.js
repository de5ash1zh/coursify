import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Create enrollment
const createEnrollment = async (req, res) => {
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

    // Check for duplicate enrollment
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

    // Create enrollment
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
      message: 'Enrollment successful',
      enrollment,
    });
  } catch (error) {
    console.error('Create Enrollment Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get user enrollments
const getUserEnrollments = async (req, res) => {
  try {
    const { id } = req.params;
    const requestingUserId = req.user.userId;

    // Users can only view their own enrollments (unless admin)
    if (parseInt(id) !== requestingUserId && req.user.role !== 'ADMIN') {
      return res.status(403).json({
        message: 'You can only view your own enrollments',
      });
    }

    const enrollments = await prisma.enrollment.findMany({
      where: {
        userId: parseInt(id),
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
            lessons: {
              select: {
                id: true,
                title: true,
                order: true,
              },
              orderBy: {
                order: 'asc',
              },
            },
            _count: {
              select: {
                lessons: true,
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
    console.error('Get User Enrollments Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update enrollment progress
const updateEnrollmentProgress = async (req, res) => {
  try {
    const { id } = req.params;
    const { lessonId, completed } = req.body;
    const userId = req.user.userId;

    if (!lessonId) {
      return res.status(400).json({
        message: 'Lesson ID is required',
      });
    }

    // Check if enrollment exists and belongs to user
    const enrollment = await prisma.enrollment.findFirst({
      where: {
        id: parseInt(id),
        userId,
      },
      include: {
        course: {
          include: {
            lessons: true,
          },
        },
      },
    });

    if (!enrollment) {
      return res.status(404).json({
        message: 'Enrollment not found',
      });
    }

    // Check if lesson belongs to the enrolled course
    const lesson = enrollment.course.lessons.find(
      (l) => l.id === parseInt(lessonId)
    );

    if (!lesson) {
      return res.status(404).json({
        message: 'Lesson not found in this course',
      });
    }

    // Get current progress
    const currentProgress = enrollment.progress || {
      completedLessons: [],
      currentLesson: null,
      completedAt: null,
    };

    let updatedProgress = { ...currentProgress };

    if (completed) {
      // Add lesson to completed lessons if not already there
      if (!updatedProgress.completedLessons.includes(parseInt(lessonId))) {
        updatedProgress.completedLessons.push(parseInt(lessonId));
      }
    } else {
      // Remove lesson from completed lessons
      updatedProgress.completedLessons = updatedProgress.completedLessons.filter(
        (id) => id !== parseInt(lessonId)
      );
    }

    // Update current lesson
    updatedProgress.currentLesson = parseInt(lessonId);

    // Check if course is completed
    const totalLessons = enrollment.course.lessons.length;
    const completedLessonsCount = updatedProgress.completedLessons.length;

    if (completedLessonsCount === totalLessons) {
      updatedProgress.completedAt = new Date().toISOString();
    } else {
      updatedProgress.completedAt = null;
    }

    // Update enrollment
    const updatedEnrollment = await prisma.enrollment.update({
      where: {
        id: parseInt(id),
      },
      data: {
        progress: updatedProgress,
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
            lessons: {
              select: {
                id: true,
                title: true,
                order: true,
              },
              orderBy: {
                order: 'asc',
              },
            },
          },
        },
      },
    });

    res.json({
      message: 'Progress updated successfully',
      enrollment: updatedEnrollment,
      progress: {
        completedLessons: updatedProgress.completedLessons,
        currentLesson: updatedProgress.currentLesson,
        completedAt: updatedProgress.completedAt,
        totalLessons,
        completedLessonsCount,
        progressPercentage: Math.round((completedLessonsCount / totalLessons) * 100),
      },
    });
  } catch (error) {
    console.error('Update Enrollment Progress Error:', error);
    res.status(500).json({ message: 'Internal server error' });
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
            lessons: {
              select: {
                id: true,
                title: true,
                order: true,
              },
              orderBy: {
                order: 'asc',
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

    const progress = enrollment.progress || {
      completedLessons: [],
      currentLesson: null,
      completedAt: null,
    };

    const totalLessons = enrollment.course.lessons.length;
    const completedLessonsCount = progress.completedLessons.length;

    res.json({
      enrollment,
      progress: {
        ...progress,
        totalLessons,
        completedLessonsCount,
        progressPercentage: Math.round((completedLessonsCount / totalLessons) * 100),
      },
    });
  } catch (error) {
    console.error('Get Enrollment Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export {
  createEnrollment,
  getUserEnrollments,
  updateEnrollmentProgress,
  getEnrollmentById,
}; 