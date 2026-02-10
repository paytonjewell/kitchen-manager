# Database Setup

This directory contains the database schema, connection utilities, and migration files for the Kitchen Manager application.

## Overview

The application uses:
- **SQLite** - Lightweight, file-based database
- **Drizzle ORM** - Type-safe ORM for TypeScript
- **better-sqlite3** - Fast, synchronous SQLite driver

## Database Schema

### Tables

1. **recipes** - Main recipe information
2. **recipe_ingredients** - Ingredients for each recipe
3. **recipe_steps** - Cooking instructions
4. **recipe_tags** - Tags for categorizing recipes
5. **inventory** - Available ingredients in stock
6. **meal_plans** - Planned meals by date and meal type

### Relationships

- Each recipe can have multiple ingredients, steps, and tags (one-to-many)
- Cascade deletes: Deleting a recipe removes all its ingredients, steps, and tags
- Meal plans reference recipes (many-to-one)
- Inventory tracks unique ingredient names

## Available Commands

From the `server` directory:

```bash
# Generate migration files from schema changes
npm run db:generate

# Apply pending migrations to the database
npm run db:migrate

# Open Drizzle Studio (web-based database browser)
npm run db:studio

# Seed the database with sample data
npm run db:seed
```

## Initial Setup

1. Install dependencies:
   ```bash
   cd server
   npm install
   ```

2. Generate the initial migration:
   ```bash
   npm run db:generate
   ```

3. Apply migrations to create tables:
   ```bash
   npm run db:migrate
   ```

4. (Optional) Seed with test data:
   ```bash
   npm run db:seed
   ```

## Database Location

The SQLite database file is stored at:
- **Development**: `/data/recipes.db`
- **Docker**: Volume-mounted to persist data

The location can be customized with the `DATABASE_PATH` environment variable.

## Usage in Code

```typescript
import { db } from './db/index.js';
import { recipes, recipeIngredients } from './db/schema.js';
import { eq } from 'drizzle-orm';

// Query all recipes
const allRecipes = await db.select().from(recipes);

// Query with filter
const favoriteRecipes = await db
  .select()
  .from(recipes)
  .where(eq(recipes.isFavorite, true));

// Insert a new recipe
const [newRecipe] = await db
  .insert(recipes)
  .values({
    title: 'My Recipe',
    description: 'A delicious dish',
  })
  .returning();

// Update a recipe
await db
  .update(recipes)
  .set({ isFavorite: true })
  .where(eq(recipes.id, recipeId));

// Delete a recipe (cascades to ingredients, steps, tags)
await db.delete(recipes).where(eq(recipes.id, recipeId));
```

## Type Safety

All database operations are fully type-safe thanks to Drizzle ORM. The schema exports TypeScript types:

```typescript
import type { Recipe, NewRecipe, RecipeIngredient } from './db/schema.js';

// Use these types in your application code
function createRecipe(data: NewRecipe): Recipe {
  // ...
}
```

## Indexes

The schema includes indexes on frequently queried fields:
- Recipe title and favorite status
- Recipe relationships (foreign keys)
- Ingredient names
- Meal plan dates and meal types

## Migration Workflow

1. Modify `schema.ts` with your changes
2. Run `npm run db:generate` to create migration files
3. Review the generated SQL in `migrations/` directory
4. Run `npm run db:migrate` to apply changes
5. Commit both schema and migration files

## Foreign Key Constraints

Foreign keys are enabled and enforced. Cascade deletes are configured for:
- Recipe → Recipe Ingredients (deleting a recipe removes its ingredients)
- Recipe → Recipe Steps (deleting a recipe removes its steps)
- Recipe → Recipe Tags (deleting a recipe removes its tags)
- Recipe → Meal Plans (deleting a recipe removes associated meal plans)

## Notes

- Timestamps use Unix epoch (seconds since 1970-01-01)
- Boolean fields are stored as integers (0 = false, 1 = true)
- UUIDs are generated automatically for primary keys
- Ingredient names in inventory are unique (case-sensitive)
