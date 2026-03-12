import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import AppShell from "../../layouts/AppShell";
import {
  Search,
  Bell,
  Shield,
  Users,
  Settings as SettingsIcon,
  Upload,
  Save,
  CheckCircle2,
  UserCircle2,
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

export default function Settings() {
  const navigate = useNavigate();

  const [workspaceName, setWorkspaceName] = useState("Acme Corporation");
  const [workspaceUrl, setWorkspaceUrl] = useState("hq");
  const [darkMode, setDarkMode] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(false);

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

          <div className="mt-auto rounded-[1.5rem] border border-slate-200 bg-white/70 p-5 shadow-sm dark:border-white/10 dark:bg-white/[0.03]">
            <p className="text-xs text-slate-500">Current Plan</p>

            <div className="mt-3 flex items-center justify-between">
              <span className="text-xl font-black text-slate-900 dark:text-white">
                Enterprise Pro
              </span>
              <span className="rounded-full bg-blue-500/10 px-2 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-blue-600 dark:text-blue-400">
                Active
              </span>
            </div>

            <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-white/10">
              <div className="h-full w-[75%] rounded-full bg-blue-600" />
            </div>

            <p className="mt-3 text-xs text-slate-500">
              7.5k / 10k monthly requests
            </p>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <div className="border-b border-slate-200 px-8 py-5 dark:border-white/10">
            <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
              <div>
                <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">
                  General Settings
                </h1>
                <p className="mt-2 text-base text-slate-500 dark:text-slate-400">
                  Update your workspace details and personal preferences.
                </p>
              </div>

              <div className="relative w-full max-w-[320px]">
                <Search
                  size={18}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="text"
                  placeholder="Search settings..."
                  className="auth-minimal-input w-full rounded-xl py-3 pl-11 pr-4 text-sm"
                />
              </div>
            </div>
          </div>

          <div className="flex-1 space-y-8 overflow-y-auto px-8 py-8">
            <section className="app-panel p-8">
              <h3 className="text-xl font-black text-slate-900 dark:text-white">
                Profile Information
              </h3>

              <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Workspace Name
                  </label>
                  <input
                    type="text"
                    value={workspaceName}
                    onChange={(e) => setWorkspaceName(e.target.value)}
                    className="auth-minimal-input w-full rounded-xl px-4 py-3"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Workspace URL
                  </label>

                  <div className="flex overflow-hidden rounded-xl border border-slate-200 dark:border-white/10">
                    <span className="inline-flex items-center bg-slate-100 px-4 text-sm text-slate-500 dark:bg-white/[0.03]">
                      acme.app/
                    </span>
                    <input
                      type="text"
                      value={workspaceUrl}
                      onChange={(e) => setWorkspaceUrl(e.target.value)}
                      className="w-full border-0 bg-transparent px-4 py-3 outline-none"
                    />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="mb-3 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Workspace Logo
                  </label>

                  <div className="flex flex-col gap-5 rounded-2xl border border-slate-200 p-5 dark:border-white/10 sm:flex-row sm:items-center">
                    <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-slate-100 dark:bg-white/[0.03]">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-900/20 text-emerald-500">
                        <SettingsIcon size={20} />
                      </div>
                    </div>

                    <div>
                      <div className="flex flex-wrap gap-3">
                        <button className="blue-gradient-btn flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white">
                          <Upload size={16} />
                          Upload New
                        </button>
                        <button className="auth-outline-btn rounded-xl px-4 py-2.5 text-sm font-semibold">
                          Remove
                        </button>
                      </div>

                      <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
                        Square SVG, PNG, or JPG. Max size 2MB.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="app-panel p-8">
              <h3 className="text-xl font-black text-slate-900 dark:text-white">
                Preferences
              </h3>

              <div className="mt-8 space-y-6">
                <div className="flex items-center justify-between gap-4 border-b border-slate-200 pb-6 dark:border-white/10">
                  <div>
                    <p className="text-lg font-bold text-slate-900 dark:text-white">
                      Dark Mode
                    </p>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                      Automatically switch between light and dark themes
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setDarkMode((prev) => !prev)}
                    className={`relative h-7 w-12 rounded-full transition ${
                      darkMode
                        ? "bg-blue-600"
                        : "bg-slate-300 dark:bg-white/10"
                    }`}
                  >
                    <span
                      className={`absolute top-1 h-5 w-5 rounded-full bg-white transition ${
                        darkMode ? "left-6" : "left-1"
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between gap-4 border-b border-slate-200 pb-6 dark:border-white/10">
                  <div>
                    <p className="text-lg font-bold text-slate-900 dark:text-white">
                      Email Weekly Digest
                    </p>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                      Receive a summary of workspace activity every Monday
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setWeeklyDigest((prev) => !prev)}
                    className={`relative h-7 w-12 rounded-full transition ${
                      weeklyDigest
                        ? "bg-blue-600"
                        : "bg-slate-300 dark:bg-white/10"
                    }`}
                  >
                    <span
                      className={`absolute top-1 h-5 w-5 rounded-full bg-white transition ${
                        weeklyDigest ? "left-6" : "left-1"
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-lg font-bold text-slate-900 dark:text-white">
                      Two-Step Verification
                    </p>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                      Secure your account with multi-factor authentication
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => navigate("/settings/security")}
                    className="flex items-center gap-2 text-blue-600 transition hover:text-blue-700 dark:text-blue-400"
                  >
                    <span className="text-sm font-black uppercase tracking-[0.12em]">
                      Configured
                    </span>
                    <CheckCircle2 size={18} />
                  </button>
                </div>
              </div>
            </section>

            <section className="rounded-[1.75rem] border border-rose-500/20 bg-rose-500/[0.03] p-8">
              <h3 className="text-xl font-black text-rose-500">Danger Zone</h3>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                Irreversible actions that affect your workspace data.
              </p>

              <div className="mt-6 flex flex-col gap-4 rounded-2xl border border-rose-500/20 bg-rose-500/[0.04] p-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-lg font-bold text-slate-900 dark:text-white">
                    Delete Workspace
                  </p>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Permanently remove all projects, members, and data.
                  </p>
                </div>

                <button
                  type="button"
                  className="rounded-xl bg-rose-500/10 px-4 py-2.5 text-sm font-bold text-rose-500 transition hover:bg-rose-500 hover:text-white"
                >
                  Delete Forever
                </button>
              </div>
            </section>
          </div>

          <div className="sticky bottom-0 flex items-center justify-end gap-4 border-t border-slate-200 bg-white/70 px-8 py-5 backdrop-blur-md dark:border-white/10 dark:bg-[#101622]/70">
            <button
              type="button"
              className="px-5 py-3 text-sm font-bold text-slate-500 transition hover:text-slate-900 dark:hover:text-white"
            >
              Cancel Changes
            </button>

            <button
              type="button"
              className="blue-gradient-btn flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-bold text-white"
            >
              <Save size={16} />
              Save Settings
            </button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}