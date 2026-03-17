import { Fragment, useEffect, useMemo, useState } from "react";
import AppShell from "../../layouts/AppShell";
import {
  Plus,
  History,
  AlertTriangle,
  LayoutDashboard,
  Palette,
  UserPlus,
  Download,
  Trash2,
  BadgeDollarSign,
} from "lucide-react";
import {
  getRolesPermissionsApi,
  getStoredUser,
  updateRolePermissionsApi,
} from "../../lib/api";

const defaultColumns = ["admin", "brand_user", "workspace_user"];

const permissionSections = [
  {
    label: "Core Platform Access",
    rows: [
      {
        key: "dashboard_overview",
        title: "Dashboard Overview",
        desc: "Access to analytics and summary widgets",
        icon: LayoutDashboard,
        tone: "slate",
      },
      {
        key: "brand_assets_management",
        title: "Brand Assets Management",
        desc: "Modify logos, colors, and branding materials",
        icon: Palette,
        tone: "slate",
      },
    ],
  },
  {
    label: "Lead Operations",
    rows: [
      {
        key: "lead_generation",
        title: "Lead Generation",
        desc: "Create and import new lead records",
        icon: UserPlus,
        tone: "slate",
      },
      {
        key: "bulk_data_export",
        title: "Bulk Data Export",
        desc: "Download sensitive lead data to CSV/XLSX",
        icon: Download,
        tone: "amber",
      },
      {
        key: "lead_deletion",
        title: "Lead Deletion",
        desc: "Permanently remove lead data from CRM",
        icon: Trash2,
        tone: "rose",
      },
    ],
  },
  {
    label: "Financials & Billing",
    rows: [
      {
        key: "revenue_reports",
        title: "Revenue Reports",
        desc: "View detailed financial statements and forecasts",
        icon: BadgeDollarSign,
        tone: "slate",
      },
    ],
  },
];

const defaultRolePermissions = {
  admin: [
    "dashboard_overview",
    "brand_assets_management",
    "lead_generation",
    "bulk_data_export",
    "lead_deletion",
    "revenue_reports",
  ],
  brand_user: [
    "dashboard_overview",
    "brand_assets_management",
    "lead_generation",
    "bulk_data_export",
    "revenue_reports",
  ],
  workspace_user: [
    "dashboard_overview",
    "lead_generation",
  ],
};

function toneClasses(tone) {
  if (tone === "amber") return "bg-amber-500/10 text-amber-500";
  if (tone === "rose") return "bg-rose-500/10 text-rose-500";
  return "bg-slate-200 dark:bg-white/10 text-slate-500 dark:text-slate-400";
}

function normalizeRoleMap(roles = [], columns = defaultColumns) {
  const map = {};

  for (const col of columns) {
    map[col] = [...(defaultRolePermissions[col] || [])];
  }

  for (const item of roles) {
    if (!item?.role) continue;
    map[item.role] = Array.isArray(item.permissions) ? item.permissions : [];
  }

  return map;
}

export default function RolesPermissions() {
  const currentUser = getStoredUser();

  const [columns, setColumns] = useState(defaultColumns);
  const [rolePermissions, setRolePermissions] = useState(
    normalizeRoleMap([], defaultColumns)
  );
  const [initialRolePermissions, setInitialRolePermissions] = useState(
    normalizeRoleMap([], defaultColumns)
  );
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadPermissions() {
      setLoading(true);
      setError("");
      setSuccess("");

      try {
        const res = await getRolesPermissionsApi();
        const roles = Array.isArray(res?.roles) ? res.roles : [];

        const roleNames =
          roles.length > 0
            ? Array.from(new Set(roles.map((item) => item.role).filter(Boolean)))
            : defaultColumns;

        const nextColumns = roleNames.length ? roleNames : defaultColumns;
        const nextMap = normalizeRoleMap(roles, nextColumns);

        if (!cancelled) {
          setColumns(nextColumns);
          setRolePermissions(nextMap);
          setInitialRolePermissions(nextMap);
        }
      } catch (err) {
        if (!cancelled) {
          const fallback = normalizeRoleMap([], defaultColumns);
          setColumns(defaultColumns);
          setRolePermissions(fallback);
          setInitialRolePermissions(fallback);
          setError(err.message || "Failed to load permissions");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadPermissions();

    return () => {
      cancelled = true;
    };
  }, []);

  const hasChanges = useMemo(() => {
    return JSON.stringify(rolePermissions) !== JSON.stringify(initialRolePermissions);
  }, [rolePermissions, initialRolePermissions]);

  const toggleCell = (permissionKey, roleName) => {
    if (currentUser?.globalRole !== "admin") return;

    setRolePermissions((prev) => {
      const existing = Array.isArray(prev[roleName]) ? prev[roleName] : [];
      const hasPermission = existing.includes(permissionKey);

      return {
        ...prev,
        [roleName]: hasPermission
          ? existing.filter((item) => item !== permissionKey)
          : [...existing, permissionKey],
      };
    });
  };

  const handleDiscard = () => {
    setRolePermissions(initialRolePermissions);
    setError("");
    setSuccess("");
  };

  const handleSave = async () => {
    if (currentUser?.globalRole !== "admin") return;

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      await Promise.all(
        columns.map((role) =>
          updateRolePermissionsApi(role, rolePermissions[role] || [])
        )
      );

      setInitialRolePermissions(rolePermissions);
      setSuccess("Permission matrix saved successfully.");
    } catch (err) {
      setError(err.message || "Failed to save permissions");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AppShell>
      <div className="space-y-8">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">
              Roles & Permissions
            </h1>
            <p className="mt-2 max-w-3xl text-base text-slate-500 dark:text-slate-400">
              Define granular permission levels across your organization modules.
              Changes apply to all assigned users.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              className="auth-outline-btn flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold"
            >
              <History size={16} />
              Audit Logs
            </button>

            {currentUser?.globalRole === "admin" && (
              <button
                type="button"
                className="blue-gradient-btn flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-white"
              >
                <Plus size={16} />
                Create New Role
              </button>
            )}
          </div>
        </div>

        <div className="rounded-[1.5rem] border border-amber-500/20 bg-amber-500/5 p-5">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-500">
                <AlertTriangle size={20} />
              </div>

              <div>
                <p className="text-sm font-bold text-amber-600 dark:text-amber-400">
                  Sensitive Permissions Warning
                </p>
                <p className="mt-1 text-xs text-amber-700/80 dark:text-amber-500/80">
                  Granting Delete or Data Export permissions to non-admin roles may
                  compromise data security protocols and compliance.
                </p>
              </div>
            </div>

            <button
              type="button"
              className="text-[11px] font-black uppercase tracking-[0.18em] text-amber-600 dark:text-amber-400"
            >
              Review Security Policy
            </button>
          </div>
        </div>

        {error ? (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300">
            {error}
          </div>
        ) : null}

        {success ? (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-600 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300">
            {success}
          </div>
        ) : null}

        {loading ? (
          <div className="app-panel rounded-[2rem] p-8 text-center text-slate-500">
            Loading permission matrix...
          </div>
        ) : (
          <div className="app-panel overflow-hidden rounded-[2rem]">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[980px] text-left">
                <thead className="bg-slate-50/80 dark:bg-white/[0.03]">
                  <tr>
                    <th className="px-8 py-6 text-[11px] font-black uppercase tracking-[0.16em] text-slate-400">
                      Module / Permission Type
                    </th>

                    {columns.map((col) => (
                      <th
                        key={col}
                        className="px-6 py-6 text-center text-[11px] font-black uppercase tracking-[0.16em] text-slate-400"
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-200 dark:divide-white/10">
                  {permissionSections.map((section) => (
                    <Fragment key={section.label}>
                      <tr className="bg-blue-500/[0.04] dark:bg-blue-500/[0.05]">
                        <td
                          colSpan={columns.length + 1}
                          className="px-8 py-3 text-[11px] font-black uppercase tracking-[0.2em] text-blue-600"
                        >
                          {section.label}
                        </td>
                      </tr>

                      {section.rows.map((row) => {
                        const Icon = row.icon;

                        return (
                          <tr
                            key={row.key}
                            className="transition hover:bg-slate-50 dark:hover:bg-white/[0.03]"
                          >
                            <td className="px-8 py-6">
                              <div className="flex items-center gap-4">
                                <div
                                  className={`flex h-10 w-10 items-center justify-center rounded-2xl ${toneClasses(
                                    row.tone
                                  )}`}
                                >
                                  <Icon size={18} />
                                </div>

                                <div>
                                  <p className="text-sm font-bold text-slate-900 dark:text-white">
                                    {row.title}
                                  </p>
                                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                    {row.desc}
                                  </p>
                                </div>
                              </div>
                            </td>

                            {columns.map((roleName) => {
                              const checked = (rolePermissions[roleName] || []).includes(
                                row.key
                              );

                              return (
                                <td
                                  key={`${row.key}-${roleName}`}
                                  className="px-6 py-6 text-center"
                                >
                                  <button
                                    type="button"
                                    disabled={currentUser?.globalRole !== "admin"}
                                    onClick={() => toggleCell(row.key, roleName)}
                                    className={`inline-flex h-6 w-6 items-center justify-center rounded-md border transition ${
                                      checked
                                        ? "border-blue-600 bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                                        : "border-slate-300 bg-white text-transparent dark:border-white/10 dark:bg-white/[0.03]"
                                    } ${
                                      currentUser?.globalRole !== "admin"
                                        ? "cursor-not-allowed opacity-70"
                                        : ""
                                    }`}
                                  >
                                    ✓
                                  </button>
                                </td>
                              );
                            })}
                          </tr>
                        );
                      })}
                    </Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="flex flex-col items-center justify-end gap-4 sm:flex-row">
          <button
            type="button"
            onClick={handleDiscard}
            disabled={!hasChanges || saving}
            className="text-xs font-black uppercase tracking-[0.18em] text-slate-500 transition hover:text-slate-900 disabled:opacity-50 dark:hover:text-white"
          >
            Discard Changes
          </button>

          {currentUser?.globalRole === "admin" && (
            <button
              type="button"
              onClick={handleSave}
              disabled={saving || !hasChanges}
              className="blue-gradient-btn rounded-xl px-8 py-3 text-sm font-semibold text-white disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save Permission Matrix"}
            </button>
          )}
        </div>
      </div>
    </AppShell>
  );
}