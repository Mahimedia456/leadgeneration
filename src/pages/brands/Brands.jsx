import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppShell from "../../layouts/AppShell";
import {
  Search,
  Upload,
  Plus,
  Megaphone,
  ShieldCheck,
  TrendingUp,
  Building2,
  Filter,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  Trash2,
  Eye,
  Settings,
} from "lucide-react";

const initialBrandStats = [
  {
    title: "Total Brands",
    value: "124",
    change: "+2.4%",
    icon: Building2,
    tone: "blue",
  },
  {
    title: "Active Campaigns",
    value: "482",
    change: "+5.1%",
    icon: Megaphone,
    tone: "emerald",
  },
  {
    title: "Avg. Health Score",
    value: "94%",
    change: "+1.2%",
    icon: ShieldCheck,
    tone: "amber",
  },
  {
    title: "Monthly Growth",
    value: "+12.5%",
    change: "+0.4%",
    icon: TrendingUp,
    tone: "indigo",
  },
];

const initialBrands = [
  {
    id: "BND-8821",
    name: "Lumina Global",
    status: "Active",
    campaigns: 24,
    health: 96,
    revenue: "$1.2M",
    logoBg: "from-slate-950 to-slate-800",
  },
  {
    id: "BND-4290",
    name: "Velvet & Co",
    status: "Active",
    campaigns: 18,
    health: 82,
    revenue: "$840k",
    logoBg: "from-neutral-900 to-zinc-700",
  },
  {
    id: "BND-1102",
    name: "Nexus Tech",
    status: "Paused",
    campaigns: 0,
    health: 45,
    revenue: "$210k",
    logoBg: "from-slate-900 to-cyan-950",
  },
  {
    id: "BND-5532",
    name: "Apex Design",
    status: "Active",
    campaigns: 32,
    health: 91,
    revenue: "$2.4M",
    logoBg: "from-amber-200 to-yellow-500",
  },
];

function statToneClasses(tone) {
  const map = {
    blue: "bg-blue-500/10 text-blue-500",
    emerald: "bg-emerald-500/10 text-emerald-500",
    amber: "bg-amber-500/10 text-amber-500",
    indigo: "bg-indigo-500/10 text-indigo-500",
  };
  return map[tone] || map.blue;
}

function healthTone(health) {
  if (health >= 90) {
    return { bar: "bg-emerald-500", text: "text-emerald-500" };
  }
  if (health >= 70) {
    return { bar: "bg-amber-500", text: "text-amber-500" };
  }
  return { bar: "bg-rose-500", text: "text-rose-500" };
}

export default function Brands() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [brands, setBrands] = useState(initialBrands);
  const [openMenuId, setOpenMenuId] = useState(null);

  const filteredBrands = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return brands;

    return brands.filter(
      (brand) =>
        brand.name.toLowerCase().includes(q) ||
        brand.id.toLowerCase().includes(q) ||
        brand.status.toLowerCase().includes(q)
    );
  }, [query, brands]);

  const handleDelete = (brandId, brandName) => {
    const ok = window.confirm(`Delete "${brandName}"?`);
    if (!ok) return;

    setBrands((prev) => prev.filter((b) => b.id !== brandId));
    setOpenMenuId(null);
  };

  return (
    <AppShell>
      <div className="space-y-8">
        <div className="flex flex-col justify-between gap-5 xl:flex-row xl:items-end">
          <div>
            <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">
              Brands
            </h1>
            <p className="mt-2 text-base text-slate-500 dark:text-slate-400">
              Manage and monitor your enterprise brand portfolio and performance.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button className="auth-outline-btn flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold">
              <Upload size={16} />
              Import CSV
            </button>

            <button
              onClick={() => navigate("/brands/add")}
              className="blue-gradient-btn flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-white"
            >
              <Plus size={16} />
              Add Brand
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
          {initialBrandStats.map((item) => {
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

                  <span className="rounded-lg bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-500">
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
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
              <div className="relative flex-1">
                <Search
                  size={18}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="text"
                  placeholder="Search brands by name, ID, or owner..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="auth-minimal-input w-full rounded-xl py-3 pl-11 pr-4 text-sm"
                />
              </div>

              <button className="auth-outline-btn flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold">
                <Filter size={16} />
                Advanced Filters
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[980px] text-left">
              <thead className="bg-slate-50/80 dark:bg-white/[0.03]">
                <tr>
                  <th className="px-8 py-5 text-[11px] font-black uppercase tracking-[0.14em] text-slate-400">
                    Brand Identity
                  </th>
                  <th className="px-8 py-5 text-[11px] font-black uppercase tracking-[0.14em] text-slate-400">
                    Current Status
                  </th>
                  <th className="px-8 py-5 text-[11px] font-black uppercase tracking-[0.14em] text-slate-400">
                    Active Campaigns
                  </th>
                  <th className="px-8 py-5 text-[11px] font-black uppercase tracking-[0.14em] text-slate-400">
                    Health Rating
                  </th>
                  <th className="px-8 py-5 text-[11px] font-black uppercase tracking-[0.14em] text-slate-400">
                    Annual Revenue
                  </th>
                  <th className="px-8 py-5 text-right text-[11px] font-black uppercase tracking-[0.14em] text-slate-400">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-200 dark:divide-white/10">
                {filteredBrands.map((brand) => {
                  const tone = healthTone(brand.health);

                  return (
                    <tr
                      key={brand.id}
                      className="transition hover:bg-slate-50 dark:hover:bg-white/[0.03]"
                    >
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div
                            className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${brand.logoBg} text-xs font-black text-white shadow-md`}
                          >
                            {brand.name.slice(0, 2).toUpperCase()}
                          </div>

                          <div>
                            <button
                              onClick={() => navigate(`/brands/${brand.id}`)}
                              className="text-left text-sm font-bold text-slate-900 transition hover:text-blue-600 dark:text-white"
                            >
                              {brand.name}
                            </button>
                            <p className="mt-1 text-xs text-slate-500">
                              ID: {brand.id}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-8 py-6">
                        <span
                          className={`inline-flex items-center gap-2 rounded-lg px-3 py-1 text-[11px] font-black uppercase tracking-[0.12em] ${
                            brand.status === "Active"
                              ? "border border-emerald-500/20 bg-emerald-500/10 text-emerald-500"
                              : "border border-slate-300 dark:border-white/10 bg-slate-100 dark:bg-white/5 text-slate-500"
                          }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              brand.status === "Active"
                                ? "bg-emerald-500"
                                : "bg-slate-400"
                            }`}
                          />
                          {brand.status}
                        </span>
                      </td>

                      <td className="px-8 py-6 text-sm font-semibold text-slate-600 dark:text-slate-300">
                        {brand.campaigns} active
                      </td>

                      <td className="px-8 py-6">
                        <div className="flex items-center gap-3">
                          <div className="h-2 w-28 overflow-hidden rounded-full bg-slate-200 dark:bg-white/10">
                            <div
                              className={`h-full rounded-full ${tone.bar}`}
                              style={{ width: `${brand.health}%` }}
                            />
                          </div>
                          <span className={`text-xs font-bold ${tone.text}`}>
                            {brand.health}%
                          </span>
                        </div>
                      </td>

                      <td className="px-8 py-6 text-sm font-bold text-slate-900 dark:text-white">
                        {brand.revenue}
                      </td>

                      <td className="relative px-8 py-6">
                        <div className="flex justify-end">
                          <button
                            onClick={() =>
                              setOpenMenuId((prev) =>
                                prev === brand.id ? null : brand.id
                              )
                            }
                            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-blue-600 dark:hover:bg-white/5"
                          >
                            <MoreHorizontal size={18} />
                          </button>
                        </div>

                        {openMenuId === brand.id && (
                          <div className="absolute right-8 top-[72px] z-20 w-44 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl dark:border-white/10 dark:bg-[#111111]">
                            <button
                              onClick={() => {
                                setOpenMenuId(null);
                                navigate(`/brands/${brand.id}`);
                              }}
                              className="flex w-full items-center gap-2 px-4 py-3 text-sm text-slate-700 transition hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-white/[0.04]"
                            >
                              <Eye size={16} />
                              View Details
                            </button>

                            <button
                              onClick={() => {
                                setOpenMenuId(null);
                                navigate(`/brands/${brand.id}/settings`);
                              }}
                              className="flex w-full items-center gap-2 px-4 py-3 text-sm text-slate-700 transition hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-white/[0.04]"
                            >
                              <Settings size={16} />
                              Settings
                            </button>

                            <button
                              onClick={() => handleDelete(brand.id, brand.name)}
                              className="flex w-full items-center gap-2 px-4 py-3 text-sm text-rose-500 transition hover:bg-rose-50 dark:hover:bg-rose-500/10"
                            >
                              <Trash2 size={16} />
                              Delete
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col gap-4 border-t border-slate-200 px-8 py-5 text-sm dark:border-white/10 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-slate-500 dark:text-slate-400">
              Displaying{" "}
              <span className="font-bold text-slate-900 dark:text-white">
                1 to {filteredBrands.length}
              </span>{" "}
              of {brands.length} brands
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