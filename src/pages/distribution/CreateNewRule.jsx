import { useState } from "react";
import AppShell from "../../layouts/AppShell";
import {
  Search,
  FlaskConical,
  Plus,
  X,
  ChevronDown,
} from "lucide-react";

const rulesTable = [
  {
    name: "EMEA High-Value SaaS",
    priority: "P1-Critical",
    summaries: ["Region: EU", "Value > $50k"],
    tone: "emerald",
  },
  {
    name: "APAC Inbound - Japanese",
    priority: "P2-Standard",
    summaries: ["Lang: JA", "Region: APAC"],
    tone: "emerald",
  },
  {
    name: "Trial - Tech Brand (Global)",
    priority: "P3-Low",
    summaries: ["Brand: Core"],
    tone: "slate",
  },
];

export default function CreateNewRule() {
  const [form, setForm] = useState({
    ruleName: "",
    priority: "P1 - Critical Priority",
    field: "Campaign",
    operator: "is exactly",
    value: "",
    targetType: "Team",
  });

  return (
    <AppShell>
      <div className="-mx-8 -my-8 grid min-h-[calc(100vh-140px)] grid-cols-1 xl:grid-cols-[minmax(0,1fr)_620px]">
        <div className="border-r border-slate-200 px-8 py-8 dark:border-white/10">
          <div className="mb-8">
            <div className="relative max-w-[420px]">
              <Search
                size={18}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                placeholder="Search rules..."
                className="auth-minimal-input w-full rounded-2xl py-3 pl-11 pr-4 text-sm"
              />
            </div>
          </div>

          <div className="space-y-8">
            <div>
              <p className="mb-4 text-[13px] font-black uppercase tracking-[0.26em] text-blue-600 dark:text-blue-400">
                Logic Configuration
              </p>

              <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">
                Assignment Rules
              </h1>

              <p className="mt-3 max-w-3xl text-xl leading-relaxed text-slate-500 dark:text-slate-400">
                Automate lead distribution based on custom criteria including
                location, campaign source, score, and real-time availability.
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <button className="auth-outline-btn flex items-center gap-2 rounded-2xl px-7 py-4 text-xl font-black">
                <FlaskConical size={18} />
                Test Logic
              </button>

              <button className="blue-gradient-btn flex items-center gap-2 rounded-2xl px-8 py-4 text-xl font-black text-white">
                <Plus size={18} />
                Create Rule
              </button>
            </div>

            <div className="border-b border-slate-200 dark:border-white/10">
              <div className="flex gap-10">
                <button className="border-b-2 border-blue-600 pb-4 text-2xl font-black text-blue-600 dark:border-blue-400 dark:text-blue-400">
                  Active Rules (12)
                </button>
                <button className="pb-4 text-2xl font-black text-slate-500">
                  Drafts (4)
                </button>
                <button className="pb-4 text-2xl font-black text-slate-500">
                  Archived
                </button>
              </div>
            </div>

            <div className="app-panel overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[760px] text-left">
                  <thead className="bg-slate-50/80 dark:bg-white/[0.03]">
                    <tr>
                      <th className="px-8 py-5 text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">
                        Rule Name
                      </th>
                      <th className="px-8 py-5 text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">
                        Priority
                      </th>
                      <th className="px-8 py-5 text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">
                        Conditions Summary
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-200 dark:divide-white/10">
                    {rulesTable.map((rule) => (
                      <tr
                        key={rule.name}
                        className="transition hover:bg-slate-50 dark:hover:bg-white/[0.03]"
                      >
                        <td className="px-8 py-7">
                          <div className="flex items-center gap-4">
                            <span
                              className={`h-3 w-1 rounded-full ${
                                rule.tone === "emerald"
                                  ? "bg-emerald-400"
                                  : "bg-slate-500"
                              }`}
                            />
                            <p className="max-w-[220px] text-2xl font-black leading-tight tracking-tight text-slate-900 dark:text-white">
                              {rule.name}
                            </p>
                          </div>
                        </td>

                        <td className="px-8 py-7">
                          <span className="inline-flex rounded-xl border border-blue-500/20 bg-blue-500/10 px-3 py-2 text-sm font-black text-blue-600 dark:text-blue-400">
                            {rule.priority}
                          </span>
                        </td>

                        <td className="px-8 py-7">
                          <div className="flex flex-wrap gap-3">
                            {rule.summaries.map((item) => (
                              <span
                                key={item}
                                className="rounded-2xl border border-slate-200 bg-slate-100 px-4 py-2 text-sm font-bold text-slate-700 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-300"
                              >
                                {item}
                              </span>
                            ))}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="px-8 py-5 text-lg text-slate-500 dark:text-slate-400">
                Showing <span className="font-black text-slate-900 dark:text-white">3</span> of 12
                active rules
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col">
          <div className="flex items-start justify-between border-b border-slate-200 px-8 py-8 dark:border-white/10">
            <div>
              <h2 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">
                Create New Rule
              </h2>
              <p className="mt-2 text-lg text-slate-500 dark:text-slate-400">
                Configure automated lead distribution parameters
              </p>
            </div>

            <button className="text-slate-400 transition hover:text-rose-500">
              <X size={28} />
            </button>
          </div>

          <div className="flex-1 space-y-10 overflow-y-auto px-8 py-8">
            <section className="space-y-6">
              <h3 className="text-[13px] font-black uppercase tracking-[0.22em] text-blue-600 dark:text-blue-400">
                Basic Identity
              </h3>

              <div>
                <label className="mb-3 block text-sm font-bold text-slate-700 dark:text-slate-200">
                  Rule Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. UK Enterprise Routing"
                  value={form.ruleName}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, ruleName: e.target.value }))
                  }
                  className="auth-minimal-input w-full rounded-2xl py-4 px-5 text-xl"
                />
              </div>

              <div>
                <label className="mb-3 block text-sm font-bold text-slate-700 dark:text-slate-200">
                  Priority Level
                </label>
                <button className="flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-white px-5 py-4 text-left text-xl font-bold text-slate-800 dark:border-white/10 dark:bg-white/[0.03] dark:text-white">
                  {form.priority}
                  <ChevronDown size={20} />
                </button>
              </div>
            </section>

            <section className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-[13px] font-black uppercase tracking-[0.22em] text-blue-600 dark:text-blue-400">
                  Assignment Conditions
                </h3>

                <button className="text-lg font-black text-blue-600 dark:text-blue-400">
                  + Add Group
                </button>
              </div>

              <div className="rounded-[2rem] border border-dashed border-slate-300 p-6 dark:border-white/10">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <label className="mb-3 block text-[11px] font-black uppercase tracking-[0.16em] text-slate-500">
                      Field
                    </label>
                    <button className="flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-white px-5 py-4 text-left text-lg font-semibold text-slate-800 dark:border-white/10 dark:bg-white/[0.03] dark:text-white">
                      {form.field}
                      <ChevronDown size={18} />
                    </button>
                  </div>

                  <div>
                    <label className="mb-3 block text-[11px] font-black uppercase tracking-[0.16em] text-slate-500">
                      Operator
                    </label>
                    <button className="flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-white px-5 py-4 text-left text-lg font-semibold text-slate-800 dark:border-white/10 dark:bg-white/[0.03] dark:text-white">
                      {form.operator}
                      <ChevronDown size={18} />
                    </button>
                  </div>
                </div>

                <div className="mt-6">
                  <label className="mb-3 block text-[11px] font-black uppercase tracking-[0.16em] text-slate-500">
                    Value
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. EMEA_SUMMER_24"
                    value={form.value}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, value: e.target.value }))
                    }
                    className="auth-minimal-input w-full rounded-2xl py-4 px-5 text-lg"
                  />
                </div>
              </div>

              <div className="flex items-center gap-4 py-2">
                <div className="h-px flex-1 bg-slate-200 dark:bg-white/10" />
                <span className="text-sm font-black uppercase tracking-[0.22em] text-slate-500">
                  And
                </span>
                <div className="h-px flex-1 bg-slate-200 dark:bg-white/10" />
              </div>

              <div className="rounded-3xl border border-slate-200 bg-slate-50/70 px-6 py-6 dark:border-white/10 dark:bg-white/[0.03]">
                <div className="flex flex-wrap items-center gap-3 text-2xl font-black text-slate-900 dark:text-white">
                  <span>Lead Score</span>
                  <span className="text-sm font-black uppercase tracking-[0.16em] text-slate-500">
                    Is greater than
                  </span>
                  <span>80</span>
                </div>
              </div>
            </section>

            <section className="space-y-6">
              <h3 className="text-[13px] font-black uppercase tracking-[0.22em] text-blue-600 dark:text-blue-400">
                Target Selection
              </h3>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                {["Team", "Agent", "Round Robin"].map((item) => (
                  <button
                    key={item}
                    onClick={() => setForm((prev) => ({ ...prev, targetType: item }))}
                    className={`rounded-3xl border px-6 py-7 text-left transition ${
                      form.targetType === item
                        ? "border-blue-500/30 bg-blue-500/10"
                        : "border-slate-200 bg-white dark:border-white/10 dark:bg-white/[0.03]"
                    }`}
                  >
                    <p className="text-2xl font-black text-slate-900 dark:text-white">
                      {item}
                    </p>
                    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                      Route matching leads to {item.toLowerCase()} targets.
                    </p>
                  </button>
                ))}
              </div>
            </section>
          </div>

          <div className="border-t border-slate-200 px-8 py-6 dark:border-white/10">
            <div className="flex flex-wrap gap-4">
              <button className="blue-gradient-btn flex-1 rounded-2xl py-4 text-xl font-black text-white">
                Activate Rule
              </button>
              <button className="auth-outline-btn rounded-2xl px-8 py-4 text-xl font-black">
                Save Draft
              </button>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}