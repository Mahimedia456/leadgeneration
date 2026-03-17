import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import ThemeToggle from "../../components/common/ThemeToggle";
import logo from "../../assets/logo.png";
import {
  Search,
  BriefcaseBusiness,
  ArrowRight,
  Plus,
  BookOpen,
  Facebook,
  Instagram,
} from "lucide-react";
import {
  getMyWorkspacesApi,
  getStoredUser,
  setSelectedWorkspace,
} from "../../lib/api";

export default function WorkspaceSelection() {
  const navigate = useNavigate();
  const user = getStoredUser();

  const [query, setQuery] = useState("");
  const [workspaces, setWorkspaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadWorkspaces() {
      setLoading(true);
      setError("");

      try {
        const data = await getMyWorkspacesApi();
        setWorkspaces(data.workspaces || []);
      } catch (err) {
        setError(err.message || "Failed to load workspaces");
      } finally {
        setLoading(false);
      }
    }

    loadWorkspaces();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return workspaces;

    return workspaces.filter(
      (item) =>
        item.name?.toLowerCase().includes(q) ||
        item.metaBusinessName?.toLowerCase().includes(q)
    );
  }, [query, workspaces]);

  const initials = (user?.fullName || user?.email || "User")
    .split(" ")
    .map((item) => item[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const enterWorkspace = (workspace) => {
    setSelectedWorkspace(workspace);
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen auth-centered-bg text-slate-900 transition-colors duration-200 dark:text-slate-100">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute left-[-8%] top-[-8%] h-[28rem] w-[28rem] rounded-full bg-primary/10 blur-[120px] dark:bg-primary/20" />
        <div className="absolute bottom-[-10%] right-[-8%] h-[26rem] w-[26rem] rounded-full bg-sky-400/10 blur-[140px] dark:bg-sky-500/10" />
      </div>

      <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden">
        <header className="sticky top-0 z-50 flex items-center justify-between border-b border-slate-200 bg-white/70 px-6 py-4 backdrop-blur-xl dark:border-white/10 dark:bg-[#0f1117]/70 md:px-10">
          <div className="flex items-center gap-3">
            <div className="sidebar-brand-logo-wrap sidebar-brand-logo-wrap-dark">
              <img
                src={logo}
                alt="Mahimedia Solutions"
                className="sidebar-brand-logo-img h-8 w-8 object-contain"
              />
            </div>
            <h2 className="hidden text-lg font-bold leading-tight tracking-tight text-slate-900 dark:text-white sm:block">
              Mahimedia Solutions
            </h2>
          </div>

          <div className="flex flex-1 items-center justify-end gap-4">
            <ThemeToggle />

            <div className="flex items-center gap-3 border-l border-slate-200 pl-4 dark:border-white/10">
              <div className="hidden md:flex flex-col items-end">
                <span className="text-sm font-semibold">
                  {user?.fullName || "User"}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {user?.globalRole === "admin" ? "Admin" : "Workspace User"}
                </span>
              </div>
              <div className="rounded-full border border-primary/20 bg-primary/10 p-0.5 dark:bg-primary/20">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white font-semibold text-primary dark:bg-slate-800">
                  {initials}
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 px-6 py-12">
          <div className="mx-auto flex w-full max-w-7xl flex-col gap-10">
            <div className="text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
                Meta Workspace Access
              </p>
              <h1 className="mt-3 text-4xl font-black leading-tight tracking-tight text-slate-900 dark:text-white md:text-5xl">
                Select Workspace
              </h1>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-500 dark:text-slate-400">
                Choose the connected Meta business workspace you want to manage
                and continue into your dashboard.
              </p>
            </div>

            <div className="mx-auto w-full max-w-2xl">
              <div className="group relative">
                <Search
                  size={18}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="text"
                  placeholder="Search by workspace name or Meta business..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="auth-minimal-input block w-full rounded-2xl py-4 pl-12 pr-4 text-slate-900 placeholder:text-slate-400 dark:text-white dark:placeholder:text-slate-500"
                />
              </div>
            </div>

            {loading ? (
              <div className="rounded-3xl border border-slate-200 bg-white/60 p-10 text-center text-slate-500 dark:border-white/10 dark:bg-white/5 dark:text-slate-400">
                Loading workspaces...
              </div>
            ) : error ? (
              <div className="rounded-3xl border border-red-200 bg-red-50 p-10 text-center text-red-600 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300">
                {error}
              </div>
            ) : filtered.length === 0 ? (
              <div className="rounded-3xl border border-slate-200 bg-white/60 p-10 text-center text-slate-500 dark:border-white/10 dark:bg-white/5 dark:text-slate-400">
                No workspaces found.
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
                {filtered.map((workspace) => (
                  <div
                    key={workspace.id}
                    className="workspace-card workspace-soft-glow group flex flex-col rounded-[1.75rem] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/30"
                  >
                    <div className="mb-6 flex items-start justify-between">
                      <div className="sidebar-brand-logo-wrap sidebar-brand-logo-wrap-dark h-14 w-14 rounded-2xl">
                        <img
                          src={logo}
                          alt={workspace.name}
                          className="sidebar-brand-logo-img h-8 w-8 object-contain"
                        />
                      </div>

                      <span className="rounded-full bg-emerald-100 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
                        {workspace.status}
                      </span>
                    </div>

                    <div className="mb-5">
                      <h3 className="mb-1 text-xl font-bold text-slate-900 dark:text-white">
                        {workspace.name}
                      </h3>
                      <p className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400">
                        <BriefcaseBusiness size={16} />
                        {workspace.metaBusinessName || "Meta Business Workspace"}
                      </p>
                      <p className="mt-3 text-xs italic text-slate-400 dark:text-slate-500">
                        Role: {workspace.memberRole || "workspace_editor"}
                      </p>
                    </div>

                    <div className="mb-6 grid grid-cols-2 gap-3 text-xs">
                      <div className="app-panel-soft p-3">
                        <p className="text-slate-400">Industry</p>
                        <p className="mt-1 font-bold text-slate-900 dark:text-white">
                          {workspace.industry || "-"}
                        </p>
                      </div>
                      <div className="app-panel-soft p-3">
                        <p className="text-slate-400">Region</p>
                        <p className="mt-1 font-bold text-slate-900 dark:text-white">
                          {workspace.region || "-"}
                        </p>
                      </div>
                    </div>

                    <div className="mb-6 flex items-center gap-2 text-slate-500 dark:text-slate-400">
                      <Facebook size={16} />
                      <Instagram size={16} />
                      <span className="text-xs">Connected channels</span>
                    </div>

                    <button
                      onClick={() => enterWorkspace(workspace)}
                      className="blue-gradient-btn mt-auto flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-3 font-bold text-white"
                    >
                      Enter Workspace
                      <ArrowRight size={16} />
                    </button>
                  </div>
                ))}

                {user?.globalRole === "admin" && (
                  <button
                    type="button"
                    onClick={() => navigate("/workspaces/create")}
                    className="workspace-card workspace-soft-glow group flex min-h-[320px] cursor-pointer flex-col items-center justify-center gap-4 rounded-[1.75rem] border-2 border-dashed p-6 text-left transition-all hover:border-primary/40 hover:bg-primary/5"
                  >
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-400 transition-colors group-hover:text-primary dark:bg-white/5">
                      <Plus size={24} />
                    </div>
                    <div className="text-center">
                      <h3 className="font-bold text-slate-900 dark:text-white">
                        Create New Workspace
                      </h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        Add a new Meta business profile
                      </p>
                    </div>
                  </button>
                )}
              </div>
            )}

            <div className="mt-4 flex flex-col items-center gap-6">
              <div className="flex flex-wrap justify-center gap-4">
                <button
                  type="button"
                  onClick={() => navigate("/settings")}
                  className="auth-outline-btn flex items-center gap-2 rounded-2xl px-6 py-3 font-semibold"
                >
                  Platform Settings
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/reports")}
                  className="auth-outline-btn flex items-center gap-2 rounded-2xl px-6 py-3 font-semibold"
                >
                  <BookOpen size={18} />
                  Documentation
                </button>
              </div>

              <p className="text-xs text-slate-400 dark:text-slate-500">
                © 2025 Mahimedia Solutions. All rights reserved.
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}