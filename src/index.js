import express from 'express';
import dotenv from 'dotenv';
dotenv.config();

import db from './config/db.js';
import helmet from 'helmet';
const app = express();
app.use(express.json());
app.use(helmet());
import userRoutes from './routes/users.js';
import courseRoutes from './routes/courses.js';
import enrollmentRoutes from './routes/enrollments.js';

const port = process.env.PORT || 4000;

app.get('/test', (req, res) => {
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
