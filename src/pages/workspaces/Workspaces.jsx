import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppShell from "../../layouts/AppShell";
import {
  Search,
  PlusCircle,
  MoreHorizontal,
  ArrowRight,
  Filter,
} from "lucide-react";
import {
  getAllWorkspacesApi,
  getStoredUser,
  setSelectedWorkspace,
} from "../../lib/api";

function badgeClasses(status) {
  if (status === "active") {
    return "border border-emerald-500/20 bg-emerald-500/10 text-emerald-500";
  }
  if (status === "inactive") {
    return "border border-slate-500/20 bg-slate-500/10 text-slate-400";
  }
  return "border border-blue-500/20 bg-blue-500/10 text-blue-500";
}

export default function Workspaces() {
  const navigate = useNavigate();

  const [user] = useState(() => getStoredUser());
  const [query, setQuery] = useState("");
  const [workspaces, setWorkspaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    async function loadWorkspaces() {
      if (!user || user.globalRole !== "admin") {
        navigate("/access-denied", { replace: true });
        return;
      }

      setLoading(true);
      setError("");

      try {
        const data = await getAllWorkspacesApi();

        if (!ignore) {
          setWorkspaces(data.workspaces || []);
        }
      } catch (err) {
        if (ignore) return;

        if (err.statusCode === 403) {
          navigate("/access-denied", { replace: true });
          return;
        }

        setError(err.message || "Failed to load workspaces");
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadWorkspaces();

    return () => {
      ignore = true;
    };
  }, [navigate, user?.globalRole]);

  const filteredWorkspaces = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return workspaces;

    return workspaces.filter(
      (item) =>
        item.name?.toLowerCase().includes(q) ||
        item.metaBusinessName?.toLowerCase().includes(q) ||
        item.industry?.toLowerCase().includes(q) ||
        item.status?.toLowerCase().includes(q)
    );
  }, [query, workspaces]);

  const summaryStats = useMemo(() => {
    const total = workspaces.length;
    const active = workspaces.filter((item) => item.status === "active").length;
    const inactive = workspaces.filter((item) => item.status === "inactive").length;

    return [
      { title: "Total Workspaces", value: String(total) },
      { title: "Active", value: String(active) },
      { title: "Inactive", value: String(inactive) },
      { title: "Admin Scope", value: "All" },
    ];
  }, [workspaces]);

  return (
    <AppShell>
      <div className="space-y-10">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white md:text-5xl">
              Workspaces
            </h1>
            <p className="mt-3 max-w-2xl text-lg text-slate-500 dark:text-slate-400">
              Central management hub for global brand assets and collaborative
              environments.
            </p>
          </div>

          <button
            onClick={() => navigate("/workspaces/create")}
            className="blue-gradient-btn flex items-center gap-2 rounded-2xl px-8 py-4 text-base font-bold text-white shadow-xl"
          >
            <PlusCircle size={18} />
            Create New Workspace
          </button>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {summaryStats.map((item) => (
            <div
              key={item.title}
              className="app-panel rounded-[1.5rem] border-l-4 border-l-blue-600 p-6"
            >
              <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">
                {item.title}
              </p>
              <div className="mt-4 flex items-end gap-2">
                <span className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">
                  {item.value}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-4 xl:flex-row">
          <div className="relative flex-1">
            <Search
              size={18}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              placeholder="Search by name, industry or status..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="auth-minimal-input w-full rounded-2xl py-4 pl-12 pr-4 text-sm"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <button className="blue-gradient-btn rounded-2xl px-6 py-3 text-sm font-bold text-white">
              All
            </button>
            <button className="auth-outline-btn flex items-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold">
              Status
              <Filter size={15} />
            </button>
          </div>
        </div>

        {loading ? (
          <div className="app-panel rounded-3xl p-10 text-center text-slate-500 dark:text-slate-400">
            Loading workspaces...
          </div>
        ) : error ? (
          <div className="rounded-3xl border border-red-200 bg-red-50 p-10 text-center text-red-600 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300">
            {error}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredWorkspaces.map((workspace) => (
              <div
                key={workspace.id}
                className="app-panel overflow-hidden rounded-[1.75rem]"
              >
                <div className="relative h-24 border-b border-slate-200/10 bg-gradient-to-r from-blue-600/20 to-transparent p-6 dark:border-white/10">
                  <div
                    className="absolute -bottom-8 left-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-slate-200 bg-white text-lg font-black text-slate-900 shadow-xl dark:border-white/10 dark:bg-[#111318] dark:text-white"
                    style={{ backgroundColor: workspace.brandColor || undefined }}
                  >
                    {workspace.name?.slice(0, 2).toUpperCase()}
                  </div>

                  <span
                    className={`ml-auto inline-flex rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] ${badgeClasses(
                      workspace.status
                    )}`}
                  >
                    {workspace.status}
                  </span>
                </div>

                <div className="px-6 pb-6 pt-12">
                  <div className="mb-5 flex items-start justify-between gap-4">
                    <div>
                      <button
                        onClick={() => navigate(`/workspaces/${workspace.id}`)}
                        className="text-left text-2xl font-black tracking-tight text-slate-900 transition hover:text-blue-600 dark:text-white"
                      >
                        {workspace.name}
                      </button>
                      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        {workspace.metaBusinessName || workspace.industry || "-"}
                      </p>
                    </div>

                    <button className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-blue-600 dark:hover:bg-white/[0.04]">
                      <MoreHorizontal size={18} />
                    </button>
                  </div>

                  <div className="mb-6 grid grid-cols-2 gap-3">
                    <div className="rounded-2xl border border-slate-200/60 bg-slate-50/40 p-4 dark:border-white/10 dark:bg-white/[0.02]">
                      <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">
                        Region
                      </p>
                      <p className="mt-2 text-sm font-bold text-slate-900 dark:text-white">
                        {workspace.region || "-"}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-slate-200/60 bg-slate-50/40 p-4 dark:border-white/10 dark:bg-white/[0.02]">
                      <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">
                        Timezone
                      </p>
                      <p className="mt-2 text-sm font-bold text-slate-900 dark:text-white">
                        {workspace.timezone || "-"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <div className="text-sm font-bold text-slate-500 dark:text-slate-400">
                      {workspace.primaryContactEmail || "-"}
                    </div>

                    <button
                      onClick={() => {
                        setSelectedWorkspace(workspace);
                        navigate(`/workspaces/${workspace.id}`);
                      }}
                      className="flex items-center gap-1 text-sm font-black text-blue-600 transition hover:translate-x-1 dark:text-blue-400"
                    >
                      Enter Workspace
                      <ArrowRight size={15} />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            <button
              onClick={() => navigate("/workspaces/create")}
              className="flex min-h-[360px] flex-col items-center justify-center rounded-[1.75rem] border-2 border-dashed border-blue-500/30 bg-transparent p-8 transition hover:border-blue-500/60 hover:bg-blue-500/[0.03]"
            >
              <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full border border-blue-500/20 bg-slate-100 text-blue-600 dark:bg-white/[0.03] dark:text-blue-400">
                <PlusCircle size={28} />
              </div>
              <p className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                Create New Workspace
              </p>
              <p className="mt-3 max-w-[220px] text-center text-base text-slate-500 dark:text-slate-400">
                Launch a new collaborative environment for your brand.
              </p>
            </button>
          </div>
        )}
      </div>
    </AppShell>
  );
}
