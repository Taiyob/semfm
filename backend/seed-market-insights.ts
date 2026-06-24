import { prisma } from './src/lib/prisma';

async function main() {
  const portugalInsights = [
    {
      regionName: 'Lisbon',
      averageYield: 4.8,
      vacancyRate: 3.0,
      averageAppreciation: 6.2,
      availableProperties: 42,
      indicators: ['Strong Capital Appreciation', 'Prime Rental Demand'],
      image: '/assets/lisbon.png',
      description: 'The political and economic heart of Portugal. Stable yields with exceptional capital growth potential in historic districts.'
    },
    {
      regionName: 'Porto',
      averageYield: 5.4,
      vacancyRate: 3.5,
      averageAppreciation: 6.2,
      availableProperties: 42,
      indicators: ['Emerging Tech Hub', 'High Rental Absorption'],
      image: '/assets/porto.png',
      description: 'A growing tech scene and vibrant tourism drive high rental demand in the Douro region.'
    },
    {
      regionName: 'Braga',
      averageYield: 5.6,
      vacancyRate: 3.0,
      averageAppreciation: 5.1,
      availableProperties: 42,
      indicators: ['High long-term rental demand', 'Strong price-to-yield ratio'],
      image: '/assets/braga.png',
      description: 'Portugal’s fastest-growing northern city. Strong rental demand driven by universities, tech expansion, and a young population.'
    },
    {
      regionName: 'Faro',
      averageYield: 5.2,
      vacancyRate: 3.4,
      averageAppreciation: 4.6,
      availableProperties: 42,
      indicators: ['High Holiday Yield', 'Luxury Resilience'],
      image: '/assets/faro.png',
      description: 'The Algarve’s year-round anchor city. A stable, service-driven economy where rental demand comes from locals, students, and professionals — not tourism cycles.'
    }
  ];

  const spainInsights = [
    {
      regionName: 'Valencia',
      averageYield: 5.6,
      vacancyRate: 3.2,
      averageAppreciation: 5.8,
      availableProperties: 42,
      indicators: ['Prime long-term rental demand', 'Strong appreciation'],
      image: 'https://images.unsplash.com/photo-1504019347908-b45f9b0b8dd5?q=80&w=2070&auto=format&fit=crop',
      description: 'A dynamic coastal city combining strong rental demand, sustainable growth, and an increasingly international tenant base.'
    },
    {
      regionName: 'Alicante',
      averageYield: 6.1,
      vacancyRate: 3.5,
      averageAppreciation: 4.9,
      availableProperties: 42,
      indicators: ['High yield potential', 'Consistent occupancy'],
      image: 'https://images.unsplash.com/photo-1544918877-460635b6d13e?q=80&w=2070&auto=format&fit=crop',
      description: 'A high-yield coastal hub where accessible entry prices meet consistent rental demand, driven by expats, remote workers, and year-round lifestyle appeal.'
    },
    {
      regionName: 'Málaga',
      averageYield: 5.4,
      vacancyRate: 2.8,
      averageAppreciation: 6.7,
      availableProperties: 42,
      indicators: ['Strong economic growth', 'Premium rental demand'],
      image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070&auto=format&fit=crop',
      description: 'One of Spain’s fastest-growing cities — a thriving tech and lifestyle destination with premium rental demand and strong long-term fundamentals.'
    },
    {
      regionName: 'Las Palmas (Gran Canaria)',
      averageYield: 6.5,
      vacancyRate: 2.1,
      averageAppreciation: 4.2,
      availableProperties: 42,
      indicators: ['Very low vacancy', 'Strong long-term rental market'],
      image: 'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?q=80&w=2070&auto=format&fit=crop',
      description: 'A year-round rental market with exceptionally low vacancy, driven by remote workers, digital nomads, and a stable local economy.'
    }
  ];

  const netherlandsInsights = [
    {
      regionName: 'Amsterdam',
      averageYield: 4.5,
      vacancyRate: 1.5,
      averageAppreciation: 7.2,
      availableProperties: 25,
      indicators: ['Extreme demand', 'High capital growth'],
      image: 'https://images.unsplash.com/photo-1512470876302-972faa2aa9a4?q=80&w=2070&auto=format&fit=crop',
      description: 'High-demand capital city with very low vacancy rates and strong international corporate presence.'
    },
    {
      regionName: 'Rotterdam',
      averageYield: 5.8,
      vacancyRate: 2.5,
      averageAppreciation: 6.0,
      availableProperties: 34,
      indicators: ['Strong rental yields', 'Urban regeneration'],
      image: 'https://images.unsplash.com/photo-1522851866415-df0484501a2d?q=80&w=2070&auto=format&fit=crop',
      description: 'A dynamic port city offering better rental yields than Amsterdam with significant urban development.'
    }
  ];

  const polandInsights = [
    {
      regionName: 'Warsaw',
      averageYield: 6.2,
      vacancyRate: 3.0,
      averageAppreciation: 8.5,
      availableProperties: 60,
      indicators: ['Rapid appreciation', 'Tech sector growth'],
      image: 'https://images.unsplash.com/photo-1589114002636-54da9d42dc54?q=80&w=2070&auto=format&fit=crop',
      description: 'The economic powerhouse of Poland with rapid capital appreciation and strong tenant demand.'
    },
    {
      regionName: 'Kraków',
      averageYield: 5.9,
      vacancyRate: 3.5,
      averageAppreciation: 7.5,
      availableProperties: 45,
      indicators: ['Strong student market', 'IT outsourcing hub'],
      image: 'https://images.unsplash.com/photo-1519011964172-e1c028aef425?q=80&w=2070&auto=format&fit=crop',
      description: 'A major IT and cultural hub with a massive student population ensuring consistent rental demand.'
    }
  ];

  const seedData = [
    { slug: 'portugal', data: portugalInsights },
    { slug: 'spain', data: spainInsights },
    { slug: 'netherlands', data: netherlandsInsights },
    { slug: 'poland', data: polandInsights } // Wait, user's screenshot has Poland slug as "Poland". Let's match by case-insensitive or just check both.
  ];

  for (const item of seedData) {
    const country = await prisma.country.findFirst({
      where: {
        slug: {
          equals: item.slug,
          mode: 'insensitive'
        }
      }
    });

    if (country) {
      console.log(`Found country: ${country.name}. Seeding ${item.data.length} insights...`);
      // Clear existing insights for this country just to be safe during migration
      await prisma.marketInsight.deleteMany({
        where: { countryId: country.id }
      });

      for (const insight of item.data) {
        await prisma.marketInsight.create({
          data: {
            countryId: country.id,
            regionName: insight.regionName,
            averageYield: insight.averageYield,
            vacancyRate: insight.vacancyRate,
            averageAppreciation: insight.averageAppreciation,
            availableProperties: insight.availableProperties,
            indicators: insight.indicators,
            image: insight.image,
            description: insight.description
          }
        });
      }
      console.log(`✅ Successfully seeded insights for ${country.name}`);
    } else {
      console.log(`⚠️ Country with slug '${item.slug}' not found in DB.`);
    }
  }

  console.log('Migration completed!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
