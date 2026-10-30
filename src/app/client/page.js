import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  ClipboardCheck,
  FileText,
  Globe,
  Lightbulb,
  ShieldCheck,
  TrendingUp,
  Download,
  Clock,
  Sparkles,
  Layers,
  ArrowUpRight,
} from "lucide-react";

import { authOptions } from "../../lib/auth";

const { prisma } = require("../../lib/prisma");

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function ScoreCard({ label, value }) {
  const score = Number(value || 0);

  const color =
    score >= 80
      ? "text-emerald-400"
      : score >= 60
        ? "text-amber-400"
        : "text-rose-400";

  const barGradient =
    score >= 80
      ? "from-teal-500 to-emerald-400"
      : score >= 60
        ? "from-amber-500 to-yellow-400"
        : "from-rose-500 to-red-400";

  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-800/90 bg-slate-900/70 p-5 backdrop-blur-sm transition hover:border-slate-700">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-slate-400">{label}</p>
        <span className="text-[11px] font-semibold text-slate-500">Benchmark</span>
      </div>

      <div className="mt-3 flex items-baseline gap-1">
        <span className={`text-3xl font-extrabold tracking-tight ${color}`}>
          {score}
        </span>
        <span className="text-xs text-slate-500">/100</span>
      </div>

      <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-800">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${barGradient} transition-all duration-700`}
          style={{ width: `${Math.min(100, Math.max(0, score))}%` }}
        />
      </div>
    </div>
  );
}

function IssueSection({ title, items, icon: Icon, color, bg }) {
  return (
    <section className="rounded-2xl border border-slate-800/90 bg-slate-900/70 p-6 backdrop-blur-sm">
      <div className="mb-4 flex items-center gap-2.5">
        <div className={`rounded-xl p-2 ${bg}`}>
          <Icon className={color} size={18} />
        </div>
        <div>
          <h3 className="text-base font-bold text-white">{title}</h3>
          <p className="text-xs text-slate-400">
            {items?.length || 0} items identified
          </p>
        </div>
      </div>

      {items?.length ? (
        <div className="space-y-2.5">
          {items.map((item, index) => (
            <div
              key={index}
              className="rounded-xl border border-slate-800/80 bg-slate-950/70 p-3.5 text-xs leading-relaxed text-slate-300"
            >
              {typeof item === "string"
                ? item
                : item?.finding || JSON.stringify(item)}
            </div>
          ))}
        </div>
      ) : (
        <p className="py-4 text-center text-xs text-slate-500">
          No issues identified in this category.
        </p>
      )}
    </section>
  );
}

export default async function ClientDashboard() {
  const session = await getServerSession(authOptions);

  if (!session) redirect("/login");

  if (session.user.role !== "CLIENT" || !session.user.clientId) {
    redirect("/admin");
  }

  const client = await prisma.client.findUnique({
    where: { id: session.user.clientId },
    include: {
      audits: {
        orderBy: { createdAt: "desc" },
        include: { result: true },
      },
    },
  });

  if (!client) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#070b12] p-6 text-white">
        <div className="max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-8 text-center">
          <ShieldCheck className="mx-auto h-12 w-12 text-teal-400" />
          <h1 className="mt-4 text-xl font-bold">Client Account Unlinked</h1>
          <p className="mt-2 text-xs text-slate-400">
            No audits are associated with this demo profile yet. Create an audit
            for <code className="text-teal-300">demo@edgelink.example</code> in the
            Admin Portal.
          </p>
          <Link
            href="/admin"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-teal-600 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-teal-500"
          >
            Go to Admin Dashboard
          </Link>
        </div>
      </main>
    );
  }

  const audits = client.audits;
  const latest = audits.find(
    (audit) => audit.status === "COMPLETED" && audit.result,
  );

  const result = latest?.result;
  const breakdown = result?.scoreBreakdown || {};

  const scores = [
    ["Technical SEO", breakdown.technical],
    ["On-Page Content", breakdown.on_page],
    ["Content Quality", breakdown.content],
    ["Core Web Vitals", breakdown.core_web_vitals],
    ["Schema Markup", breakdown.schema],
  ];

  return (
    <div className="min-h-screen bg-[#070b12] text-slate-100 selection:bg-teal-500/30 selection:text-teal-200">
      {/* Background Teal Accents */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/3 h-[450px] w-[600px] rounded-full bg-teal-500/5 blur-[140px]" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-teal-700 shadow-md shadow-teal-500/20">
                <ShieldCheck size={22} className="text-white" />
              </div>
              <div>
                <span className="text-base font-bold tracking-tight text-white">
                  EDGELINK <span className="text-teal-400">TECHNOLOGY</span>
                </span>
                <p className="text-[11px] font-medium text-slate-400">
                  Client Performance Portal
                </p>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <span className="rounded-full border border-teal-500/30 bg-teal-950/40 px-3 py-1 text-xs font-semibold text-teal-300">
              Verified Client
            </span>
            <Link
              href="/api/auth/signout"
              className="rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs font-medium text-slate-400 transition hover:bg-slate-800 hover:text-white"
            >
              Sign Out
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 mx-auto max-w-7xl space-y-8 px-6 py-8">
        {/* Welcome Client Card */}
        <div className="flex flex-col justify-between gap-6 rounded-2xl border border-slate-800/90 bg-gradient-to-br from-slate-900/90 via-slate-900/70 to-slate-950/90 p-6 sm:p-8 md:flex-row md:items-center">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-teal-400">
              <Layers size={14} />
              SEO Growth & Diagnostic Overview
            </div>
            <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
              {client.name}
            </h2>
            <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-400">
              <span className="flex items-center gap-1.5 font-mono text-teal-300">
                <Globe size={13} />
                {client.websiteUrl}
              </span>
              <span>•</span>
              <span>{client.businessType || "General Business"}</span>
              <span>•</span>
              <span>
                {client.city}, {client.state}
              </span>
            </div>
          </div>

          {latest && (
            <div className="flex items-center gap-3">
              <a
                href={`/api/reports/${latest.id}`}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 px-5 py-3 text-xs font-bold text-white shadow-lg shadow-teal-500/25 transition hover:from-teal-500 hover:to-emerald-500"
              >
                <Download size={15} />
                Download Full PDF Report
              </a>
            </div>
          )}
        </div>

        {!result ? (
          <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-900/40 p-12 text-center text-slate-400">
            <ClipboardCheck className="mx-auto h-12 w-12 text-slate-600" />
            <h3 className="mt-3 text-base font-bold text-slate-200">
              Audit in Queue
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              Your SEO audit is currently being processed by the worker pipeline.
              Refresh shortly to view results.
            </p>
          </div>
        ) : (
          <>
            {/* Top Metric Cards */}
            <div className="grid gap-5 md:grid-cols-3">
              {/* Overall Score */}
              <div className="relative overflow-hidden rounded-2xl border border-teal-500/30 bg-gradient-to-br from-teal-950/30 via-slate-900/80 to-slate-900/60 p-6 shadow-xl backdrop-blur-md">
                <div className="flex items-center justify-between text-teal-400">
                  <span className="text-xs font-bold uppercase tracking-wider">
                    Overall Health Score
                  </span>
                  <Activity size={18} />
                </div>
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="text-5xl font-black tracking-tight text-white">
                    {result.overallScore}
                  </span>
                  <span className="text-sm font-semibold text-teal-400/80">
                    / 100
                  </span>
                </div>
                <p className="mt-2 text-xs text-slate-400">
                  Aggregated across Technical, CWV, Schema, and On-Page.
                </p>
              </div>

              {/* Completed Audits */}
              <div className="rounded-2xl border border-slate-800/80 bg-slate-900/70 p-6 backdrop-blur-sm">
                <div className="flex items-center justify-between text-emerald-400">
                  <span className="text-xs font-bold uppercase tracking-wider">
                    Completed Audits
                  </span>
                  <CheckCircle2 size={18} />
                </div>
                <p className="mt-4 text-4xl font-extrabold text-white">
                  {audits.filter((a) => a.status === "COMPLETED").length}
                </p>
                <p className="mt-2 text-xs text-slate-400">
                  Historical audit cycles saved to Postgres database.
                </p>
              </div>

              {/* Actionable Recommendations */}
              <div className="rounded-2xl border border-slate-800/80 bg-slate-900/70 p-6 backdrop-blur-sm">
                <div className="flex items-center justify-between text-cyan-400">
                  <span className="text-xs font-bold uppercase tracking-wider">
                    Actionable Fixes
                  </span>
                  <TrendingUp size={18} />
                </div>
                <p className="mt-4 text-4xl font-extrabold text-white">
                  {result.recommendations?.length || 0}
                </p>
                <p className="mt-2 text-xs text-slate-400">
                  Ranked by impact, effort, and falsifiability.
                </p>
              </div>
            </div>

            {/* AI Executive Summary Card */}
            <section className="relative overflow-hidden rounded-2xl border border-slate-800/90 bg-slate-900/80 p-6 shadow-xl backdrop-blur-md sm:p-8">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-teal-400">
                <Sparkles size={14} />
                Claude 4.6 AI Executive Synthesis
              </div>
              <h3 className="mt-2 text-lg font-bold text-white">
                Analyst Summary & Growth Roadblock Diagnosis
              </h3>
              <p className="mt-4 text-sm leading-relaxed text-slate-300">
                {result.executiveSummary}
              </p>

              <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-slate-800/80 pt-4 text-xs text-slate-500">
                <span>Audit Version: {result.auditVersion || "v1.0"}</span>
                <span>Generated by Edgelink Automated Analysis Engine</span>
              </div>
            </section>

            {/* Score Breakdown */}
            <div>
              <div className="mb-4">
                <h3 className="text-lg font-bold text-white">
                  SEO Domain Breakdown
                </h3>
                <p className="text-xs text-slate-400">
                  Individual performance ratings across critical ranking pillars
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                {scores.map(([label, value]) => (
                  <ScoreCard key={label} label={label} value={value} />
                ))}
              </div>
            </div>

            {/* Issues Breakdown Grid */}
            <div className="grid gap-6 lg:grid-cols-3">
              <IssueSection
                title="Critical Issues"
                items={result.criticalIssues}
                icon={AlertTriangle}
                color="text-rose-400"
                bg="bg-rose-950/40"
              />
              <IssueSection
                title="Important Issues"
                items={result.importantIssues}
                icon={FileText}
                color="text-amber-400"
                bg="bg-amber-950/40"
              />
              <IssueSection
                title="Quick Wins (≤ 2 Hours)"
                items={result.quickWins}
                icon={Lightbulb}
                color="text-emerald-400"
                bg="bg-emerald-950/40"
              />
            </div>

            {/* Actionable Recommendations List */}
            <section className="rounded-2xl border border-slate-800/90 bg-slate-900/80 p-6 shadow-xl backdrop-blur-md">
              <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white">
                    Prioritized Action Plan
                  </h3>
                  <p className="text-xs text-slate-400">
                    Structured recommendations with verification checks
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {(result.recommendations || []).map((rec, i) => {
                  const priority = rec.priority?.toUpperCase();
                  const badgeColor =
                    priority === "CRITICAL"
                      ? "border-rose-500/30 bg-rose-950/40 text-rose-300"
                      : priority === "HIGH"
                        ? "border-orange-500/30 bg-orange-950/40 text-orange-300"
                        : priority === "MEDIUM"
                          ? "border-amber-500/30 bg-amber-950/40 text-amber-300"
                          : "border-slate-700 bg-slate-800 text-slate-300";

                  return (
                    <div
                      key={i}
                      className="group relative rounded-xl border border-slate-800 bg-slate-950/70 p-5 transition hover:border-slate-700"
                    >
                      <div className="mb-3 flex flex-wrap items-center gap-2">
                        <span
                          className={`rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${badgeColor}`}
                        >
                          {rec.priority}
                        </span>
                        <span className="rounded-full border border-teal-500/20 bg-teal-950/40 px-2.5 py-0.5 text-[11px] font-semibold text-teal-300">
                          {rec.category}
                        </span>
                      </div>

                      <h4 className="text-sm font-bold text-white">
                        {rec.finding}
                      </h4>

                      <div className="mt-3 rounded-lg border border-slate-800/80 bg-slate-900/50 p-3 text-xs text-slate-300">
                        <strong className="text-teal-400">Action:</strong>{" "}
                        {rec.fix}
                      </div>

                      <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-slate-400">
                        <span>
                          <strong className="text-slate-300">Impact:</strong>{" "}
                          {rec.estimated_impact}
                        </span>
                        <span>•</span>
                        <span>
                          <strong className="text-slate-300">Effort:</strong>{" "}
                          {rec.effort}
                        </span>
                        <span>•</span>
                        <span>
                          <strong className="text-slate-300">Verification:</strong>{" "}
                          {rec.falsifiability_check}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          </>
        )}

        {/* Audit History */}
        <section className="rounded-2xl border border-slate-800/90 bg-slate-900/80 p-6 shadow-xl backdrop-blur-md">
          <h3 className="mb-4 text-base font-bold text-white">
            Historical Audit Runs
          </h3>

          <div className="divide-y divide-slate-800/60 rounded-xl border border-slate-800 bg-slate-950/70">
            {audits.map((audit) => (
              <div
                key={audit.id}
                className="flex flex-wrap items-center justify-between gap-3 p-4 transition hover:bg-slate-900/30"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">
                      {new Date(audit.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                    <span className="text-xs text-slate-500">•</span>
                    <span className="text-xs text-slate-400">
                      {new Date(audit.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <p className="text-xs font-mono text-teal-400/80">
                    {audit.websiteUrl}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                      audit.status === "COMPLETED"
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                        : "bg-teal-500/10 text-teal-300 border border-teal-500/20"
                    }`}
                  >
                    {audit.status}
                  </span>

                  {audit.overallScore !== null && (
                    <span className="text-xs font-bold text-slate-200">
                      {audit.overallScore}/100
                    </span>
                  )}

                  {audit.status === "COMPLETED" && (
                    <a
                      href={`/api/reports/${audit.id}`}
                      className="rounded-lg border border-slate-800 bg-slate-900 p-1.5 text-slate-400 transition hover:border-teal-500/50 hover:text-white"
                      title="Download PDF"
                    >
                      <FileText size={14} />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
