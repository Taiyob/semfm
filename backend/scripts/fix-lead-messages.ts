/**
 * One-time script to clean up duplicate [New Inquiry] messages in leads.
 * Run with: npx tsx scripts/fix-lead-messages.ts
 */

import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma/client';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import pg from 'pg';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: resolve(__dirname, '../.env') });

const connectionString = process.env.DATABASE_URL!;
const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const leads = await prisma.lead.findMany({
    where: {
      message: { contains: '[New Inquiry]' }
    }
  });

  console.log(`Found ${leads.length} leads with duplicate messages.`);

  for (const lead of leads) {
    if (!lead.message) continue;

    // Extract the original message — take only the last clean occurrence
    // Pattern: "[New Inquiry]: <actual message>"
    const parts = lead.message.split('[New Inquiry]:').map(s => s.trim()).filter(Boolean);
    const cleanMessage = parts[parts.length - 1] || lead.message;

    await prisma.lead.update({
      where: { id: lead.id },
      data: { message: cleanMessage }
    });

    console.log(`Fixed lead ${lead.id}: "${cleanMessage.substring(0, 60)}..."`);
  }

  console.log('Done.');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
