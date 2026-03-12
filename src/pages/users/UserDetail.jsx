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

const metrics = [
  {
    title: "Assigned Brands",
    value: "3",
    delta: "+1",
    icon: Briefcase,
    tone: "blue",
  },
  {
    title: "Permissions",
    value: "24",
    delta: "+3",
    icon: ShieldCheck,
    tone: "emerald",
  },
  {
    title: "Open Tasks",
    value: "8",
    delta: "Stable",
    icon: Activity,
    tone: "slate",
  },
  {
    title: "Compliance Score",
    value: "98%",
    delta: "+2.1%",
    icon: Lock,
    tone: "rose",
  },
];

const activities = [
  {
    title: "User Updated",
    text: "Role changed from Brand Editor to Global Admin",
    time: "2 hours ago",
  },
  {
    title: "Invite Accepted",
    text: "User accepted invitation and activated account",
    time: "Yesterday, 4:12 PM",
  },
  {
    title: "Brand Assigned",
    text: "Horizon workspace added to assigned brands",
    time: "Oct 24, 2023",
  },
  {
    title: "Permission Updated",
    text: "Export data access enabled",
    time: "Oct 22, 2023",
  },
];

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

  return (
    <AppShell>
      <div className="space-y-10">
        <section className="app-panel overflow-hidden rounded-[2rem] p-8 md:p-10">
          <div className="relative">
            <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-blue-500/10 blur-3xl dark:bg-blue-500/10" />

            <div className="relative flex flex-col justify-between gap-8 xl:flex-row xl:items-center">
              <div className="flex flex-col gap-8 md:flex-row md:items-center">
                <div className="flex h-32 w-32 items-center justify-center rounded-[2rem] bg-gradient-to-br from-slate-950 to-slate-800 text-2xl font-black text-white shadow-xl">
                  LW
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-4">
                    <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">
                      Liam Wilson
                    </h1>
                    <span className="rounded-lg bg-blue-600 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-white">
                      Global Admin
                    </span>
                  </div>

                  <p className="mt-3 text-2xl font-medium text-slate-500 dark:text-slate-400">
                    Enterprise Access • Multi-Brand Operations
                  </p>

                  <div className="mt-5 flex flex-wrap gap-6 text-sm font-semibold text-slate-400">
                    <span className="flex items-center gap-2">
                      <CalendarDays size={16} className="text-blue-500/70" />
                      Joined Oct 2022
                    </span>
                    <span className="flex items-center gap-2">
                      <Mail size={16} className="text-blue-500/70" />
                      liam.w@nexus-labs.com
                    </span>
                    <span className="flex items-center gap-2">
                      <ShieldCheck size={16} className="text-blue-500/70" />
                      Verified Access
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => navigate(`/users/${userId}/edit`)}
                  className="auth-outline-btn rounded-xl px-5 py-3 text-sm font-semibold"
                >
                  Edit User
                </button>
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
                  <div className="flex h-11 w-11 items-center justify-center rounded-full border-4 border-white bg-slate-300 text-xs font-black shadow-sm dark:border-[#111111] dark:bg-slate-700">
                    NL
                  </div>
                  <div className="flex h-11 w-11 items-center justify-center rounded-full border-4 border-white bg-slate-400 text-xs font-black shadow-sm dark:border-[#111111] dark:bg-slate-600">
                    V
                  </div>
                  <div className="flex h-11 w-11 items-center justify-center rounded-full border-4 border-white bg-slate-500 text-xs font-black text-white shadow-sm dark:border-[#111111] dark:bg-slate-500">
                    H
                  </div>
                </div>

                <button className="text-sm font-bold text-blue-600">
                  Manage Brand Access
                </button>
              </div>

              <div className="inline-flex items-center gap-3 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-500 shadow-sm dark:border-white/10 dark:bg-white/[0.03]">
                <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                Active now
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

                  <span
                    className={`rounded-lg px-3 py-1 text-xs font-bold ${
                      item.delta.startsWith("+")
                        ? "bg-emerald-500/10 text-emerald-500"
                        : item.delta.startsWith("-")
                        ? "bg-rose-500/10 text-rose-500"
                        : "bg-slate-200 dark:bg-white/10 text-slate-400"
                    }`}
                  >
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
                    Activity Trend
                  </h3>
                  <p className="mt-1 text-sm text-slate-400">
                    Permission changes and workspace activity over time
                  </p>
                </div>

                <select className="auth-minimal-input rounded-xl px-4 py-2 text-sm font-semibold">
                  <option>Last 30 Days</option>
                  <option>Last 90 Days</option>
                </select>
              </div>

              <div className="flex h-72 items-end gap-2.5">
                {[35, 48, 54, 76, 58, 61, 42, 84, 66, 40, 57, 72].map((h, i) => (
                  <div
                    key={i}
                    className={`flex-1 rounded-xl ${
                      i === 7
                        ? "bg-blue-600 shadow-lg shadow-blue-500/20"
                        : i === 3 || i === 11
                        ? "bg-blue-600/45"
                        : "bg-slate-200 dark:bg-white/10"
                    }`}
                    style={{ height: `${h}%` }}
                  />
                ))}
              </div>

              <div className="mt-6 flex justify-between px-2 text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">
                <span>Oct 01</span>
                <span>Oct 10</span>
                <span>Oct 20</span>
                <span>Oct 30</span>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              <div className="app-panel rounded-[2rem] p-8">
                <h3 className="mb-8 text-xs font-black uppercase tracking-[0.18em] text-slate-400">
                  Brand Allocation
                </h3>

                <div className="space-y-6">
                  {[
                    ["Nexus Labs", "42%", "bg-blue-600"],
                    ["Vortex Global", "31%", "bg-blue-300"],
                    ["Horizon Corp", "27%", "bg-slate-300 dark:bg-white/10"],
                  ].map(([label, value, color]) => (
                    <div key={label} className="flex items-center gap-4">
                      <span className={`h-2.5 w-2.5 rounded-full ${color}`} />
                      <p className="flex-1 text-sm font-bold text-slate-600 dark:text-slate-300">
                        {label}
                      </p>
                      <p className="text-sm font-extrabold text-slate-900 dark:text-white">
                        {value}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-8 border-t border-slate-200 pt-6 dark:border-white/10">
                  <button className="text-sm font-black text-blue-600">
                    View Full Allocation
                  </button>
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
                    fully compliant
                  </span>{" "}
                  with current workspace rules.
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