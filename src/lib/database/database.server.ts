import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { resolve } from 'path';

// สร้างเส้นทางแบบ absolute path
const dbPath = resolve('src/lib/databaseStorage/dbforTrain-2.db');

const sqliteClient = new Database(dbPath);

export const database = drizzle(sqliteClient);
