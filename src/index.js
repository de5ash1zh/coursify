import express from 'express';
import dotenv from 'dotenv';
dotenv.config();

import db from './config/db.js';
const app = express();

const port = process.env.PORT || 4000;

app.get('/test', () => {
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

app.listen(port, () => {
  console.log(`serving on port: ${port}`);
});
