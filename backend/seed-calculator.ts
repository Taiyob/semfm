import { prisma } from './src/lib/prisma';

async function main() {
    console.log('Seeding calculator regions and multipliers...');

    // 1. Setup default rent multipliers in SystemSetting
    const rentMultipliers = {
        size: {
            '<45': 1.25,
            '<60': 1.10,
            '<90': 1.00,
            '<120': 0.90,
            '>=120': 0.70
        },
        bedroom: {
            'Studio': 1.10,
            '1 Bedroom': 1.00,
            '2 Bedrooms': 0.95,
            '3+ Bedrooms': 0.90
        },
        location: {
            'Centre': 1.25,
            'Semi-Centre': 1.05,
            'Outside Centre': 0.85
        },
        yearBuilt: {
            '<=2': 1.07,
            '3-5': 1.03,
            '6-15': 1.00,
            '16-30': 0.90,
            '>30': 0.95
        },
        outsideArea: {
            'None': 1.00,
            'Balcony': 1.05,
            'Garden': 1.05
        },
        parking: {
            'Yes': 1.05,
            'No': 0.95
        },
        energy: {
            'A': 1.10,
            'B': 1.00,
            'C': 0.95,
            'D': 0.90,
            'E': 0.85,
            'F': 0.80,
            'G': 0.80
        },
        elevator: {
            'Yes': 1.00,
            'No': 0.95
        },
        finish: {
            'High-End': 1.15,
            'Premium': 1.10,
            'Good': 1.05,
            'Standard': 1.00,
            'Outdated': 0.95,
            'In need of renovation': 0.90
        }
    };

    let settings = await prisma.systemSetting.findFirst();
    if (!settings) {
        settings = await prisma.systemSetting.create({
            data: { rentMultipliers }
        });
    } else {
        await prisma.systemSetting.update({
            where: { id: settings.id },
            data: { rentMultipliers }
        });
    }
    console.log('Rent multipliers seeded successfully.');

    // 2. Setup Regions
    // Ensure countries exist
    const portugal = await prisma.country.upsert({
        where: { name: 'Portugal' },
        update: {},
        create: { name: 'Portugal', slug: 'portugal', continent: 'Europe' }
    });

    const spain = await prisma.country.upsert({
        where: { name: 'Spain' },
        update: {},
        create: { name: 'Spain', slug: 'spain', continent: 'Europe' }
    });

    const regions = [
        { name: 'Braga', countryId: portugal.id, baseRent: 9.5 },
        { name: 'Porto', countryId: portugal.id, baseRent: 13.0 },
        { name: 'Lisbon', countryId: portugal.id, baseRent: 18.0 },
        { name: 'Faro', countryId: portugal.id, baseRent: 15.0 },
        { name: 'Valencia', countryId: spain.id, baseRent: 13.5 },
        { name: 'Alicante', countryId: spain.id, baseRent: 11.0 },
        { name: 'Málaga', countryId: spain.id, baseRent: 13.0 },
        { name: 'Las Palmas (Gran Canaria)', countryId: spain.id, baseRent: 10.5 },
    ];

    for (const region of regions) {
        await prisma.region.upsert({
            where: { name: region.name },
            update: { baseRent: region.baseRent, countryId: region.countryId },
            create: region
        });
    }

    console.log('Regions seeded successfully.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
