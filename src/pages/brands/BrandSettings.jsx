import AppShell from "../../layouts/AppShell";
import {
  Info,
  ImageIcon,
  Shield,
  Puzzle,
  Database,
  History,
  Palette,
  Copy,
  RotateCcw,
} from "lucide-react";

export default function BrandSettings() {
  return (
    <AppShell>
      <div className="space-y-12">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">
              Brand Settings
            </h1>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Fine-tune your enterprise presence and global design tokens.
            </p>
          </div>

          <div className="flex gap-3">
            <button className="auth-outline-btn rounded-xl px-5 py-3 text-sm font-semibold">
              Discard
            </button>
            <button className="blue-gradient-btn rounded-xl px-6 py-3 text-sm font-semibold text-white">
              Save Changes
            </button>
          </div>
        </div>

        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded bg-blue-500/10">
              <Info size={18} className="text-blue-600" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Basic Information
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6 rounded-2xl border border-slate-200 bg-slate-50/50 p-1 dark:border-white/10 dark:bg-white/[0.03] md:grid-cols-2">
            <div className="space-y-5 p-5">
              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">
                  Brand Name
                </label>
                <input
                  type="text"
                  defaultValue="Aether Dynamics"
                  className="auth-minimal-input w-full rounded-xl px-4 py-3 text-sm"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">
                  Industry Sector
                </label>
                <select className="auth-minimal-input w-full rounded-xl px-4 py-3 text-sm">
                  <option>Technology & SaaS</option>
                  <option>Financial Services</option>
                  <option>Manufacturing</option>
                  <option>Healthcare</option>
                </select>
              </div>
            </div>

            <div className="p-5">
              <div className="flex h-full flex-col space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">
                  Description
                </label>
                <textarea
                  rows={5}
                  defaultValue="Premium global brand focused on enterprise growth and market leadership."
                  className="auth-minimal-input w-full flex-1 resize-none rounded-xl px-4 py-3 text-sm"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded bg-blue-500/10">
              <ImageIcon size={18} className="text-blue-600" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Logo & Theme
            </h2>
          </div>

          <div className="grid grid-cols-1 overflow-hidden rounded-2xl border border-slate-200 dark:border-white/10 md:grid-cols-3">
            <div className="border-b border-slate-200 p-6 dark:border-white/10 md:border-b-0 md:border-r">
              <label className="mb-4 block text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">
                Brand Logo
              </label>

              <div className="flex items-center gap-5">
                <div className="flex h-20 w-20 cursor-pointer items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-white transition hover:border-blue-500/50 dark:border-white/10 dark:bg-white/[0.03]">
                  <ImageIcon size={20} className="text-slate-400" />
                </div>

                <div className="space-y-2">
                  <button className="auth-outline-btn rounded-lg px-4 py-2 text-xs font-bold">
                    Replace
                  </button>
                  <p className="text-[10px] font-medium text-slate-500">
                    SVG, PNG up to 5MB
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 md:col-span-2">
              <label className="mb-4 block text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">
                Accent Color
              </label>

              <div className="mb-4 flex flex-wrap gap-4">
                {[
                  "bg-blue-600",
                  "bg-emerald-500",
                  "bg-amber-500",
                  "bg-rose-500",
                  "bg-violet-500",
                ].map((cls, i) => (
                  <button
                    key={cls}
                    className={`h-9 w-9 rounded-full ${cls} ${
                      i === 0
                        ? "ring-2 ring-blue-600 ring-offset-2 ring-offset-white dark:ring-offset-[#0b0b0f]"
                        : ""
                    }`}
                  />
                ))}

                <button className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-200 dark:bg-white/10">
                  <Palette size={16} className="text-slate-500" />
                </button>
              </div>

              <p className="text-xs leading-relaxed text-slate-500">
                This color defines the primary visual signature across buttons,
                links, and system notifications.
              </p>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded bg-blue-500/10">
                <Shield size={18} className="text-blue-600" />
              </div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Workspace Access
              </h2>
            </div>

            <div className="space-y-5 rounded-2xl border border-slate-200 bg-slate-50/50 p-6 dark:border-white/10 dark:bg-white/[0.03]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">
                    Single Sign-On (SSO)
                  </p>
                  <p className="text-xs text-slate-500">
                    Require enterprise SAML/Okta
                  </p>
                </div>

                <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600">
                  <span className="ml-6 inline-block h-4 w-4 rounded-full bg-white shadow-sm" />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">
                    Public Workspace
                  </p>
                  <p className="text-xs text-slate-500">
                    Enable indexed guest access
                  </p>
                </div>

                <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-slate-300 dark:bg-white/10">
                  <span className="ml-1 inline-block h-4 w-4 rounded-full bg-white shadow-sm" />
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded bg-blue-500/10">
                <Puzzle size={18} className="text-blue-600" />
              </div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Allowed Modules
              </h2>
            </div>

            <div className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50/50 p-6 dark:border-white/10 dark:bg-white/[0.03]">
              {[
                "Advanced Analytics Dashboard",
                "Global CDN Distribution",
                "AI-Powered Content Generation",
              ].map((item, i) => (
                <label key={item} className="flex items-center gap-3 text-sm">
                  <input
                    type="checkbox"
                    defaultChecked={i !== 2}
                    className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-slate-700 dark:text-slate-300">
                    {item}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded bg-blue-500/10">
              <Database size={18} className="text-blue-600" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Connection & Sync
            </h2>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-6 dark:border-white/10 dark:bg-white/[0.03]">
            <div className="flex flex-col gap-10 md:flex-row">
              <div className="flex-1 space-y-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
                  Connection Preferences
                </p>

                <div className="space-y-2">
                  <label className="text-[11px] font-semibold text-slate-500">
                    API Endpoint URL
                  </label>

                  <div className="flex">
                    <input
                      readOnly
                      value="api.aether-dynamics.cloud/v1"
                      className="auth-minimal-input w-full rounded-l-xl rounded-r-none px-4 py-3 text-xs font-mono"
                    />
                    <button className="flex items-center justify-center rounded-r-xl border border-l-0 border-slate-200 bg-slate-200 px-4 text-slate-700 dark:border-white/10 dark:bg-white/[0.03] dark:text-slate-400">
                      <Copy size={16} />
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex-1 space-y-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
                  Sync Settings
                </p>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-900 dark:text-white">
                      Auto-Sync Interval
                    </span>
                    <span className="rounded-lg border border-blue-500/20 bg-blue-500/10 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-blue-600">
                      15 mins
                    </span>
                  </div>

                  <div className="h-2 w-full rounded-full bg-slate-200 dark:bg-white/10">
                    <div className="h-2 w-3/4 rounded-full bg-blue-600 shadow-[0_0_8px_rgba(37,99,235,0.35)]" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded bg-blue-500/10">
              <History size={18} className="text-blue-600" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Archival Controls
            </h2>
          </div>

          <div className="flex flex-col items-start justify-between gap-8 rounded-2xl border border-slate-200 bg-slate-50/50 p-6 dark:border-white/10 dark:bg-white/[0.03] md:flex-row md:items-center">
            <div className="flex-1">
              <p className="text-sm font-bold text-slate-900 dark:text-white">
                Automatic Data Purge
              </p>
              <p className="mt-1 text-xs leading-relaxed text-slate-500">
                Migrate legacy assets to cold storage after 180 days of
                inactivity to optimize performance and ensure compliance.
              </p>
            </div>

            <div className="flex gap-3">
              <button className="auth-outline-btn rounded-xl px-4 py-3 text-xs font-bold">
                Review Archive
              </button>
              <button className="rounded-xl bg-slate-800 px-4 py-3 text-xs font-bold text-white dark:bg-white dark:text-slate-900">
                Configure Rules
              </button>
            </div>
          </div>
        </section>

        <div className="flex flex-col items-start justify-between gap-6 border-t border-slate-200 pt-8 dark:border-white/10 md:flex-row md:items-center">
          <button className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-rose-500">
            <RotateCcw size={16} />
            Reset All Settings
          </button>

          <div className="flex w-full gap-3 md:w-auto">
            <button className="auth-outline-btn flex-1 rounded-xl px-6 py-3 text-sm font-semibold md:flex-none">
              Discard
            </button>
            <button className="blue-gradient-btn flex-1 rounded-xl px-8 py-3 text-sm font-bold text-white md:flex-none">
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}