import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "../../../../lib/auth";

const { prisma } = require("../../../../lib/prisma");
const { generateAuditPDF } = require("../../../../lib/pdf");

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request, { params }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const audit = await prisma.audit.findUnique({
      where: { id: params.auditId },
      include: {
        client: true,
        result: true,
      },
    });

    if (!audit || audit.status !== "COMPLETED" || !audit.result) {
      return NextResponse.json(
        { error: "Completed audit not found" },
        { status: 404 },
      );
    }

    if (
      session.user.role !== "ADMIN" &&
      (session.user.role !== "CLIENT" || audit.clientId !== session.user.clientId)
    ) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const pdfBuffer = await generateAuditPDF(audit);

    return new Response(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="edgelink-audit-${audit.id}.pdf"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("PDF generation error:", error);

    return NextResponse.json(
      { error: "Failed to generate PDF report" },
      { status: 500 },
    );
  }
}
