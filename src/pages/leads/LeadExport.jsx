import { useState } from "react";
import AppShell from "../../layouts/AppShell";
import {
  Search,
  Filter,
  Plus,
  History,
  CheckCircle2,
  HardDrive,
  Download,
  RefreshCcw,
  MoreHorizontal,
  CalendarDays,
  Repeat,
} from "lucide-react";

const exportRows = [
  {
    job: "Q4_Retail_Segment_Final",
    source: "Salesforce CRM / All Contacts",
    requestedAt: "Oct 24, 2023 · 14:22",
    records: "124,500",
    format: "CSV",
    status: "Completed",
    action: "download",
  },
  {
    job: "Enterprise_Global_Prospects",
    source: "Marketing Cloud / LeadGen-23",
    requestedAt: "Oct 23, 2023 · 09:15",
    records: "850,210",
    format: "XLSX",
    status: "Processing (68%)",
    action: "cancel",
  },
  {
    job: "Monthly_Sync_Backup",
    source: "Core Database / Daily Archive",
    requestedAt: "Oct 20, 2023 · 18:00",
    records: "42,000",
    format: "CSV",
    status: "Archived",
    action: "restore",
  },
  {
    job: "Abandoned_Cart_Leads_UK",
    source: "E-commerce Engine",
    requestedAt: "Oct 18, 2023 · 11:30",
    records: "5,430",
    format: "CSV",
    status: "Failed",
    action: "retry",
  },
];

const schedules = [
  {
    title: "Daily Operations Sync",
    subtitle: "Runs daily at 00:00 UTC",
    tags: ["CSV", "AWS S3 Destination"],
    icon: CalendarDays,
  },
  {
    title: "Weekly Marketing Report",
    subtitle: "Runs every Monday at 08:00 AM",
    tags: ["XLSX", "SFTP Transfer"],
    icon: Repeat,
  },
];

function statusClasses(status) {
  if (status === "Completed") {
    return "border border-emerald-100 bg-emerald-50 text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400";
  }
  if (status.includes("Processing")) {
    return "border border-blue-100 bg-blue-50 text-blue-700 dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-400";
  }
  if (status === "Archived") {
    return "border border-slate-200 bg-slate-50 text-slate-600 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-400";
  }
  if (status === "Failed") {
    return "border border-red-100 bg-red-50 text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400";
  }
  return "border border-slate-200 bg-slate-50 text-slate-600 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-400";
}

export default function LeadExport() {
  const [autoRefresh, setAutoRefresh] = useState(true);

  return (
    <AppShell>
      <div className="space-y-10">
        <div className="flex flex-col justify-between gap-5 xl:flex-row xl:items-end">
          <div>
            <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">
              Lead Exports
            </h1>
            <p className="mt-2 text-base text-slate-500 dark:text-slate-400">
              Manage, track and download your enterprise lead data generation tasks.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button className="auth-outline-btn flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold">
              <Filter size={16} />
              Filter
            </button>

            <button className="blue-gradient-btn flex items-center gap-2 rounded-xl px-7 py-3 text-sm font-semibold text-white">
              <Plus size={16} />
              New Export
            </button>
          </div>
        </div>

        <div className="relative max-w-xl">
          <Search
            size={18}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            placeholder="Search export history..."
            className="auth-minimal-input w-full rounded-xl py-3 pl-11 pr-4 text-sm"
          />
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {[
            {
              title: "Total Exports",
              value: "1,284",
              icon: History,
              tone: "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400",
            },
            {
              title: "Completed (30d)",
              value: "42",
              icon: CheckCircle2,
              tone: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400",
            },
            {
              title: "Storage Used",
              value: "8.4 GB",
              icon: HardDrive,
              tone: "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400",
            },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="app-panel p-8">
                <div className="flex items-center gap-5">
                  <div
                    className={`flex h-14 w-14 items-center justify-center rounded-2xl ${item.tone}`}
                  >
                    <Icon size={26} />
                  </div>

                  <div>
                    <p className="mb-1 text-xs font-bold uppercase tracking-widest text-slate-400">
                      {item.title}
                    </p>
                    <p className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">
                      {item.value}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="app-panel overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-200 px-8 py-6 dark:border-white/10">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Export History
            </h3>

            <div className="flex items-center gap-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Auto-refresh
              </span>

              <button
                onClick={() => setAutoRefresh((prev) => !prev)}
                className={`relative h-5 w-10 rounded-full transition ${
                  autoRefresh ? "bg-blue-500/20" : "bg-slate-300 dark:bg-white/10"
                }`}
              >
                <span
                  className={`absolute top-0.5 h-4 w-4 rounded-full transition ${
                    autoRefresh
                      ? "right-0.5 bg-blue-600"
                      : "left-0.5 bg-slate-500 dark:bg-slate-400"
                  }`}
                />
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[980px] text-left">
              <thead className="bg-slate-50/60 dark:bg-white/[0.03]">
                <tr>
                  <th className="border-b border-slate-100 px-8 py-5 text-[11px] font-bold uppercase tracking-widest text-slate-400 dark:border-white/10">
                    Job Name / Source
                  </th>
                  <th className="border-b border-slate-100 px-8 py-5 text-[11px] font-bold uppercase tracking-widest text-slate-400 dark:border-white/10">
                    Requested At
                  </th>
                  <th className="border-b border-slate-100 px-8 py-5 text-[11px] font-bold uppercase tracking-widest text-slate-400 dark:border-white/10">
                    Records
                  </th>
                  <th className="border-b border-slate-100 px-8 py-5 text-[11px] font-bold uppercase tracking-widest text-slate-400 dark:border-white/10">
                    Format
                  </th>
                  <th className="border-b border-slate-100 px-8 py-5 text-[11px] font-bold uppercase tracking-widest text-slate-400 dark:border-white/10">
                    Status
                  </th>
                  <th className="border-b border-slate-100 px-8 py-5 text-right text-[11px] font-bold uppercase tracking-widest text-slate-400 dark:border-white/10">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 dark:divide-white/10">
                {exportRows.map((row) => (
                  <tr
                    key={row.job}
                    className="transition hover:bg-slate-50/60 dark:hover:bg-white/[0.03]"
                  >
                    <td className="px-8 py-6">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-900 dark:text-slate-100">
                          {row.job}
                        </span>
                        <span className="mt-1 text-[11px] font-medium text-slate-400">
                          {row.source}
                        </span>
                      </div>
                    </td>

                    <td className="whitespace-nowrap px-8 py-6 text-sm font-medium text-slate-600 dark:text-slate-400">
                      {row.requestedAt}
                    </td>

                    <td className="px-8 py-6 text-sm font-bold text-slate-700 dark:text-slate-300">
                      {row.records}
                    </td>

                    <td className="px-8 py-6">
                      <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-1 text-[10px] font-black text-slate-500 dark:bg-white/[0.04] dark:text-slate-400">
                        {row.format}
                      </span>
                    </td>

                    <td className="px-8 py-6">
                      <span
                        className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-bold ${statusClasses(
                          row.status
                        )}`}
                      >
                        {row.status.includes("Processing") ? (
                          <RefreshCcw size={12} className="animate-spin" />
                        ) : (
                          <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
                        )}
                        {row.status}
                      </span>
                    </td>

                    <td className="px-8 py-6 text-right">
                      {row.action === "download" ? (
                        <button className="inline-flex items-center gap-2 rounded-xl bg-blue-500/5 px-4 py-2 text-xs font-bold text-blue-600 transition hover:bg-blue-500/10 dark:text-blue-400">
                          <Download size={14} />
                          Download
                        </button>
                      ) : row.action === "retry" ? (
                        <button className="inline-flex items-center gap-2 rounded-xl bg-blue-500/5 px-4 py-2 text-xs font-bold text-blue-600 transition hover:bg-blue-500/10 dark:text-blue-400">
                          <RefreshCcw size={14} />
                          Retry
                        </button>
                      ) : row.action === "cancel" ? (
                        <button className="rounded-xl p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-500/10">
                          <MoreHorizontal size={18} />
                        </button>
                      ) : (
                        <button className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-white/[0.04] dark:hover:text-white">
                          <MoreHorizontal size={18} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col items-start justify-between gap-4 border-t border-slate-100 px-8 py-6 dark:border-white/10 md:flex-row md:items-center">
            <span className="text-[13px] font-medium text-slate-400">
              Showing <span className="font-bold text-slate-900 dark:text-white">1 to 5</span> of
              1,284 results
            </span>

            <div className="flex items-center gap-2">
              <button className="auth-outline-btn rounded-xl px-4 py-2 text-sm font-bold opacity-50">
                Previous
              </button>
              <button className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-sm font-bold text-white">
                1
              </button>
              <button className="auth-outline-btn flex h-10 w-10 items-center justify-center rounded-xl text-sm font-bold">
                2
              </button>
              <button className="auth-outline-btn flex h-10 w-10 items-center justify-center rounded-xl text-sm font-bold">
                3
              </button>
              <button className="auth-outline-btn rounded-xl px-4 py-2 text-sm font-bold">
                Next
              </button>
            </div>
          </div>
        </div>

        <div className="mt-14">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                Scheduled Syncs
              </h3>
              <p className="mt-1 text-sm font-medium text-slate-500">
                Automated recurring export tasks configured for your accounts.
              </p>
            </div>

            <button className="flex items-center gap-1 text-sm font-bold text-blue-600 transition hover:text-blue-700 dark:text-blue-400">
              View All Schedules
            </button>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {schedules.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="app-panel flex items-start justify-between p-8 transition hover:border-blue-500/20"
                >
                  <div className="flex gap-5">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
                      <Icon size={20} />
                    </div>

                    <div>
                      <h4 className="text-lg font-bold text-slate-900 dark:text-white">
                        {item.title}
                      </h4>
                      <p className="mt-1 text-xs font-bold tracking-wide text-slate-400">
                        {item.subtitle}
                      </p>

                      <div className="mt-5 flex items-center gap-3">
                        {item.tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded bg-slate-100 px-2 py-1 text-[10px] font-black uppercase text-slate-500 dark:bg-white/[0.04] dark:text-slate-400"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <button className="text-slate-300 transition hover:text-slate-500">
                    <MoreHorizontal size={18} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </AppShell>
  );
}