import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
dotenv.config();

import db from './config/db.js';
import helmet from 'helmet';
const app = express();

// CORS configuration - allow all origins
app.use(cors({
  origin: '*', // Allow all origins
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true, // Allow credentials (cookies, authorization headers)
  optionsSuccessStatus: 200 // Some legacy browsers choke on 204
}));

app.use(express.json());
app.use(helmet());
import userRoutes from './routes/users.js';
import courseRoutes from './routes/courses.js';
import enrollmentRoutes from './routes/enrollments.js';

const port = process.env.PORT || 4000;

// Handle preflight requests
app.options('*', cors());

app.get('/test', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.send('All good,Welcome');
});

//db connection
async function startServer() {
  try {
    await db.testConnection(); // Access testConnection from the default export
    app.listen(port, () => console.log(`Server running on port ${port}`));
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}
startServer();
//routes setup
app.use('/', userRoutes);
app.use('/api/v1/courses', courseRoutes);
app.use('/api/v1/enrollments', enrollmentRoutes);
