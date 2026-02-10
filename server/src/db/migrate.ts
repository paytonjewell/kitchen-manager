import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_PATH = process.env.DATABASE_PATH || path.join(__dirname, '../../../data/recipes.db');
const MIGRATIONS_FOLDER = path.join(__dirname, './migrations');

// Ensure the data directory exists
const dataDir = path.dirname(DB_PATH);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
  console.log(`Created data directory: ${dataDir}`);
}

console.log(`Database path: ${DB_PATH}`);
console.log(`Migrations folder: ${MIGRATIONS_FOLDER}`);

// Create SQLite connection
const sqlite = new Database(DB_PATH);

// Enable foreign keys
sqlite.pragma('foreign_keys = ON');

// Create Drizzle instance
const db = drizzle(sqlite);

// Run migrations
try {
  console.log('Running migrations...');
  migrate(db, { migrationsFolder: MIGRATIONS_FOLDER });
  console.log('Migrations completed successfully!');
} catch (error) {
  console.error('Migration failed:', error);
  process.exit(1);
} finally {
  sqlite.close();
}
