const { Queue } = require("bullmq");
const { redisConnection } = require("./redis");

const auditQueue = new Queue("seo-audit-jobs", {
  connection: redisConnection,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 2000,
    },
    removeOnComplete: 100,
    removeOnFail: 100,
  },
});

async function addAuditJob(auditId, websiteUrl) {
  return auditQueue.add("seo-audit", {
    auditId,
    websiteUrl,
  });
}

module.exports = { auditQueue, addAuditJob };
