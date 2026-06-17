import { PrismaClient } from '../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import bcrypt from 'bcryptjs';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error('DATABASE_URL is missing');

const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function seedAdmin() {
    console.log('🌱 Starting admin user seeding...');

    // 1. Create or get admin role
    let role = await prisma.role.findUnique({ where: { name: 'admin' } });
    if (!role) {
        console.log('Creating admin role...');
        role = await prisma.role.create({
            data: {
                name: 'admin',
                description: 'System Administrator'
            }
        });
    }

    const email = 'admin@semfm.com';
    const password = 'Password123!';
    
    // 2. Check if admin user exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
        console.log(`✅ Admin user ${email} already exists.`);
        return;
    }

    console.log('Creating admin user...');
    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
        data: {
            email,
            password: hashedPassword,
            firstName: 'Admin',
            lastName: 'User',
            displayName: 'Admin User',
            status: 'active',
            roleId: role.id,
        }
    });

    console.log(`✅ Successfully seeded admin user!`);
    console.log(`📧 Email: ${email}`);
    console.log(`🔑 Password: ${password}`);
}

seedAdmin()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
