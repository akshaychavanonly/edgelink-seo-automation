const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is missing");
}

const globalForPrisma = globalThis;

let prisma = globalForPrisma.__prisma;

if (!prisma) {
  const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL,
  });
  prisma = new PrismaClient({ adapter });

  if (process.env.NODE_ENV !== "production") {
    globalForPrisma.__prisma = prisma;
  }
}

module.exports = { prisma };
