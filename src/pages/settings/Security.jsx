import { NavLink } from "react-router-dom";
import { useState } from "react";
import AppShell from "../../layouts/AppShell";
import {
  Shield,
  Bell,
  Users,
  Settings as SettingsIcon,
  UserCircle2,
  Search,
  Lock,
  Smartphone,
  Globe,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";

const workspaceLinks = [
  { label: "General", icon: SettingsIcon, to: "/settings" },
  { label: "Security", icon: Shield, to: "/settings/security" },
  { label: "Notifications", icon: Bell, to: "/settings/notificationssetting" },
  { label: "Team Members", icon: Users, to: "/settings/team-members" },
  { label: "Edit Profile", icon: UserCircle2, to: "/profile" },
];

function SidebarLink({ to, icon: Icon, label }) {
  return (
    <NavLink
      to={to}
      end={to === "/settings"}
      className={({ isActive }) =>
        `flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-semibold transition ${
          isActive
            ? "bg-blue-500/10 text-blue-600 dark:text-blue-400"
            : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-white/[0.04]"
        }`
      }
    >
      <Icon size={18} />
      {label}
    </NavLink>
  );
}

export default function Security() {
  const [twoFactor, setTwoFactor] = useState(true);
  const [loginAlerts, setLoginAlerts] = useState(true);

  const sessions = [
    {
      device: "MacBook Pro · Chrome",
      location: "Karachi, Pakistan",
      ip: "103.44.21.180",
      status: "Current Session",
    },
    {
      device: "Windows Desktop · Edge",
      location: "Lahore, Pakistan",
      ip: "111.68.92.14",
      status: "Active",
    },
    {
      device: "iPhone 15 · Safari",
      location: "Dubai, UAE",
      ip: "86.96.201.55",
      status: "Needs Review",
    },
  ];

  return (
    <AppShell>
      <div className="-mx-8 -my-8 flex min-h-[calc(100vh-140px)]">
        <aside className="hidden w-72 shrink-0 border-r border-slate-200 bg-slate-50/40 px-6 py-8 dark:border-white/10 dark:bg-white/[0.02] lg:flex lg:flex-col">
          <div className="space-y-2">
            <p className="mb-4 px-3 text-xs font-bold uppercase tracking-[0.22em] text-slate-500">
              Workspace
            </p>
            {workspaceLinks.map((item) => (
              <SidebarLink key={item.label} {...item} />
            ))}
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <div className="border-b border-slate-200 px-8 py-5 dark:border-white/10">
            <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
              <div>
                <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">
                  Security Settings
                </h1>
                <p className="mt-2 text-base text-slate-500 dark:text-slate-400">
                  Control authentication, sessions, and workspace protection.
                </p>
              </div>

              <div className="relative w-full max-w-[320px]">
                <Search
                  size={18}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="text"
                  placeholder="Search security..."
                  className="auth-minimal-input w-full rounded-xl py-3 pl-11 pr-4 text-sm"
                />
              </div>
            </div>
          </div>

          <div className="flex-1 space-y-8 overflow-y-auto px-8 py-8">
            <section className="grid grid-cols-1 gap-5 md:grid-cols-3">
              <div className="metric-card app-panel-glow">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">
                  Security Score
                </p>
                <p className="mt-3 text-4xl font-black tracking-tight text-slate-900 dark:text-white">
                  92%
                </p>
              </div>

              <div className="metric-card app-panel-glow">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">
                  MFA Coverage
                </p>
                <p className="mt-3 text-4xl font-black tracking-tight text-slate-900 dark:text-white">
                  84%
                </p>
              </div>

              <div className="metric-card app-panel-glow">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">
                  Open Alerts
                </p>
                <p className="mt-3 text-4xl font-black tracking-tight text-slate-900 dark:text-white">
                  3
                </p>
              </div>
            </section>

            <section className="app-panel p-8">
              <h3 className="text-xl font-black text-slate-900 dark:text-white">
                Authentication Controls
              </h3>

              <div className="mt-8 space-y-6">
                <div className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 p-5 dark:border-white/10">
                  <div>
                    <p className="text-lg font-bold text-slate-900 dark:text-white">
                      Two-Factor Authentication
                    </p>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                      Require verification codes for account sign-in.
                    </p>
                  </div>

                  <button
                    onClick={() => setTwoFactor((prev) => !prev)}
                    className={`relative h-7 w-12 rounded-full transition ${
                      twoFactor ? "bg-blue-600" : "bg-slate-300 dark:bg-white/10"
                    }`}
                  >
                    <span
                      className={`absolute top-1 h-5 w-5 rounded-full bg-white transition ${
                        twoFactor ? "left-6" : "left-1"
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 p-5 dark:border-white/10">
                  <div>
                    <p className="text-lg font-bold text-slate-900 dark:text-white">
                      Login Alerts
                    </p>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                      Notify admins about new devices and unusual sign-ins.
                    </p>
                  </div>

                  <button
                    onClick={() => setLoginAlerts((prev) => !prev)}
                    className={`relative h-7 w-12 rounded-full transition ${
                      loginAlerts
                        ? "bg-blue-600"
                        : "bg-slate-300 dark:bg-white/10"
                    }`}
                  >
                    <span
                      className={`absolute top-1 h-5 w-5 rounded-full bg-white transition ${
                        loginAlerts ? "left-6" : "left-1"
                      }`}
                    />
                  </button>
                </div>
              </div>
            </section>

            <section className="app-panel overflow-hidden">
              <div className="border-b border-slate-200 px-8 py-6 dark:border-white/10">
                <h3 className="text-xl font-black text-slate-900 dark:text-white">
                  Active Sessions
                </h3>
              </div>

              <div className="divide-y divide-slate-200 dark:divide-white/10">
                {sessions.map((session) => (
                  <div
                    key={`${session.device}-${session.ip}`}
                    className="flex flex-col gap-4 px-8 py-6 lg:flex-row lg:items-center lg:justify-between"
                  >
                    <div>
                      <p className="text-base font-bold text-slate-900 dark:text-white">
                        {session.device}
                      </p>
                      <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-500 dark:text-slate-400">
                        <span className="inline-flex items-center gap-1.5">
                          <Globe size={14} />
                          {session.location}
                        </span>
                        <span>IP: {session.ip}</span>
                      </div>
                    </div>

                    <span
                      className={`rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em] ${
                        session.status === "Current Session"
                          ? "bg-emerald-500/10 text-emerald-500"
                          : session.status === "Active"
                          ? "bg-blue-500/10 text-blue-500"
                          : "bg-amber-500/10 text-amber-500"
                      }`}
                    >
                      {session.status}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-[1.75rem] border border-amber-500/20 bg-amber-500/[0.03] p-8">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-500">
                  <AlertTriangle size={18} />
                </div>

                <div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white">
                    Security Recommendations
                  </h3>
                  <ul className="mt-4 space-y-3 text-sm text-slate-600 dark:text-slate-300">
                    <li>Review one sign-in marked as unusual.</li>
                    <li>Enable mandatory MFA for all team members.</li>
                    <li>Rotate API secrets older than 60 days.</li>
                  </ul>
                </div>
              </div>
            </section>
          </div>

          <div className="sticky bottom-0 flex items-center justify-end gap-4 border-t border-slate-200 bg-white/70 px-8 py-5 backdrop-blur-md dark:border-white/10 dark:bg-[#101622]/70">
            <button className="px-5 py-3 text-sm font-bold text-slate-500 transition hover:text-slate-900 dark:hover:text-white">
              Cancel Changes
            </button>

            <button className="blue-gradient-btn flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-bold text-white">
              <CheckCircle2 size={16} />
              Save Security
            </button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}