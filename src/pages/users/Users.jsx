import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppShell from "../../layouts/AppShell";
import {
  Search,
  Upload,
  Plus,
  Users as UsersIcon,
  UserCheck,
  UserPlus,
  Shield,
  Filter,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  Trash2,
  Eye,
  Pencil,
  KeyRound,
} from "lucide-react";

const initialUserStats = [
  {
    title: "Total Users",
    value: "1,284",
    change: "+4.6%",
    icon: UsersIcon,
    tone: "blue",
  },
  {
    title: "Active Now",
    value: "421",
    change: "+2.8%",
    icon: UserCheck,
    tone: "emerald",
  },
  {
    title: "Pending Invites",
    value: "28",
    change: "+1.1%",
    icon: UserPlus,
    tone: "amber",
  },
  {
    title: "Admin Accounts",
    value: "64",
    change: "+0.7%",
    icon: Shield,
    tone: "indigo",
  },
];

const initialUsers = [
  {
    id: "USR-1001",
    name: "Liam Wilson",
    email: "liam.w@nexus-labs.com",
    role: "Global Admin",
    status: "Active",
    lastActive: "2 mins ago",
    brands: ["NL", "V", "H"],
    avatarBg: "from-slate-950 to-slate-800",
  },
  {
    id: "USR-1002",
    name: "Sarah Jenkins",
    email: "s.jenkins@vortex.co",
    role: "Brand Editor",
    status: "Active",
    lastActive: "1 hour ago",
    brands: ["V"],
    avatarBg: "from-zinc-900 to-slate-700",
  },
  {
    id: "USR-1003",
    name: "David Chen",
    email: "d.chen@horizon.io",
    role: "Viewer",
    status: "Pending",
    lastActive: "Invited Mar 12",
    brands: ["H"],
    avatarBg: "from-slate-900 to-cyan-950",
  },
  {
    id: "USR-1004",
    name: "Elena Rodriguez",
    email: "e.rod@nexus-labs.com",
    role: "Compliance Officer",
    status: "Inactive",
    lastActive: "2 days ago",
    brands: ["NL", "H"],
    avatarBg: "from-stone-900 to-neutral-700",
  },
  {
    id: "USR-1005",
    name: "Marcus King",
    email: "m.king@corp.net",
    role: "Developer",
    status: "Active",
    lastActive: "Just now",
    brands: ["V", "NL"],
    avatarBg: "from-amber-700 to-yellow-500",
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

function statusClasses(status) {
  if (status === "Active") {
    return "border border-emerald-500/20 bg-emerald-500/10 text-emerald-500";
  }
  if (status === "Pending") {
    return "border border-amber-500/20 bg-amber-500/10 text-amber-500";
  }
  return "border border-slate-300 dark:border-white/10 bg-slate-100 dark:bg-white/5 text-slate-500";
}

function statusDot(status) {
  if (status === "Active") return "bg-emerald-500";
  if (status === "Pending") return "bg-amber-500";
  return "bg-slate-400";
}

export default function Users() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState(initialUsers);
  const [openMenuId, setOpenMenuId] = useState(null);

  const filteredUsers = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return users;

    return users.filter(
      (user) =>
        user.name.toLowerCase().includes(q) ||
        user.email.toLowerCase().includes(q) ||
        user.role.toLowerCase().includes(q) ||
        user.status.toLowerCase().includes(q) ||
        user.id.toLowerCase().includes(q)
    );
  }, [query, users]);

  const handleDelete = (userId, userName) => {
    const ok = window.confirm(`Delete "${userName}"?`);
    if (!ok) return;
    setUsers((prev) => prev.filter((u) => u.id !== userId));
    setOpenMenuId(null);
  };

  return (
    <AppShell>
      <div className="space-y-8">
        <div className="flex flex-col justify-between gap-5 xl:flex-row xl:items-end">
          <div>
            <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">
              Users
            </h1>
            <p className="mt-2 text-base text-slate-500 dark:text-slate-400">
              Manage users across brands and workspaces.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button className="auth-outline-btn flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold">
              <Upload size={16} />
              Export Data
            </button>

            <button
              onClick={() => navigate("/roles-permissions")}
              className="auth-outline-btn flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold"
            >
              <KeyRound size={16} />
              Roles & Permissions
            </button>

            <button
              onClick={() => navigate("/users/add")}
              className="blue-gradient-btn flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-white"
            >
              <Plus size={16} />
              Add User
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
          {initialUserStats.map((item) => {
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
                  placeholder="Search users by name, email, role, or ID..."
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
            <table className="w-full min-w-[1080px] text-left">
              <thead className="bg-slate-50/80 dark:bg-white/[0.03]">
                <tr>
                  <th className="px-8 py-5 text-[11px] font-black uppercase tracking-[0.14em] text-slate-400">
                    User
                  </th>
                  <th className="px-8 py-5 text-[11px] font-black uppercase tracking-[0.14em] text-slate-400">
                    Role
                  </th>
                  <th className="px-8 py-5 text-[11px] font-black uppercase tracking-[0.14em] text-slate-400">
                    Assigned Brands
                  </th>
                  <th className="px-8 py-5 text-[11px] font-black uppercase tracking-[0.14em] text-slate-400">
                    Status
                  </th>
                  <th className="px-8 py-5 text-[11px] font-black uppercase tracking-[0.14em] text-slate-400">
                    Last Active
                  </th>
                  <th className="px-8 py-5 text-right text-[11px] font-black uppercase tracking-[0.14em] text-slate-400">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-200 dark:divide-white/10">
                {filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="transition hover:bg-slate-50 dark:hover:bg-white/[0.03]"
                  >
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div
                          className={`flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br ${user.avatarBg} text-xs font-black text-white shadow-md`}
                        >
                          {user.name
                            .split(" ")
                            .map((p) => p[0])
                            .slice(0, 2)
                            .join("")}
                        </div>

                        <div>
                          <button
                            onClick={() => navigate(`/users/${user.id}`)}
                            className="text-left text-sm font-bold text-slate-900 transition hover:text-blue-600 dark:text-white"
                          >
                            {user.name}
                          </button>
                          <p className="mt-1 text-xs text-slate-500">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-8 py-6 text-sm font-semibold text-slate-700 dark:text-slate-300">
                      {user.role}
                    </td>

                    <td className="px-8 py-6">
                      <div className="flex -space-x-2">
                        {user.brands.map((brand) => (
                          <div
                            key={brand}
                            className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-slate-200 text-[10px] font-bold text-slate-700 dark:border-[#111111] dark:bg-slate-800 dark:text-slate-200"
                          >
                            {brand}
                          </div>
                        ))}
                      </div>
                    </td>

                    <td className="px-8 py-6">
                      <span
                        className={`inline-flex items-center gap-2 rounded-lg px-3 py-1 text-[11px] font-black uppercase tracking-[0.12em] ${statusClasses(
                          user.status
                        )}`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${statusDot(
                            user.status
                          )}`}
                        />
                        {user.status}
                      </span>
                    </td>

                    <td className="px-8 py-6 text-sm font-semibold text-slate-500 dark:text-slate-400">
                      {user.lastActive}
                    </td>

                    <td className="relative px-8 py-6">
                      <div className="flex justify-end">
                        <button
                          onClick={() =>
                            setOpenMenuId((prev) =>
                              prev === user.id ? null : user.id
                            )
                          }
                          className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-blue-600 dark:hover:bg-white/5"
                        >
                          <MoreHorizontal size={18} />
                        </button>
                      </div>

                      {openMenuId === user.id && (
                        <div className="absolute right-8 top-[72px] z-20 w-44 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl dark:border-white/10 dark:bg-[#111111]">
                          <button
                            onClick={() => {
                              setOpenMenuId(null);
                              navigate(`/users/${user.id}`);
                            }}
                            className="flex w-full items-center gap-2 px-4 py-3 text-sm text-slate-700 transition hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-white/[0.04]"
                          >
                            <Eye size={16} />
                            View Details
                          </button>

                          <button
                            onClick={() => {
                              setOpenMenuId(null);
                              navigate(`/users/${user.id}/edit`);
                            }}
                            className="flex w-full items-center gap-2 px-4 py-3 text-sm text-slate-700 transition hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-white/[0.04]"
                          >
                            <Pencil size={16} />
                            Edit User
                          </button>

                          <button
                            onClick={() => handleDelete(user.id, user.name)}
                            className="flex w-full items-center gap-2 px-4 py-3 text-sm text-rose-500 transition hover:bg-rose-50 dark:hover:bg-rose-500/10"
                          >
                            <Trash2 size={16} />
                            Delete
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col gap-4 border-t border-slate-200 px-8 py-5 text-sm dark:border-white/10 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-slate-500 dark:text-slate-400">
              Displaying{" "}
              <span className="font-bold text-slate-900 dark:text-white">
                1 to {filteredUsers.length}
              </span>{" "}
              of {users.length} users
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