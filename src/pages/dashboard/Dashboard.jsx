import AppShell from "../../layouts/AppShell";
import {
  CalendarDays,
  ChevronDown,
  TrendingUp,
  TrendingDown,
  Minus,
  MoreHorizontal,
  User,
} from "lucide-react";

const metrics = [
  { label: "Total Brands", value: "24", delta: "8.2%", trend: "up" },
  { label: "Meta Links", value: "156", delta: "12%", trend: "up" },
  { label: "Campaigns", value: "842", delta: "0.4%", trend: "flat" },
  { label: "Total Leads", value: "124.5k", delta: "24%", trend: "up" },
  { label: "Efficiency", value: "92%", delta: "3%", trend: "down" },
];

const campaigns = [
  ["Q3 Mid-Year Sale - Meta", "Facebook Ads", "2,450", "$4.12", "Active"],
  ["Brand Awareness 2024", "Instagram Feed", "1,120", "$6.45", "Active"],
  ["Retargeting Flow - V2", "Meta Messenger", "854", "$3.88", "Paused"],
];

const leads = [
  ["Johnathan W.", "Residential Solar", "2m ago", "Qualified"],
  ["Maria Gonzales", "New Customer Offer", "14m ago", "Qualified"],
];

const regionData = [
  ["North America", "45%"],
  ["Europe", "32%"],
  ["Asia Pacific", "18%"],
];

function TrendIcon({ trend }) {
  if (trend === "up") return <TrendingUp size={12} className="text-emerald-400" />;
  if (trend === "down") return <TrendingDown size={12} className="text-rose-400" />;
  return <Minus size={12} className="text-slate-400" />;
}

export default function Dashboard() {
  return (
    <AppShell>
      <div className="space-y-8">
        <div className="flex flex-col justify-between gap-6 xl:flex-row xl:items-center">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Welcome Back, James! 👋
            </h1>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-500">
              Here&apos;s what&apos;s happening with your brands today.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button className="app-panel-soft flex items-center gap-2 px-4 py-2.5 text-xs font-medium text-slate-600 dark:text-slate-300">
              <CalendarDays size={16} className="text-slate-500" />
              <span>Last 30 Days</span>
              <ChevronDown size={15} className="text-slate-500" />
            </button>

            <button className="app-panel-soft flex items-center gap-2 px-4 py-2.5 text-xs font-medium text-slate-600 dark:text-slate-300">
              <span className="text-slate-500">Brand:</span>
              <span>All Brands</span>
              <ChevronDown size={15} className="text-slate-500" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-5">
          {metrics.map((item) => (
            <div key={item.label} className="glass-card app-panel-glow rounded-2xl p-6">
              <div className="mb-4 flex items-start justify-between">
                <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-400 dark:text-slate-500">
                  {item.label}
                </span>
                <MoreHorizontal size={16} className="text-slate-400 dark:text-slate-600" />
              </div>

              <div className="flex items-end gap-2">
                <span className="text-2xl font-bold text-slate-900 dark:text-white">
                  {item.value}
                </span>
                <span
                  className={`inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-bold ${
                    item.trend === "up"
                      ? "bg-emerald-500/10 text-emerald-500 dark:text-emerald-400"
                      : item.trend === "down"
                      ? "bg-rose-500/10 text-rose-500 dark:text-rose-400"
                      : "bg-slate-500/10 text-slate-500 dark:text-slate-400"
                  }`}
                >
                  <TrendIcon trend={item.trend} />
                  {item.trend === "down" ? "↓" : item.trend === "up" ? "↑" : "~"}{" "}
                  {item.delta}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="glass-card app-panel-glow rounded-3xl p-8 lg:col-span-8">
            <div className="mb-10 flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                  Leads Overview
                </h3>
                <p className="mt-1 text-xs text-slate-500">
                  <span className="font-bold text-emerald-500 dark:text-emerald-400">
                    +5% more
                  </span>{" "}
                  than last month
                </p>
              </div>

              <div className="flex gap-4">
                <span className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                  Organic
                </span>
                <span className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-300/50" />
                  Paid
                </span>
              </div>
            </div>

            <div className="relative flex h-[320px] items-end gap-1.5 overflow-hidden rounded-2xl bg-gradient-to-t from-blue-500/10 to-transparent p-4">
              {[40, 55, 35, 70, 60, 85, 50, 45, 75, 95, 65, 80].map((h, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-t-md bg-blue-500/30 transition hover:bg-blue-500/50"
                  style={{ height: `${h}%` }}
                />
              ))}

              <div className="pointer-events-none absolute inset-0 flex flex-col justify-between px-4 py-6 opacity-20">
                {[1, 2, 3, 4].map((line) => (
                  <div key={line} className="border-t border-slate-400 dark:border-slate-500" />
                ))}
              </div>
            </div>
          </div>

          <div className="glass-card app-panel-glow rounded-3xl p-8 lg:col-span-4">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
              Satisfaction Rate
            </h3>
            <p className="mt-2 text-xs text-slate-500">From all user feedback</p>

            <div className="mt-10 flex flex-col items-center">
              <div className="relative mb-8 h-52 w-52">
                <svg className="h-full w-full -rotate-90" viewBox="0 0 36 36">
                  <circle
                    cx="18"
                    cy="18"
                    r="16"
                    fill="none"
                    strokeWidth="2.5"
                    className="stroke-slate-200 dark:stroke-slate-800"
                  />
                  <circle
                    cx="18"
                    cy="18"
                    r="16"
                    fill="none"
                    strokeWidth="2.5"
                    strokeDasharray="75 100"
                    strokeLinecap="round"
                    className="stroke-blue-500"
                  />
                </svg>

                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-5xl font-extrabold text-slate-900 dark:text-white">
                    95%
                  </span>
                  <span className="mt-1 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
                    Based on Likes
                  </span>
                </div>
              </div>

              <div className="grid w-full grid-cols-2">
                <span className="text-left text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
                  0%
                </span>
                <span className="text-right text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
                  100%
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="glass-card app-panel-glow overflow-hidden rounded-3xl">
          <div className="flex items-center justify-between border-b border-slate-200 p-8 dark:border-white/5">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
              Campaigns Performance
            </h3>
            <button className="text-xs font-bold uppercase tracking-[0.2em] text-blue-500 transition hover:text-slate-900 dark:hover:text-white">
              View All
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-separate border-spacing-0 text-left text-sm">
              <thead>
                <tr className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
                  <th className="px-8 py-5">Campaign Name</th>
                  <th className="px-8 py-5">Channel</th>
                  <th className="px-8 py-5 text-right">Leads</th>
                  <th className="px-8 py-5 text-right">CPL</th>
                  <th className="px-8 py-5 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-white/5">
                {campaigns.map((row) => (
                  <tr key={row[0]} className="transition hover:bg-slate-50 dark:hover:bg-white/[0.02]">
                    <td className="px-8 py-6 font-bold text-slate-900 dark:text-slate-200">
                      {row[0]}
                    </td>
                    <td className="px-8 py-6 text-slate-500 dark:text-slate-400">{row[1]}</td>
                    <td className="px-8 py-6 text-right font-bold text-slate-900 dark:text-slate-200">
                      {row[2]}
                    </td>
                    <td className="px-8 py-6 text-right font-bold text-emerald-500 dark:text-emerald-400">
                      {row[3]}
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex justify-center">
                        <span
                          className={`rounded-full border px-3 py-1 text-[9px] font-extrabold uppercase tracking-[0.2em] ${
                            row[4] === "Active"
                              ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-500 dark:text-emerald-400"
                              : "border-slate-500/20 bg-slate-500/10 text-slate-500 dark:text-slate-400"
                          }`}
                        >
                          {row[4]}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div className="glass-card app-panel-glow rounded-3xl p-8">
            <h3 className="mb-8 text-2xl font-bold text-slate-900 dark:text-white">
              Latest Captured Leads
            </h3>
            <div className="space-y-4">
              {leads.map(([name, campaign, time, status]) => (
                <div
                  key={name}
                  className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white/70 p-4 transition hover:border-blue-500/30 dark:border-white/5 dark:bg-white/[0.03]"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-500 dark:bg-slate-800">
                      <User size={18} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900 dark:text-white">{name}</p>
                      <p className="text-[10px] uppercase tracking-[0.08em] text-slate-500">
                        {campaign} • {time}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`rounded px-2 py-1 text-[10px] font-extrabold uppercase tracking-[0.18em] ${
                      status === "Qualified"
                        ? "bg-blue-500/10 text-blue-500 dark:text-blue-400"
                        : "bg-amber-500/10 text-amber-500 dark:text-amber-400"
                    }`}
                  >
                    {status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card app-panel-glow rounded-3xl p-8">
            <h3 className="mb-8 text-2xl font-bold text-slate-900 dark:text-white">
              Region Performance
            </h3>
            <div className="space-y-6">
              {regionData.map(([region, value]) => (
                <div key={region}>
                  <div className="mb-3 flex justify-between text-xs font-bold">
                    <span className="uppercase tracking-[0.18em] text-slate-500">
                      {region}
                    </span>
                    <span className="text-slate-800 dark:text-slate-200">{value}</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-slate-200 dark:bg-slate-800">
                    <div
                      className="h-full rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]"
                      style={{ width: value }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}