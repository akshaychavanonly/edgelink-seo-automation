"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import {
  Activity,
  CheckCircle2,
  Clock3,
  Globe,
  Loader2,
  Play,
  RefreshCw,
  Search,
  ShieldCheck,
  TrendingUp,
  FileText,
  AlertCircle,
  ExternalLink,
  LogOut,
  Sparkles,
  Zap,
} from "lucide-react";

export default function AdminDashboard() {
  const [audits, setAudits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const [form, setForm] = useState({
    name: "Dr. Smile Dental Clinic",
    email: "demo@edgelink.example",
    websiteUrl: "https://example.com",
    businessType: "Dental & Healthcare",
    city: "Pune",
    state: "Maharashtra",
  });

  const loadAudits = useCallback(async () => {
    try {
      const response = await fetch("/api/audits", {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Unable to load audits");
      }

      const data = await response.json();
      setAudits(data.audits || []);
      setError("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAudits();
    const interval = setInterval(loadAudits, 3000);
    return () => clearInterval(interval);
  }, [loadAudits]);

  function updateField(event) {
    const { name, value } = event.target;
    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  function fillSample(type) {
    if (type === "dental") {
      setForm({
        name: "Dr. Smile Dental Clinic",
        email: "demo@edgelink.example",
        websiteUrl: "https://example.com",
        businessType: "Dental Clinic",
        city: "Pune",
        state: "Maharashtra",
      });
    } else if (type === "hospital") {
      setForm({
        name: "Apex Healthcare & Diagnostic",
        email: "apex@edgelink.example",
        websiteUrl: "https://example.org",
        businessType: "Healthcare Hospital",
        city: "Mumbai",
        state: "Maharashtra",
      });
    }
  }

  async function startAudit(event) {
    event.preventDefault();

    setSubmitting(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch("/api/audits", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Audit dispatch failed");
      }

      setMessage("Audit successfully queued in BullMQ (seo-audit-jobs)!");
      await loadAudits();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  const completed = audits.filter((audit) => audit.status === "COMPLETED");
  const running = audits.filter(
    (audit) => audit.status === "PROCESSING" || audit.status === "PENDING",
  );
  const failed = audits.filter((audit) => audit.status === "FAILED");

  const averageScore = completed.length
    ? Math.round(
        completed.reduce(
          (total, audit) => total + (audit.overallScore || 0),
          0,
        ) / completed.length,
      )
    : 0;

  const filteredAudits = audits.filter((audit) => {
    if (statusFilter === "ALL") return true;
    if (statusFilter === "RUNNING")
      return audit.status === "PROCESSING" || audit.status === "PENDING";
    return audit.status === statusFilter;
  });

  const stats = [
    {
      label: "Total Audits",
      value: audits.length,
      icon: Search,
      change: "All time",
      color: "text-slate-200",
      bg: "bg-slate-800/40",
    },
    {
      label: "Completed",
      value: completed.length,
      icon: CheckCircle2,
      change: "Processed",
      color: "text-emerald-400",
      bg: "bg-emerald-950/30",
    },
    {
      label: "In Progress",
      value: running.length,
      icon: Activity,
      change: running.length > 0 ? "Active pipeline" : "Idle",
      color: "text-teal-400",
      bg: "bg-teal-950/30",
      pulse: running.length > 0,
    },
    {
      label: "Average SEO Score",
      value: averageScore ? `${averageScore}/100` : "--",
      icon: TrendingUp,
      change: "Benchmark",
      color: "text-cyan-400",
      bg: "bg-cyan-950/30",
    },
  ];

  return (
    <div className="min-h-screen bg-[#070b12] text-slate-100 selection:bg-teal-500/30 selection:text-teal-200">
      {/* Background Teal Accents */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute top-0 right-1/4 h-[400px] w-[600px] rounded-full bg-teal-500/5 blur-[140px]" />
        <div className="absolute bottom-10 left-10 h-[350px] w-[500px] rounded-full bg-emerald-600/5 blur-[130px]" />
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
                  Operations Console
                </p>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-2 rounded-full border border-teal-500/20 bg-teal-950/40 px-3 py-1 text-xs text-teal-300 md:flex">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-teal-500"></span>
              </span>
              BullMQ Workers Active
            </div>

            <Link
              href="/client"
              className="flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs font-medium text-slate-300 transition hover:border-teal-500/50 hover:text-white"
            >
              <span>Client Portal</span>
              <ExternalLink size={13} className="text-slate-400" />
            </Link>

            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs font-medium text-slate-400 transition hover:border-red-500/40 hover:bg-red-950/30 hover:text-red-300"
              title="Sign Out"
            >
              <LogOut size={13} />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 mx-auto max-w-7xl space-y-8 px-6 py-8">
        {/* Title & Description */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-teal-400">
              <Zap size={14} />
              SEO Audit Orchestration
            </div>
            <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
              Platform Overview & Control
            </h2>
            <p className="mt-1 text-sm text-slate-400">
              Trigger automated crawling, monitor BullMQ queue progression, and inspect Claude 4.6 AI audits.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={loadAudits}
              className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/90 px-3.5 py-2 text-xs font-semibold text-slate-300 transition hover:border-teal-500/50 hover:bg-slate-800 hover:text-white"
            >
              <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
              Refresh
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="relative overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/70 p-5 backdrop-blur-sm"
              >
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium text-slate-400">{stat.label}</p>
                  <div className={`rounded-xl p-2.5 ${stat.bg}`}>
                    <Icon size={18} className={stat.color} />
                  </div>
                </div>

                <div className="mt-4 flex items-baseline gap-2">
                  <p className="text-3xl font-extrabold tracking-tight text-white">
                    {stat.value}
                  </p>
                  {stat.pulse && (
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal-400 opacity-75"></span>
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-teal-500"></span>
                    </span>
                  )}
                </div>
                <p className="mt-1 text-xs text-slate-500">{stat.change}</p>
              </div>
            );
          })}
        </div>

        {/* Two Column Section */}
        <div className="grid gap-8 lg:grid-cols-12">
          {/* New Audit Form - 4 cols */}
          <section className="lg:col-span-5">
            <div className="rounded-2xl border border-slate-800/90 bg-slate-900/80 p-6 shadow-xl backdrop-blur-md">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="rounded-lg bg-teal-950/60 p-2 text-teal-400">
                    <Globe size={18} />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">Dispatch New Audit</h3>
                    <p className="text-xs text-slate-400">Enqueues job to Upstash BullMQ</p>
                  </div>
                </div>
              </div>

              {/* Sample Autofill Pills */}
              <div className="mb-5 flex items-center gap-2 text-xs">
                <span className="text-[11px] text-slate-500">Presets:</span>
                <button
                  type="button"
                  onClick={() => fillSample("dental")}
                  className="rounded-md border border-slate-700/60 bg-slate-800/50 px-2.5 py-1 text-[11px] font-medium text-teal-300 transition hover:bg-slate-700"
                >
                  Dental Clinic
                </button>
                <button
                  type="button"
                  onClick={() => fillSample("hospital")}
                  className="rounded-md border border-slate-700/60 bg-slate-800/50 px-2.5 py-1 text-[11px] font-medium text-slate-300 transition hover:bg-slate-700"
                >
                  Healthcare
                </button>
              </div>

              <form onSubmit={startAudit} className="space-y-3.5">
                {[
                  ["name", "Client / Business Name", "text"],
                  ["email", "Recipient Client Email", "email"],
                  ["websiteUrl", "Target Website URL (HTTP/HTTPS)", "url"],
                  ["businessType", "Business Category / Niche", "text"],
                  ["city", "City (Target Market)", "text"],
                  ["state", "State", "text"],
                ].map(([field, label, inputType]) => (
                  <div key={field}>
                    <label className="mb-1 block text-xs font-medium text-slate-300">
                      {label}
                    </label>
                    <input
                      name={field}
                      value={form[field]}
                      onChange={updateField}
                      required={["name", "email", "websiteUrl"].includes(field)}
                      type={inputType}
                      className="w-full rounded-xl border border-slate-700/80 bg-slate-950/70 px-3.5 py-2 text-xs text-white placeholder-slate-500 outline-none transition focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                    />
                  </div>
                ))}

                <button
                  type="submit"
                  disabled={submitting}
                  className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 px-4 py-3 text-xs font-bold text-white shadow-lg shadow-teal-500/25 transition hover:from-teal-500 hover:to-emerald-500 disabled:opacity-50"
                >
                  {submitting ? (
                    <Loader2 className="animate-spin" size={15} />
                  ) : (
                    <Play size={15} />
                  )}
                  {submitting ? "Queueing Audit Job..." : "Queue SEO Audit Pipeline"}
                </button>
              </form>

              {message && (
                <div className="mt-4 flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-950/30 px-3 py-2 text-xs text-emerald-300">
                  <CheckCircle2 size={15} className="shrink-0 text-emerald-400" />
                  <span>{message}</span>
                </div>
              )}

              {error && (
                <div className="mt-4 flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-950/30 px-3 py-2 text-xs text-red-300">
                  <AlertCircle size={15} className="shrink-0 text-red-400" />
                  <span>{error}</span>
                </div>
              )}
            </div>
          </section>

          {/* Audit Queue & History - 7 cols */}
          <section className="lg:col-span-7">
            <div className="rounded-2xl border border-slate-800/90 bg-slate-900/80 p-6 shadow-xl backdrop-blur-md">
              <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-base font-bold text-white">Live Audit Queue & Runs</h3>
                  <p className="text-xs text-slate-400">
                    Real-time execution status ({audits.length} total)
                  </p>
                </div>

                {/* Filter Tabs */}
                <div className="flex items-center gap-1 rounded-xl border border-slate-800 bg-slate-950 p-1 text-xs">
                  {[
                    ["ALL", "All"],
                    ["RUNNING", `Running (${running.length})`],
                    ["COMPLETED", `Done (${completed.length})`],
                    ["FAILED", `Failed (${failed.length})`],
                  ].map(([val, text]) => (
                    <button
                      key={val}
                      onClick={() => setStatusFilter(val)}
                      className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                        statusFilter === val
                          ? "bg-teal-600 text-white"
                          : "text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      {text}
                    </button>
                  ))}
                </div>
              </div>

              {loading ? (
                <div className="flex h-64 flex-col items-center justify-center gap-3 text-slate-400">
                  <Loader2 className="animate-spin text-teal-400" size={24} />
                  <p className="text-xs">Fetching audit statuses...</p>
                </div>
              ) : filteredAudits.length === 0 ? (
                <div className="flex h-64 flex-col items-center justify-center rounded-xl border border-dashed border-slate-800 p-8 text-center text-slate-400">
                  <Search size={32} className="text-slate-600" />
                  <p className="mt-3 text-sm font-medium text-slate-300">
                    No audits match this filter
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    Submit a new audit or switch the filter tab.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredAudits.map((audit) => {
                    const isRunning =
                      audit.status === "PROCESSING" || audit.status === "PENDING";
                    const isDone = audit.status === "COMPLETED";
                    const isFail = audit.status === "FAILED";

                    return (
                      <div
                        key={audit.id}
                        className="group relative rounded-xl border border-slate-800 bg-slate-950/70 p-5 transition hover:border-slate-700"
                      >
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <h4 className="text-sm font-bold text-white">
                                {audit.client?.name || "Client"}
                              </h4>
                              <span className="text-[11px] text-slate-500">•</span>
                              <span className="flex items-center gap-1 text-[11px] text-slate-400">
                                <Clock3 size={11} />
                                {new Date(audit.createdAt).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </span>
                            </div>
                            <p className="break-all text-xs font-mono text-teal-400/90">
                              {audit.websiteUrl}
                            </p>
                          </div>

                          <div className="flex items-center gap-2">
                            <span
                              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                                isDone
                                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                  : isFail
                                    ? "bg-red-500/10 text-red-400 border border-red-500/20"
                                    : "bg-teal-500/10 text-teal-300 border border-teal-500/20"
                              }`}
                            >
                              {isRunning && (
                                <span className="relative flex h-1.5 w-1.5">
                                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal-400 opacity-75"></span>
                                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-teal-400"></span>
                                </span>
                              )}
                              {audit.status}
                            </span>

                            {audit.overallScore !== null && (
                              <span className="rounded-lg bg-teal-950/60 px-2 py-0.5 text-xs font-bold text-teal-300 border border-teal-500/20">
                                {audit.overallScore}/100
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="mt-4">
                          <div className="flex items-center justify-between text-[11px] text-slate-400">
                            <span>Pipeline Progress</span>
                            <span className="font-semibold text-slate-300">
                              {audit.progress}%
                            </span>
                          </div>
                          <div
                            role="progressbar"
                            aria-valuenow={audit.progress}
                            aria-valuemin={0}
                            aria-valuemax={100}
                            className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-slate-800"
                          >
                            <div
                              className={`h-full rounded-full transition-all duration-500 ${
                                isDone
                                  ? "bg-gradient-to-r from-teal-500 to-emerald-400"
                                  : isFail
                                    ? "bg-red-500"
                                    : "bg-gradient-to-r from-teal-600 via-teal-400 to-cyan-400"
                              }`}
                              style={{ width: `${Math.max(5, audit.progress)}%` }}
                            />
                          </div>
                        </div>

                        {/* Summary / Report Actions */}
                        {audit.result?.executiveSummary && (
                          <div className="mt-3.5 rounded-lg border border-slate-800/80 bg-slate-900/60 p-3 text-xs leading-relaxed text-slate-300">
                            <div className="mb-1 flex items-center gap-1.5 font-semibold text-teal-400">
                              <Sparkles size={12} />
                              AI Executive Summary
                            </div>
                            {audit.result.executiveSummary}
                          </div>
                        )}

                        {isDone && (
                          <div className="mt-3.5 flex items-center justify-between border-t border-slate-800/60 pt-3">
                            <span className="text-[11px] text-slate-500">
                              ID: {audit.id.slice(-8)}
                            </span>
                            <a
                              href={`/api/reports/${audit.id}`}
                              className="inline-flex items-center gap-1.5 rounded-lg border border-teal-500/30 bg-teal-950/40 px-3 py-1 text-xs font-semibold text-teal-300 transition hover:bg-teal-900/40 hover:text-white"
                            >
                              <FileText size={13} />
                              Download PDF
                            </a>
                          </div>
                        )}

                        {isFail && (
                          <div className="mt-3 text-xs text-red-400">
                            Failure Reason: {audit.errorMessage || "Worker processing error"}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
