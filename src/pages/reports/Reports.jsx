import AppShell from "../../layouts/AppShell";
import {
  Search,
  Bell,
  FileDown,
  Globe,
  CalendarDays,
  Building2,
  CircleDollarSign,
  Gauge,
  Rocket,
  ShoppingCart,
  ArrowUpRight,
  ArrowDownRight,
  ArrowRight,
} from "lucide-react";

const filters = [
  { label: "Global Regions", icon: Globe },
  { label: "Q3 FY 2024", icon: CalendarDays },
  { label: "Marketing Dept", icon: Building2 },
];

const stats = [
  {
    title: "Total Revenue",
    value: "$4,250,800",
    change: "14.2%",
    positive: true,
    icon: CircleDollarSign,
    tone: "emerald",
  },
  {
    title: "Avg. Conversion",
    value: "12.5%",
    change: "2.1%",
    positive: false,
    icon: Gauge,
    tone: "rose",
  },
  {
    title: "Active Campaigns",
    value: "148",
    change: "5.0%",
    positive: true,
    icon: Rocket,
    tone: "blue",
  },
  {
    title: "Cust. Acquisition Cost",
    value: "$42.10",
    change: "8.4%",
    positive: false,
    icon: ShoppingCart,
    tone: "amber",
  },
];

const channelData = [
  { label: "Paid Search", value: "45%", color: "bg-blue-600" },
  { label: "Social Ads", value: "25%", color: "bg-blue-400" },
  { label: "Referral", value: "30%", color: "bg-slate-400" },
];

const campaigns = [
  {
    name: "Summer Tech Expo 2024",
    id: "CAM-9241",
    region: "North America",
    status: "Active",
    spent: "$45,200",
    revenue: "$182,400",
    roi: "4.0x",
  },
  {
    name: "Global SaaS Migration",
    id: "CAM-8812",
    region: "EMEA / APAC",
    status: "Paused",
    spent: "$128,000",
    revenue: "$640,000",
    roi: "5.0x",
  },
  {
    name: "Q4 Retargeting Engine",
    id: "CAM-7422",
    region: "Western Europe",
    status: "Active",
    spent: "$12,400",
    revenue: "$38,100",
    roi: "3.1x",
  },
  {
    name: "New Market Expansion",
    id: "CAM-9930",
    region: "Latin America",
    status: "Draft",
    spent: "$2,500",
    revenue: "$0",
    roi: "0.0x",
  },
];

function toneClasses(tone) {
  const map = {
    emerald: "bg-emerald-500/10 text-emerald-500",
    rose: "bg-rose-500/10 text-rose-500",
    blue: "bg-blue-500/10 text-blue-500",
    amber: "bg-amber-500/10 text-amber-500",
  };
  return map[tone] || map.blue;
}

function statusClasses(status) {
  if (status === "Active") {
    return "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20";
  }
  if (status === "Paused") {
    return "bg-blue-500/10 text-blue-500 border border-blue-500/20";
  }
  return "bg-slate-100 dark:bg-white/5 text-slate-500 border border-slate-200 dark:border-white/10";
}

export default function Reports() {
  return (
    <AppShell>
      <div className="space-y-8">
        <div className="flex flex-col justify-between gap-5 xl:flex-row xl:items-end">
          <div>
            <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">
              Executive Performance Report
            </h1>
            <p className="mt-2 text-base text-slate-500 dark:text-slate-400">
              Real-time enterprise marketing insights and ROI tracking.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative hidden w-72 lg:block">
              <Search
                size={18}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                placeholder="Search data..."
                className="auth-minimal-input w-full rounded-xl py-3 pl-11 pr-4 text-sm"
              />
            </div>

            <button className="topbar-action-btn h-11 w-11 rounded-full">
              <Bell size={18} />
            </button>

            <button className="blue-gradient-btn flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-white">
              <FileDown size={16} />
              Export Report
            </button>
          </div>
        </div>

        <section className="app-panel p-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="px-2 text-xs font-black uppercase tracking-[0.18em] text-slate-400">
              Filters
            </span>

            {filters.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.label}
                  className="flex items-center gap-2 rounded-xl bg-slate-100 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-200 dark:bg-white/[0.04] dark:text-slate-300 dark:hover:bg-white/[0.06]"
                >
                  <Icon size={16} />
                  {item.label}
                </button>
              );
            })}

            <button className="ml-2 text-sm font-bold text-blue-600 hover:underline dark:text-blue-400">
              Clear all filters
            </button>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
          {stats.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="metric-card app-panel-glow">
                <div className="mb-5 flex items-center justify-between">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-2xl ${toneClasses(
                      item.tone
                    )}`}
                  >
                    <Icon size={20} />
                  </div>

                  <span
                    className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-bold ${
                      item.positive
                        ? "bg-emerald-500/10 text-emerald-500"
                        : "bg-rose-500/10 text-rose-500"
                    }`}
                  >
                    {item.positive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                    {item.change}
                  </span>
                </div>

                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {item.title}
                </p>
                <p className="mt-2 text-4xl font-black tracking-tight text-slate-900 dark:text-white">
                  {item.value}
                </p>
              </div>
            );
          })}
        </section>

        <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <div className="app-panel xl:col-span-2">
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white">
                  Revenue Growth
                </h3>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Monthly performance vs budget
                </p>
              </div>

              <div className="flex flex-wrap gap-4 text-xs font-bold text-slate-500">
                <span className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-blue-600" />
                  Budget
                </span>
                <span className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-slate-300 dark:bg-slate-600" />
                  Actual
                </span>
              </div>
            </div>

            <div className="relative h-[340px] w-full overflow-hidden rounded-2xl bg-gradient-to-b from-blue-500/[0.04] to-transparent">
              <svg viewBox="0 0 900 320" className="h-full w-full">
                <path
                  d="M40 250 Q 120 210 200 230 T 380 120 T 560 140 T 860 50"
                  fill="none"
                  stroke="#1152d4"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
                <path
                  d="M40 270 Q 120 230 200 250 T 380 160 T 560 175 T 860 95"
                  fill="none"
                  stroke="#cbd5e1"
                  strokeWidth="3"
                  strokeDasharray="8 6"
                  strokeLinecap="round"
                />
              </svg>

              <div className="absolute bottom-0 left-0 right-0 flex justify-between px-3 pb-1 text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">
                <span>Jan</span>
                <span>Feb</span>
                <span>Mar</span>
                <span>Apr</span>
                <span>May</span>
                <span>Jun</span>
                <span>Jul</span>
                <span>Aug</span>
              </div>
            </div>
          </div>

          <div className="app-panel">
            <h3 className="text-xl font-black text-slate-900 dark:text-white">
              Conversion Channels
            </h3>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Performance by source
            </p>

            <div className="mt-8 flex flex-col items-center">
              <div className="relative h-52 w-52">
                <svg viewBox="0 0 36 36" className="h-full w-full -rotate-90">
                  <circle
                    cx="18"
                    cy="18"
                    r="15.9"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    className="text-slate-200 dark:text-white/10"
                  />
                  <circle
                    cx="18"
                    cy="18"
                    r="15.9"
                    fill="none"
                    stroke="#1152d4"
                    strokeWidth="3"
                    strokeDasharray="45 100"
                    strokeLinecap="round"
                  />
                  <circle
                    cx="18"
                    cy="18"
                    r="15.9"
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="3"
                    strokeDasharray="25 100"
                    strokeDashoffset="-45"
                    strokeLinecap="round"
                  />
                  <circle
                    cx="18"
                    cy="18"
                    r="15.9"
                    fill="none"
                    stroke="#94a3b8"
                    strokeWidth="3"
                    strokeDasharray="30 100"
                    strokeDashoffset="-70"
                    strokeLinecap="round"
                  />
                </svg>

                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <p className="text-4xl font-black text-slate-900 dark:text-white">
                    84%
                  </p>
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">
                    Efficiency
                  </p>
                </div>
              </div>

              <div className="mt-8 w-full space-y-4">
                {channelData.map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <span className={`h-2.5 w-2.5 rounded-full ${item.color}`} />
                      <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                        {item.label}
                      </span>
                    </div>
                    <span className="text-sm font-black text-slate-900 dark:text-white">
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="app-panel overflow-hidden">
          <div className="flex flex-col gap-4 border-b border-slate-200 px-6 py-6 dark:border-white/10 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white">
                Top Performing Campaigns
              </h3>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Detailed performance breakdown by region and spend.
              </p>
            </div>

            <button className="auth-outline-btn flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold">
              View Full Report
              <ArrowRight size={16} />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[980px] text-left">
              <thead className="bg-slate-50/80 dark:bg-white/[0.03]">
                <tr>
                  <th className="px-6 py-4 text-[11px] font-black uppercase tracking-[0.14em] text-slate-400">
                    Campaign Name
                  </th>
                  <th className="px-6 py-4 text-[11px] font-black uppercase tracking-[0.14em] text-slate-400">
                    Region
                  </th>
                  <th className="px-6 py-4 text-[11px] font-black uppercase tracking-[0.14em] text-slate-400">
                    Status
                  </th>
                  <th className="px-6 py-4 text-[11px] font-black uppercase tracking-[0.14em] text-slate-400">
                    Spent
                  </th>
                  <th className="px-6 py-4 text-right text-[11px] font-black uppercase tracking-[0.14em] text-slate-400">
                    Revenue
                  </th>
                  <th className="px-6 py-4 text-right text-[11px] font-black uppercase tracking-[0.14em] text-slate-400">
                    ROI
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-200 dark:divide-white/10">
                {campaigns.map((item) => (
                  <tr
                    key={item.id}
                    className="transition hover:bg-slate-50 dark:hover:bg-white/[0.03]"
                  >
                    <td className="px-6 py-5">
                      <div>
                        <p className="text-sm font-bold text-slate-900 dark:text-white">
                          {item.name}
                        </p>
                        <p className="mt-1 text-xs text-slate-400">
                          ID: {item.id}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-sm font-medium text-slate-600 dark:text-slate-300">
                      {item.region}
                    </td>
                    <td className="px-6 py-5">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-[0.12em] ${statusClasses(
                          item.status
                        )}`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-sm font-semibold text-slate-700 dark:text-slate-200">
                      {item.spent}
                    </td>
                    <td className="px-6 py-5 text-right text-sm font-bold text-slate-900 dark:text-white">
                      {item.revenue}
                    </td>
                    <td className="px-6 py-5 text-right text-sm font-black text-emerald-500">
                      {item.roi}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </AppShell>
  );
}