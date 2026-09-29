import os from 'os';
import path from 'path';

/**
 * Single source of truth for the upload directory.
 *
 * Serverless platforms (Vercel) mount a read-only filesystem except for
 * `/tmp`, which is writable but ephemeral per invocation. In that case files
 * are streamed to a memory-backed tmp path; on a normal Node host (local dev,
 * VPS, container) they persist under `<server>/uploads`.
 */
export const IS_SERVERLESS = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);

export const UPLOAD_DIR = process.env.UPLOAD_DIR
  ? path.resolve(process.env.UPLOAD_DIR)
  : IS_SERVERLESS
    ? path.join(os.tmpdir(), 'tribalscholar-uploads')
    : path.join(process.cwd(), 'uploads');
