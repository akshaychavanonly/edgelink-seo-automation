require("dotenv").config();

const { prisma } = require("../src/lib/prisma");

async function main() {
  try {
    await prisma.$connect();

    const count = await prisma.client.count();

    console.log("Database connected successfully!");
    console.log("Total clients:", count);
  } catch (error) {
    console.error("Database connection failed:", error.message);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
}

main();
