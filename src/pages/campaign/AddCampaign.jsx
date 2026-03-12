import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AppShell from "../../layouts/AppShell";
import {
  ArrowLeft,
  Save,
  Megaphone,
  CalendarDays,
  Globe2,
  BadgeDollarSign,
  Users,
  ImagePlus,
} from "lucide-react";

const objectiveOptions = [
  "Brand Awareness",
  "Lead Generation",
  "Traffic",
  "Conversions",
  "Engagement",
  "Sales",
];

const platformOptions = ["Facebook", "Instagram", "Messenger", "Audience Network"];

export default function AddCampaign() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    campaignName: "",
    brand: "",
    objective: "Lead Generation",
    platform: ["Facebook", "Instagram"],
    region: "",
    budget: "",
    startDate: "",
    endDate: "",
    audience: "",
    description: "",
  });

  const togglePlatform = (value) => {
    setForm((prev) => ({
      ...prev,
      platform: prev.platform.includes(value)
        ? prev.platform.filter((item) => item !== value)
        : [...prev.platform, value],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    window.alert("Campaign created successfully.");
    navigate("/campaigns");
  };

  return (
    <AppShell>
      <div className="mx-auto max-w-5xl space-y-8">
        <div className="flex flex-col justify-between gap-5 xl:flex-row xl:items-end">
          <div>
            <button
              onClick={() => navigate("/campaigns")}
              className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-blue-600"
            >
              <ArrowLeft size={16} />
              Back to Campaigns
            </button>

            <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">
              Create Campaign
            </h1>
            <p className="mt-2 text-base text-slate-500 dark:text-slate-400">
              Configure a new marketing campaign for your enterprise workspace.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="app-panel p-8">
            <div className="mb-8 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-500">
                <Megaphone size={20} />
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-900 dark:text-white">
                  Campaign Information
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Basic naming, objective, and ownership details.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-200">
                  Campaign Name
                </label>
                <input
                  type="text"
                  value={form.campaignName}
                  onChange={(e) => setForm({ ...form, campaignName: e.target.value })}
                  className="auth-minimal-input w-full rounded-xl py-3 px-4 text-sm"
                  placeholder="Q4 Global Expansion"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-200">
                  Brand
                </label>
                <input
                  type="text"
                  value={form.brand}
                  onChange={(e) => setForm({ ...form, brand: e.target.value })}
                  className="auth-minimal-input w-full rounded-xl py-3 px-4 text-sm"
                  placeholder="Lumina Global"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-200">
                  Objective
                </label>
                <select
                  value={form.objective}
                  onChange={(e) => setForm({ ...form, objective: e.target.value })}
                  className="auth-minimal-input w-full rounded-xl py-3 px-4 text-sm"
                >
                  {objectiveOptions.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-200">
                  Region
                </label>
                <input
                  type="text"
                  value={form.region}
                  onChange={(e) => setForm({ ...form, region: e.target.value })}
                  className="auth-minimal-input w-full rounded-xl py-3 px-4 text-sm"
                  placeholder="United States / Global"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 xl:grid-cols-[minmax(0,1fr)_320px]">
            <div className="space-y-8">
              <div className="app-panel p-8">
                <div className="mb-8 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-500">
                    <BadgeDollarSign size={20} />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-slate-900 dark:text-white">
                      Budget & Schedule
                    </h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Allocate spend and define campaign timing.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                  <div>
                    <label className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-200">
                      Budget
                    </label>
                    <input
                      type="number"
                      value={form.budget}
                      onChange={(e) => setForm({ ...form, budget: e.target.value })}
                      className="auth-minimal-input w-full rounded-xl py-3 px-4 text-sm"
                      placeholder="5000"
                      required
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-200">
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={form.startDate}
                      onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                      className="auth-minimal-input w-full rounded-xl py-3 px-4 text-sm"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-200">
                      End Date
                    </label>
                    <input
                      type="date"
                      value={form.endDate}
                      onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                      className="auth-minimal-input w-full rounded-xl py-3 px-4 text-sm"
                    />
                  </div>
                </div>
              </div>

              <div className="app-panel p-8">
                <div className="mb-8 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-500">
                    <Globe2 size={20} />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-slate-900 dark:text-white">
                      Distribution
                    </h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Select platforms and audience context.
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="mb-3 block text-sm font-bold text-slate-700 dark:text-slate-200">
                      Platforms
                    </label>
                    <div className="flex flex-wrap gap-3">
                      {platformOptions.map((item) => {
                        const active = form.platform.includes(item);
                        return (
                          <button
                            key={item}
                            type="button"
                            onClick={() => togglePlatform(item)}
                            className={`rounded-xl border px-4 py-3 text-sm font-bold transition ${
                              active
                                ? "border-blue-500/20 bg-blue-500/10 text-blue-600 dark:text-blue-400"
                                : "border-slate-200 bg-white text-slate-600 dark:border-white/10 dark:bg-white/[0.03] dark:text-slate-300"
                            }`}
                          >
                            {item}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-200">
                      Audience
                    </label>
                    <input
                      type="text"
                      value={form.audience}
                      onChange={(e) => setForm({ ...form, audience: e.target.value })}
                      className="auth-minimal-input w-full rounded-xl py-3 px-4 text-sm"
                      placeholder="Tech Enthusiasts, 25-44, Urban"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-200">
                      Description
                    </label>
                    <textarea
                      rows={5}
                      value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                      className="auth-minimal-input w-full rounded-xl px-4 py-3 text-sm"
                      placeholder="Describe the campaign strategy, targeting, and success criteria..."
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div className="app-panel p-6">
                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                  Quick Summary
                </h3>

                <div className="mt-6 space-y-4">
                  <div className="rounded-xl bg-slate-50 p-4 dark:bg-white/[0.03]">
                    <div className="flex items-center gap-3">
                      <CalendarDays size={18} className="text-blue-500" />
                      <div>
                        <p className="text-sm font-bold text-slate-900 dark:text-white">
                          Scheduling
                        </p>
                        <p className="text-xs text-slate-500">
                          Define launch and end dates before publishing.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-4 dark:bg-white/[0.03]">
                    <div className="flex items-center gap-3">
                      <Users size={18} className="text-emerald-500" />
                      <div>
                        <p className="text-sm font-bold text-slate-900 dark:text-white">
                          Audience Readiness
                        </p>
                        <p className="text-xs text-slate-500">
                          Pair saved audiences with ad sets after creation.
                        </p>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 px-4 py-4 text-sm font-bold text-slate-500 transition hover:border-blue-500 hover:text-blue-600 dark:border-white/10 dark:hover:border-blue-400 dark:hover:text-blue-400"
                  >
                    <ImagePlus size={18} />
                    Add Creative Later
                  </button>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => navigate("/campaigns")}
                  className="auth-outline-btn flex-1 rounded-xl px-5 py-3 text-sm font-semibold"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="blue-gradient-btn flex flex-1 items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-white"
                >
                  <Save size={16} />
                  Save Campaign
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </AppShell>
  );
}