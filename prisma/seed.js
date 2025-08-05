import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function seed() {
  try {
    const hashedPassword = await bcrypt.hash('password123', 10);
    const instructor = await prisma.user.create({
      data: {
        name: 'John Doe',
        email: 'john@example.com',
        password: hashedPassword,
        role: 'INSTRUCTOR',
      },
    });
    const course = await prisma.course.create({
      data: {
        title: 'Introduction to Node.js',
        description: 'Learn Node.js from scratch!',
        price: 49.99,
        instructorId: instructor.id,
        category: 'Programming',
        imageUrl: 'https://example.com/course-image.jpg',
      },
    });
    await prisma.lesson.create({
      data: {
        title: 'Getting Started with Node.js',
        courseId: course.id,
        videoUrl: 'https://example.com/video.mp4',
        order: 1,
      },
    });
    console.log('Seed data inserted successfully!');
  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seed();
