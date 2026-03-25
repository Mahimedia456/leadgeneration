import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppShell from "../../layouts/AppShell";
import {
  Search,
  RefreshCcw,
  Download,
  Eye,
  Filter,
  Users,
  Mail,
  Phone,
  BadgeCheck,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { getSelectedWorkspace } from "../../lib/api";
import {
  exportMetaLeadsApi,
  getMetaConnectionsApi,
  getMetaLeadsApi,
  syncMetaLeadsApi,
} from "../../lib/metaApi";

function formatDate(value) {
  if (!value) return "--";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleString();
}

function normalizeLead(row) {
  const payload = row.payload || {};

  return {
    id: row.id,
    metaLeadId: row.meta_lead_id || "",
    metaFormId: row.meta_form_id || "",
    fullName: row.full_name || "Unnamed Lead",
    email: row.email || "",
    phone: row.phone || "",
    createdTime: row.created_time || row.created_at || "",
    source: "Meta Lead Ads",
    formName: row.meta_form_id || "Lead Form",
    payload,
  };
}

export default function Leads() {
  const navigate = useNavigate();

  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState("");
  const [leads, setLeads] = useState([]);
  const [connections, setConnections] = useState([]);

  async function loadLeads() {
    try {
      setLoading(true);
      setError("");

      const selectedWorkspace = getSelectedWorkspace();
      const workspaceId =
        selectedWorkspace?.id || selectedWorkspace?.workspace_id || "";

      if (!workspaceId) {
        throw new Error("No workspace selected.");
      }

      const [leadsRes, connectionsRes] = await Promise.all([
        getMetaLeadsApi(workspaceId),
        getMetaConnectionsApi(),
      ]);

      setLeads((Array.isArray(leadsRes) ? leadsRes : []).map(normalizeLead));
      setConnections(connectionsRes?.items || []);
    } catch (err) {
      setError(err.message || "Failed to load leads.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadLeads();
  }, []);

  const filteredLeads = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return leads;

    return leads.filter((item) => {
      const haystack = [
        item.fullName,
        item.email,
        item.phone,
        item.metaLeadId,
        item.metaFormId,
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(q);
    });
  }, [leads, query]);

  const stats = useMemo(() => {
    return {
      total: leads.length,
      withEmail: leads.filter((l) => l.email).length,
      withPhone: leads.filter((l) => l.phone).length,
      today: leads.filter((l) => {
        if (!l.createdTime) return false;
        const d = new Date(l.createdTime);
        const now = new Date();
        return d.toDateString() === now.toDateString();
      }).length,
    };
  }, [leads]);

  async function handleSyncLeads() {
    try {
      setSyncing(true);

      if (!connections.length) {
        throw new Error("No Meta connection found.");
      }

      const optionsText = connections
        .map((item, index) => `${index + 1}. ${item.business_name || item.meta_user_name || item.id}`)
        .join("\n");

      const choice = window.prompt(
        `Select Meta connection number to sync leads:\n\n${optionsText}`
      );

      if (!choice) return;

      const selected = connections[Number(choice) - 1];
      if (!selected?.id) {
        throw new Error("Invalid connection selection.");
      }

      const result = await syncMetaLeadsApi(selected.id);
      window.alert(result?.message || `Leads synced. Inserted: ${result?.inserted || 0}`);

      await loadLeads();
    } catch (err) {
      window.alert(err.message || "Failed to sync leads.");
    } finally {
      setSyncing(false);
    }
  }

  async function handleExport() {
    try {
      const selectedWorkspace = getSelectedWorkspace();
      const workspaceId =
        selectedWorkspace?.id || selectedWorkspace?.workspace_id || "";

      if (!workspaceId) {
        throw new Error("No workspace selected.");
      }

      const csvText = await exportMetaLeadsApi(workspaceId);
      const blob = new Blob([csvText], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "meta-leads.csv";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      window.alert(err.message || "Failed to export leads.");
    }
  }

  return (
    <AppShell>
      <div className="space-y-8">
        <div className="flex flex-col justify-between gap-5 xl:flex-row xl:items-end">
          <div>
            <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">
              Leads
            </h1>
            <p className="mt-2 text-base text-slate-500 dark:text-slate-400">
              Manage Meta lead form submissions synced from Facebook and Instagram lead ads.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleExport}
              className="auth-outline-btn flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold"
            >
              <Download size={16} />
              Export CSV
            </button>

            <button
              onClick={handleSyncLeads}
              disabled={syncing}
              className="blue-gradient-btn flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-white disabled:opacity-60"
            >
              <RefreshCcw size={16} className={syncing ? "animate-spin" : ""} />
              {syncing ? "Syncing..." : "Sync Meta Leads"}
            </button>
          </div>
        </div>

        {error ? (
          <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 px-5 py-4 text-sm text-rose-500">
            {error}
          </div>
        ) : null}

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
          <div className="metric-card app-panel-glow">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-500">
              <Users size={20} />
            </div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">Total Leads</p>
            <p className="mt-3 text-4xl font-black tracking-tight text-slate-900 dark:text-white">{stats.total}</p>
          </div>

          <div className="metric-card app-panel-glow">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-500">
              <Mail size={20} />
            </div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">With Email</p>
            <p className="mt-3 text-4xl font-black tracking-tight text-slate-900 dark:text-white">{stats.withEmail}</p>
          </div>

          <div className="metric-card app-panel-glow">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-500">
              <Phone size={20} />
            </div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">With Phone</p>
            <p className="mt-3 text-4xl font-black tracking-tight text-slate-900 dark:text-white">{stats.withPhone}</p>
          </div>

          <div className="metric-card app-panel-glow">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-500">
              <BadgeCheck size={20} />
            </div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">Today</p>
            <p className="mt-3 text-4xl font-black tracking-tight text-slate-900 dark:text-white">{stats.today}</p>
          </div>
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
                  placeholder="Search by name, email, phone, form ID..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="auth-minimal-input w-full rounded-xl py-3 pl-11 pr-4 text-sm"
                />
              </div>

              <button className="auth-outline-btn flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold">
                <Filter size={16} />
                Filter
              </button>
            </div>
          </div>

          {loading ? (
            <div className="px-8 py-12 text-sm text-slate-500 dark:text-slate-400">
              Loading leads...
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[1080px] text-left">
                  <thead className="bg-slate-50/80 dark:bg-white/[0.03]">
                    <tr>
                      <th className="px-8 py-5 text-[11px] font-black uppercase tracking-[0.14em] text-slate-400">
                        Lead
                      </th>
                      <th className="px-8 py-5 text-[11px] font-black uppercase tracking-[0.14em] text-slate-400">
                        Email
                      </th>
                      <th className="px-8 py-5 text-[11px] font-black uppercase tracking-[0.14em] text-slate-400">
                        Phone
                      </th>
                      <th className="px-8 py-5 text-[11px] font-black uppercase tracking-[0.14em] text-slate-400">
                        Form
                      </th>
                      <th className="px-8 py-5 text-[11px] font-black uppercase tracking-[0.14em] text-slate-400">
                        Created
                      </th>
                      <th className="px-8 py-5 text-right text-[11px] font-black uppercase tracking-[0.14em] text-slate-400">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-200 dark:divide-white/10">
                    {filteredLeads.map((lead) => (
                      <tr
                        key={lead.id}
                        className="transition hover:bg-slate-50 dark:hover:bg-white/[0.03]"
                      >
                        <td className="px-8 py-6">
                          <div>
                            <p className="text-sm font-black text-slate-900 dark:text-white">
                              {lead.fullName}
                            </p>
                            <p className="mt-1 text-xs text-slate-500">
                              Meta Lead ID: {lead.metaLeadId || "--"}
                            </p>
                          </div>
                        </td>

                        <td className="px-8 py-6 text-sm font-semibold text-slate-700 dark:text-slate-200">
                          {lead.email || "--"}
                        </td>

                        <td className="px-8 py-6 text-sm font-semibold text-slate-700 dark:text-slate-200">
                          {lead.phone || "--"}
                        </td>

                        <td className="px-8 py-6 text-sm font-semibold text-slate-700 dark:text-slate-200">
                          {lead.formName}
                        </td>

                        <td className="px-8 py-6 text-sm font-semibold text-slate-700 dark:text-slate-200">
                          {formatDate(lead.createdTime)}
                        </td>

                        <td className="px-8 py-6 text-right">
                          <button
                            onClick={() => navigate(`/leads/${lead.id}`)}
                            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-700 transition hover:border-blue-500 hover:text-blue-600 dark:border-white/10 dark:text-slate-300 dark:hover:border-blue-400 dark:hover:text-blue-400"
                          >
                            <Eye size={14} />
                            View
                          </button>
                        </td>
                      </tr>
                    ))}

                    {!filteredLeads.length && (
                      <tr>
                        <td
                          colSpan={6}
                          className="px-8 py-10 text-center text-sm text-slate-500 dark:text-slate-400"
                        >
                          No leads found. Sync Meta leads first.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="flex flex-col gap-4 border-t border-slate-200 px-8 py-5 text-sm dark:border-white/10 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-slate-500 dark:text-slate-400">
                  Showing{" "}
                  <span className="font-bold text-slate-900 dark:text-white">
                    {filteredLeads.length}
                  </span>{" "}
                  leads
                </p>

                <div className="flex items-center gap-2">
                  <button className="auth-outline-btn flex h-9 w-9 items-center justify-center rounded-lg opacity-50">
                    <ChevronLeft size={16} />
                  </button>
                  <button className="auth-outline-btn flex h-9 w-9 items-center justify-center rounded-lg opacity-50">
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </AppShell>
  );
}