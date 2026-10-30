import { NextResponse } from "next/server";
import { timingSafeEqual } from "node:crypto";

const { prisma } = require("../../../lib/prisma");
const { auditQueue } = require("../../../lib/queue");

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function isAuthorized(request) {
  const secret = process.env.CRON_SECRET;
  const supplied = request.headers.get("authorization") || "";

  if (!secret) return false;

  const expected = Buffer.from(`Bearer ${secret}`);
  const received = Buffer.from(supplied);

  return (
    expected.length === received.length && timingSafeEqual(expected, received)
  );
}

export async function POST(request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  const testMode =
    process.env.NODE_ENV === "development" &&
    new URL(request.url).searchParams.get("test") === "true";

  // Allow scheduled audits during the first 3 days
  // of each month (UTC).
  if (!testMode && (now.getUTCDate() < 1 || now.getUTCDate() > 3)) {
    return NextResponse.json({
      message: "Not within monthly scheduling window",
      scheduled: 0,
    });
  }

  const period = now.toISOString().slice(0, 7);
  let scheduled = 0;
  let skipped = 0;
  let failed = 0;

  try {
    const clients = await prisma.client.findMany({
      select: {
        id: true,
        websiteUrl: true,
      },
    });

    for (const client of clients) {
      let audit;

      try {
        audit = await prisma.audit.create({
          data: {
            clientId: client.id,
            websiteUrl: client.websiteUrl,
            status: "PENDING",
            progress: 0,
            scheduledPeriod: period,
          },
        });
      } catch (error) {
        // Another invocation already created this
        // client's audit for this month.
        if (error.code === "P2002") {
          skipped++;
          continue;
        }

        console.error("Database error:", error);
        failed++;
        continue;
      }

      try {
        await auditQueue.add(
          "seo-audit",
          {
            auditId: audit.id,
            websiteUrl: audit.websiteUrl,
          },
          {
            jobId: `monthly_${client.id}_${period}`,
          },
        );

        scheduled++;
      } catch (error) {
        failed++;

        console.error("Queue error:", error);

        await prisma.audit.update({
          where: { id: audit.id },
          data: {
            status: "FAILED",
            errorMessage: "Monthly audit queueing failed",
          },
        });
      }
    }

    return NextResponse.json(
      {
        success: failed === 0,
        period,
        totalClients: clients.length,
        scheduled,
        skipped,
        failed,
        testMode,
      },
      {
        status: failed ? 207 : 200,
      },
    );
  } catch (error) {
    console.error("Monthly scheduler error:", error);

    return NextResponse.json(
      { error: "Monthly scheduling failed" },
      { status: 500 },
    );
  }
}
