import { NextResponse } from "next/server";
import { z } from "zod";
import { getServerSession } from "next-auth";

import { authOptions } from "../../../lib/auth";

const { prisma } = require("../../../lib/prisma");
const { addAuditJob } = require("../../../lib/queue");

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const auditInput = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email(),
  websiteUrl: z.string().url(),
  businessType: z.string().max(100).optional(),
  city: z.string().max(100).optional(),
  state: z.string().max(100).optional(),
});

// Get recent audits
export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const audits = await prisma.audit.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
      include: {
        client: {
          select: {
            name: true,
            websiteUrl: true,
          },
        },
        result: {
          select: {
            executiveSummary: true,
            recommendations: true,
          },
        },
      },
    });

    return NextResponse.json({ audits });
  } catch (error) {
    console.error("Fetch audits error:", error);
    return NextResponse.json(
      { error: "Failed to load audits" },
      { status: 500 },
    );
  }
}

// Create and queue a new audit
export async function POST(request) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const body = auditInput.safeParse(await request.json());

    if (!body.success) {
      return NextResponse.json(
        { error: "Invalid client or website details" },
        { status: 400 },
      );
    }

    const input = body.data;
    const url = new URL(input.websiteUrl);

    if (
      !["http:", "https:"].includes(url.protocol) ||
      url.username ||
      url.password ||
      url.port
    ) {
      return NextResponse.json(
        { error: "Enter a standard HTTP or HTTPS URL" },
        { status: 400 },
      );
    }

    const client = await prisma.client.upsert({
      where: { email: input.email },
      update: {
        name: input.name,
        websiteUrl: input.websiteUrl,
        businessType: input.businessType,
        city: input.city,
        state: input.state,
      },
      create: {
        name: input.name,
        email: input.email,
        websiteUrl: input.websiteUrl,
        businessType: input.businessType,
        city: input.city,
        state: input.state,
      },
    });

    // Store clientName as an immutable snapshot so renaming the client
    // later does not retroactively change historical audit cards.
    const audit = await prisma.audit.create({
      data: {
        clientId: client.id,
        clientName: client.name,
        websiteUrl: input.websiteUrl,
        status: "PENDING",
        progress: 0,
      },
    });

    try {
      await addAuditJob(audit.id, audit.websiteUrl);
    } catch (queueError) {
      await prisma.audit.update({
        where: { id: audit.id },
        data: {
          status: "FAILED",
          errorMessage: "Unable to enqueue audit",
        },
      });
      throw queueError;
    }

    return NextResponse.json(
      { success: true, auditId: audit.id },
      { status: 201 },
    );
  } catch (error) {
    console.error("Create audit error:", error);

    return NextResponse.json(
      { error: "Unable to create audit" },
      { status: 500 },
    );
  }
}
