import { NavLink } from "react-router-dom";
import { useState } from "react";
import AppShell from "../../layouts/AppShell";
import {
  Users,
  Search,
  MoreHorizontal,
  Shield,
  Bell,
  Settings as SettingsIcon,
  UserCircle2,
  UserPlus,
} from "lucide-react";

const workspaceLinks = [
  { label: "General", icon: SettingsIcon, to: "/settings" },
  { label: "Security", icon: Shield, to: "/settings/security" },
  { label: "Notifications", icon: Bell, to: "/settings/notificationssetting" },
  { label: "Team Members", icon: Users, to: "/settings/team-members" },
  { label: "Edit Profile", icon: UserCircle2, to: "/profile" },
];

const membersData = [
  {
    id: "USR-1001",
    name: "Alex Rivera",
    role: "Admin",
    email: "alex@acme.app",
    status: "Active",
    initials: "AR",
    tone: "from-blue-600 to-indigo-600",
  },
  {
    id: "USR-1002",
    name: "Sarah Miller",
    role: "Manager",
    email: "sarah@acme.app",
    status: "Active",
    initials: "SM",
    tone: "from-emerald-600 to-teal-600",
  },
  {
    id: "USR-1003",
    name: "Daniel Brooks",
    role: "Analyst",
    email: "daniel@acme.app",
    status: "Invited",
    initials: "DB",
    tone: "from-amber-500 to-orange-500",
  },
  {
    id: "USR-1004",
    name: "Emma Scott",
    role: "Editor",
    email: "emma@acme.app",
    status: "Suspended",
    initials: "ES",
    tone: "from-rose-500 to-pink-600",
  },
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

function statusClasses(status) {
  if (status === "Active") {
    return "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20";
  }
  if (status === "Invited") {
    return "bg-blue-500/10 text-blue-500 border border-blue-500/20";
  }
  return "bg-rose-500/10 text-rose-500 border border-rose-500/20";
}

export default function TeamMembers() {
  const [query, setQuery] = useState("");

  const filtered = membersData.filter((member) => {
    const q = query.toLowerCase().trim();
    if (!q) return true;

    return (
      member.name.toLowerCase().includes(q) ||
      member.email.toLowerCase().includes(q) ||
      member.role.toLowerCase().includes(q)
    );
  });

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
                  Team Members
                </h1>
                <p className="mt-2 text-base text-slate-500 dark:text-slate-400">
                  Manage roles, access levels, and team member activity.
                </p>
              </div>

              <button className="blue-gradient-btn flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-bold text-white">
                <UserPlus size={16} />
                Invite Member
              </button>
            </div>
          </div>

          <div className="flex-1 space-y-8 overflow-y-auto px-8 py-8">
            <section className="grid grid-cols-1 gap-5 md:grid-cols-3">
              <div className="metric-card app-panel-glow">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">
                  Total Members
                </p>
                <p className="mt-3 text-4xl font-black tracking-tight text-slate-900 dark:text-white">
                  24
                </p>
              </div>

              <div className="metric-card app-panel-glow">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">
                  Active Seats
                </p>
                <p className="mt-3 text-4xl font-black tracking-tight text-slate-900 dark:text-white">
                  21
                </p>
              </div>

              <div className="metric-card app-panel-glow">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">
                  Pending Invites
                </p>
                <p className="mt-3 text-4xl font-black tracking-tight text-slate-900 dark:text-white">
                  3
                </p>
              </div>
            </section>

            <section className="app-panel overflow-hidden">
              <div className="border-b border-slate-200 p-6 dark:border-white/10">
                <div className="relative max-w-md">
                  <Search
                    size={18}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    type="text"
                    placeholder="Search team members..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="auth-minimal-input w-full rounded-xl py-3 pl-11 pr-4 text-sm"
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[920px] text-left">
                  <thead className="bg-slate-50/80 dark:bg-white/[0.03]">
                    <tr>
                      <th className="px-8 py-5 text-[11px] font-black uppercase tracking-[0.14em] text-slate-400">
                        Member
                      </th>
                      <th className="px-8 py-5 text-[11px] font-black uppercase tracking-[0.14em] text-slate-400">
                        Role
                      </th>
                      <th className="px-8 py-5 text-[11px] font-black uppercase tracking-[0.14em] text-slate-400">
                        Status
                      </th>
                      <th className="px-8 py-5 text-[11px] font-black uppercase tracking-[0.14em] text-slate-400">
                        ID
                      </th>
                      <th className="px-8 py-5 text-right text-[11px] font-black uppercase tracking-[0.14em] text-slate-400">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-200 dark:divide-white/10">
                    {filtered.map((member) => (
                      <tr
                        key={member.id}
                        className="transition hover:bg-slate-50 dark:hover:bg-white/[0.03]"
                      >
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-4">
                            <div
                              className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${member.tone} text-sm font-black text-white`}
                            >
                              {member.initials}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-slate-900 dark:text-white">
                                {member.name}
                              </p>
                              <p className="mt-1 text-xs text-slate-500">
                                {member.email}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-8 py-6 text-sm font-semibold text-slate-700 dark:text-slate-200">
                          {member.role}
                        </td>

                        <td className="px-8 py-6">
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em] ${statusClasses(
                              member.status
                            )}`}
                          >
                            {member.status}
                          </span>
                        </td>

                        <td className="px-8 py-6 text-sm text-slate-500 dark:text-slate-400">
                          {member.id}
                        </td>

                        <td className="px-8 py-6 text-right">
                          <button className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-blue-600 dark:hover:bg-white/[0.04]">
                            <MoreHorizontal size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>

          <div className="sticky bottom-0 flex items-center justify-end gap-4 border-t border-slate-200 bg-white/70 px-8 py-5 backdrop-blur-md dark:border-white/10 dark:bg-[#101622]/70">
            <button className="px-5 py-3 text-sm font-bold text-slate-500 transition hover:text-slate-900 dark:hover:text-white">
              Cancel Changes
            </button>

            <button className="blue-gradient-btn rounded-xl px-6 py-3 text-sm font-bold text-white">
              Save Members
            </button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}