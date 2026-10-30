const fs = require("node:fs/promises");
const path = require("node:path");
const os = require("node:os");

const { prisma } = require("./prisma");
const { generateAuditPDF } = require("./pdf");
const { sendWhatsApp } = require("../mocks/twilio.mock");
const { sendEmail } = require("../mocks/email.mock");

async function createAndDeliverReport(auditId) {
  const audit = await prisma.audit.findUnique({
    where: { id: auditId },
    include: {
      client: true,
      result: true,
    },
  });

  if (!audit || !audit.result) {
    throw new Error("Audit result not found");
  }

  console.log("Generating PDF for:", auditId);

  const pdfBytes = await generateAuditPDF(audit);

  // Works on Windows, Linux and macOS.
  const reportsFolder = path.join(os.tmpdir(), "edgelink-reports");

  await fs.mkdir(reportsFolder, { recursive: true });

  const pdfPath = path.join(reportsFolder, `audit-${auditId}.pdf`);

  await fs.writeFile(pdfPath, Buffer.from(pdfBytes));

  console.log("PDF saved:", pdfPath);

  // Record the PDF before attempting delivery.
  await prisma.report.upsert({
    where: { auditId },
    create: {
      auditId,
      pdfPath,
      whatsappStatus: "PENDING",
      emailStatus: "PENDING",
    },
    update: {
      pdfPath,
    },
  });

  let whatsappStatus = "FAILED";
  let emailStatus = "FAILED";

  try {
    const response = await sendWhatsApp(
      audit.clientId,
      pdfPath,
      audit.result.overallScore,
    );
    whatsappStatus = response.status.toUpperCase();
  } catch (error) {
    console.error("WhatsApp mock failed:", error.message);
  }

  try {
    const response = await sendEmail(
      audit.client.email,
      pdfPath,
      audit.result.overallScore,
    );
    emailStatus = response.status.toUpperCase();
  } catch (error) {
    console.error("Email mock failed:", error.message);
  }

  const report = await prisma.report.update({
    where: { auditId },
    data: {
      whatsappStatus,
      emailStatus,
    },
  });

  console.log("Report processing finished");

  return report;
}

module.exports = { createAndDeliverReport };
