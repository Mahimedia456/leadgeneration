import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AppShell from "../../layouts/AppShell";
import {
  CalendarDays,
  Mail,
  ShieldCheck,
  Briefcase,
  Activity,
  UserCheck,
  Lock,
  MoreHorizontal,
} from "lucide-react";
import { getStoredUser, getUserByIdApi } from "../../lib/api";

function metricToneClasses(tone) {
  const map = {
    blue: "bg-blue-500/10 text-blue-500",
    emerald: "bg-emerald-500/10 text-emerald-500",
    slate: "bg-slate-200 dark:bg-white/10 text-slate-500",
    rose: "bg-rose-500/10 text-rose-500",
  };
  return map[tone] || map.blue;
}

export default function UserDetail() {
  const navigate = useNavigate();
  const { userId } = useParams();
  const currentUser = getStoredUser();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadUser() {
      setLoading(true);
      setError("");

      try {
        const res = await getUserByIdApi(userId);
        if (!cancelled) {
          setUser(res.user);
        }
      } catch (err) {
        if (!cancelled) {
          if (err.statusCode === 403) {
            navigate("/access-denied");
            return;
          }
          setError(err.message || "Failed to load user");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadUser();

    return () => {
      cancelled = true;
    };
  }, [userId, navigate]);

  const metrics = useMemo(() => {
    const brandCount = (user?.assignedBrands || []).length;
    const workspaceCount = (user?.assignedWorkspaces || []).length;

    return [
      {
        title: "Assigned Brands",
        value: String(brandCount),
        delta: "Scoped",
        icon: Briefcase,
        tone: "blue",
      },
      {
        title: "Assigned Workspaces",
        value: String(workspaceCount),
        delta: "Visible",
        icon: ShieldCheck,
        tone: "emerald",
      },
      {
        title: "Status",
        value: user?.status || "-",
        delta: "Current",
        icon: Activity,
        tone: "slate",
      },
      {
        title: "Role",
        value: user?.globalRole || "-",
        delta: "Access",
        icon: Lock,
        tone: "rose",
      },
    ];
  }, [user]);

  const activities = [
    {
      title: "User Profile Loaded",
      text: "User profile opened successfully",
      time: "Just now",
    },
    {
      title: "Access Scope",
      text: "Brand and workspace visibility resolved from backend",
      time: "Current",
    },
    {
      title: "Role Snapshot",
      text: "Role and memberships displayed from latest record",
      time: "Current",
    },
  ];

  if (loading) {
    return (
      <AppShell>
        <div className="app-panel p-8">Loading user...</div>
      </AppShell>
    );
  }

  if (error || !user) {
    return (
      <AppShell>
        <div className="app-panel p-8 text-red-500">
          {error || "User not found"}
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
                <div className="flex h-32 w-32 items-center justify-center rounded-[2rem] bg-gradient-to-br from-slate-950 to-slate-800 text-2xl font-black text-white shadow-xl">
                  {(user.fullName || "U")
                    .split(" ")
                    .map((p) => p[0])
                    .slice(0, 2)
                    .join("")}
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-4">
                    <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">
                      {user.fullName || "Unnamed User"}
                    </h1>
                    <span className="rounded-lg bg-blue-600 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-white">
                      {user.globalRole}
                    </span>
                  </div>

                  <p className="mt-3 text-2xl font-medium text-slate-500 dark:text-slate-400">
                    Enterprise Access • Role Based Visibility
                  </p>

                  <div className="mt-5 flex flex-wrap gap-6 text-sm font-semibold text-slate-400">
                    <span className="flex items-center gap-2">
                      <CalendarDays size={16} className="text-blue-500/70" />
                      Joined user profile
                    </span>
                    <span className="flex items-center gap-2">
                      <Mail size={16} className="text-blue-500/70" />
                      {user.email}
                    </span>
                    <span className="flex items-center gap-2">
                      <ShieldCheck size={16} className="text-blue-500/70" />
                      {user.status}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                {(currentUser?.globalRole === "admin" ||
                  currentUser?.globalRole === "brand_user") && (
                  <button
                    onClick={() => navigate(`/users/${userId}/edit`)}
                    className="auth-outline-btn rounded-xl px-5 py-3 text-sm font-semibold"
                  >
                    Edit User
                  </button>
                )}

                <button
                  onClick={() => navigate("/roles-permissions")}
                  className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-lg dark:bg-white dark:text-slate-900"
                >
                  Manage Permissions
                </button>
              </div>
            </div>

            <div className="mt-10 flex flex-col gap-4 border-t border-slate-200 pt-8 dark:border-white/10 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap items-center gap-5">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">
                  Assigned Brands
                </p>

                <div className="flex -space-x-3">
                  {(user.assignedBrands || []).slice(0, 4).map((brand) => (
                    <div
                      key={brand.id || brand.name}
                      className="flex h-11 w-11 items-center justify-center rounded-full border-4 border-white bg-slate-300 text-xs font-black shadow-sm dark:border-[#111111] dark:bg-slate-700"
                      title={brand.name}
                    >
                      {(brand.name || "B").slice(0, 2).toUpperCase()}
                    </div>
                  ))}
                </div>

                <button className="text-sm font-bold text-blue-600">
                  Manage Brand Access
                </button>
              </div>

              <div className="inline-flex items-center gap-3 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-500 shadow-sm dark:border-white/10 dark:bg-white/[0.03]">
                <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                {String(user.status).toLowerCase() === "active"
                  ? "Active now"
                  : user.status}
              </div>
            </div>
          </div>
        </section>

        <div className="flex gap-10 overflow-x-auto border-b border-slate-200 dark:border-white/10">
          {["Overview", "Assigned Brands", "Permissions", "Activity Log", "Security"].map(
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
                <p className="mt-3 text-2xl font-black tracking-tight text-slate-900 dark:text-white">
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
                    Brand Allocation
                  </h3>
                  <p className="mt-1 text-sm text-slate-400">
                    User brand and workspace scope
                  </p>
                </div>

                <select className="auth-minimal-input rounded-xl px-4 py-2 text-sm font-semibold">
                  <option>Current Scope</option>
                </select>
              </div>

              <div className="space-y-4">
                {(user.assignedBrands || []).length ? (
                  user.assignedBrands.map((brand) => (
                    <div
                      key={brand.id || brand.name}
                      className="rounded-2xl border border-slate-200 p-4 dark:border-white/10"
                    >
                      <p className="font-bold text-slate-900 dark:text-white">
                        {brand.name}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="text-sm text-slate-500">No assigned brands.</div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              <div className="app-panel rounded-[2rem] p-8">
                <h3 className="mb-8 text-xs font-black uppercase tracking-[0.18em] text-slate-400">
                  Assigned Workspaces
                </h3>

                <div className="space-y-6">
                  {(user.assignedWorkspaces || []).length ? (
                    user.assignedWorkspaces.map((workspace) => (
                      <div key={workspace.id} className="flex items-center gap-4">
                        <span className="h-2.5 w-2.5 rounded-full bg-blue-600" />
                        <p className="flex-1 text-sm font-bold text-slate-600 dark:text-slate-300">
                          {workspace.name}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-slate-500">No workspaces assigned.</p>
                  )}
                </div>
              </div>

              <div className="app-panel rounded-[2rem] p-8">
                <h3 className="mb-6 text-xs font-black uppercase tracking-[0.18em] text-slate-400">
                  Security Health
                </h3>

                <div className="flex items-center justify-center py-6">
                  <div className="relative h-28 w-28">
                    <svg className="h-28 w-28 -rotate-90">
                      <circle
                        cx="56"
                        cy="56"
                        r="48"
                        fill="transparent"
                        stroke="currentColor"
                        strokeWidth="10"
                        className="text-slate-200 dark:text-white/10"
                      />
                      <circle
                        cx="56"
                        cy="56"
                        r="48"
                        fill="transparent"
                        stroke="currentColor"
                        strokeWidth="10"
                        strokeDasharray="301.6"
                        strokeDashoffset="25"
                        strokeLinecap="round"
                        className="text-blue-600"
                      />
                    </svg>

                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-2xl font-black text-slate-900 dark:text-white">
                        92%
                      </span>
                    </div>
                  </div>
                </div>

                <p className="mt-4 text-center text-xs font-semibold leading-relaxed text-slate-400">
                  User security posture is{" "}
                  <span className="font-black text-emerald-500">
                    compliant
                  </span>{" "}
                  with current access rules.
                </p>
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
              {activities.map((item, index) => (
                <div key={item.title} className="relative flex gap-5">
                  {index !== activities.length - 1 && (
                    <div className="absolute left-5 top-12 bottom-[-40px] w-0.5 bg-slate-100 dark:bg-white/5" />
                  )}

                  <div className="relative z-10 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-500/10">
                    <UserCheck size={18} />
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