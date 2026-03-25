import { useEffect, useMemo, useState } from "react";
import AppShell from "../../layouts/AppShell";
import { Download, FileSpreadsheet, RefreshCcw, Users } from "lucide-react";
import { getSelectedWorkspace } from "../../lib/api";
import { exportMetaLeadsApi, getMetaLeadsApi } from "../../lib/metaApi";

function normalizeLead(row) {
  return {
    id: row.id,
    fullName: row.full_name || "Unnamed Lead",
    email: row.email || "",
    phone: row.phone || "",
    createdTime: row.created_time || row.created_at || "",
  };
}

export default function LeadExport() {
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState("");
  const [leads, setLeads] = useState([]);

  async function loadData() {
    try {
      setLoading(true);
      setError("");

      const selectedWorkspace = getSelectedWorkspace();
      const workspaceId =
        selectedWorkspace?.id || selectedWorkspace?.workspace_id || "";

      if (!workspaceId) {
        throw new Error("No workspace selected.");
      }

      const data = await getMetaLeadsApi(workspaceId);
      setLeads((Array.isArray(data) ? data : []).map(normalizeLead));
    } catch (err) {
      setError(err.message || "Failed to load leads for export.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const stats = useMemo(() => {
    return {
      total: leads.length,
      emails: leads.filter((lead) => lead.email).length,
      phones: leads.filter((lead) => lead.phone).length,
    };
  }, [leads]);

  async function handleExportCsv() {
    try {
      setExporting(true);

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
      a.download = "meta-leads-export.csv";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      window.alert(err.message || "Failed to export CSV.");
    } finally {
      setExporting(false);
    }
  }

  return (
    <AppShell>
      <div className="space-y-8">
        <div className="flex flex-col justify-between gap-5 xl:flex-row xl:items-end">
          <div>
            <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">
              Lead Export
            </h1>
            <p className="mt-2 text-base text-slate-500 dark:text-slate-400">
              Export synced Meta leads to CSV for CRM import, reporting, or backup.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={loadData}
              className="auth-outline-btn flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold"
            >
              <RefreshCcw size={16} />
              Refresh
            </button>

            <button
              onClick={handleExportCsv}
              disabled={exporting || !leads.length}
              className="blue-gradient-btn flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-white disabled:opacity-60"
            >
              <Download size={16} />
              {exporting ? "Exporting..." : "Download CSV"}
            </button>
          </div>
        </div>

        {error ? (
          <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 px-5 py-4 text-sm text-rose-500">
            {error}
          </div>
        ) : null}

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          <div className="metric-card app-panel-glow">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-500">
              <Users size={20} />
            </div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">Total Leads</p>
            <p className="mt-3 text-4xl font-black tracking-tight text-slate-900 dark:text-white">{stats.total}</p>
          </div>

          <div className="metric-card app-panel-glow">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-500">
              <FileSpreadsheet size={20} />
            </div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">Emails Available</p>
            <p className="mt-3 text-4xl font-black tracking-tight text-slate-900 dark:text-white">{stats.emails}</p>
          </div>

          <div className="metric-card app-panel-glow">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-500">
              <Download size={20} />
            </div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">Phones Available</p>
            <p className="mt-3 text-4xl font-black tracking-tight text-slate-900 dark:text-white">{stats.phones}</p>
          </div>
        </div>

        <div className="app-panel overflow-hidden rounded-[2rem] p-8">
          {loading ? (
            <div className="text-sm text-slate-500 dark:text-slate-400">
              Loading export preview...
            </div>
          ) : !leads.length ? (
            <div className="text-sm text-slate-500 dark:text-slate-400">
              No synced leads available for export.
            </div>
          ) : (
            <>
              <div className="mb-6">
                <h3 className="text-xl font-black text-slate-900 dark:text-white">
                  Export Preview
                </h3>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  The CSV export will include lead name, email, phone, and created time.
                </p>
              </div>

              <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-white/10">
                <table className="w-full min-w-[760px] text-left">
                  <thead className="bg-slate-50/80 dark:bg-white/[0.03]">
                    <tr>
                      <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">
                        Name
                      </th>
                      <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">
                        Email
                      </th>
                      <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">
                        Phone
                      </th>
                      <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">
                        Created Time
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-200 dark:divide-white/10">
                    {leads.slice(0, 10).map((lead) => (
                      <tr key={lead.id} className="transition hover:bg-slate-50 dark:hover:bg-white/[0.03]">
                        <td className="px-6 py-4 text-sm font-bold text-slate-900 dark:text-white">
                          {lead.fullName}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-700 dark:text-slate-200">
                          {lead.email || "--"}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-700 dark:text-slate-200">
                          {lead.phone || "--"}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-700 dark:text-slate-200">
                          {lead.createdTime || "--"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {leads.length > 10 ? (
                <p className="mt-4 text-xs text-slate-500 dark:text-slate-400">
                  Showing first 10 rows of {leads.length} total leads.
                </p>
              ) : null}
            </>
          )}
        </div>
      </div>
    </AppShell>
  );
}