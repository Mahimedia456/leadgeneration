import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppShell from "../../layouts/AppShell";
import {
  Search,
  Upload,
  Plus,
  Instagram,
  Users,
  HeartHandshake,
  Activity,
  Filter,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  Trash2,
  Eye,
  Settings,
  AlertTriangle,
  CheckCircle2,
  PauseCircle,
  Link2,
  TrendingUp,
} from "lucide-react";

const initialInstagramStats = [
  {
    title: "Total Followers",
    value: "4.84M",
    change: "+2.4%",
    icon: Users,
    tone: "blue",
  },
  {
    title: "Engaged Accounts",
    value: "942K",
    change: "+5.1%",
    icon: HeartHandshake,
    tone: "emerald",
  },
  {
    title: "Avg. Engagement",
    value: "3.12%",
    change: "-0.4%",
    icon: Activity,
    tone: "amber",
  },
  {
    title: "Flagged Accounts",
    value: "3",
    change: "Needs review",
    icon: AlertTriangle,
    tone: "rose",
  },
];

const initialAccounts = [
  {
    id: "IG-220194",
    handle: "@fashionco_official",
    niche: "Retail & Apparel",
    linkedPage: "Fashion Co. Global",
    followers: "1.2M",
    growth: "+4.2%",
    campaignStatus: "Active (8)",
    permission: "Admin",
    state: "Healthy",
    avatarBg: "from-fuchsia-500 to-pink-600",
  },
  {
    id: "IG-772031",
    handle: "@techsolutions_hq",
    niche: "Software & Services",
    linkedPage: "TS Business Hub",
    followers: "450K",
    growth: "+1.8%",
    campaignStatus: "Paused",
    permission: "Editor",
    state: "Paused",
    avatarBg: "from-sky-500 to-blue-700",
  },
  {
    id: "IG-442810",
    handle: "@lux_footwear",
    niche: "Action Required",
    linkedPage: "Page disconnected",
    followers: "2.1M",
    growth: "+0.2%",
    campaignStatus: "Flagged",
    permission: "Admin",
    state: "Flagged",
    avatarBg: "from-rose-500 to-orange-500",
  },
  {
    id: "IG-662281",
    handle: "@urbanblend.studio",
    niche: "Home & Lifestyle",
    linkedPage: "Urban Blend Living",
    followers: "1.09M",
    growth: "+3.6%",
    campaignStatus: "Active (4)",
    permission: "Analyst",
    state: "Healthy",
    avatarBg: "from-violet-500 to-indigo-700",
  },
];

const overviewCards = [
  {
    title: "Healthy Links",
    value: "21",
    note: "FB page pairing active",
    icon: CheckCircle2,
    tone: "emerald",
  },
  {
    title: "Paused Campaigns",
    value: "06",
    note: "Manual review pending",
    icon: PauseCircle,
    tone: "amber",
  },
  {
    title: "Growth Momentum",
    value: "+12%",
    note: "Month over month",
    icon: TrendingUp,
    tone: "blue",
  },
];

function statToneClasses(tone) {
  const map = {
    blue: "bg-blue-500/10 text-blue-500",
    emerald: "bg-emerald-500/10 text-emerald-500",
    amber: "bg-amber-500/10 text-amber-500",
    rose: "bg-rose-500/10 text-rose-500",
  };
  return map[tone] || map.blue;
}

function stateClasses(state) {
  if (state === "Healthy") {
    return "border border-emerald-500/20 bg-emerald-500/10 text-emerald-500";
  }
  if (state === "Paused") {
    return "border border-slate-300 dark:border-white/10 bg-slate-100 dark:bg-white/5 text-slate-500";
  }
  if (state === "Flagged") {
    return "border border-rose-500/20 bg-rose-500/10 text-rose-500";
  }
  return "border border-slate-300 dark:border-white/10 bg-slate-100 dark:bg-white/5 text-slate-500";
}

function campaignClasses(status) {
  if (status.includes("Active")) {
    return "border border-emerald-500/20 bg-emerald-500/10 text-emerald-500";
  }
  if (status === "Paused") {
    return "border border-slate-300 dark:border-white/10 bg-slate-100 dark:bg-white/5 text-slate-500";
  }
  if (status === "Flagged") {
    return "border border-rose-500/20 bg-rose-500/10 text-rose-500";
  }
  return "border border-slate-300 dark:border-white/10 bg-slate-100 dark:bg-white/5 text-slate-500";
}

function growthClasses(growth) {
  return growth.startsWith("+") ? "text-emerald-500" : "text-rose-500";
}

export default function InstagramAccounts() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [accounts, setAccounts] = useState(initialAccounts);
  const [openMenuId, setOpenMenuId] = useState(null);

  const filteredAccounts = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return accounts;

    return accounts.filter(
      (account) =>
        account.handle.toLowerCase().includes(q) ||
        account.id.toLowerCase().includes(q) ||
        account.niche.toLowerCase().includes(q) ||
        account.linkedPage.toLowerCase().includes(q) ||
        account.campaignStatus.toLowerCase().includes(q)
    );
  }, [query, accounts]);

  const handleDelete = (accountId, handle) => {
    const ok = window.confirm(`Disconnect "${handle}"?`);
    if (!ok) return;

    setAccounts((prev) => prev.filter((account) => account.id !== accountId));
    setOpenMenuId(null);
  };

  return (
    <AppShell>
      <div className="space-y-8">
        <div className="flex flex-col justify-between gap-5 xl:flex-row xl:items-end">
          <div>
            <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">
              Instagram Accounts
            </h1>
            <p className="mt-2 text-base text-slate-500 dark:text-slate-400">
              Manage connected Instagram business accounts, linked Facebook pages, campaign states, and permissions.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button className="auth-outline-btn flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold">
              <Upload size={16} />
              Export Accounts
            </button>

            <button
              onClick={() => navigate("/meta/instagram/connect")}
              className="blue-gradient-btn flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-white"
            >
              <Plus size={16} />
              Connect Account
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
          {initialInstagramStats.map((item) => {
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
                    className={`rounded-lg px-3 py-1 text-xs font-bold ${
                      item.change.startsWith("-")
                        ? "bg-rose-500/10 text-rose-500"
                        : item.tone === "amber"
                        ? "bg-amber-500/10 text-amber-500"
                        : statToneClasses(item.tone)
                    }`}
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
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-1 flex-col gap-4 lg:flex-row lg:items-center">
                <div className="relative flex-1">
                  <Search
                    size={18}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    type="text"
                    placeholder="Search accounts by handle, ID, linked page, niche, or status..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="auth-minimal-input w-full rounded-xl py-3 pl-11 pr-4 text-sm"
                  />
                </div>

                <button className="auth-outline-btn flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold">
                  <Filter size={16} />
                  Filter Accounts
                </button>
              </div>

              <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">
                Showing 1–{filteredAccounts.length} of {accounts.length} accounts
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[1100px] text-left">
              <thead className="bg-slate-50/80 dark:bg-white/[0.03]">
                <tr>
                  <th className="px-8 py-5 text-[11px] font-black uppercase tracking-[0.14em] text-slate-400">
                    Account
                  </th>
                  <th className="px-8 py-5 text-[11px] font-black uppercase tracking-[0.14em] text-slate-400">
                    Linked FB Page
                  </th>
                  <th className="px-8 py-5 text-[11px] font-black uppercase tracking-[0.14em] text-slate-400">
                    Followers
                  </th>
                  <th className="px-8 py-5 text-[11px] font-black uppercase tracking-[0.14em] text-slate-400">
                    Campaign Status
                  </th>
                  <th className="px-8 py-5 text-[11px] font-black uppercase tracking-[0.14em] text-slate-400">
                    Permissions
                  </th>
                  <th className="px-8 py-5 text-right text-[11px] font-black uppercase tracking-[0.14em] text-slate-400">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-200 dark:divide-white/10">
                {filteredAccounts.map((account) => (
                  <tr
                    key={account.id}
                    className="transition hover:bg-slate-50 dark:hover:bg-white/[0.03]"
                  >
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div
                          className={`flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br ${account.avatarBg} text-xs font-black text-white shadow-md`}
                        >
                          <Instagram size={16} />
                        </div>

                        <div>
                          <button
                            onClick={() => navigate(`/meta/instagram/${account.id}`)}
                            className="text-left text-sm font-bold text-slate-900 transition hover:text-blue-600 dark:text-white"
                          >
                            {account.handle}
                          </button>
                          <p className={`mt-1 text-xs font-semibold ${account.state === "Flagged" ? "text-rose-500" : "text-slate-500"}`}>
                            {account.niche}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-8 py-6">
                      <div>
                        <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                          {account.linkedPage}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">ID: {account.id}</p>
                      </div>
                    </td>

                    <td className="px-8 py-6">
                      <div>
                        <p className="text-sm font-bold text-slate-900 dark:text-white">
                          {account.followers}
                        </p>
                        <p className={`mt-1 text-xs font-bold ${growthClasses(account.growth)}`}>
                          {account.growth}
                        </p>
                      </div>
                    </td>

                    <td className="px-8 py-6">
                      <span
                        className={`inline-flex rounded-lg px-3 py-1 text-[11px] font-black uppercase tracking-[0.12em] ${campaignClasses(
                          account.campaignStatus
                        )}`}
                      >
                        {account.campaignStatus}
                      </span>
                    </td>

                    <td className="px-8 py-6">
                      <span
                        className={`inline-flex rounded-lg px-3 py-1 text-[11px] font-black uppercase tracking-[0.12em] ${stateClasses(
                          account.state
                        )}`}
                      >
                        {account.permission}
                      </span>
                    </td>

                    <td className="relative px-8 py-6">
                      <div className="flex justify-end">
                        <button
                          onClick={() =>
                            setOpenMenuId((prev) => (prev === account.id ? null : account.id))
                          }
                          className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-blue-600 dark:hover:bg-white/5"
                        >
                          <MoreHorizontal size={18} />
                        </button>
                      </div>

                      {openMenuId === account.id && (
                        <div className="absolute right-8 top-[72px] z-20 w-48 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl dark:border-white/10 dark:bg-[#111111]">
                          <button
                            onClick={() => {
                              setOpenMenuId(null);
                              navigate(`/meta/instagram/${account.id}`);
                            }}
                            className="flex w-full items-center gap-2 px-4 py-3 text-sm text-slate-700 transition hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-white/[0.04]"
                          >
                            <Eye size={16} />
                            View Details
                          </button>

                          <button
                            onClick={() => {
                              setOpenMenuId(null);
                              navigate(`/meta/instagram/${account.id}/settings`);
                            }}
                            className="flex w-full items-center gap-2 px-4 py-3 text-sm text-slate-700 transition hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-white/[0.04]"
                          >
                            <Settings size={16} />
                            Manage Access
                          </button>

                          <button
                            onClick={() => handleDelete(account.id, account.handle)}
                            className="flex w-full items-center gap-2 px-4 py-3 text-sm text-rose-500 transition hover:bg-rose-50 dark:hover:bg-rose-500/10"
                          >
                            <Trash2 size={16} />
                            Disconnect
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid gap-6 border-t border-slate-200 p-6 dark:border-white/10 xl:grid-cols-[minmax(0,1fr)_320px]">
            <div className="rounded-2xl border border-slate-200 p-6 dark:border-white/10">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white">
                    Account linking overview
                  </h3>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Review Facebook page pairings, reconnect flagged accounts, and launch bulk link flows.
                  </p>
                </div>
                <div className="hidden h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-500 md:flex">
                  <Link2 size={20} />
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <button className="blue-gradient-btn rounded-xl px-5 py-3 text-sm font-semibold text-white">
                  Launch Bulk Linker
                </button>
                <button className="auth-outline-btn rounded-xl px-5 py-3 text-sm font-semibold">
                  Review Flagged
                </button>
              </div>
            </div>

            <div className="space-y-4 rounded-2xl border border-slate-200 p-6 dark:border-white/10">
              <h3 className="text-sm font-black uppercase tracking-[0.14em] text-slate-400">
                Instagram Snapshot
              </h3>

              {overviewCards.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.title}
                    className="rounded-xl bg-slate-50 p-4 dark:bg-white/[0.03]"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-xl ${statToneClasses(
                          item.tone
                        )}`}
                      >
                        <Icon size={18} />
                      </div>
                      <p className="text-xl font-black text-slate-900 dark:text-white">
                        {item.value}
                      </p>
                    </div>
                    <p className="mt-3 text-xs font-black uppercase tracking-[0.12em] text-slate-500">
                      {item.title}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">{item.note}</p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col gap-4 border-t border-slate-200 px-8 py-5 text-sm dark:border-white/10 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-slate-500 dark:text-slate-400">
              Displaying{" "}
              <span className="font-bold text-slate-900 dark:text-white">
                1 to {filteredAccounts.length}
              </span>{" "}
              of {accounts.length} Instagram accounts
            </p>

            <div className="flex items-center gap-2">
              <button className="auth-outline-btn flex h-9 w-9 items-center justify-center rounded-lg opacity-50">
                <ChevronLeft size={16} />
              </button>
              <button className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-xs font-bold text-white">
                1
              </button>
              <button className="auth-outline-btn flex h-9 w-9 items-center justify-center rounded-lg text-xs font-bold">
                2
              </button>
              <button className="auth-outline-btn flex h-9 w-9 items-center justify-center rounded-lg text-xs font-bold">
                3
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
