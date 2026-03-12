import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AppShell from "../../layouts/AppShell";
import {
  ArrowLeft,
  Pencil,
  Trash2,
  Users,
  Activity,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Clock3,
  MoreHorizontal,
} from "lucide-react";

const workspaces = [
  {
    id: "WS-1001",
    name: "Quantum Leap Labs",
    subtitle: "Global Production Hub",
    status: "Active",
    role: "Administrator",
    owner: "Sarah Chen",
    region: "North America (Virginia)",
    timezone: "(GMT-05:00) Eastern Time",
    members: 14,
    activeProjects: 28,
    securityScore: 96,
    description:
      "Primary global production workspace used for enterprise campaigns, operational collaboration, and cross-functional delivery.",
  },
  {
    id: "WS-1002",
    name: "Aether Brands",
    subtitle: "Marketing & Creative",
    status: "Syncing",
    role: "Contributor",
    owner: "James Wilson",
    region: "Europe (Frankfurt)",
    timezone: "(GMT+01:00) Paris",
    members: 6,
    activeProjects: 12,
    securityScore: 91,
    description:
      "Creative and marketing collaboration environment used for campaign planning, assets, and ongoing brand execution.",
  },
  {
    id: "WS-1003",
    name: "Vector Dynamics",
    subtitle: "Legacy R&D Archive",
    status: "Error",
    role: "Viewer Only",
    owner: "Elena Rodriguez",
    region: "Asia Pacific (Singapore)",
    timezone: "(GMT+08:00) Singapore",
    members: 4,
    activeProjects: 2,
    securityScore: 68,
    description:
      "Legacy research workspace currently affected by integration and sync failures across historical systems.",
  },
];

const recentEvents = [
  { title: "Member access updated", time: "16 mins ago", status: "Success" },
  { title: "Workspace sync check executed", time: "43 mins ago", status: "Queued" },
  { title: "API authentication refreshed", time: "2 hours ago", status: "Success" },
  { title: "Third-party connector warning", time: "5 hours ago", status: "Warning" },
];

function statusClasses(status) {
  if (status === "Active") {
    return "border border-emerald-500/20 bg-emerald-500/10 text-emerald-500";
  }
  if (status === "Syncing") {
    return "border border-blue-500/20 bg-blue-500/10 text-blue-500";
  }
  if (status === "Error") {
    return "border border-rose-500/20 bg-rose-500/10 text-rose-500";
  }
  return "border border-slate-500/20 bg-slate-500/10 text-slate-400";
}

export default function WorkspaceDetail() {
  const navigate = useNavigate();
  const { workspaceId } = useParams();

  const workspace = useMemo(
    () => workspaces.find((item) => item.id === workspaceId) || workspaces[0],
    [workspaceId]
  );

  return (
    <AppShell>
      <div className="space-y-8">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <button
              onClick={() => navigate("/workspaces")}
              className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-blue-600"
            >
              <ArrowLeft size={16} />
              Back to Workspaces
            </button>

            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">
                  {workspace.name}
                </h1>
                <span
                  className={`inline-flex rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] ${statusClasses(
                    workspace.status
                  )}`}
                >
                  {workspace.status}
                </span>
              </div>

              <p className="mt-3 max-w-3xl text-base text-slate-500 dark:text-slate-400">
                {workspace.description}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => navigate(`/workspaces/edit/${workspace.id}`)}
              className="auth-outline-btn flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold"
            >
              <Pencil size={16} />
              Edit Workspace
            </button>

            <button className="flex items-center gap-2 rounded-xl bg-rose-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-rose-600">
              <Trash2 size={16} />
              Delete
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
          <div className="metric-card app-panel-glow">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">
              Team Members
            </p>
            <p className="mt-3 text-4xl font-black tracking-tight text-slate-900 dark:text-white">
              {workspace.members}
            </p>
          </div>

          <div className="metric-card app-panel-glow">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">
              Active Projects
            </p>
            <p className="mt-3 text-4xl font-black tracking-tight text-slate-900 dark:text-white">
              {workspace.activeProjects}
            </p>
          </div>

          <div className="metric-card app-panel-glow">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">
              Security Score
            </p>
            <p className="mt-3 text-4xl font-black tracking-tight text-slate-900 dark:text-white">
              {workspace.securityScore}%
            </p>
          </div>

          <div className="metric-card app-panel-glow">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">
              My Role
            </p>
            <p className="mt-3 text-2xl font-black tracking-tight text-slate-900 dark:text-white">
              {workspace.role}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
          <div className="space-y-6">
            <div className="app-panel p-6">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-black text-slate-900 dark:text-white">
                  Workspace Overview
                </h2>

                <button className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-blue-600 dark:hover:bg-white/[0.04]">
                  <MoreHorizontal size={18} />
                </button>
              </div>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 p-5 dark:border-white/10">
                  <p className="text-[11px] font-black uppercase tracking-[0.14em] text-slate-400">
                    Owner
                  </p>
                  <p className="mt-3 text-lg font-bold text-slate-900 dark:text-white">
                    {workspace.owner}
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 p-5 dark:border-white/10">
                  <p className="text-[11px] font-black uppercase tracking-[0.14em] text-slate-400">
                    Workspace ID
                  </p>
                  <p className="mt-3 text-lg font-bold text-slate-900 dark:text-white">
                    {workspace.id}
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 p-5 dark:border-white/10">
                  <p className="text-[11px] font-black uppercase tracking-[0.14em] text-slate-400">
                    Region
                  </p>
                  <p className="mt-3 text-lg font-bold text-slate-900 dark:text-white">
                    {workspace.region}
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 p-5 dark:border-white/10">
                  <p className="text-[11px] font-black uppercase tracking-[0.14em] text-slate-400">
                    Timezone
                  </p>
                  <p className="mt-3 text-lg font-bold text-slate-900 dark:text-white">
                    {workspace.timezone}
                  </p>
                </div>
              </div>
            </div>

            <div className="app-panel overflow-hidden">
              <div className="border-b border-slate-200 px-6 py-5 dark:border-white/10">
                <h2 className="text-xl font-black text-slate-900 dark:text-white">
                  Workspace Activity
                </h2>
              </div>

              <div className="divide-y divide-slate-200 dark:divide-white/10">
                {recentEvents.map((event) => (
                  <div key={event.title} className="px-6 py-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <div
                          className={`mt-1 flex h-9 w-9 items-center justify-center rounded-xl ${
                            event.status === "Success"
                              ? "bg-emerald-500/10 text-emerald-500"
                              : event.status === "Warning"
                              ? "bg-amber-500/10 text-amber-500"
                              : "bg-blue-500/10 text-blue-500"
                          }`}
                        >
                          {event.status === "Success" ? (
                            <CheckCircle2 size={16} />
                          ) : event.status === "Warning" ? (
                            <AlertTriangle size={16} />
                          ) : (
                            <Clock3 size={16} />
                          )}
                        </div>

                        <div>
                          <p className="text-sm font-bold text-slate-900 dark:text-white">
                            {event.title}
                          </p>
                          <p className="mt-1 text-xs text-slate-500">{event.time}</p>
                        </div>
                      </div>

                      <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400">
                        {event.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="app-panel p-6">
              <div className="mb-4 flex items-center gap-3">
                <Users className="text-blue-500" size={18} />
                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                  Collaboration
                </h3>
              </div>

              <div className="space-y-4">
                <div className="rounded-xl bg-slate-50 p-4 dark:bg-white/[0.03]">
                  <p className="text-sm font-bold text-slate-900 dark:text-white">
                    Assigned Role
                  </p>
                  <p className="mt-1 text-xs text-slate-500">{workspace.role}</p>
                </div>

                <div className="rounded-xl bg-slate-50 p-4 dark:bg-white/[0.03]">
                  <p className="text-sm font-bold text-slate-900 dark:text-white">
                    Team Scale
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    {workspace.members} active collaborators
                  </p>
                </div>
              </div>
            </div>

            <div className="app-panel p-6">
              <div className="mb-4 flex items-center gap-3">
                <ShieldCheck className="text-emerald-500" size={18} />
                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                  Compliance
                </h3>
              </div>

              <div className="h-3 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-white/10">
                <div
                  className={`h-full rounded-full ${
                    workspace.securityScore >= 90
                      ? "bg-emerald-500"
                      : workspace.securityScore >= 75
                      ? "bg-amber-500"
                      : "bg-rose-500"
                  }`}
                  style={{ width: `${workspace.securityScore}%` }}
                />
              </div>

              <p className="mt-3 text-sm font-bold text-slate-900 dark:text-white">
                {workspace.securityScore}% security posture
              </p>
            </div>

            <div className="app-panel p-6">
              <div className="mb-4 flex items-center gap-3">
                <Activity className="text-blue-500" size={18} />
                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                  Quick Actions
                </h3>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => navigate(`/workspaces/edit/${workspace.id}`)}
                  className="blue-gradient-btn w-full rounded-xl px-4 py-3 text-sm font-bold text-white"
                >
                  Open Edit Workspace
                </button>
                <button className="auth-outline-btn w-full rounded-xl px-4 py-3 text-sm font-semibold">
                  Manage Members
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}