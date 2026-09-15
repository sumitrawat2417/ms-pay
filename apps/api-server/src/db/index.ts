import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as schema from './schema.js';
import 'dotenv/config';

const client = createClient({
  url: 'file:sqlite3.db',
});

export const db = drizzle(client, { schema });
