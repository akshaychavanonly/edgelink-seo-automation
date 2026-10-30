import Link from "next/link";
import {
  ShieldCheck,
  Cpu,
  Layers,
  FileCheck2,
  ArrowRight,
  Sparkles,
  Activity,
  Globe2,
  Zap,
  BarChart3,
  Bot,
  Send,
} from "lucide-react";

export default function HomePage() {
  const features = [
    {
      title: "Headless Crawling",
      description: "Cheerio & Fetch powered SSR crawler extracting on-page signals, schema.org JSON-LD, robots.txt, and sitemap.",
      icon: Globe2,
    },
    {
      title: "Multi-Source Metrics",
      description: "Integrated signals from Google PageSpeed Insights, Google Search Console, and DataForSEO SERP rankings.",
      icon: BarChart3,
    },
    {
      title: "Claude AI Engine",
      description: "Automated analysis via Claude 4.6 Sonnet returning falsifiable, structured JSON recommendations and priority fixes.",
      icon: Bot,
    },
    {
      title: "BullMQ Distributed Queue",
      description: "Upstash Redis-backed asynchronous worker pipeline ensuring fault-tolerant job dispatch and real-time progress.",
      icon: Zap,
    },
    {
      title: "Executive PDF Generation",
      description: "Automated pixel-perfect branded PDF generation using headless Puppeteer for immediate client delivery.",
      icon: FileCheck2,
    },
    {
      title: "Multi-Channel Delivery",
      description: "Integrated WhatsApp and Email dispatch triggers delivering audit reports instantly to stakeholders.",
      icon: Send,
    },
  ];

  return (
    <div className="min-h-screen bg-[#070b12] text-slate-100 selection:bg-teal-500/30 selection:text-teal-200">
      {/* Background Teal Glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-[500px] w-[900px] -translate-x-1/2 rounded-full bg-teal-500/10 blur-[130px]" />
        <div className="absolute top-[400px] -left-40 h-[400px] w-[500px] rounded-full bg-emerald-600/5 blur-[120px]" />
      </div>

      {/* Top Navigation */}
      <header className="relative z-10 border-b border-slate-800/80 bg-slate-950/60 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-teal-700 shadow-lg shadow-teal-500/20">
              <ShieldCheck className="h-6 w-6 text-white" />
            </div>
            <div>
              <span className="text-base font-bold tracking-tight text-white">
                EDGELINK <span className="text-teal-400">TECHNOLOGY</span>
              </span>
              <p className="text-[11px] font-medium tracking-wide text-slate-400">
                SEO Automation Dashboard
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden items-center gap-2 rounded-full border border-teal-500/20 bg-teal-950/40 px-3 py-1 text-xs text-teal-300 sm:flex">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-teal-500"></span>
              </span>
              Pipeline Online
            </div>
            <Link
              href="/login"
              className="rounded-lg border border-slate-700 bg-slate-800/80 px-4 py-2 text-xs font-semibold text-white transition hover:border-teal-500/50 hover:bg-slate-700"
            >
              Sign In
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 mx-auto max-w-7xl px-6 pt-16 pb-24">
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-teal-500/30 bg-teal-950/50 px-4 py-1.5 text-xs font-semibold text-teal-300 shadow-inner">
            <Sparkles className="h-3.5 w-3.5 text-teal-400" />
            <span>AI Developer & Automation Engineer Assessment</span>
          </div>

          <h1 className="mt-8 text-4xl font-extrabold tracking-tight text-white sm:text-6xl sm:leading-[1.15]">
            Autonomous Website{" "}
            <span className="bg-gradient-to-r from-teal-400 via-emerald-300 to-teal-200 bg-clip-text text-transparent">
              SEO Audits & AI Insights
            </span>
          </h1>

          <p className="mt-6 text-lg leading-relaxed text-slate-400">
            End-to-end SEO automation platform powered by Next.js 14, BullMQ workers,
            Cheerio crawler, and Anthropic Claude 4.6 for prioritized, falsifiable SEO growth reports.
          </p>

          {/* Quick Action Portals */}
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/admin"
              className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-teal-500/25 transition hover:from-teal-500 hover:to-emerald-500 sm:w-auto"
            >
              <Cpu className="h-4 w-4 text-teal-200" />
              <span>Launch Admin Portal</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>

            <Link
              href="/client"
              className="group flex w-full items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900/80 px-6 py-3.5 text-sm font-semibold text-slate-200 transition hover:border-teal-500/50 hover:bg-slate-800 hover:text-white sm:w-auto"
            >
              <Layers className="h-4 w-4 text-teal-400" />
              <span>Open Client Dashboard</span>
            </Link>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="mt-24">
          <div className="text-center">
            <h2 className="text-xs font-bold uppercase tracking-widest text-teal-400">
              System Architecture & Capabilities
            </h2>
            <p className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Engineered for Production Scale
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="group relative rounded-2xl border border-slate-800/80 bg-slate-900/60 p-6 backdrop-blur-sm transition-all duration-200 hover:-translate-y-1 hover:border-teal-500/40 hover:bg-slate-900/90 hover:shadow-xl hover:shadow-teal-950/30"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-teal-500/20 bg-teal-950/60 text-teal-400 group-hover:border-teal-500/40 group-hover:bg-teal-900/40">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-white">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-400">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Pipeline Diagram Bar */}
        <div className="mt-20 rounded-2xl border border-slate-800 bg-slate-950/70 p-6 sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="flex items-center gap-2 text-teal-400">
                <Activity className="h-4 w-4" />
                <span className="text-xs font-bold uppercase tracking-wider">
                  Audit Execution Sequence
                </span>
              </div>
              <h3 className="mt-2 text-xl font-bold text-white">
                Deterministic 7-Step Analysis Workflow
              </h3>
              <p className="mt-1 text-sm text-slate-400">
                Manual / Cron Trigger → Upstash BullMQ → Cheerio Crawler → Multi-Signal Aggregator → Claude AI → Neon DB → Puppeteer PDF → WhatsApp.
              </p>
            </div>

            <div className="flex flex-wrap gap-2 text-xs">
              {["Queue (BullMQ)", "Crawler", "PageSpeed", "GSC", "DataForSEO", "Claude Sonnet", "Puppeteer PDF"].map((step, idx) => (
                <span
                  key={step}
                  className="flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900/90 px-3 py-2 text-slate-300"
                >
                  <span className="font-semibold text-teal-400">{idx + 1}.</span> {step}
                </span>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950/60 py-8 text-center text-xs text-slate-500">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 sm:flex-row">
          <p>© 2026 Edgelink Technology. Confidential Assessment Build.</p>
          <div className="flex items-center gap-6 text-slate-400">
            <Link href="/admin" className="hover:text-teal-400">
              Admin Portal
            </Link>
            <Link href="/client" className="hover:text-teal-400">
              Client Portal
            </Link>
            <Link href="/login" className="hover:text-teal-400">
              Sign In
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
