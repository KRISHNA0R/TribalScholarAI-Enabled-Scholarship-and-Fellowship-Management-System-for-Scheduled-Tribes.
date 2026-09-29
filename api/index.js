/**
 * Vercel Serverless Function entrypoint for the TribalScholar AI API.
 *
 * Vercel maps every `/api/*` request to a function inside the repo's `/api`
 * folder. `api/[...path].js` is a catch-all that simply re-exports this
 * handler, so the original URL (e.g. `/api/health`) reaches Express untouched.
 *
 * Serverless caveats handled here:
 *  - No `app.listen()` — the handler is invoked per request.
 *  - Mongo connection is cached per warm instance (config/ensureDB.js).
 *  - The filesystem is read-only except /tmp, so uploads go to an ephemeral
 *    tmp dir (see config/paths.js). Database records remain durable.
 */
import { createApp } from '../server/app.js';
import ensureDB from '../server/config/ensureDB.js';

const app = createApp();

export default async function handler(req, res) {
  try {
    await ensureDB();
  } catch (error) {
    console.error('[MongoDB] connection failed:', error.message);
    return res.status(503).json({
      success: false,
      errorCode: 'DB_UNAVAILABLE',
      message:
        'Database connection is not configured. Set MONGO_URI (e.g. MongoDB Atlas) in the Vercel project environment variables.',
    });
  }

  // Vercel Node runtimes are plain Node HTTP req/res — Express 4 handles both.
  return app(req, res);
}
