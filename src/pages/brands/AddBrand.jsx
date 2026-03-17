import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AppShell from "../../layouts/AppShell";
import {
  ArrowLeft,
  Building2,
  Globe,
  BriefcaseBusiness,
  Facebook,
  Instagram,
  Save,
  X,
} from "lucide-react";
import { createBrandApi } from "../../lib/api";

export default function AddBrand() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    brandName: "",
    brandId: "",
    industry: "Technology & SaaS",
    website: "",
    metaBusiness: "",
    status: "active",
    description: "",
    pages: "",
    campaigns: "",
    revenue: "",
    connectFacebook: true,
    connectInstagram: true,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await createBrandApi(form);
      navigate(`/brands/${res.brand.id}`);
    } catch (err) {
      setError(err.message || "Failed to create brand");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell>
      <div className="mx-auto max-w-5xl space-y-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <button
              onClick={() => navigate("/brands")}
              className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-blue-600 dark:text-slate-400"
            >
              <ArrowLeft size={16} />
              Back to Brands
            </button>

            <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">
              Add Brand
            </h1>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Create a new enterprise brand workspace and configure its primary business details.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => navigate("/brands")}
              className="auth-outline-btn rounded-xl px-5 py-3 text-sm font-semibold"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="blue-gradient-btn inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-white disabled:opacity-60"
            >
              <Save size={16} />
              {loading ? "Saving..." : "Save Brand"}
            </button>
          </div>
        </div>

        {error ? (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300">
            {error}
          </div>
        ) : null}

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
                  placeholder="Aether Dynamics"
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
                  placeholder="BND-1001"
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
                  <option value="active">Active</option>
                  <option value="paused">Paused</option>
                  <option value="draft">Draft</option>
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
                  placeholder="Short brand summary..."
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
                  Connected business manager and brand performance references.
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
                    placeholder="https://example.com"
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
                  placeholder="Aether Dynamics Business Manager"
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
                  placeholder="12"
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
                  placeholder="24"
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
                  placeholder="$1.2M"
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
                Select which platforms should be enabled for this brand.
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
                      Enable Facebook pages and lead forms
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
                      Enable Instagram inbox and campaigns
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
              onClick={() => navigate("/brands")}
              className="auth-outline-btn inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold"
            >
              <X size={16} />
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="blue-gradient-btn inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-white disabled:opacity-60"
            >
              <Save size={16} />
              {loading ? "Creating..." : "Create Brand"}
            </button>
          </div>
        </form>
      </div>
    </AppShell>
  );
}