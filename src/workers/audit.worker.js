require("dotenv").config();

const { Worker } = require("bullmq");
const { redisConnection } = require("../lib/redis");
const { prisma } = require("../lib/prisma");
const { collectSEOData } = require("../lib/seo-data");
const { analyzeSEO } = require("../lib/claude");
const { createAndDeliverReport } = require("../lib/report-delivery");

async function updateProgress(job, progress) {
  await job.updateProgress(progress);

  await prisma.audit.update({
    where: { id: job.data.auditId },
    data: { progress },
  });

  console.log(`Audit progress: ${progress}%`);
}

const worker = new Worker(
  "seo-audit-jobs",

  async (job) => {
    const { auditId, websiteUrl } = job.data;

    console.log("\nStarting audit:", auditId);
    console.log("Website:", websiteUrl);

    try {
      const audit = await prisma.audit.findUnique({
        where: { id: auditId },
        include: { client: true },
      });

      if (!audit) {
        throw new Error("Audit record not found");
      }

      await prisma.audit.update({
        where: { id: auditId },
        data: {
          status: "PROCESSING",
          progress: 0,
          startedAt: new Date(),
          errorMessage: null,
        },
      });

      // Step 1: Website crawling and SEO data
      console.log("Collecting SEO data...");

      const seoData = await collectSEOData(websiteUrl);

      await updateProgress(job, 45);

      // Step 2: AI analysis
      console.log("Running Claude SEO analysis...");

      const result = await analyzeSEO(seoData, {
        businessType: audit.client.businessType,
        city: audit.client.city,
        state: audit.client.state,
      });

      await updateProgress(job, 75);

      // Step 3: Save complete audit result
      console.log("Saving audit results...");

      await prisma.$transaction([
        prisma.auditResult.upsert({
          where: { auditId },
          create: {
            auditId,
            auditVersion: result.audit_version,
            overallScore: result.overall_score,
            scoreBreakdown: result.score_breakdown,
            criticalIssues: result.critical_issues,
            importantIssues: result.important_issues,
            quickWins: result.quick_wins,
            recommendations: result.recommendations,
            executiveSummary: result.executive_summary,
            onPageData: seoData.onPage,
            technicalData: seoData.technical,
            pageSpeedData: seoData.coreWebVitals,
            gscData: seoData.searchConsole,
            rankingData: seoData.rankings,
            schemaData: seoData.schema,
          },
          update: {
            auditVersion: result.audit_version,
            overallScore: result.overall_score,
            scoreBreakdown: result.score_breakdown,
            criticalIssues: result.critical_issues,
            importantIssues: result.important_issues,
            quickWins: result.quick_wins,
            recommendations: result.recommendations,
            executiveSummary: result.executive_summary,
            onPageData: seoData.onPage,
            technicalData: seoData.technical,
            pageSpeedData: seoData.coreWebVitals,
            gscData: seoData.searchConsole,
            rankingData: seoData.rankings,
            schemaData: seoData.schema,
          },
        }),

        prisma.audit.update({
          where: { id: auditId },
          data: {
            status: "PROCESSING",
            progress: 90,
            overallScore: result.overall_score,
            errorMessage: null,
          },
        }),
      ]);

      await job.updateProgress(90);

      console.log("Generating and delivering PDF...");

      const report = await createAndDeliverReport(auditId);

      await prisma.audit.update({
        where: { id: auditId },
        data: {
          status: "COMPLETED",
          progress: 100,
          completedAt: new Date(),
          errorMessage: null,
        },
      });

      await job.updateProgress(100);

      console.log("AUDIT COMPLETED");
      console.log("SEO Score:", result.overall_score);
      console.log("Report:", report.pdfPath);

      return {
        auditId,
        overallScore: result.overall_score,
        reportId: report.id,
        status: "COMPLETED",
      };
    } catch (error) {
      console.error("Audit processing error:", error.message);

      const isFinalAttempt = job.attemptsMade + 1 >= (job.opts.attempts || 1);

      await prisma.audit.updateMany({
        where: { id: auditId },
        data: {
          status: isFinalAttempt ? "FAILED" : "PENDING",
          errorMessage: error.message,
        },
      });

      throw error;
    }
  },

  {
    connection: redisConnection,
    concurrency: 2,
  },
);

worker.on("completed", (job) => {
  console.log("BullMQ job completed:", job.id);
});

worker.on("failed", (job, error) => {
  console.error("BullMQ job failed:", job?.id, error.message);
});

console.log("Edgelink SEO Audit Worker Running...");
