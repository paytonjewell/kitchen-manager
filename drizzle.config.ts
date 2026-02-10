import type { Config } from 'drizzle-kit';

export default {
  schema: './server/src/db/schema.ts',
  out: './server/src/db/migrations',
  dialect: 'sqlite',
  dbCredentials: {
    url: process.env.DATABASE_PATH || './data/recipes.db',
  },
} satisfies Config;
