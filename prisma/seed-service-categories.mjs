import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const categories = [
  { slug: "flowers", label: "Flowers", sortOrder: 1 },
  { slug: "funeral-home", label: "Funeral Homes", sortOrder: 2 },
  { slug: "church", label: "Churches", sortOrder: 3 },
  { slug: "videographer", label: "Videographers", sortOrder: 4 },
  { slug: "graphics", label: "Graphics & Printing", sortOrder: 5 },
  { slug: "counsellor", label: "Counsellors", sortOrder: 6 },
  { slug: "caregiver", label: "Care Givers", sortOrder: 7 },
  { slug: "hospice", label: "Hospice Services", sortOrder: 8 },
];

async function main() {
  for (const cat of categories) {
    await prisma.ilmServiceCategory.upsert({
      where: { slug: cat.slug },
      update: { label: cat.label, sortOrder: cat.sortOrder },
      create: cat,
    });
  }
  console.log("Seeded service categories.");
}

main().catch(console.error).finally(() => prisma.$disconnect());
