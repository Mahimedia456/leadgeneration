import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AppShell from "../../layouts/AppShell";
import {
  CalendarDays,
  Globe,
  BadgeCheck,
  Eye,
  Heart,
  BadgeDollarSign,
  TrendingUp,
  MoreHorizontal,
  BriefcaseBusiness,
} from "lucide-react";
import {
  getBrandByIdApi,
  getBrandWorkspacesApi,
  getStoredUser,
} from "../../lib/api";

function metricToneClasses(tone) {
  const map = {
    blue: "bg-blue-500/10 text-blue-500",
    emerald: "bg-emerald-500/10 text-emerald-500",
    slate: "bg-slate-200 dark:bg-white/10 text-slate-500",
    rose: "bg-rose-500/10 text-rose-500",
  };
  return map[tone] || map.blue;
}

export default function BrandDetail() {
  const navigate = useNavigate();
  const { brandId } = useParams();
  const [user] = useState(() => getStoredUser());

  const [brand, setBrand] = useState(null);
  const [workspaces, setWorkspaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadBrand() {
      setLoading(true);
      setError("");

      try {
        const [brandRes, workspacesRes] = await Promise.all([
          getBrandByIdApi(brandId),
          getBrandWorkspacesApi(brandId),
        ]);

        if (!cancelled) {
          setBrand(brandRes.brand);
          setWorkspaces(workspacesRes.workspaces || []);
        }
      } catch (err) {
        if (!cancelled) {
          if (err.statusCode === 403) {
            navigate("/access-denied");
            return;
          }
          setError(err.message || "Failed to load brand");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadBrand();

    return () => {
      cancelled = true;
    };
  }, [brandId, navigate]);

  const metrics = useMemo(() => {
    const reach = `${Math.max(workspaces.length * 400, 1)}k`;
    const campaigns = Number(brand?.activeCampaigns || 0);

    return [
      {
        title: "Total Reach",
        value: reach,
        delta: "+12.4%",
        icon: Eye,
        tone: "blue",
      },
      {
        title: "Avg Engagement",
        value: campaigns ? "4.82%" : "0%",
        delta: "+4.2%",
        icon: Heart,
        tone: "emerald",
      },
      {
        title: "Ad Spend",
        value: brand?.annualRevenue || "$0",
        delta: "Stable",
        icon: BadgeDollarSign,
        tone: "slate",
      },
      {
        title: "Workspaces",
        value: String(workspaces.length),
        delta: "Linked",
        icon: TrendingUp,
        tone: "rose",
      },
    ];
  }, [brand, workspaces]);

  const activities = useMemo(() => {
    return [
      {
        title: "Brand loaded",
        text: `${brand?.name || "Brand"} detail opened successfully`,
        time: "Just now",
      },
      {
        title: "Workspace sync",
        text: `${workspaces.length} workspaces currently linked with this brand`,
        time: "Recently",
      },
      {
        title: "Meta business",
        text: brand?.metaBusinessName || "No Meta business linked yet",
        time: "Current",
      },
    ];
  }, [brand, workspaces]);

  if (loading) {
    return (
      <AppShell>
        <div className="app-panel p-8">Loading brand...</div>
      </AppShell>
    );
  }

  if (error || !brand) {
    return (
      <AppShell>
        <div className="app-panel p-8 text-red-500">
          {error || "Brand not found"}
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="space-y-10">
        <section className="app-panel overflow-hidden rounded-[2rem] p-8 md:p-10">
          <div className="relative">
            <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-blue-500/10 blur-3xl dark:bg-blue-500/10" />

            <div className="relative flex flex-col justify-between gap-8 xl:flex-row xl:items-center">
              <div className="flex flex-col gap-8 md:flex-row md:items-center">
                <div
                  className="flex h-32 w-32 items-center justify-center rounded-[2rem] text-2xl font-black text-white shadow-xl"
                  style={{ background: brand.brandColor || "#0f172a" }}
                >
                  {brand.name?.slice(0, 2).toUpperCase()}
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-4">
                    <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">
                      {brand.name}
                    </h1>
                    <span className="rounded-lg bg-blue-600 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-white">
                      {brand.memberRole || "brand"}
                    </span>
                  </div>

                  <p className="mt-3 text-2xl font-medium text-slate-500 dark:text-slate-400">
                    {brand.industry || "No industry"} • {brand.status}
                  </p>

                  <div className="mt-5 flex flex-wrap gap-6 text-sm font-semibold text-slate-400">
                    <span className="flex items-center gap-2">
                      <CalendarDays size={16} className="text-blue-500/70" />
                      {new Date(brand.createdAt).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-2">
                      <Globe size={16} className="text-blue-500/70" />
                      {brand.website || "No website"}
                    </span>
                    <span className="flex items-center gap-2">
                      <BadgeCheck size={16} className="text-blue-500/70" />
                      {brand.metaBusinessName || "No Meta business"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                {user?.globalRole === "admin" && (
                  <button
                    onClick={() => navigate(`/brands/${brandId}/edit`)}
                    className="auth-outline-btn rounded-xl px-5 py-3 text-sm font-semibold"
                  >
                    Edit Profile
                  </button>
                )}
                <button className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-lg dark:bg-white dark:text-slate-900">
                  Share Hub
                </button>
              </div>
            </div>

            <div className="mt-10 flex flex-col gap-4 border-t border-slate-200 pt-8 dark:border-white/10 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap items-center gap-5">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">
                  Brand Workspaces
                </p>

                <div className="flex -space-x-3">
                  {workspaces.slice(0, 4).map((workspace) => (
                    <div
                      key={workspace.id}
                      className="flex h-11 w-11 items-center justify-center rounded-full border-4 border-white bg-slate-900 text-xs font-black text-white shadow-sm dark:border-[#111111]"
                    >
                      {workspace.name?.slice(0, 2).toUpperCase()}
                    </div>
                  ))}
                  {workspaces.length > 4 && (
                    <div className="flex h-11 w-11 items-center justify-center rounded-full border-4 border-white bg-slate-900 text-xs font-black text-white shadow-sm dark:border-[#111111]">
                      +{workspaces.length - 4}
                    </div>
                  )}
                </div>

                <button className="text-sm font-bold text-blue-600">
                  Manage Access
                </button>
              </div>

              <div className="inline-flex items-center gap-3 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-500 shadow-sm dark:border-white/10 dark:bg-white/[0.03]">
                <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                Brand systems operational
              </div>
            </div>
          </div>
        </section>

        <div className="flex gap-10 overflow-x-auto border-b border-slate-200 dark:border-white/10">
          {["Overview", "Workspaces", "Managers", "Activity Log", "Guidelines"].map(
            (tab, i) => (
              <button
                key={tab}
                className={`whitespace-nowrap pb-5 text-sm font-bold transition ${
                  i === 0
                    ? "border-b-2 border-blue-600 text-blue-600"
                    : "border-b-2 border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                }`}
              >
                {tab}
              </button>
            )
          )}
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {metrics.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="metric-card">
                <div className="mb-4 flex items-start justify-between">
                  <div
                    className={`flex h-14 w-14 items-center justify-center rounded-2xl ${metricToneClasses(
                      item.tone
                    )}`}
                  >
                    <Icon size={22} />
                  </div>

                  <span className="rounded-lg px-3 py-1 text-xs font-bold bg-emerald-500/10 text-emerald-500">
                    {item.delta}
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

        <div className="grid grid-cols-1 gap-8 xl:grid-cols-3">
          <div className="space-y-8 xl:col-span-2">
            <div className="app-panel rounded-[2rem] p-8">
              <div className="mb-10 flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                    Linked Workspaces
                  </h3>
                  <p className="mt-1 text-sm text-slate-400">
                    Workspaces connected to this brand
                  </p>
                </div>

                <BriefcaseBusiness className="text-blue-500" size={22} />
              </div>

              <div className="space-y-4">
                {!workspaces.length ? (
                  <div className="text-sm text-slate-500">No linked workspaces.</div>
                ) : (
                  workspaces.map((workspace) => (
                    <button
                      key={workspace.id}
                      onClick={() => navigate(`/workspaces/${workspace.id}`)}
                      className="flex w-full items-center justify-between rounded-2xl border border-slate-200 p-4 text-left transition hover:border-blue-500/30 hover:bg-slate-50 dark:border-white/10 dark:hover:bg-white/[0.03]"
                    >
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white">
                          {workspace.name}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          {workspace.meta_business_name || workspace.industry || "-"}
                        </p>
                      </div>
                      <span className="text-xs font-bold uppercase tracking-[0.16em] text-blue-500">
                        open
                      </span>
                    </button>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="app-panel overflow-hidden rounded-[2rem] p-0">
            <div className="flex items-center justify-between border-b border-slate-200 px-8 py-6 dark:border-white/10">
              <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                Recent Activity
              </h3>

              <button className="text-slate-400 transition hover:text-slate-600 dark:hover:text-slate-300">
                <MoreHorizontal size={20} />
              </button>
            </div>

            <div className="space-y-10 p-8">
              {activities.map((item) => (
                <div key={item.title} className="relative flex gap-5">
                  <div className="relative z-10 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-500/10">
                    •
                  </div>

                  <div className="space-y-1.5 pt-1">
                    <p className="text-sm leading-snug text-slate-600 dark:text-slate-300">
                      <span className="font-extrabold text-slate-900 dark:text-white">
                        {item.title}:
                      </span>{" "}
                      {item.text}
                    </p>
                    <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">
                      {item.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-8 pt-0">
              <button className="w-full rounded-2xl bg-slate-50 py-4 text-sm font-black uppercase tracking-[0.18em] text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:bg-white/[0.03] dark:hover:bg-white/[0.06] dark:hover:text-white">
                View Full History
              </button>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}