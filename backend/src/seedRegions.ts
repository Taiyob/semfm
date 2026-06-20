import { PrismaClient } from '@/generated/prisma/client';
import { prisma } from '@/lib/prisma';

const seedData = async () => {
    console.log('Seeding initial data...');

    // 1. Ensure Countries exist
    const nl = await prisma.country.upsert({
        where: { slug: 'netherlands' },
        update: {},
        create: {
            name: 'Netherlands',
            slug: 'netherlands',
            isActive: true
        }
    });

    const es = await prisma.country.upsert({
        where: { slug: 'spain' },
        update: {},
        create: {
            name: 'Spain',
            slug: 'spain',
            isActive: true
        }
    });

    const countriesMap: Record<string, string> = {
        'Netherlands': nl.id,
        'Spain': es.id
    };

    // 2. Original static region data
    const regions = [
        // Netherlands
        { name: "Amsterdam", country: "Netherlands", baseRent: 22 },
        { name: "Rotterdam", country: "Netherlands", baseRent: 17 },
        { name: "The Hague", country: "Netherlands", baseRent: 16 },
        { name: "Utrecht", country: "Netherlands", baseRent: 18 },
        { name: "Eindhoven", country: "Netherlands", baseRent: 15 },
        { name: "Groningen", country: "Netherlands", baseRent: 14 },
        { name: "Maastricht", country: "Netherlands", baseRent: 15 },
        { name: "Haarlem", country: "Netherlands", baseRent: 19 },
        { name: "Leiden", country: "Netherlands", baseRent: 18 },
        { name: "Breda", country: "Netherlands", baseRent: 14 },
        
        // Spain
        { name: "Madrid", country: "Spain", baseRent: 16 },
        { name: "Barcelona", country: "Spain", baseRent: 18 },
        { name: "Valencia", country: "Spain", baseRent: 12 },
        { name: "Seville", country: "Spain", baseRent: 11 },
        { name: "Málaga", country: "Spain", baseRent: 13 },
        { name: "Bilbao", country: "Spain", baseRent: 14 },
        { name: "Alicante", country: "Spain", baseRent: 10 },
        { name: "Palma de Mallorca", country: "Spain", baseRent: 15 },
        { name: "Zaragoza", country: "Spain", baseRent: 10 },
        { name: "Granada", country: "Spain", baseRent: 11 },
    ];

    for (const region of regions) {
        const countryId = countriesMap[region.country];
        if (!countryId) continue;

        // Upsert based on name
        const existing = await prisma.region.findFirst({
            where: { name: region.name, countryId }
        });

        if (existing) {
            await prisma.region.update({
                where: { id: existing.id },
                data: { baseRent: region.baseRent }
            });
        } else {
            await prisma.region.create({
                data: {
                    name: region.name,
                    countryId: countryId,
                    baseRent: region.baseRent,
                    isActive: true
                }
            });
        }
    }

    console.log('Seeding completed successfully!');
};

seedData().catch(e => {
    console.error(e);
    process.exit(1);
});
