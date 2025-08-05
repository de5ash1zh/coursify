import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Create review
const createReview = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user.userId;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        message: 'Rating is required and must be between 1 and 5',
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

    // Check if user is enrolled in the course
    const enrollment = await prisma.enrollment.findFirst({
      where: {
        userId,
        courseId: parseInt(courseId),
      },
    });

    if (!enrollment) {
      return res.status(403).json({
        message: 'You must be enrolled in this course to leave a review',
      });
    }

    // Check if user has already reviewed this course
    const existingReview = await prisma.review.findFirst({
      where: {
        userId,
        courseId: parseInt(courseId),
      },
    });

    if (existingReview) {
      return res.status(409).json({
        message: 'You have already reviewed this course',
      });
    }

    // Create review
    const review = await prisma.review.create({
      data: {
        userId,
        courseId: parseInt(courseId),
        rating: parseInt(rating),
        comment: comment || null,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    // Calculate and update average rating
    await updateCourseAverageRating(parseInt(courseId));

    res.status(201).json({
      message: 'Review submitted successfully',
      review,
    });
  } catch (error) {
    console.error('Create Review Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get course reviews with pagination
const getCourseReviews = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    // Check if course exists
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

    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where: {
          courseId: parseInt(courseId),
        },
        skip,
        take,
        include: {
          user: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      prisma.review.count({
        where: {
          courseId: parseInt(courseId),
        },
      }),
    ]);

    // Calculate rating distribution
    const ratingDistribution = await prisma.review.groupBy({
      by: ['rating'],
      where: {
        courseId: parseInt(courseId),
      },
      _count: {
        rating: true,
      },
    });

    const distribution = {};
    for (let i = 1; i <= 5; i++) {
      distribution[i] = 0;
    }
    ratingDistribution.forEach(item => {
      distribution[item.rating] = item._count.rating;
    });

    res.json({
      reviews,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
      courseInfo: {
        id: course.id,
        title: course.title,
        averageRating: course.averageRating,
        totalReviews: total,
      },
      ratingDistribution: distribution,
    });
  } catch (error) {
    console.error('Get Course Reviews Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update review
const updateReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user.userId;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        message: 'Rating is required and must be between 1 and 5',
      });
    }

    // Check if review exists and belongs to user
    const review = await prisma.review.findFirst({
      where: {
        id: parseInt(id),
        userId,
      },
      include: {
        course: true,
      },
    });

    if (!review) {
      return res.status(404).json({
        message: 'Review not found',
      });
    }

    // Update review
    const updatedReview = await prisma.review.update({
      where: {
        id: parseInt(id),
      },
      data: {
        rating: parseInt(rating),
        comment: comment || null,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    // Recalculate average rating
    await updateCourseAverageRating(review.courseId);

    res.json({
      message: 'Review updated successfully',
      review: updatedReview,
    });
  } catch (error) {
    console.error('Update Review Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete review
const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    // Check if review exists and belongs to user
    const review = await prisma.review.findFirst({
      where: {
        id: parseInt(id),
        userId,
      },
    });

    if (!review) {
      return res.status(404).json({
        message: 'Review not found',
      });
    }

    // Delete review
    await prisma.review.delete({
      where: {
        id: parseInt(id),
      },
    });

    // Recalculate average rating
    await updateCourseAverageRating(review.courseId);

    res.json({
      message: 'Review deleted successfully',
    });
  } catch (error) {
    console.error('Delete Review Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get user's reviews
const getUserReviews = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { page = 1, limit = 10 } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where: {
          userId,
        },
        skip,
        take,
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
          createdAt: 'desc',
        },
      }),
      prisma.review.count({
        where: {
          userId,
        },
      }),
    ]);

    res.json({
      reviews,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error('Get User Reviews Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Helper function to update course average rating
const updateCourseAverageRating = async (courseId) => {
  try {
    const result = await prisma.review.aggregate({
      where: {
        courseId,
      },
      _avg: {
        rating: true,
      },
      _count: {
        rating: true,
      },
    });

    const averageRating = result._avg.rating || 0;
    const totalReviews = result._count.rating || 0;

    await prisma.course.update({
      where: {
        id: courseId,
      },
      data: {
        averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal place
      },
    });

    console.log(`Updated course ${courseId} average rating to ${averageRating} (${totalReviews} reviews)`);
  } catch (error) {
    console.error('Update Average Rating Error:', error);
  }
};

export {
  createReview,
  getCourseReviews,
  updateReview,
  deleteReview,
  getUserReviews,
}; 