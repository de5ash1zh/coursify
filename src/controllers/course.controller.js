import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Create course
const createCourse = async (req, res) => {
  try {
    const { title, description, price, category, imageUrl } = req.body;
    const instructorId = req.user.userId; // From auth middleware

    if (!title || !price || !category) {
      return res.status(400).json({
        message: 'Title, price, and category are required',
      });
    }

    const course = await prisma.course.create({
      data: {
        title,
        description,
        price: parseFloat(price),
        category,
        imageUrl,
        instructorId,
      },
      include: {
        instructor: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    res.status(201).json({
      message: 'Course created successfully',
      course,
    });
  } catch (error) {
    console.error('Create Course Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update course
const updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, price, category, imageUrl } = req.body;
    const instructorId = req.user.userId;

    const course = await prisma.course.findFirst({
      where: {
        id: parseInt(id),
        instructorId,
        deletedAt: null,
      },
    });

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const updatedCourse = await prisma.course.update({
      where: { id: parseInt(id) },
      data: {
        title,
        description,
        price: price ? parseFloat(price) : undefined,
        category,
        imageUrl,
      },
      include: {
        instructor: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    res.json({
      message: 'Course updated successfully',
      course: updatedCourse,
    });
  } catch (error) {
    console.error('Update Course Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Soft delete course
const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const instructorId = req.user.userId;

    const course = await prisma.course.findFirst({
      where: {
        id: parseInt(id),
        instructorId,
        deletedAt: null,
      },
    });

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    await prisma.course.update({
      where: { id: parseInt(id) },
      data: { deletedAt: new Date() },
    });

    res.json({ message: 'Course deleted successfully' });
  } catch (error) {
    console.error('Delete Course Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get all courses with pagination, filtering, and search
const getCourses = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      category,
      search,
      minPrice,
      maxPrice,
    } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    // Build where clause
    const where = {
      deletedAt: null,
    };

    if (category) {
      where.category = category;
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice);
      if (maxPrice) where.price.lte = parseFloat(maxPrice);
    }

    const [courses, total] = await Promise.all([
      prisma.course.findMany({
        where,
        skip,
        take,
        include: {
          instructor: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          _count: {
            select: {
              lessons: true,
              enrollments: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.course.count({ where }),
    ]);

    res.json({
      courses,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error('Get Courses Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get course by ID
const getCourseById = async (req, res) => {
  try {
    const { id } = req.params;

    const course = await prisma.course.findFirst({
      where: {
        id: parseInt(id),
        deletedAt: null,
      },
      include: {
        instructor: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        lessons: {
          orderBy: { order: 'asc' },
        },
        _count: {
          select: {
            lessons: true,
            enrollments: true,
            reviews: true,
          },
        },
      },
    });

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.json({ course });
  } catch (error) {
    console.error('Get Course Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Create lesson
const createLesson = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { title, videoUrl, order } = req.body;
    const instructorId = req.user.userId;

    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }

    // Check if course exists and belongs to instructor
    const course = await prisma.course.findFirst({
      where: {
        id: parseInt(courseId),
        instructorId,
        deletedAt: null,
      },
    });

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const lesson = await prisma.lesson.create({
      data: {
        title,
        videoUrl,
        order: order || 1,
        courseId: parseInt(courseId),
      },
    });

    res.status(201).json({
      message: 'Lesson created successfully',
      lesson,
    });
  } catch (error) {
    console.error('Create Lesson Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update lesson
const updateLesson = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, videoUrl, order } = req.body;
    const instructorId = req.user.userId;

    // Check if lesson exists and belongs to instructor's course
    const lesson = await prisma.lesson.findFirst({
      where: {
        id: parseInt(id),
        course: {
          instructorId,
          deletedAt: null,
        },
      },
      include: {
        course: true,
      },
    });

    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }

    const updatedLesson = await prisma.lesson.update({
      where: { id: parseInt(id) },
      data: {
        title,
        videoUrl,
        order: order ? parseInt(order) : undefined,
      },
    });

    res.json({
      message: 'Lesson updated successfully',
      lesson: updatedLesson,
    });
  } catch (error) {
    console.error('Update Lesson Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete lesson
const deleteLesson = async (req, res) => {
  try {
    const { id } = req.params;
    const instructorId = req.user.userId;

    // Check if lesson exists and belongs to instructor's course
    const lesson = await prisma.lesson.findFirst({
      where: {
        id: parseInt(id),
        course: {
          instructorId,
          deletedAt: null,
        },
      },
    });

    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }

    await prisma.lesson.delete({
      where: { id: parseInt(id) },
    });

    res.json({ message: 'Lesson deleted successfully' });
  } catch (error) {
    console.error('Delete Lesson Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export {
  createCourse,
  updateCourse,
  deleteCourse,
  getCourses,
  getCourseById,
  createLesson,
  updateLesson,
  deleteLesson,
};
