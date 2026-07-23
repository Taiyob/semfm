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

    const pt = await prisma.country.upsert({
        where: { slug: 'portugal' },
        update: {},
        create: {
            name: 'Portugal',
            slug: 'portugal',
            isActive: true
        }
    });

    const countriesMap: Record<string, string> = {
        'Netherlands': nl.id,
        'Spain': es.id,
        'Portugal': pt.id
    };

    // 2. Original static region data
    const regions = [
        // Portugal
        { name: "Lisbon", country: "Portugal", baseRent: 18, neighborhoods: ["Alfama", "Baixa", "Chiado", "Bairro Alto", "Parque das Nações", "Campo de Ourique", "Estrela", "Avenidas Novas"] },
        { name: "Porto", country: "Portugal", baseRent: 13, neighborhoods: ["Ribeira", "Boavista", "Foz do Douro", "Cedofeita", "Bonfim", "Campanhã"] },
        { name: "Faro", country: "Portugal", baseRent: 15, neighborhoods: ["Sé", "São Pedro", "Montenegro", "Gambelas", "Penha"] },
        { name: "Braga", country: "Portugal", baseRent: 9.5, neighborhoods: ["São Victor", "Maximinos", "Sé", "São José de São Lázaro", "Real"] },
        
        // Netherlands
        { name: "Amsterdam", country: "Netherlands", baseRent: 22, neighborhoods: [] },
        { name: "Rotterdam", country: "Netherlands", baseRent: 17, neighborhoods: [] },
        { name: "The Hague", country: "Netherlands", baseRent: 16, neighborhoods: [] },
        { name: "Utrecht", country: "Netherlands", baseRent: 18, neighborhoods: [] },
        { name: "Eindhoven", country: "Netherlands", baseRent: 15, neighborhoods: [] },
        { name: "Groningen", country: "Netherlands", baseRent: 14, neighborhoods: [] },
        { name: "Maastricht", country: "Netherlands", baseRent: 15, neighborhoods: [] },
        { name: "Haarlem", country: "Netherlands", baseRent: 19, neighborhoods: [] },
        { name: "Leiden", country: "Netherlands", baseRent: 18, neighborhoods: [] },
        { name: "Breda", country: "Netherlands", baseRent: 14, neighborhoods: [] },
        
        // Spain
        { name: "Madrid", country: "Spain", baseRent: 16, neighborhoods: [] },
        { name: "Barcelona", country: "Spain", baseRent: 18, neighborhoods: [] },
        { name: "Valencia", country: "Spain", baseRent: 12, neighborhoods: [] },
        { name: "Seville", country: "Spain", baseRent: 11, neighborhoods: [] },
        { name: "Málaga", country: "Spain", baseRent: 13, neighborhoods: [] },
        { name: "Bilbao", country: "Spain", baseRent: 14, neighborhoods: [] },
        { name: "Alicante", country: "Spain", baseRent: 10, neighborhoods: [] },
        { name: "Palma de Mallorca", country: "Spain", baseRent: 15, neighborhoods: [] },
        { name: "Zaragoza", country: "Spain", baseRent: 10, neighborhoods: [] },
        { name: "Granada", country: "Spain", baseRent: 11, neighborhoods: [] },
    ];

    for (const region of regions) {
        const countryId = countriesMap[region.country];
        if (!countryId) continue;

        // Upsert based on name
        let existingRegion = await prisma.region.findFirst({
            where: { name: region.name, countryId }
        });

        if (existingRegion) {
            existingRegion = await prisma.region.update({
                where: { id: existingRegion.id },
                data: { baseRent: region.baseRent }
            });
        } else {
            existingRegion = await prisma.region.create({
                data: {
                    name: region.name,
                    countryId: countryId,
                    baseRent: region.baseRent,
                    isActive: true
                }
            });
        }

        // Handle Neighborhoods
        if (region.neighborhoods && region.neighborhoods.length > 0) {
            for (const nName of region.neighborhoods) {
                const existingN = await prisma.neighborhood.findFirst({
                    where: { name: nName, regionId: existingRegion.id }
                });
                if (!existingN) {
                    await prisma.neighborhood.create({
                        data: {
                            name: nName,
                            regionId: existingRegion.id,
                            isActive: true
                        }
                    });
                }
            }
        }
    }

    console.log('Seeding completed successfully!');
};

seedData().catch(e => {
    console.error(e);
    process.exit(1);
});
