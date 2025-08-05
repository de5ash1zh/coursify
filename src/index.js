import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
const app = express();

const port = process.env.PORT || 4000;
app.get('/test', () => {
  res.send('All good,Welcome');
});

app.listen(port, () => {
  console.log(`serving on port: ${port}`);
});
