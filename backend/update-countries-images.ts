import { prisma } from './src/lib/prisma';

async function main() {
  const updates = [
    { 
      slug: 'portugal', 
      imageUrl: '/assets/portugal_real_estate_hero_1775342926518.png', 
      isActive: true,
      description: 'Premium yields in Lisbon and Porto. Strategic golden visa opportunities.',
      yield: '+5.2%',
      grossYield: '6.4%',
      investors: '12k+',
      region: 'Western Europe'
    },
    { 
      slug: 'spain', 
      imageUrl: '/assets/spain_market_hero.png', 
      isActive: true,
      description: 'Market analysis for Valencia, Alicante, Málaga, and Las Palmas. Beta access.',
      yield: '+5.9%',
      grossYield: '7.2%',
      investors: '8.5k+',
      region: 'Western Europe'
    },
    { 
      slug: 'greece', 
      imageUrl: '/assets/greece_market_hero.png', 
      isActive: false,
      description: 'High-growth potential in Athens and the Islands. EU residency pathway.',
      yield: '+6.1%',
      grossYield: '7.2%',
      investors: '5k+',
      region: 'Southern Europe'
    },
  ];

  for (const update of updates) {
    const country = await prisma.country.findUnique({ where: { slug: update.slug } });
    if (country) {
      await prisma.country.update({
        where: { slug: update.slug },
        data: { 
          imageUrl: update.imageUrl, 
          isActive: update.isActive,
          description: update.description,
          yield: update.yield,
          grossYield: update.grossYield,
          investors: update.investors,
          region: update.region
        }
      });
      console.log(`Updated ${update.slug}`);
    } else {
      console.log(`Country ${update.slug} not found in DB.`);
      // We can create it if not found, let's see.
      await prisma.country.create({
        data: {
          name: update.slug.charAt(0).toUpperCase() + update.slug.slice(1),
          slug: update.slug,
          continent: 'Europe',
          imageUrl: update.imageUrl,
          isActive: update.isActive
        }
      });
      console.log(`Created ${update.slug}`);
    }
  }
  
  // also make Italy inactive or delete if it exists
  const italy = await prisma.country.findUnique({ where: { slug: 'italy' } });
  if (italy) {
     await prisma.country.delete({ where: { slug: 'italy' } });
     console.log('Deleted italy');
  }

  const allCountries = await prisma.country.findMany();
  console.log("All countries in DB:", allCountries.map(c => ({ name: c.name, slug: c.slug, image: c.imageUrl, isActive: c.isActive })));
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
