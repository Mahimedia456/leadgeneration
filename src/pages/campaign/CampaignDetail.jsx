import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AppShell from "../../layouts/AppShell";
import {
  ArrowLeft,
  Share2,
  Pencil,
  MonitorCog,
  Layers3,
  Image,
  Users,
  History,
  DollarSign,
  Eye,
  MousePointerClick,
  BadgeDollarSign,
  Sparkles,
} from "lucide-react";

const campaignData = [
  {
    id: "CAM-928341",
    publicId: "ENT-99420-B",
    name: "Q4 Global Tech Expansion",
    status: "Active",
    stage: "Optimization phase",
    createdAt: "Oct 12, 2023",
    owner: "Alex Chen",
    investment: "$142,850.00",
    investmentDelta: "14%",
    reach: "2.4M",
    reachDelta: "8.2%",
    ctr: "3.12%",
    ctrDelta: "0.4%",
    cpa: "$14.20",
    cpaDelta: "5.1%",
  },
];

const adSets = [
  {
    name: "Tier 1 - Tech Enthusiasts",
    status: "Active",
    spend: "$42,500",
    conversions: "1,204",
    roas: "4.8x",
  },
  {
    name: "Remarketing - Lapsed Users",
    status: "Active",
    spend: "$18,200",
    conversions: "842",
    roas: "5.2x",
  },
];

const audienceData = [
  { label: "25-34 Years", value: 45 },
  { label: "35-44 Years", value: 32 },
  { label: "18-24 Years", value: 18 },
];

function statToneClasses(tone) {
  const map = {
    blue: "bg-blue-500/10 text-blue-500",
    emerald: "bg-emerald-500/10 text-emerald-500",
    rose: "bg-rose-500/10 text-rose-500",
  };
  return map[tone] || map.blue;
}

export default function CampaignDetail() {
  const navigate = useNavigate();
  const { campaignId } = useParams();

  const campaign = useMemo(
    () => campaignData.find((item) => item.id === campaignId) || campaignData[0],
    [campaignId]
  );

  const metricCards = [
    {
      title: "Total Investment",
      value: campaign.investment,
      change: campaign.investmentDelta,
      icon: DollarSign,
      tone: "emerald",
      sub: "Utilization: 84%",
    },
    {
      title: "Reach",
      value: campaign.reach,
      change: campaign.reachDelta,
      icon: Eye,
      tone: "emerald",
      sub: "Unique Viewers",
    },
    {
      title: "CTR",
      value: campaign.ctr,
      change: campaign.ctrDelta,
      icon: MousePointerClick,
      tone: "rose",
      sub: "vs. 2.9% Benchmark",
    },
    {
      title: "CPA",
      value: campaign.cpa,
      change: campaign.cpaDelta,
      icon: BadgeDollarSign,
      tone: "emerald",
      sub: "Optimized Target",
    },
  ];

  return (
    <AppShell>
      <div className="space-y-8">
        <div className="flex flex-col justify-between gap-5 xl:flex-row xl:items-end">
          <div>
            <button
              onClick={() => navigate("/campaigns")}
              className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-blue-600"
            >
              <ArrowLeft size={16} />
              Back to Campaigns
            </button>

            <div className="mb-2 flex items-center gap-3">
              <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400">
                {campaign.status}
              </span>
              <span className="text-sm font-medium text-slate-400">
                ID: {campaign.publicId}
              </span>
            </div>

            <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">
              {campaign.name}
            </h1>
            <p className="mt-2 text-base text-slate-500 dark:text-slate-400">
              {campaign.stage} • Created on {campaign.createdAt} by {campaign.owner}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button className="auth-outline-btn flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold">
              <Share2 size={16} />
              Share Report
            </button>

            <button
              onClick={() => navigate(`/campaigns/${campaign.id}/edit`)}
              className="blue-gradient-btn flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-white"
            >
              <Pencil size={16} />
              Edit Campaign
            </button>
          </div>
        </div>

        <div className="border-b border-slate-200 dark:border-white/10">
          <div className="flex flex-wrap gap-8">
            <button className="border-b-2 border-blue-600 pb-4 text-sm font-bold text-blue-600 dark:border-blue-400 dark:text-blue-400">
              Overview
            </button>
            <button
              onClick={() => navigate("/adset")}
              className="pb-4 text-sm font-bold text-slate-400 transition hover:text-slate-700 dark:hover:text-slate-200"
            >
              Ad Sets
            </button>
            <button className="pb-4 text-sm font-bold text-slate-400 transition hover:text-slate-700 dark:hover:text-slate-200">
              Creative Library
            </button>
            <button className="pb-4 text-sm font-bold text-slate-400 transition hover:text-slate-700 dark:hover:text-slate-200">
              Audience Insights
            </button>
            <button className="pb-4 text-sm font-bold text-slate-400 transition hover:text-slate-700 dark:hover:text-slate-200">
              History
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
          {metricCards.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="metric-card app-panel-glow">
                <div className="mb-6 flex items-center justify-between">
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                    {item.title}
                  </p>

                  <span
                    className={`rounded-lg px-3 py-1 text-xs font-bold ${statToneClasses(
                      item.tone
                    )}`}
                  >
                    {item.change}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-2xl ${statToneClasses(
                      item.tone
                    )}`}
                  >
                    <Icon size={18} />
                  </div>
                  <p className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                    {item.value}
                  </p>
                </div>

                <p className="mt-4 text-[11px] font-black uppercase tracking-[0.16em] text-slate-400">
                  {item.sub}
                </p>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 gap-8 xl:grid-cols-3">
          <div className="space-y-8 xl:col-span-2">
            <div className="app-panel p-8">
              <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white">
                    Performance Analytics
                  </h3>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Conversion trends over the last 30 days
                  </p>
                </div>

                <div className="flex rounded-xl bg-slate-100 p-1 dark:bg-white/[0.04]">
                  <button className="rounded-lg bg-white px-5 py-2 text-xs font-bold shadow-sm dark:bg-white/[0.08]">
                    Daily
                  </button>
                  <button className="px-5 py-2 text-xs font-bold text-slate-500">
                    Weekly
                  </button>
                  <button className="px-5 py-2 text-xs font-bold text-slate-500">
                    Monthly
                  </button>
                </div>
              </div>

              <div className="h-64 w-full">
                <svg className="h-full w-full" viewBox="0 0 800 240" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="campaignChartGradient" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="#2563eb" stopOpacity="0.15" />
                      <stop offset="100%" stopColor="#2563eb" stopOpacity="0" />
                    </linearGradient>
                  </defs>

                  <path
                    d="M0 200 Q 50 180, 100 190 T 200 140 T 300 160 T 400 100 T 500 120 T 600 60 T 700 80 T 800 40 L 800 240 L 0 240 Z"
                    fill="url(#campaignChartGradient)"
                  />
                  <path
                    d="M0 200 Q 50 180, 100 190 T 200 140 T 300 160 T 400 100 T 500 120 T 600 60 T 700 80 T 800 40"
                    fill="none"
                    stroke="#2563eb"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                  <circle cx="400" cy="100" r="5" fill="#2563eb" stroke="white" strokeWidth="2" />
                  <circle cx="600" cy="60" r="5" fill="#2563eb" stroke="white" strokeWidth="2" />
                </svg>

                <div className="mt-4 flex justify-between px-1">
                  {["Oct 01", "Oct 08", "Oct 15", "Oct 22", "Oct 29", "Nov 04"].map((label) => (
                    <span
                      key={label}
                      className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400"
                    >
                      {label}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="app-panel overflow-hidden">
              <div className="flex items-center justify-between border-b border-slate-200 px-8 py-6 dark:border-white/10">
                <h3 className="text-xl font-black text-slate-900 dark:text-white">
                  Top Performing Ad Sets
                </h3>
                <button
                  onClick={() => navigate("/adset")}
                  className="text-sm font-bold text-blue-600 dark:text-blue-400"
                >
                  View All
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[760px] text-left">
                  <thead className="bg-slate-50/80 dark:bg-white/[0.03]">
                    <tr>
                      <th className="px-8 py-4 text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">
                        Ad Set Name
                      </th>
                      <th className="px-8 py-4 text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">
                        Status
                      </th>
                      <th className="px-8 py-4 text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">
                        Spend
                      </th>
                      <th className="px-8 py-4 text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">
                        Conversions
                      </th>
                      <th className="px-8 py-4 text-right text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">
                        ROAS
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-200 dark:divide-white/10">
                    {adSets.map((item) => (
                      <tr
                        key={item.name}
                        className="transition hover:bg-slate-50 dark:hover:bg-white/[0.03]"
                      >
                        <td className="px-8 py-5 text-sm font-bold text-slate-900 dark:text-white">
                          {item.name}
                        </td>
                        <td className="px-8 py-5">
                          <span className="flex items-center gap-2 text-xs font-bold text-emerald-500">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                            {item.status}
                          </span>
                        </td>
                        <td className="px-8 py-5 text-sm font-semibold text-slate-700 dark:text-slate-200">
                          {item.spend}
                        </td>
                        <td className="px-8 py-5 text-sm font-semibold text-slate-700 dark:text-slate-200">
                          {item.conversions}
                        </td>
                        <td className="px-8 py-5 text-right text-sm font-black text-slate-900 dark:text-white">
                          {item.roas}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="app-panel p-7">
              <h3 className="text-xl font-black text-slate-900 dark:text-white">
                Audience Breakdown
              </h3>

              <div className="mt-8 space-y-7">
                {audienceData.map((item, index) => (
                  <div key={item.label}>
                    <div className="mb-2.5 flex justify-between text-xs font-bold">
                      <span className="text-slate-600 dark:text-slate-300">{item.label}</span>
                      <span className="text-slate-900 dark:text-white">{item.value}%</span>
                    </div>

                    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-white/10">
                      <div
                        className={`h-full rounded-full ${
                          index === 0
                            ? "bg-blue-600"
                            : index === 1
                            ? "bg-blue-500/70"
                            : "bg-blue-500/40"
                        }`}
                        style={{ width: `${item.value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-10 border-t border-slate-100 pt-7 dark:border-white/10">
                <h5 className="mb-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                  Device Distribution
                </h5>

                <div className="flex items-center gap-4">
                  {[
                    { icon: MonitorCog, label: "78% Mobile" },
                    { icon: Layers3, label: "19% Desktop" },
                    { icon: Image, label: "3% Tablet" },
                  ].map((item) => {
                    const Icon = item.icon;
                    return (
                      <div key={item.label} className="flex-1 text-center">
                        <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-lg border border-slate-100 bg-slate-50 dark:border-white/10 dark:bg-white/[0.03]">
                          <Icon size={16} className="text-slate-400" />
                        </div>
                        <p className="text-[10px] font-bold uppercase text-slate-700 dark:text-slate-300">
                          {item.label}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-2xl bg-blue-600 p-7 text-white shadow-2xl shadow-blue-600/20">
              <div className="relative z-10">
                <div className="mb-3 flex items-center gap-2">
                  <Sparkles size={18} />
                  <h4 className="text-lg font-extrabold tracking-tight">
                    AI Campaign Insights
                  </h4>
                </div>

                <p className="mb-8 text-sm font-medium leading-relaxed text-white/85">
                  Based on your current CPA, increasing your budget by 15% on the
                  "Tech Enthusiasts" ad set could lead to an estimated 140
                  additional conversions per week.
                </p>

                <button className="w-full rounded-xl bg-white py-3 text-sm font-black text-blue-600 transition hover:bg-slate-50">
                  Apply Optimization
                </button>
              </div>
            </div>

            <div className="app-panel p-7">
              <h4 className="text-sm font-black uppercase tracking-[0.2em] text-slate-900 dark:text-white">
                Activity Log
              </h4>

              <div className="mt-6 space-y-6">
                {[
                  {
                    dot: "bg-blue-500",
                    title: "Budget increased by 10%",
                    meta: "Automated Rule • 2h ago",
                  },
                  {
                    dot: "bg-slate-300 dark:bg-slate-600",
                    title: "Creative 'V3_Summer_Promo' paused",
                    meta: "Sarah Jenkins • 5h ago",
                  },
                  {
                    dot: "bg-emerald-500",
                    title: "New Ad Set 'High_Intent_Lookalike' launched",
                    meta: "System • 1d ago",
                  },
                ].map((item) => (
                  <div key={item.title} className="flex gap-4">
                    <div className={`mt-1.5 h-2 w-2 rounded-full ${item.dot}`} />
                    <div className="text-xs">
                      <p className="font-bold text-slate-800 dark:text-slate-200">
                        {item.title}
                      </p>
                      <p className="mt-0.5 font-medium text-slate-400">{item.meta}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}