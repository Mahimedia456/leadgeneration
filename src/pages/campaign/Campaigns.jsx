import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppShell from "../../layouts/AppShell";
import {
  Search,
  Plus,
  Megaphone,
  PlayCircle,
  PauseCircle,
  DollarSign,
  Users,
  BadgeDollarSign,
  Calendar,
  Building2,
  MonitorSmartphone,
  Globe2,
  Filter,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  Eye,
  Settings,
  Trash2,
} from "lucide-react";

const initialCampaignStats = [
  {
    title: "Total Campaigns",
    value: "1,284",
    change: "+12%",
    icon: Megaphone,
    tone: "blue",
  },
  {
    title: "Active",
    value: "842",
    change: "+5%",
    icon: PlayCircle,
    tone: "emerald",
  },
  {
    title: "Paused",
    value: "442",
    change: "-2%",
    icon: PauseCircle,
    tone: "rose",
  },
  {
    title: "Total Spend",
    value: "$425.2k",
    change: "+18%",
    icon: DollarSign,
    tone: "indigo",
  },
  {
    title: "Total Leads",
    value: "12,450",
    change: "+24%",
    icon: Users,
    tone: "emerald",
  },
  {
    title: "Avg CPL",
    value: "$34.15",
    change: "-4%",
    icon: BadgeDollarSign,
    tone: "amber",
  },
];

const initialCampaigns = [
  {
    id: "CAM-928341",
    name: "Summer Apparel Retargeting 2024",
    source: "Meta Pixel",
    status: "Active",
    spend: "$12,480.00",
    leads: 452,
    cpl: "$27.61",
  },
  {
    id: "CAM-928342",
    name: "B2B SaaS Lead Gen - Q3",
    source: "CRM Sync",
    status: "Active",
    spend: "$25,900.00",
    leads: 182,
    cpl: "$142.30",
  },
  {
    id: "CAM-928345",
    name: "Spring Flash Sale Clearance",
    source: "Instagram Feed",
    status: "Paused",
    spend: "$8,125.00",
    leads: 310,
    cpl: "$26.21",
  },
  {
    id: "CAM-928349",
    name: "Video Brand Awareness - USA",
    source: "Audience Network",
    status: "Active",
    spend: "$45,000.00",
    leads: 0,
    cpl: "N/A",
  },
  {
    id: "CAM-928355",
    name: "High LTV Lookalike Test",
    source: "Lookalike 1%",
    status: "Rejected",
    spend: "$0.00",
    leads: 0,
    cpl: "$0.00",
  },
];

function statToneClasses(tone) {
  const map = {
    blue: "bg-blue-500/10 text-blue-500",
    emerald: "bg-emerald-500/10 text-emerald-500",
    amber: "bg-amber-500/10 text-amber-500",
    indigo: "bg-indigo-500/10 text-indigo-500",
    rose: "bg-rose-500/10 text-rose-500",
  };
  return map[tone] || map.blue;
}

function statusClasses(status) {
  if (status === "Active") {
    return "border border-emerald-500/20 bg-emerald-500/10 text-emerald-500";
  }
  if (status === "Paused") {
    return "border border-slate-300 dark:border-white/10 bg-slate-100 dark:bg-white/5 text-slate-500";
  }
  if (status === "Rejected") {
    return "border border-rose-500/20 bg-rose-500/10 text-rose-500";
  }
  return "border border-blue-500/20 bg-blue-500/10 text-blue-500";
}

function filterBtnClass(active) {
  return active
    ? "border-blue-500/20 bg-blue-500/10 text-blue-600 dark:text-blue-400"
    : "border-slate-200 bg-white text-slate-600 dark:border-white/10 dark:bg-white/[0.03] dark:text-slate-300";
}

export default function Campaigns() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [campaigns, setCampaigns] = useState(initialCampaigns);
  const [openMenuId, setOpenMenuId] = useState(null);

  const filteredCampaigns = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return campaigns;

    return campaigns.filter(
      (item) =>
        item.name.toLowerCase().includes(q) ||
        item.id.toLowerCase().includes(q) ||
        item.status.toLowerCase().includes(q) ||
        item.source.toLowerCase().includes(q)
    );
  }, [query, campaigns]);

  const handleDelete = (campaignId, campaignName) => {
    const ok = window.confirm(`Delete "${campaignName}"?`);
    if (!ok) return;
    setCampaigns((prev) => prev.filter((item) => item.id !== campaignId));
    setOpenMenuId(null);
  };

  return (
    <AppShell>
      <div className="space-y-8">
        <div className="flex flex-col justify-between gap-5 xl:flex-row xl:items-end">
          <div>
            <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">
              Campaigns
            </h1>
            <p className="mt-2 text-base text-slate-500 dark:text-slate-400">
              Real-time performance metrics across all enterprise campaign accounts.
            </p>
          </div>

          <button
            onClick={() => navigate("/campaigns/add")}
            className="blue-gradient-btn flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-white"
          >
            <Plus size={16} />
            Create Campaign
          </button>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
          {initialCampaignStats.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="metric-card app-panel-glow">
                <div className="mb-6 flex items-center justify-between">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-2xl ${statToneClasses(
                      item.tone
                    )}`}
                  >
                    <Icon size={20} />
                  </div>

                  <span
                    className={`rounded-lg px-3 py-1 text-xs font-bold ${statToneClasses(
                      item.tone
                    )}`}
                  >
                    {item.change}
                  </span>
                </div>

                <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">
                  {item.title}
                </p>
                <p className="mt-3 text-4xl font-black tracking-tight text-slate-900 dark:text-white">
                  {item.value}
                </p>
              </div>
            );
          })}
        </div>

        <div className="app-panel overflow-hidden">
          <div className="border-b border-slate-200 p-6 dark:border-white/10">
            <div className="flex flex-col gap-4">
              <div className="relative">
                <Search
                  size={18}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="text"
                  placeholder="Search campaigns by name, ID, status or source..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="auth-minimal-input w-full rounded-xl py-3 pl-11 pr-4 text-sm"
                />
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-xs font-bold ${filterBtnClass(
                    false
                  )}`}
                >
                  <Calendar size={14} />
                  Last 30 Days
                </button>

                <button
                  className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-xs font-bold ${filterBtnClass(
                    false
                  )}`}
                >
                  <Building2 size={14} />
                  All Brands
                </button>

                <button
                  className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-xs font-bold ${filterBtnClass(
                    false
                  )}`}
                >
                  <MonitorSmartphone size={14} />
                  Platform
                </button>

                <button
                  className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-xs font-bold ${filterBtnClass(
                    false
                  )}`}
                >
                  <Globe2 size={14} />
                  Region
                </button>

                <button className="flex items-center gap-2 rounded-xl px-2 py-2 text-xs font-black text-blue-600 dark:text-blue-400">
                  <Filter size={14} />
                  Clear Filters
                </button>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[980px] text-left">
              <thead className="bg-slate-50/80 dark:bg-white/[0.03]">
                <tr>
                  <th className="px-8 py-5 text-[11px] font-black uppercase tracking-[0.14em] text-slate-400">
                    Campaign Details
                  </th>
                  <th className="px-8 py-5 text-center text-[11px] font-black uppercase tracking-[0.14em] text-slate-400">
                    Status
                  </th>
                  <th className="px-8 py-5 text-right text-[11px] font-black uppercase tracking-[0.14em] text-slate-400">
                    Spend
                  </th>
                  <th className="px-8 py-5 text-right text-[11px] font-black uppercase tracking-[0.14em] text-slate-400">
                    Leads
                  </th>
                  <th className="px-8 py-5 text-right text-[11px] font-black uppercase tracking-[0.14em] text-slate-400">
                    CPL
                  </th>
                  <th className="px-8 py-5 text-right text-[11px] font-black uppercase tracking-[0.14em] text-slate-400">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-200 dark:divide-white/10">
                {filteredCampaigns.map((campaign) => (
                  <tr
                    key={campaign.id}
                    className="transition hover:bg-slate-50 dark:hover:bg-white/[0.03]"
                  >
                    <td className="px-8 py-6">
                      <div className="flex flex-col">
                        <button
                          onClick={() => navigate(`/campaigns/${campaign.id}`)}
                          className="text-left text-sm font-bold text-slate-900 transition hover:text-blue-600 dark:text-white"
                        >
                          {campaign.name}
                        </button>
                        <p className="mt-1 text-xs text-slate-500">
                          ID: {campaign.id} • {campaign.source}
                        </p>
                      </div>
                    </td>

                    <td className="px-8 py-6 text-center">
                      <span
                        className={`inline-flex rounded-lg px-3 py-1 text-[11px] font-black uppercase tracking-[0.12em] ${statusClasses(
                          campaign.status
                        )}`}
                      >
                        {campaign.status}
                      </span>
                    </td>

                    <td className="px-8 py-6 text-right text-sm font-bold text-slate-900 dark:text-white">
                      {campaign.spend}
                    </td>

                    <td className="px-8 py-6 text-right text-sm font-bold text-slate-900 dark:text-white">
                      {campaign.leads}
                    </td>

                    <td className="px-8 py-6 text-right text-sm font-black text-blue-600 dark:text-blue-400">
                      {campaign.cpl}
                    </td>

                    <td className="relative px-8 py-6">
                      <div className="flex justify-end">
                        <button
                          onClick={() =>
                            setOpenMenuId((prev) =>
                              prev === campaign.id ? null : campaign.id
                            )
                          }
                          className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-blue-600 dark:hover:bg-white/5"
                        >
                          <MoreHorizontal size={18} />
                        </button>
                      </div>

                      {openMenuId === campaign.id && (
                        <div className="absolute right-8 top-[72px] z-20 w-44 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl dark:border-white/10 dark:bg-[#111111]">
                          <button
                            onClick={() => {
                              setOpenMenuId(null);
                              navigate(`/campaigns/${campaign.id}`);
                            }}
                            className="flex w-full items-center gap-2 px-4 py-3 text-sm text-slate-700 transition hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-white/[0.04]"
                          >
                            <Eye size={16} />
                            View Details
                          </button>

                          <button
                            onClick={() => {
                              setOpenMenuId(null);
                              navigate(`/campaigns/${campaign.id}/edit`);
                            }}
                            className="flex w-full items-center gap-2 px-4 py-3 text-sm text-slate-700 transition hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-white/[0.04]"
                          >
                            <Settings size={16} />
                            Edit Campaign
                          </button>

                          <button
                            onClick={() => handleDelete(campaign.id, campaign.name)}
                            className="flex w-full items-center gap-2 px-4 py-3 text-sm text-rose-500 transition hover:bg-rose-50 dark:hover:bg-rose-500/10"
                          >
                            <Trash2 size={16} />
                            Delete
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col gap-4 border-t border-slate-200 px-8 py-5 text-sm dark:border-white/10 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-slate-500 dark:text-slate-400">
              Showing{" "}
              <span className="font-bold text-slate-900 dark:text-white">
                1 - {filteredCampaigns.length}
              </span>{" "}
              of {campaigns.length} campaigns
            </p>

            <div className="flex items-center gap-2">
              <button className="auth-outline-btn flex h-9 items-center justify-center rounded-lg px-4 opacity-50">
                <ChevronLeft size={16} />
              </button>
              <button className="auth-outline-btn flex h-9 items-center justify-center rounded-lg px-4 text-xs font-bold">
                Previous
              </button>
              <button className="auth-outline-btn flex h-9 items-center justify-center rounded-lg px-4 text-xs font-bold">
                Next
              </button>
              <button className="auth-outline-btn flex h-9 items-center justify-center rounded-lg px-4">
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}