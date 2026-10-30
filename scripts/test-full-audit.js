require("dotenv").config();

const { prisma } = require("../src/lib/prisma");
const { addAuditJob, auditQueue } = require("../src/lib/queue");
const { redisConnection } = require("../src/lib/redis");

async function main() {
  try {
    // Create or find test client
    const client = await prisma.client.upsert({
      where: {
        email: "test@edgelink.example",
      },
      update: {},
      create: {
        name: "Test Dental Clinic",
        email: "test@edgelink.example",
        websiteUrl: "https://example.com",
        businessType: "Dental Clinic",
        city: "Pune",
        state: "Maharashtra",
      },
    });

    console.log("Client created:", client.id);

    // Create audit database record
    const audit = await prisma.audit.create({
      data: {
        clientId: client.id,
        websiteUrl: client.websiteUrl,
        status: "PENDING",
        progress: 0,
      },
    });

    console.log("Audit created:", audit.id);

    // Send job to BullMQ
    const job = await addAuditJob(audit.id, audit.websiteUrl);

    console.log("Audit queued successfully!");
    console.log("BullMQ job ID:", job.id);
    console.log("Database audit ID:", audit.id);
  } catch (error) {
    console.error("Test failed:", error);
    process.exitCode = 1;
  } finally {
    await auditQueue.close();
    await redisConnection.quit();
    await prisma.$disconnect();
  }
}

main();
