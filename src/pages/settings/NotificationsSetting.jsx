import { NavLink } from "react-router-dom";
import { useState } from "react";
import AppShell from "../../layouts/AppShell";
import {
  Bell,
  Search,
  Shield,
  Users,
  Settings as SettingsIcon,
  UserCircle2,
  Mail,
  Smartphone,
  MessageSquare,
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

export default function NotificationsSetting() {
  const [email, setEmail] = useState(true);
  const [push, setPush] = useState(true);
  const [sms, setSms] = useState(false);
  const [weeklyDigest, setWeeklyDigest] = useState(true);

  const rows = [
    {
      title: "New Lead Activity",
      desc: "Receive alerts when fresh leads enter the workspace.",
      enabled: true,
    },
    {
      title: "Export Completion",
      desc: "Get notified when exports finish or fail.",
      enabled: true,
    },
    {
      title: "Campaign Alerts",
      desc: "Budget pacing, sync failures, and delivery warnings.",
      enabled: true,
    },
    {
      title: "Security Incidents",
      desc: "Suspicious sign-ins and elevated risk events.",
      enabled: true,
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
                  Notification Settings
                </h1>
                <p className="mt-2 text-base text-slate-500 dark:text-slate-400">
                  Choose how your team receives workspace updates and alerts.
                </p>
              </div>

              <div className="relative w-full max-w-[320px]">
                <Search
                  size={18}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="text"
                  placeholder="Search notifications..."
                  className="auth-minimal-input w-full rounded-xl py-3 pl-11 pr-4 text-sm"
                />
              </div>
            </div>
          </div>

          <div className="flex-1 space-y-8 overflow-y-auto px-8 py-8">
            <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
              {[
                { label: "Email", icon: Mail, active: email, action: () => setEmail((p) => !p) },
                { label: "Push", icon: Bell, active: push, action: () => setPush((p) => !p) },
                { label: "SMS", icon: Smartphone, active: sms, action: () => setSms((p) => !p) },
                {
                  label: "Weekly Digest",
                  icon: MessageSquare,
                  active: weeklyDigest,
                  action: () => setWeeklyDigest((p) => !p),
                },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="metric-card app-panel-glow">
                    <div className="mb-5 flex items-center justify-between">
                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-2xl ${
                          item.active
                            ? "bg-blue-500/10 text-blue-500"
                            : "bg-slate-100 text-slate-400 dark:bg-white/[0.04]"
                        }`}
                      >
                        <Icon size={20} />
                      </div>

                      <span
                        className={`rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em] ${
                          item.active
                            ? "bg-emerald-500/10 text-emerald-500"
                            : "bg-slate-100 text-slate-500 dark:bg-white/[0.04]"
                        }`}
                      >
                        {item.active ? "Enabled" : "Off"}
                      </span>
                    </div>

                    <p className="text-lg font-bold text-slate-900 dark:text-white">
                      {item.label}
                    </p>

                    <button
                      onClick={item.action}
                      className="auth-outline-btn mt-4 rounded-xl px-4 py-2.5 text-sm font-semibold"
                    >
                      {item.active ? "Disable" : "Enable"}
                    </button>
                  </div>
                );
              })}
            </section>

            <section className="app-panel overflow-hidden">
              <div className="border-b border-slate-200 px-8 py-6 dark:border-white/10">
                <h3 className="text-xl font-black text-slate-900 dark:text-white">
                  Event Preferences
                </h3>
              </div>

              <div className="divide-y divide-slate-200 dark:divide-white/10">
                {rows.map((row) => (
                  <div
                    key={row.title}
                    className="flex items-center justify-between gap-4 px-8 py-6"
                  >
                    <div>
                      <p className="text-lg font-bold text-slate-900 dark:text-white">
                        {row.title}
                      </p>
                      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        {row.desc}
                      </p>
                    </div>

                    <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-emerald-500">
                      Enabled
                    </span>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <div className="sticky bottom-0 flex items-center justify-end gap-4 border-t border-slate-200 bg-white/70 px-8 py-5 backdrop-blur-md dark:border-white/10 dark:bg-[#101622]/70">
            <button className="px-5 py-3 text-sm font-bold text-slate-500 transition hover:text-slate-900 dark:hover:text-white">
              Cancel Changes
            </button>

            <button className="blue-gradient-btn rounded-xl px-6 py-3 text-sm font-bold text-white">
              Save Notifications
            </button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}