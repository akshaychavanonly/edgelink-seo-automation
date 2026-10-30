"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ShieldCheck, Loader2, ArrowLeft, KeyRound, UserCheck, ShieldAlert } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLoginWithCredentials(userEmail, userPassword) {
    setError("");
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email: userEmail,
        password: userPassword,
        redirect: false,
      });

      if (!result?.ok) {
        setError("Invalid email or password");
        setLoading(false);
        return;
      }

      const response = await fetch("/api/auth/session", {
        cache: "no-store",
      });
      const session = await response.json();

      const destination =
        session?.user?.role === "ADMIN" ? "/admin" : "/client";

      router.push(destination);
      router.refresh();
    } catch {
      setError("Login failed. Please check credentials or worker status.");
      setLoading(false);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    await handleLoginWithCredentials(email, password);
  }

  function setDemoAccount(role) {
    if (role === "admin") {
      setEmail("admin@edgelink.example");
      setPassword("AdminPass123!");
    } else {
      setEmail("demo@edgelink.example");
      setPassword("DemoClientPass123!");
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center bg-[#070b12] px-4 py-12 text-slate-100 selection:bg-teal-500/30 selection:text-teal-200">
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/2 h-[450px] w-[600px] -translate-x-1/2 rounded-full bg-teal-500/10 blur-[130px]" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 transition hover:text-teal-300"
          >
            <ArrowLeft size={14} />
            Back to Home
          </Link>
          <span className="rounded-full border border-teal-500/20 bg-teal-950/40 px-3 py-1 text-[11px] font-medium text-teal-300">
            Secure Portal
          </span>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-8 shadow-2xl backdrop-blur-xl">
          {/* Logo & Heading */}
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-teal-700 shadow-md shadow-teal-500/20">
              <ShieldCheck size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-white">
                EDGELINK <span className="text-teal-400">TECHNOLOGY</span>
              </h1>
              <p className="text-xs text-slate-400">SEO Automation Platform</p>
            </div>
          </div>

          <h2 className="mb-2 text-xl font-bold tracking-tight text-white">
            Sign In to Dashboard
          </h2>
          <p className="mb-6 text-xs text-slate-400">
            Access internal audit console or client performance reports.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-300">
                Email address
              </label>
              <input
                type="email"
                required
                autoComplete="username"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full rounded-xl border border-slate-700/80 bg-slate-950/70 px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                placeholder="you@edgelink.example"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-300">
                Password
              </label>
              <input
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-xl border border-slate-700/80 bg-slate-950/70 px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                placeholder="Enter password"
              />
            </div>

            {error && (
              <div
                role="alert"
                className="flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-950/30 px-3.5 py-2.5 text-xs text-red-300"
              >
                <ShieldAlert size={16} className="text-red-400 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-teal-500/25 transition hover:from-teal-500 hover:to-emerald-500 disabled:opacity-50"
            >
              {loading && <Loader2 size={16} className="animate-spin" />}
              {loading ? "Authenticating..." : "Sign In"}
            </button>
          </form>

          {/* Quick Demo Logins Helper */}
          <div className="mt-6 border-t border-slate-800 pt-5">
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Quick Fill Demo Credentials
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setDemoAccount("admin")}
                className="flex items-center justify-center gap-1.5 rounded-lg border border-slate-700/80 bg-slate-800/60 px-3 py-2 text-xs font-medium text-slate-300 transition hover:border-teal-500/50 hover:bg-slate-800 hover:text-white"
              >
                <KeyRound size={13} className="text-teal-400" />
                Admin Demo
              </button>
              <button
                type="button"
                onClick={() => setDemoAccount("client")}
                className="flex items-center justify-center gap-1.5 rounded-lg border border-slate-700/80 bg-slate-800/60 px-3 py-2 text-xs font-medium text-slate-300 transition hover:border-teal-500/50 hover:bg-slate-800 hover:text-white"
              >
                <UserCheck size={13} className="text-emerald-400" />
                Client Demo
              </button>
            </div>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-slate-500">
          Edgelink Technology • SEO Automation System
        </p>
      </div>
    </main>
  );
}
