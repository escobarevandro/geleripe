#!/usr/bin/env tsx
import 'dotenv/config';
import { getDb } from '../server/db';
import { users } from '../drizzle/schema';
import { eq } from 'drizzle-orm';

async function main() {
  const email = process.env.SEED_EMAIL || 'teste@example.com';

  console.log('Removing seeded user with email:', email);

  const db = await getDb();
  if (!db) {
    console.error('Database not available. Check your .env and DB connection.');
    process.exit(1);
  }

  try {
    const result = await (db.delete(users).where(eq(users.email, email)) as any);
    console.log('Delete result:', result);
    console.log('If the user existed, it was removed.');
  } catch (err) {
    console.error('Failed to remove user:', err);
    process.exit(1);
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
