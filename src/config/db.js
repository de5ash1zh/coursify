import { PrismaClient } from '@prisma/client';

// Initialize PrismaClient
const prisma = new PrismaClient();

// Function to test database connection
async function testConnection() {
  try {
    await prisma.$connect();
    console.log('Successfully connected to the Coursify database!');
  } catch (error) {
    console.error('Failed to connect to the database:', error);
    process.exit(1);
  }
}

export default { prisma, testConnection };
