import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import * as schema from './schema';

// Set up a cache map for database connections
const globalForDb = globalThis as unknown as {
  turso: ReturnType<typeof createClient> | undefined;
};

// Configure with connection pooling options
const turso = globalForDb.turso ?? createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN,
  // Add retry configuration
  fetch: (url: string, options?: RequestInit) => {
    return fetch(url, {
      ...options,
      // Increase timeout to 20 seconds (from the default of 5)
      signal: options?.signal || AbortSignal.timeout(20_000),
    });
  },
});

// In development, preserve the existing connection across hot reloads
if (process.env.NODE_ENV === 'development') globalForDb.turso = turso;

export const db = drizzle(turso, { 
  schema,
  // Prepare statements for better performance
  logger: process.env.NODE_ENV === 'development',
}); 