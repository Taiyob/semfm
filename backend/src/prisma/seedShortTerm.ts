import { prisma } from '../lib/prisma';

const defaultShortTermSettings = {
    baseRates: {
        'Lisbon': 145,
        'Porto': 110,
        'Faro': 160,
        'Braga': 90,
        'Valencia': 130,
        'Alicante': 120,
        'Málaga': 135,
        'Las Palmas (Gran Canaria)': 115
    },
    listingTypeMultipliers: {
        'Entire place': 1.0,
        'Private room': 0.5,
        'Shared room': 0.3
    },
    bedroomMultipliers: {
        1: 1.0,
        2: 1.4,
        3: 1.8,
        4: 2.2,
        5: 2.6
    },
    bathroomMultipliers: {
        1: 1.0,
        2: 1.15,
        3: 1.30,
        4: 1.45,
        5: 1.60
    },
    guestCapacityMultipliers: {
        1: 1.0,
        2: 1.0,
        3: 1.1,
        4: 1.2,
        5: 1.3,
        6: 1.4
    },
    zoneFactors: {
        'Centre': 1.15,
        'Semi-Centre': 1.0,
        'Outside Centre': 0.85
    },
    conditionFactors: {
        'Premium': 1.2,
        'High-End': 1.2,
        'Standard': 1.0,
        'Basic': 0.8,
        'Outdated': 0.8,
        'In need of renovation': 0.8
    }
};

async function main() {
    console.log('Seeding short-term default settings...');
    
    let settings = await prisma.systemSetting.findFirst();
    
    if (settings) {
        await prisma.systemSetting.update({
            where: { id: settings.id },
            data: {
                shortTermSettings: defaultShortTermSettings
            }
        });
        console.log('Updated existing SystemSetting with short-term defaults.');
    } else {
        await prisma.systemSetting.create({
            data: {
                shortTermSettings: defaultShortTermSettings
            }
        });
        console.log('Created new SystemSetting with short-term defaults.');
    }
    
    console.log('Seeding finished.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
