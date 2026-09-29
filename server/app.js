/**
 * Express application factory.
 *
 * Kept separate from `server.js` so the exact same app can be booted two ways:
 *   - `node server.js`            -> long-running local/dev process
 *   - `api/index.js` (Vercel)     -> serverless function (no `app.listen`)
 */
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import fs from 'fs';
import { UPLOAD_DIR } from './config/paths.js';

// Route imports
import authRoutes from './routes/authRoutes.js';
import schemeRoutes from './routes/schemeRoutes.js';
import applicationRoutes from './routes/applicationRoutes.js';
import documentRoutes from './routes/documentRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import deficiencyRoutes from './routes/deficiencyRoutes.js';
import selectionRoutes from './routes/selectionRoutes.js';
import disbursementRoutes from './routes/disbursementRoutes.js';
import grievanceRoutes from './routes/grievanceRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import auditRoutes from './routes/auditRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';

import { notFound, errorHandler } from './middleware/errorMiddleware.js';

const VERSION = '2.6.0';

export const createApp = () => {
  const app = express();

  // --- Security -------------------------------------------------------------
  app.set('trust proxy', 1); // required for correct client IPs behind Vercel proxy
  app.use(
    helmet({
      crossOriginResourcePolicy: false,
    })
  );

  const allowedOrigins = (process.env.CLIENT_URL || '')
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean);

  app.use(
    cors({
      // Same-origin on Vercel (no Origin header) stays open; otherwise allow-list.
      origin: allowedOrigins.length ? allowedOrigins : true,
      credentials: true,
    })
  );

  // --- Body parsing ---------------------------------------------------------
  app.use(express.json({ limit: '15mb' }));
  app.use(express.urlencoded({ extended: true, limit: '15mb' }));

  if (process.env.NODE_ENV !== 'production') {
    app.use(morgan('dev'));
  }

  // --- Static uploads -------------------------------------------------------
  // On serverless (Vercel) the filesystem is read-only except /tmp, which is
  // ephemeral. Records persist in MongoDB; file bytes are best-effort only.
  try {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  } catch {
    /* ignore — read-only or already exists */
  }
  app.use('/uploads', express.static(UPLOAD_DIR, { fallthrough: true, maxAge: '1h' }));

  // --- Health ---------------------------------------------------------------
  app.get('/api/health', (_req, res) => {
    res.json({
      success: true,
      system: 'TribalScholar AI — MoTA Scholarship & Fellowship API',
      status: 'OPERATIONAL',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      runtime: process.env.VERCEL ? 'vercel-serverless' : 'node-server',
      aiEngine: {
        mode: process.env.AI_MODE || 'demo',
        ocrMode: process.env.OCR_MODE || 'demo',
        ruleEngine: 'ACTIVE_DYNAMIC',
        fraudDetection: 'ACTIVE_SHA256',
        documentIntegrity: 'ACTIVE_MAGIC_BYTES',
      },
      version: VERSION,
    });
  });

  // --- API routes -----------------------------------------------------------
  app.use('/api/auth', authRoutes);
  app.use('/api/schemes', schemeRoutes);
  app.use('/api/applications', applicationRoutes);
  app.use('/api/documents', documentRoutes);
  app.use('/api/ai', aiRoutes);
  app.use('/api/deficiencies', deficiencyRoutes);
  app.use('/api/selection', selectionRoutes);
  app.use('/api/disbursements', disbursementRoutes);
  app.use('/api/grievances', grievanceRoutes);
  app.use('/api/analytics', analyticsRoutes);
  app.use('/api/audit', auditRoutes);
  app.use('/api/notifications', notificationRoutes);

  // --- Errors ---------------------------------------------------------------
  app.use(notFound);
  app.use(errorHandler);

  return app;
};

export default createApp;
