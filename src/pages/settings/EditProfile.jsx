import { NavLink } from "react-router-dom";
import AppShell from "../../layouts/AppShell";
import {
  UserCircle2,
  Search,
  Bell,
  Shield,
  Users,
  Settings as SettingsIcon,
  Camera,
  Save,
  Lock,
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

export default function EditProfile() {
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
                  Edit Profile
                </h1>
                <p className="mt-2 text-base text-slate-500 dark:text-slate-400">
                  Manage your personal information and account security.
                </p>
              </div>

              <div className="relative w-full max-w-[320px]">
                <Search
                  size={18}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="text"
                  placeholder="Search profile settings..."
                  className="auth-minimal-input w-full rounded-xl py-3 pl-11 pr-4 text-sm"
                />
              </div>
            </div>
          </div>

          <div className="flex-1 space-y-8 overflow-y-auto px-8 py-8">
            <section className="app-panel p-8">
              <div className="flex flex-col items-center gap-6 md:flex-row">
                <div className="relative">
                  <div className="flex h-32 w-32 items-center justify-center rounded-full border-4 border-blue-500/20 bg-slate-100 text-2xl font-black text-slate-700 dark:bg-white/[0.04] dark:text-white">
                    AJ
                  </div>

                  <button className="absolute bottom-1 right-1 flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg">
                    <Camera size={18} />
                  </button>
                </div>

                <div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white">
                    Profile Photo
                  </h3>
                  <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                    Recommended size: 400x400px. JPG, PNG or GIF.
                  </p>

                  <div className="mt-4 flex flex-wrap gap-3">
                    <button className="blue-gradient-btn rounded-xl px-4 py-2.5 text-sm font-semibold text-white">
                      Upload New
                    </button>
                    <button className="auth-outline-btn rounded-xl px-4 py-2.5 text-sm font-semibold">
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            </section>

            <section className="app-panel p-8">
              <h3 className="text-xl font-black text-slate-900 dark:text-white">
                Personal Information
              </h3>

              <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Full Name
                  </label>
                  <input
                    type="text"
                    defaultValue="Alex Johnson"
                    className="auth-minimal-input w-full rounded-xl px-4 py-3"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Email Address
                  </label>
                  <input
                    type="email"
                    defaultValue="alex.j@example.com"
                    className="auth-minimal-input w-full rounded-xl px-4 py-3"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    defaultValue="+1 (555) 000-0000"
                    className="auth-minimal-input w-full rounded-xl px-4 py-3"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Job Title
                  </label>
                  <input
                    type="text"
                    defaultValue="Senior Product Designer"
                    className="auth-minimal-input w-full rounded-xl px-4 py-3"
                  />
                </div>
              </div>
            </section>

            <section className="grid grid-cols-1 gap-8 md:grid-cols-2">
              <div className="app-panel p-8">
                <div className="mb-6 flex items-center gap-3">
                  <Lock className="text-blue-500" size={20} />
                  <h3 className="text-xl font-black text-slate-900 dark:text-white">
                    Password
                  </h3>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                      Current Password
                    </label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="auth-minimal-input w-full rounded-xl px-4 py-3"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                      New Password
                    </label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="auth-minimal-input w-full rounded-xl px-4 py-3"
                    />
                  </div>

                  <button className="auth-outline-btn w-full rounded-xl px-4 py-3 text-sm font-semibold">
                    Update Password
                  </button>
                </div>
              </div>

              <div className="app-panel p-8">
                <div className="mb-6 flex items-center gap-3">
                  <Shield className="text-blue-500" size={20} />
                  <h3 className="text-xl font-black text-slate-900 dark:text-white">
                    Two-Factor
                  </h3>
                </div>

                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Secure your account with an extra layer of protection.
                </p>

                <div className="mt-6 flex items-center justify-between rounded-2xl border border-slate-200 p-4 dark:border-white/10">
                  <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">
                      Authenticator App
                    </p>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      Not configured
                    </p>
                  </div>

                  <button className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white">
                    +
                  </button>
                </div>
              </div>
            </section>
          </div>

          <div className="sticky bottom-0 flex items-center justify-end gap-4 border-t border-slate-200 bg-white/70 px-8 py-5 backdrop-blur-md dark:border-white/10 dark:bg-[#101622]/70">
            <button className="px-5 py-3 text-sm font-bold text-slate-500 transition hover:text-slate-900 dark:hover:text-white">
              Discard
            </button>

            <button className="blue-gradient-btn flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-bold text-white">
              <Save size={16} />
              Save Profile
            </button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}