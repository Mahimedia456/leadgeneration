import { useState } from "react";
import AppShell from "../../layouts/AppShell";
import {
  Shield,
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

const columns = [
  "Super Admin",
  "Brand Admin",
  "Lead Manager",
  "Sales Rep",
  "Analyst",
];

const initialSections = [
  {
    label: "Core Platform Access",
    rows: [
      {
        title: "Dashboard Overview",
        desc: "Access to analytics and summary widgets",
        icon: LayoutDashboard,
        tone: "slate",
        values: [true, true, true, true, true],
      },
      {
        title: "Brand Assets Management",
        desc: "Modify logos, colors, and branding materials",
        icon: Palette,
        tone: "slate",
        values: [true, true, false, false, false],
      },
    ],
  },
  {
    label: "Lead Operations",
    rows: [
      {
        title: "Lead Generation",
        desc: "Create and import new lead records",
        icon: UserPlus,
        tone: "slate",
        values: [true, true, true, true, false],
      },
      {
        title: "Bulk Data Export",
        desc: "Download sensitive lead data to CSV/XLSX",
        icon: Download,
        tone: "amber",
        values: [true, true, false, false, false],
      },
      {
        title: "Lead Deletion",
        desc: "Permanently remove lead data from CRM",
        icon: Trash2,
        tone: "rose",
        values: [true, false, false, false, false],
      },
    ],
  },
  {
    label: "Financials & Billing",
    rows: [
      {
        title: "Revenue Reports",
        desc: "View detailed financial statements and forecasts",
        icon: BadgeDollarSign,
        tone: "slate",
        values: [true, true, false, false, true],
      },
    ],
  },
];

function toneClasses(tone) {
  if (tone === "amber") return "bg-amber-500/10 text-amber-500";
  if (tone === "rose") return "bg-rose-500/10 text-rose-500";
  return "bg-slate-200 dark:bg-white/10 text-slate-500 dark:text-slate-400";
}

export default function RolesPermissions() {
  const [sections, setSections] = useState(initialSections);

  const toggleCell = (sectionIndex, rowIndex, colIndex) => {
    setSections((prev) =>
      prev.map((section, sIdx) =>
        sIdx !== sectionIndex
          ? section
          : {
              ...section,
              rows: section.rows.map((row, rIdx) =>
                rIdx !== rowIndex
                  ? row
                  : {
                      ...row,
                      values: row.values.map((v, cIdx) =>
                        cIdx === colIndex ? !v : v
                      ),
                    }
              ),
            }
      )
    );
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
            <button className="auth-outline-btn flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold">
              <History size={16} />
              Audit Logs
            </button>

            <button className="blue-gradient-btn flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-white">
              <Plus size={16} />
              Create New Role
            </button>
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

            <button className="text-[11px] font-black uppercase tracking-[0.18em] text-amber-600 dark:text-amber-400">
              Review Security Policy
            </button>
          </div>
        </div>

        <div className="app-panel overflow-hidden rounded-[2rem]">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1180px] text-left">
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
                {sections.map((section, sectionIndex) => (
                  <tbody key={section.label}>
                    <tr className="bg-blue-500/[0.04] dark:bg-blue-500/[0.05]">
                      <td
                        colSpan={columns.length + 1}
                        className="px-8 py-3 text-[11px] font-black uppercase tracking-[0.2em] text-blue-600"
                      >
                        {section.label}
                      </td>
                    </tr>

                    {section.rows.map((row, rowIndex) => {
                      const Icon = row.icon;
                      return (
                        <tr
                          key={row.title}
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

                          {row.values.map((checked, colIndex) => (
                            <td key={colIndex} className="px-6 py-6 text-center">
                              <button
                                type="button"
                                onClick={() =>
                                  toggleCell(sectionIndex, rowIndex, colIndex)
                                }
                                className={`inline-flex h-6 w-6 items-center justify-center rounded-md border transition ${
                                  checked
                                    ? "border-blue-600 bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                                    : "border-slate-300 bg-white text-transparent dark:border-white/10 dark:bg-white/[0.03]"
                                }`}
                              >
                                ✓
                              </button>
                            </td>
                          ))}
                        </tr>
                      );
                    })}
                  </tbody>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex flex-col items-center justify-end gap-4 sm:flex-row">
          <button className="text-xs font-black uppercase tracking-[0.18em] text-slate-500 transition hover:text-slate-900 dark:hover:text-white">
            Discard Changes
          </button>

          <button className="blue-gradient-btn rounded-xl px-8 py-3 text-sm font-semibold text-white">
            Save Permission Matrix
          </button>
        </div>
      </div>
    </AppShell>
  );
}