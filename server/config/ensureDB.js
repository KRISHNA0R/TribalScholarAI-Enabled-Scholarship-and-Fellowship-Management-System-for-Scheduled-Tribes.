import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

let cached = global.__tsaMongoPromise;

const isConnected = () => mongoose.connection.readyState === 1;

/**
 * Connects once per warm instance. Cached on `global` so Vercel reuses the
 * connection between invocations instead of exhausting the Atlas IP/user limit.
 */
export const ensureDB = () => {
  if (isConnected()) return Promise.resolve(mongoose.connection);
  if (!cached) {
    cached = mongoose
      .connect(process.env.MONGO_URI, {
        autoIndex: true,
        serverSelectionTimeoutMS: 10000,
        maxPoolSize: 5,
      })
      .then((m) => m.connection)
      .catch((err) => {
        cached = null; // allow retry on next invocation
        throw err;
      });
    global.__tsaMongoPromise = cached;
  }
  return cached;
};

export default ensureDB;
