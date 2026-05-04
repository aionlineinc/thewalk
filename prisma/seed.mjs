/**
 * Seeds hub registry rows for external products. Run: `npx prisma db seed`
 * Env overrides: ILM_APP_URL, CONNECT8_APP_URL
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const ilmUrl = process.env.ILM_APP_URL?.trim() || "https://inlovingmemory.cloud";
  const connect8Url = process.env.CONNECT8_APP_URL?.trim() || "https://connect8.thewalk.org";

  await prisma.platformApplication.upsert({
    where: { slug: "ilm" },
    update: {
      label: "inLovingMemory",
      baseUrl: ilmUrl,
      enabled: true,
      sortOrder: 0,
    },
    create: {
      slug: "ilm",
      label: "inLovingMemory",
      baseUrl: ilmUrl,
      enabled: true,
      sortOrder: 0,
    },
  });

  await prisma.platformApplication.upsert({
    where: { slug: "connect8" },
    update: {
      label: "Connect8",
      baseUrl: connect8Url,
      sortOrder: 10,
    },
    create: {
      slug: "connect8",
      label: "Connect8",
      baseUrl: connect8Url,
      enabled: false,
      sortOrder: 10,
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
