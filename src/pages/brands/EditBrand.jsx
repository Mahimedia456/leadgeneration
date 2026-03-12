import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AppShell from "../../layouts/AppShell";
import {
  ArrowLeft,
  Building2,
  Globe,
  BriefcaseBusiness,
  Facebook,
  Instagram,
  Save,
  Pencil,
} from "lucide-react";

export default function EditBrand() {
  const navigate = useNavigate();
  const { brandId } = useParams();

  const [form, setForm] = useState({
    brandName: "Aether Dynamics",
    brandId: brandId || "BND-8821",
    industry: "Technology & SaaS",
    website: "https://aetherdynamics.com",
    metaBusiness: "Aether Dynamics Business Manager",
    status: "Active",
    description:
      "Premium brand identity focused on global operations, campaign performance, and enterprise Meta workspace management.",
    pages: "12",
    campaigns: "24",
    revenue: "$1.2M",
    connectFacebook: true,
    connectInstagram: true,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate(`/brands/${form.brandId}`);
  };

  return (
    <AppShell>
      <div className="mx-auto max-w-5xl space-y-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <button
              onClick={() => navigate(`/brands/${brandId}`)}
              className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-blue-600 dark:text-slate-400"
            >
              <ArrowLeft size={16} />
              Back to Brand Detail
            </button>

            <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">
              Edit Brand
            </h1>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Update identity, workspace, and business connection details for this brand.
            </p>
          </div>

          <button
            onClick={handleSubmit}
            className="blue-gradient-btn inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-white"
          >
            <Save size={16} />
            Save Changes
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <section className="app-panel rounded-[2rem] p-8">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-600">
                <Building2 size={20} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  Basic Information
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Main identity and workspace information.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Brand Name
                </label>
                <input
                  name="brandName"
                  value={form.brandName}
                  onChange={handleChange}
                  className="auth-minimal-input w-full rounded-xl px-4 py-3 text-sm"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Brand ID
                </label>
                <input
                  name="brandId"
                  value={form.brandId}
                  onChange={handleChange}
                  className="auth-minimal-input w-full rounded-xl px-4 py-3 text-sm"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Industry
                </label>
                <select
                  name="industry"
                  value={form.industry}
                  onChange={handleChange}
                  className="auth-minimal-input w-full rounded-xl px-4 py-3 text-sm"
                >
                  <option>Technology & SaaS</option>
                  <option>Financial Services</option>
                  <option>Healthcare</option>
                  <option>Retail</option>
                  <option>Marketing</option>
                  <option>Education</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Status
                </label>
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className="auth-minimal-input w-full rounded-xl px-4 py-3 text-sm"
                >
                  <option>Active</option>
                  <option>Paused</option>
                  <option>Draft</option>
                </select>
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Description
                </label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={4}
                  className="auth-minimal-input w-full rounded-xl px-4 py-3 text-sm"
                />
              </div>
            </div>
          </section>

          <section className="app-panel rounded-[2rem] p-8">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-500">
                <BriefcaseBusiness size={20} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  Business & Meta Details
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Connected business manager and performance references.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Website
                </label>
                <div className="relative">
                  <Globe
                    size={16}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    name="website"
                    value={form.website}
                    onChange={handleChange}
                    className="auth-minimal-input w-full rounded-xl py-3 pl-11 pr-4 text-sm"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Meta Business
                </label>
                <input
                  name="metaBusiness"
                  value={form.metaBusiness}
                  onChange={handleChange}
                  className="auth-minimal-input w-full rounded-xl px-4 py-3 text-sm"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Active Pages
                </label>
                <input
                  name="pages"
                  value={form.pages}
                  onChange={handleChange}
                  className="auth-minimal-input w-full rounded-xl px-4 py-3 text-sm"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Active Campaigns
                </label>
                <input
                  name="campaigns"
                  value={form.campaigns}
                  onChange={handleChange}
                  className="auth-minimal-input w-full rounded-xl px-4 py-3 text-sm"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Annual Revenue
                </label>
                <input
                  name="revenue"
                  value={form.revenue}
                  onChange={handleChange}
                  className="auth-minimal-input w-full rounded-xl px-4 py-3 text-sm"
                />
              </div>
            </div>
          </section>

          <section className="app-panel rounded-[2rem] p-8">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Channel Connections
              </h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Enable or disable connected social channels for this brand.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <label className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white/70 px-5 py-4 dark:border-white/10 dark:bg-white/[0.03]">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-600">
                    <Facebook size={18} />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">
                      Facebook
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Facebook pages and lead forms
                    </p>
                  </div>
                </div>

                <input
                  type="checkbox"
                  name="connectFacebook"
                  checked={form.connectFacebook}
                  onChange={handleChange}
                  className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
              </label>

              <label className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white/70 px-5 py-4 dark:border-white/10 dark:bg-white/[0.03]">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-pink-500/10 text-pink-500">
                    <Instagram size={18} />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">
                      Instagram
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Instagram inbox and campaigns
                    </p>
                  </div>
                </div>

                <input
                  type="checkbox"
                  name="connectInstagram"
                  checked={form.connectInstagram}
                  onChange={handleChange}
                  className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
              </label>
            </div>
          </section>

          <div className="flex flex-col gap-3 border-t border-slate-200 pt-6 dark:border-white/10 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => navigate(`/brands/${brandId}`)}
              className="auth-outline-btn rounded-xl px-6 py-3 text-sm font-semibold"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="blue-gradient-btn inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-white"
            >
              <Pencil size={16} />
              Update Brand
            </button>
          </div>
        </form>
      </div>
    </AppShell>
  );
}