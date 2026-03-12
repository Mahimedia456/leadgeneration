import { useState } from "react";
import AppShell from "../../layouts/AppShell";
import {
  Search,
  X,
  PlusCircle,
  Trash2,
  ChevronDown,
} from "lucide-react";

const rulesList = [
  {
    id: "R-1",
    name: "Tier 3 Escalation",
    updated: "Updated 2h ago",
    priority: "P0-Critical",
    conditions: [`Severity == "Urgent"`],
  },
  {
    id: "R-2",
    name: "EMEA Sales Routing",
    updated: "Updated 1d ago",
    priority: "P1-High",
    conditions: [`Region == "EMEA"`],
  },
  {
    id: "R-3",
    name: "Default Web Leads",
    updated: "Updated 5d ago",
    priority: "P3-Low",
    conditions: [`Source == "Web"`],
  },
];

export default function EditOldRule() {
  const [form, setForm] = useState({
    ruleName: "Tier 3 Escalation",
    priorityLevel: "P0 - Immediate",
    executionStatus: "Enabled",
    conditions: [
      { field: "Severity", operator: "IS EQUAL TO", value: "Urgent" },
      { field: "Customer Tier", operator: "IS ANY OF", value: "Enterprise,Platinum" },
    ],
    routeTo: "Team",
    destination: "Global Ops Tier 3",
  });

  const deleteCondition = (index) => {
    setForm((prev) => ({
      ...prev,
      conditions: prev.conditions.filter((_, i) => i !== index),
    }));
  };

  return (
    <AppShell>
      <div className="-mx-8 -my-8 grid min-h-[calc(100vh-140px)] grid-cols-1 xl:grid-cols-[minmax(0,1fr)_600px]">
        <div className="border-r border-slate-200 px-8 py-8 dark:border-white/10">
          <div className="mb-8">
            <div className="relative max-w-[520px]">
              <Search
                size={18}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                placeholder="Search rules, teams, or logs..."
                className="auth-minimal-input w-full rounded-2xl py-3 pl-11 pr-4 text-sm"
              />
            </div>
          </div>

          <div className="space-y-8">
            <div>
              <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">
                Assignment Rules
              </h1>
              <p className="mt-3 max-w-3xl text-xl leading-relaxed text-slate-500 dark:text-slate-400">
                Manage automated ticket and lead distribution logic with
                high-performance routing.
              </p>
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
                      <th className="px-7 py-5 text-[11px] font-black uppercase tracking-[0.14em] text-slate-400">
                        Rule Name
                      </th>
                      <th className="px-7 py-5 text-[11px] font-black uppercase tracking-[0.14em] text-slate-400">
                        Priority
                      </th>
                      <th className="px-7 py-5 text-[11px] font-black uppercase tracking-[0.14em] text-slate-400">
                        Conditions
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-200 dark:divide-white/10">
                    {rulesList.map((rule) => (
                      <tr
                        key={rule.id}
                        className="transition hover:bg-slate-50 dark:hover:bg-white/[0.03]"
                      >
                        <td className="px-7 py-7">
                          <div>
                            <p className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                              {rule.name}
                            </p>
                            <p className="mt-2 text-lg text-slate-500 dark:text-slate-400">
                              {rule.updated}
                            </p>
                          </div>
                        </td>

                        <td className="px-7 py-7">
                          <span className="inline-flex rounded-xl border border-rose-500/20 bg-rose-500/10 px-4 py-2 text-sm font-black text-rose-500">
                            {rule.priority}
                          </span>
                        </td>

                        <td className="px-7 py-7">
                          <div className="flex flex-wrap gap-3">
                            {rule.conditions.map((condition) => (
                              <span
                                key={condition}
                                className="rounded-2xl border border-slate-200 bg-slate-100 px-4 py-2 text-sm font-bold text-slate-600 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-300"
                              >
                                {condition}
                              </span>
                            ))}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col">
          <div className="flex items-start justify-between border-b border-slate-200 px-8 py-8 dark:border-white/10">
            <div>
              <h2 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">
                Edit Assignment Rule
              </h2>
              <p className="mt-2 text-lg text-slate-500 dark:text-slate-400">
                Configure automated distribution logic and triggers
              </p>
            </div>

            <button className="text-slate-400 transition hover:text-rose-500">
              <X size={28} />
            </button>
          </div>

          <div className="flex-1 space-y-10 overflow-y-auto px-8 py-8">
            <section className="space-y-6">
              <h3 className="text-[13px] font-black uppercase tracking-[0.22em] text-slate-500">
                General Settings
              </h3>

              <div>
                <label className="mb-3 block text-sm font-black uppercase tracking-[0.14em] text-slate-700 dark:text-slate-200">
                  Rule Name
                </label>
                <input
                  type="text"
                  value={form.ruleName}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, ruleName: e.target.value }))
                  }
                  className="auth-minimal-input w-full rounded-2xl py-4 px-5 text-xl"
                />
              </div>

              <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                <div>
                  <label className="mb-3 block text-sm font-black uppercase tracking-[0.14em] text-slate-700 dark:text-slate-200">
                    Priority Level
                  </label>
                  <button className="flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-white px-5 py-4 text-left text-xl font-bold text-slate-800 dark:border-white/10 dark:bg-white/[0.03] dark:text-white">
                    {form.priorityLevel}
                    <ChevronDown size={20} />
                  </button>
                </div>

                <div>
                  <label className="mb-3 block text-sm font-black uppercase tracking-[0.14em] text-slate-700 dark:text-slate-200">
                    Execution Status
                  </label>
                  <div className="flex h-[60px] items-center px-2 text-3xl font-black text-slate-900 dark:text-white">
                    {form.executionStatus}
                  </div>
                </div>
              </div>
            </section>

            <section className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-[13px] font-black uppercase tracking-[0.22em] text-slate-500">
                  Conditions
                </h3>

                <button className="flex items-center gap-2 text-sm font-black uppercase tracking-[0.16em] text-blue-600 dark:text-blue-400">
                  <PlusCircle size={16} />
                  Add Condition
                </button>
              </div>

              <div className="space-y-4">
                {form.conditions.map((item, index) => (
                  <div
                    key={`${item.field}-${index}`}
                    className="rounded-3xl border border-slate-200 bg-slate-50/70 px-5 py-5 dark:border-white/10 dark:bg-white/[0.03]"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex flex-wrap items-center gap-4">
                        <span className="rounded-full border border-slate-200 bg-slate-200 px-4 py-2 text-lg font-black text-slate-700 dark:border-white/10 dark:bg-white/[0.06] dark:text-white">
                          {item.field}
                        </span>

                        <span className="text-sm font-black uppercase tracking-[0.14em] text-slate-500">
                          {item.operator}
                        </span>

                        <span className="text-lg font-black text-blue-600 dark:text-blue-400">
                          {item.value}
                        </span>
                      </div>

                      <button
                        onClick={() => deleteCondition(index)}
                        className="text-slate-400 transition hover:text-rose-500"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}

                <div className="flex items-center gap-4 py-2">
                  <div className="h-px flex-1 bg-slate-200 dark:bg-white/10" />
                  <span className="rounded-full bg-slate-100 px-4 py-1 text-xs font-black uppercase tracking-[0.18em] text-slate-500 dark:bg-white/[0.04]">
                    And
                  </span>
                  <div className="h-px flex-1 bg-slate-200 dark:bg-white/10" />
                </div>
              </div>
            </section>

            <section className="space-y-6">
              <h3 className="text-[13px] font-black uppercase tracking-[0.22em] text-slate-500">
                Assignment Action
              </h3>

              <div className="rounded-3xl border border-blue-500/20 bg-blue-500/[0.03] p-6">
                <p className="mb-5 text-sm font-black uppercase tracking-[0.14em] text-slate-700 dark:text-slate-200">
                  Route To
                </p>

                <div className="mb-6 flex flex-wrap gap-8">
                  {["Team", "Agent", "Round Robin"].map((option) => (
                    <label key={option} className="flex items-center gap-3">
                      <input
                        type="radio"
                        checked={form.routeTo === option}
                        onChange={() =>
                          setForm((prev) => ({ ...prev, routeTo: option }))
                        }
                        className="h-5 w-5"
                      />
                      <span className="text-lg font-bold text-slate-800 dark:text-white">
                        {option}
                      </span>
                    </label>
                  ))}
                </div>

                <button className="flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-white px-5 py-4 text-left text-xl font-bold text-slate-800 dark:border-white/10 dark:bg-white/[0.03] dark:text-white">
                  {form.destination}
                  <ChevronDown size={20} />
                </button>
              </div>
            </section>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-200 px-8 py-6 dark:border-white/10">
            <button className="text-lg font-black uppercase tracking-[0.16em] text-slate-500">
              Cancel
            </button>

            <div className="flex gap-4">
              <button className="auth-outline-btn rounded-2xl px-7 py-4 text-lg font-black">
                Disable Rule
              </button>

              <button className="blue-gradient-btn rounded-2xl px-8 py-4 text-lg font-black text-white">
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}