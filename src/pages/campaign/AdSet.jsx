import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppShell from "../../layouts/AppShell";
import {
  Search,
  Filter,
  Plus,
  BadgeDollarSign,
  MousePointerClick,
  Eye,
  DollarSign,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  X,
  ImagePlus,
} from "lucide-react";

const tabs = [
  { label: "Active Ad Sets", count: 42 },
  { label: "Pending Review", count: null },
  { label: "Paused", count: null },
  { label: "Archived", count: null },
];

const adSetsData = [
  {
    id: "ADSET-1001",
    name: "Q4 Retention Lookalike 1%",
    campaign: "Awareness_Main_2024",
    status: "Active",
    budget: "$1,250.00",
    budgetType: "Daily Budget",
    ctr: "2.84%",
    cpc: "$0.45",
    reach: "1.2M",
    previews: 4,
    expanded: true,
    creatives: [
      { name: "V1_Static_Benefits", ctr: "3.1%", label: "Top Performer" },
      { name: "V2_Video_Demo", ctr: "2.4%", label: "Stable" },
    ],
  },
  {
    id: "ADSET-1002",
    name: "Interest: Enterprise SaaS",
    campaign: "LeadGen_Prospecting",
    status: "Active",
    budget: "$850.00",
    budgetType: "Daily Budget",
    ctr: "1.92%",
    cpc: "$0.82",
    reach: "450k",
    previews: 2,
  },
  {
    id: "ADSET-1003",
    name: "Broad Targeting_Global",
    campaign: "Brand_Awareness_International",
    status: "Learning",
    budget: "$3,000.00",
    budgetType: "Daily Budget",
    ctr: "0.95%",
    cpc: "$1.45",
    reach: "4.8M",
    previews: 1,
  },
];

function statusClasses(status) {
  if (status === "Active") {
    return "border border-emerald-500/20 bg-emerald-500/10 text-emerald-500";
  }
  if (status === "Learning") {
    return "border border-amber-500/20 bg-amber-500/10 text-amber-500";
  }
  return "border border-slate-300 dark:border-white/10 bg-slate-100 dark:bg-white/5 text-slate-500";
}

export default function AdSet() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return adSetsData;

    return adSetsData.filter(
      (item) =>
        item.name.toLowerCase().includes(q) ||
        item.campaign.toLowerCase().includes(q) ||
        item.status.toLowerCase().includes(q)
    );
  }, [query]);

  return (
    <AppShell>
      <div className="space-y-8">
        <div className="flex flex-col justify-between gap-5 xl:flex-row xl:items-end">
          <div>
            <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">
              Ad Sets Performance
            </h1>
            <p className="mt-2 text-base text-slate-500 dark:text-slate-400">
              Managing 48 active ad sets across 12 campaigns.
            </p>
          </div>

          <div className="flex gap-3">
            <button className="auth-outline-btn flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold">
              <Filter size={16} />
              Filter
            </button>

            <button className="blue-gradient-btn flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-white">
              <Plus size={16} />
              Create New Ad Set
            </button>
          </div>
        </div>

        <div className="border-b border-slate-200 dark:border-white/10">
          <div className="flex flex-wrap gap-8">
            {tabs.map((tab, index) => (
              <button
                key={tab.label}
                className={`pb-4 text-sm font-bold ${
                  index === 0
                    ? "border-b-2 border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400"
                    : "text-slate-400"
                }`}
              >
                {tab.label}
                {tab.count ? (
                  <span className="ml-2 rounded bg-blue-500/10 px-2 py-0.5 text-[10px] font-bold text-blue-600 dark:text-blue-400">
                    {tab.count}
                  </span>
                ) : null}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="relative">
            <Search
              size={18}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              placeholder="Search ad sets by name, campaign or status..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="auth-minimal-input w-full rounded-xl py-3 pl-11 pr-4 text-sm"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {["Budget: >$500", "CTR: >1.5%"].map((item) => (
              <button
                key={item}
                className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold dark:border-white/10 dark:bg-white/[0.03]"
              >
                {item}
                <X size={14} />
              </button>
            ))}

            <button className="flex items-center gap-2 rounded-xl border border-dashed border-slate-300 px-3 py-2 text-xs font-bold text-slate-500 dark:border-white/10">
              <Plus size={14} />
              Add Filter
            </button>
          </div>
        </div>

        <div className="app-panel overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1180px] text-left">
              <thead className="bg-slate-50/80 dark:bg-white/[0.03]">
                <tr>
                  <th className="px-6 py-5 text-[11px] font-black uppercase tracking-[0.14em] text-slate-400">
                    Ad Set Detail
                  </th>
                  <th className="px-6 py-5 text-[11px] font-black uppercase tracking-[0.14em] text-slate-400">
                    Status
                  </th>
                  <th className="px-6 py-5 text-[11px] font-black uppercase tracking-[0.14em] text-slate-400">
                    Budget
                  </th>
                  <th className="px-6 py-5 text-[11px] font-black uppercase tracking-[0.14em] text-slate-400">
                    CTR
                  </th>
                  <th className="px-6 py-5 text-[11px] font-black uppercase tracking-[0.14em] text-slate-400">
                    CPC
                  </th>
                  <th className="px-6 py-5 text-[11px] font-black uppercase tracking-[0.14em] text-slate-400">
                    Reach
                  </th>
                  <th className="px-6 py-5 text-[11px] font-black uppercase tracking-[0.14em] text-slate-400">
                    Previews
                  </th>
                  <th className="px-6 py-5 text-right text-[11px] font-black uppercase tracking-[0.14em] text-slate-400">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-200 dark:divide-white/10">
                {filtered.map((item) => (
                  <>
                    <tr
                      key={item.id}
                      className="transition hover:bg-slate-50 dark:hover:bg-white/[0.03]"
                    >
                      <td className="px-6 py-6">
                        <div className="flex items-center gap-4">
                          <div
                            className={`h-2 w-2 rounded-full ${
                              item.status === "Active"
                                ? "bg-emerald-500"
                                : "bg-amber-500"
                            }`}
                          />
                          <div>
                            <p className="text-sm font-black text-slate-900 dark:text-white">
                              {item.name}
                            </p>
                            <p className="mt-1 text-xs font-bold uppercase text-slate-500">
                              Campaign: {item.campaign}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-6">
                        <span
                          className={`inline-flex rounded px-2 py-0.5 text-[10px] font-black uppercase tracking-[0.1em] ${statusClasses(
                            item.status
                          )}`}
                        >
                          {item.status}
                        </span>
                      </td>

                      <td className="px-6 py-6">
                        <div>
                          <p className="text-sm font-black text-slate-900 dark:text-white">
                            {item.budget}
                          </p>
                          <p className="text-[10px] font-bold uppercase text-slate-500">
                            {item.budgetType}
                          </p>
                        </div>
                      </td>

                      <td className="px-6 py-6 text-sm font-black text-blue-600 dark:text-blue-400">
                        {item.ctr}
                      </td>

                      <td className="px-6 py-6 text-sm font-black text-slate-900 dark:text-white">
                        {item.cpc}
                      </td>

                      <td className="px-6 py-6 text-sm font-black text-slate-900 dark:text-white">
                        {item.reach}
                      </td>

                      <td className="px-6 py-6">
                        <div className="flex -space-x-2">
                          <div className="flex h-9 w-9 items-center justify-center rounded-sm border border-slate-200 bg-slate-100 text-slate-500 dark:border-white/10 dark:bg-white/[0.04]">
                            <Eye size={14} />
                          </div>
                          <div className="flex h-9 w-9 items-center justify-center rounded-sm border border-slate-200 bg-slate-100 text-slate-500 dark:border-white/10 dark:bg-white/[0.04]">
                            <BadgeDollarSign size={14} />
                          </div>
                          <div className="flex h-9 w-9 items-center justify-center rounded-sm border border-slate-200 bg-slate-100 text-[10px] font-black text-slate-700 dark:border-white/10 dark:bg-white/[0.04] dark:text-white">
                            +{item.previews - 2 > 0 ? item.previews - 2 : 0}
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-6 text-right">
                        <button className="text-slate-500 transition hover:text-blue-600 dark:hover:text-white">
                          <MoreVertical size={18} />
                        </button>
                      </td>
                    </tr>

                    {item.expanded ? (
                      <tr>
                        <td colSpan={8} className="bg-slate-50/40 px-10 py-8 dark:bg-white/[0.02]">
                          <div className="space-y-6">
                            <div className="flex items-center justify-between">
                              <h4 className="text-[11px] font-black uppercase tracking-[0.24em] text-blue-600 dark:text-blue-400">
                                Ads Distribution
                              </h4>
                              <button className="text-[11px] font-black uppercase tracking-[0.14em] text-slate-500 transition hover:text-blue-600 dark:hover:text-blue-400">
                                View all 4 ads
                              </button>
                            </div>

                            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                              {item.creatives?.map((creative) => (
                                <div
                                  key={creative.name}
                                  className="rounded-xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-white/[0.03]"
                                >
                                  <div className="mb-4 aspect-[4/3] rounded-lg bg-slate-100 dark:bg-white/[0.04]" />
                                  <p className="text-[12px] font-black uppercase text-slate-900 dark:text-white">
                                    {creative.name}
                                  </p>
                                  <div className="mt-2 flex items-center justify-between">
                                    <span className="text-[10px] font-bold uppercase text-slate-500">
                                      CTR: {creative.ctr}
                                    </span>
                                    <span className="text-[10px] font-black uppercase text-emerald-500">
                                      {creative.label}
                                    </span>
                                  </div>
                                </div>
                              ))}

                              <button className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-slate-300 p-4 text-slate-500 transition hover:border-blue-500 hover:text-blue-600 dark:border-white/10 dark:hover:border-blue-400">
                                <ImagePlus size={34} />
                                <span className="text-[10px] font-black uppercase tracking-[0.18em]">
                                  Add Creative
                                </span>
                              </button>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ) : null}
                  </>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col gap-4 border-t border-slate-200 px-8 py-5 text-sm dark:border-white/10 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-slate-500 dark:text-slate-400">
              Showing{" "}
              <span className="font-bold text-slate-900 dark:text-white">
                10
              </span>{" "}
              of 42 active ad sets
            </p>

            <div className="flex items-center gap-2">
              <button className="auth-outline-btn flex h-9 w-9 items-center justify-center rounded-lg">
                <ChevronLeft size={16} />
              </button>
              <button className="auth-outline-btn flex h-9 w-9 items-center justify-center rounded-lg">
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}