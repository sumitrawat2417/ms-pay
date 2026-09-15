import { createClient } from '@libsql/client';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import process from 'node:process';

async function seed() {
  const client = createClient({ url: 'file:sqlite3.db' });
  
  // 1. Run migrations
  const sqlContent = readFileSync(join(process.cwd(), 'drizzle/0000_flawless_william_stryker.sql'), 'utf-8');
  const statements = sqlContent.split('--> statement-breakpoint').map((s: string) => s.trim()).filter((s: string) => s.length > 0);
  
  console.log('Running migrations...');
  for (const stmt of statements) {
    try {
      await client.execute(stmt);
    } catch (e: any) {
      if (!e.message.includes('already exists')) {
        console.error('Migration error on statement:', stmt, e);
      }
    }
  }

  // 2. Insert mock data to match frontend requirements
  console.log('Inserting seed data...');
  
  try {
    await client.execute(`
      INSERT INTO consumers (id, first_name, last_name, phone, id_qr_token) 
      VALUES ('consumer-001', 'Sumit', 'Rawat', '9876543210', 'qr-consumer-001-demo')
      ON CONFLICT DO NOTHING;
    `);

    await client.execute(`
      INSERT INTO wallets (id, consumer_id, balance_msp) 
      VALUES ('wallet-001', 'consumer-001', 1250.0)
      ON CONFLICT DO NOTHING;
    `);

    await client.execute(`
      INSERT INTO merchants (id, owner_name, store_name, phone, category, store_qr_token) 
      VALUES 
        ('merchant-001', 'Sula', 'The Green Leaf Café', '9876543211', 'Food & Beverage', 'qr-store-001'),
        ('merchant-002', 'Urban Owner', 'Urban Threads', '9876543212', 'Clothing', 'qr-store-002'),
        ('merchant-003', 'Tech Owner', 'TechZone Electronics', '9876543213', 'Electronics', 'qr-store-003')
      ON CONFLICT DO NOTHING;
    `);

    // Insert a few transactions for consumer-001 so the UI has history
    await client.execute(`
      INSERT INTO transactions (id, type, amount_msp, consumer_id, funding_source, created_at)
      VALUES 
        ('tx-seed-1', 'recharge_self', 500, 'consumer-001', 'self', datetime('now', '-2 days')),
        ('tx-seed-2', 'recharge_admin', 100, 'consumer-001', 'admin', datetime('now', '-5 days'))
      ON CONFLICT DO NOTHING;
    `);

    console.log('Seed completed successfully!');
  } catch (err) {
    console.error('Seed error:', err);
  }
}

seed();
