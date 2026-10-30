require("dotenv").config();

const { addAuditJob, auditQueue } = require("../src/lib/queue");
const { redisConnection } = require("../src/lib/redis");

async function main() {
  try {
    const job = await addAuditJob(
      "test-audit-001",
      "https://example-dental-clinic.com",
    );

    console.log("Audit queued successfully!");
    console.log("Job ID:", job.id);
  } finally {
    await auditQueue.close();
    await redisConnection.quit();
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
