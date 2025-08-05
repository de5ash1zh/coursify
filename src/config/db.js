import { PrismaClient } from '@prisma/client';
//Init the prisma client
const prisma = new PrismaClient();

//Function to test the DB connection
async function testConnection() {
  try {
    await prisma.$connect();
    console.log(`Successfully connected to the DB`);
  } catch (error) {
    console.error('Failed to connect to the database:', error);
    process.exit(1);
  }
}
