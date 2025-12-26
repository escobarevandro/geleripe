#!/usr/bin/env tsx
import 'dotenv/config';
import { hashSync } from 'bcryptjs';
import { getDb } from '../server/db';
import { users } from '../drizzle/schema';

async function main() {
  const email = process.env.SEED_EMAIL || 'teste@example.com';
  const password = process.env.SEED_PASSWORD || 'MinhaSenha123!';

  console.log('Seeding user:', email);

  const db = await getDb();
  if (!db) {
    console.error('Database not available. Check your .env and DB connection.');
    process.exit(1);
  }

  const hashed = hashSync(password, 10);

  try {
    const result = await (db.insert(users).values({
      email,
      senha: hashed,
      status: 'ativo',
    }) as any);

    const insertedId = result && result.insertId ? Number(result.insertId) : (Array.isArray(result) && result[0] && result[0].insertId ? Number(result[0].insertId) : undefined);

    if (insertedId) {
      console.log('User created with id:', insertedId);
    } else {
      console.log('Insert result:', result);
      console.log('User may already exist or DB returned unexpected insert result.');
    }
  } catch (err) {
    console.error('Failed to seed user:', err);
    process.exit(1);
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
