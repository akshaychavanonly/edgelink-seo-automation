require("dotenv").config();

const bcrypt = require("bcryptjs");
const { prisma } = require("../src/lib/prisma");

async function main() {
  const required = [
    "ADMIN_EMAIL",
    "ADMIN_PASSWORD",
    "DEMO_CLIENT_PASSWORD",
  ];

  for (const key of required) {
    if (!process.env[key]) {
      throw new Error(`${key} is missing in .env`);
    }
  }

  const adminEmail = process.env.ADMIN_EMAIL.trim().toLowerCase();
  const clientEmail = "demo@edgelink.example";

  if (adminEmail === clientEmail) {
    throw new Error("Admin and client emails must differ");
  }

  let client = await prisma.client.findUnique({
    where: { email: clientEmail },
  });

  if (!client) {
    client = await prisma.client.create({
      data: {
        name: "Demo Client",
        email: clientEmail,
        websiteUrl: "https://example.com",
        businessType: "Demo",
        city: "Pune",
        state: "Maharashtra",
      },
    });
  }

  const adminHash = await bcrypt.hash(process.env.ADMIN_PASSWORD, 12);
  const clientHash = await bcrypt.hash(process.env.DEMO_CLIENT_PASSWORD, 12);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      name: "Edgelink Admin",
      passwordHash: adminHash,
      role: "ADMIN",
      clientId: null,
    },
    create: {
      name: "Edgelink Admin",
      email: adminEmail,
      passwordHash: adminHash,
      role: "ADMIN",
    },
  });

  await prisma.user.upsert({
    where: { email: clientEmail },
    update: {
      name: client.name,
      passwordHash: clientHash,
      role: "CLIENT",
      clientId: client.id,
    },
    create: {
      name: client.name,
      email: clientEmail,
      passwordHash: clientHash,
      role: "CLIENT",
      clientId: client.id,
    },
  });

  console.log("Admin and client accounts created.");
}

main()
  .catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
