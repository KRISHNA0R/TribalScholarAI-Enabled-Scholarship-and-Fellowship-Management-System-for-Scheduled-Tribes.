/**
 * TribalScholar AI — local / VPS entrypoint.
 *
 * On serverless (Vercel) the app is NOT listened to here; see /api/index.js.
 */
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import { createApp } from './app.js';

dotenv.config();

const app = createApp();
const PORT = process.env.PORT || 5000;

await connectDB();

app.listen(PORT, () => {
  console.log('============================================================');
  console.log(' TribalScholar AI — Scholarship & Fellowship Backend');
  console.log(` URL      : http://localhost:${PORT}`);
  console.log(` Health   : http://localhost:${PORT}/api/health`);
  console.log(
    ` AI / OCR : ${process.env.AI_MODE || 'demo'} / ${process.env.OCR_MODE || 'demo'}`
  );
  console.log('============================================================');
});

export default app;
