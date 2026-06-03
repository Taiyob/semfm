import { prisma } from './src/lib/prisma';

async function main() {
  const properties = await prisma.property.findMany();
  for (const property of properties) {
    const newYield = parseFloat((Math.random() * (12.5 - 4.5) + 4.5).toFixed(1));
    await prisma.property.update({
      where: { id: property.id },
      data: { yield: newYield }
    });
  }
  console.log('Updated yields for all properties successfully!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
