import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CloudUpload,
  Lock,
  Zap,
  X,
} from "lucide-react";
import { createWorkspaceApi, getStoredUser } from "../../lib/api";

const stepLabels = ["Basic Info", "Brand Assets", "Review"];

export default function CreateWorkspace() {
  const navigate = useNavigate();
  const user = getStoredUser();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    industry: "Technology & Software",
    email: "",
    logoUrl: "",
    color: "#1152d4",
    description: "",
    region: "North America (Virginia)",
    timezone: "(GMT-05:00) Eastern Time (US & Canada)",
    metaBusinessName: "",
  });

  const canContinue = useMemo(() => {
    if (step === 1) {
      return form.name.trim() && form.email.trim();
    }
    return true;
  }, [step, form]);

  const updateField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const nextStep = () => {
    if (!canContinue) return;
    if (step < 3) setStep((prev) => prev + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep((prev) => prev - 1);
  };

  const handleCreate = async () => {
    setLoading(true);
    setError("");

    try {
      const data = await createWorkspaceApi({
        name: form.name,
        metaBusinessName: form.metaBusinessName,
        description: form.description,
        industry: form.industry,
        primaryContactEmail: form.email,
        logoUrl: form.logoUrl,
        brandColor: form.color,
        region: form.region,
        timezone: form.timezone,
      });

      navigate(`/workspaces/${data.workspace.id}`);
    } catch (err) {
      if (err.statusCode === 403) {
        navigate("/access-denied");
        return;
      }
      setError(err.message || "Failed to create workspace");
    } finally {
      setLoading(false);
    }
  };

  if (user?.globalRole !== "admin") {
    navigate("/access-denied");
    return null;
  }

  return (
    <div className="min-h-screen bg-[#0f1115] text-slate-100">
      <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden">
        <header className="sticky top-0 z-50 border-b border-blue-500/10 bg-[rgba(22,24,28,0.7)] px-6 py-4 backdrop-blur-xl lg:px-20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate("/workspaces")}
                className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white"
              >
                <ArrowLeft size={20} />
              </button>
              <div>
                <p className="text-xl font-black uppercase tracking-tight text-white">
                  Mahimedia Solutions
                </p>
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                  Workspace Builder
                </p>
              </div>
            </div>

            <button
              onClick={() => navigate("/workspaces")}
              className="rounded-xl p-2 text-slate-500 transition hover:bg-white/[0.04] hover:text-white"
            >
              <X size={22} />
            </button>
          </div>
        </header>

        <main className="flex-1 px-6 py-12 lg:px-20">
          <div className="mx-auto max-w-4xl">
            <div className="mb-10 text-center">
              <h1 className="text-4xl font-black tracking-tighter text-white lg:text-5xl">
                Create New Workspace
              </h1>
              <p className="mt-4 text-lg text-slate-400">
                Define your collaborative environment and brand presence.
              </p>
            </div>

            <nav className="relative mb-12 flex items-center justify-between">
              <div className="absolute top-5 left-0 h-0.5 w-full bg-slate-800" />
              {stepLabels.map((label, index) => {
                const current = index + 1;
                const active = current === step;
                const complete = current < step;

                return (
                  <div
                    key={label}
                    className="relative z-10 flex flex-col items-center gap-2 bg-[#0f1115] px-3"
                  >
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-black ring-4 ring-[#0f1115] ${
                        active
                          ? "bg-blue-600 text-white"
                          : complete
                          ? "bg-emerald-500 text-white"
                          : "bg-slate-800 text-slate-400"
                      }`}
                    >
                      {complete ? <Check size={16} /> : current}
                    </div>
                    <span
                      className={`text-xs font-bold uppercase tracking-[0.18em] ${
                        active ? "text-blue-500" : "text-slate-500"
                      }`}
                    >
                      {label}
                    </span>
                  </div>
                );
              })}
            </nav>

            <div className="rounded-[1.5rem] border border-blue-500/15 bg-[rgba(22,24,28,0.7)] p-8 shadow-2xl backdrop-blur-xl">
              {step === 1 && (
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                  <div className="space-y-6">
                    <div>
                      <label className="mb-2 block text-sm font-bold uppercase tracking-[0.16em] text-slate-400">
                        Workspace Name
                      </label>
                      <input
                        type="text"
                        value={form.name}
                        onChange={(e) => updateField("name", e.target.value)}
                        placeholder="e.g. Global Marketing Hub"
                        className="w-full rounded-xl border border-blue-500/20 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 placeholder:text-slate-600"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-bold uppercase tracking-[0.16em] text-slate-400">
                        Meta Business Name
                      </label>
                      <input
                        type="text"
                        value={form.metaBusinessName}
                        onChange={(e) => updateField("metaBusinessName", e.target.value)}
                        placeholder="e.g. Allianz Europe Business Manager"
                        className="w-full rounded-xl border border-blue-500/20 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 placeholder:text-slate-600"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-bold uppercase tracking-[0.16em] text-slate-400">
                        Industry
                      </label>
                      <select
                        value={form.industry}
                        onChange={(e) => updateField("industry", e.target.value)}
                        className="w-full rounded-xl border border-blue-500/20 bg-[#0f1115] px-4 py-3 text-white outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
                      >
                        <option>Technology & Software</option>
                        <option>Finance & Fintech</option>
                        <option>Marketing & Media</option>
                        <option>Healthcare</option>
                        <option>Manufacturing</option>
                      </select>
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-bold uppercase tracking-[0.16em] text-slate-400">
                        Primary Contact Email
                      </label>
                      <input
                        type="email"
                        value={form.email}
                        onChange={(e) => updateField("email", e.target.value)}
                        placeholder="admin@enterprise.com"
                        className="w-full rounded-xl border border-blue-500/20 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 placeholder:text-slate-600"
                      />
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="mb-2 block text-sm font-bold uppercase tracking-[0.16em] text-slate-400">
                        Workspace Logo URL
                      </label>
                      <div className="flex h-32 flex-col items-center justify-center rounded-xl border-2 border-dashed border-blue-500/30 bg-blue-500/5">
                        <CloudUpload className="mb-2 text-blue-500" size={28} />
                        <input
                          type="text"
                          value={form.logoUrl}
                          onChange={(e) => updateField("logoUrl", e.target.value)}
                          placeholder="https://example.com/logo.png"
                          className="w-[85%] rounded-xl border border-blue-500/20 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-slate-600"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-bold uppercase tracking-[0.16em] text-slate-400">
                        Brand Identity Color
                      </label>
                      <div className="flex items-center gap-3 rounded-xl border border-blue-500/10 bg-white/5 p-3">
                        <input
                          type="color"
                          value={form.color}
                          onChange={(e) => updateField("color", e.target.value)}
                          className="h-12 w-12 cursor-pointer rounded-lg border-none bg-transparent"
                        />
                        <div className="flex-1">
                          <p className="text-sm font-bold text-white">
                            {form.color.toUpperCase()}
                          </p>
                          <p className="text-xs uppercase tracking-[0.14em] text-slate-500">
                            Primary Accent
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6">
                  <div>
                    <label className="mb-2 block text-sm font-bold uppercase tracking-[0.16em] text-slate-400">
                      Workspace Description
                    </label>
                    <textarea
                      rows={5}
                      value={form.description}
                      onChange={(e) => updateField("description", e.target.value)}
                      placeholder="Describe the purpose, teams, and operating scope of this workspace..."
                      className="w-full rounded-xl border border-blue-500/20 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 placeholder:text-slate-600"
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-bold uppercase tracking-[0.16em] text-slate-400">
                        Data Hosting Region
                      </label>
                      <select
                        value={form.region}
                        onChange={(e) => updateField("region", e.target.value)}
                        className="w-full rounded-xl border border-blue-500/20 bg-[#0f1115] px-4 py-3 text-white outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
                      >
                        <option>North America (Virginia)</option>
                        <option>Europe (Frankfurt)</option>
                        <option>Asia Pacific (Singapore)</option>
                      </select>
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-bold uppercase tracking-[0.16em] text-slate-400">
                        Timezone
                      </label>
                      <select
                        value={form.timezone}
                        onChange={(e) => updateField("timezone", e.target.value)}
                        className="w-full rounded-xl border border-blue-500/20 bg-[#0f1115] px-4 py-3 text-white outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
                      >
                        <option>(GMT-05:00) Eastern Time (US & Canada)</option>
                        <option>(GMT+00:00) London</option>
                        <option>(GMT+01:00) Paris</option>
                        <option>(GMT+08:00) Singapore</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-8">
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="rounded-2xl border border-blue-500/10 bg-white/[0.03] p-5">
                      <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                        Workspace Name
                      </p>
                      <p className="mt-2 text-xl font-black text-white">
                        {form.name || "—"}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-blue-500/10 bg-white/[0.03] p-5">
                      <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                        Meta Business
                      </p>
                      <p className="mt-2 text-xl font-black text-white">
                        {form.metaBusinessName || "—"}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-blue-500/10 bg-white/[0.03] p-5">
                      <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                        Primary Contact
                      </p>
                      <p className="mt-2 text-base font-bold text-white">
                        {form.email || "—"}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-blue-500/10 bg-white/[0.03] p-5">
                      <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                        Identity Color
                      </p>
                      <div className="mt-2 flex items-center gap-3">
                        <div
                          className="h-8 w-8 rounded-lg border border-white/10"
                          style={{ backgroundColor: form.color }}
                        />
                        <span className="text-base font-bold text-white">
                          {form.color.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-blue-500/10 bg-white/[0.03] p-5">
                    <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                      Description
                    </p>
                    <p className="mt-2 text-sm leading-7 text-slate-300">
                      {form.description || "No description provided yet."}
                    </p>
                  </div>

                  {error ? (
                    <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                      {error}
                    </div>
                  ) : null}
                </div>
              )}

              <div className="mt-8 flex items-center justify-between border-t border-blue-500/10 pt-6">
                <button
                  onClick={step === 1 ? () => navigate("/workspaces") : prevStep}
                  className="rounded-xl px-8 py-3 text-sm font-bold uppercase tracking-[0.16em] text-slate-500 transition hover:text-white"
                >
                  {step === 1 ? "Cancel" : "Back"}
                </button>

                {step < 3 ? (
                  <button
                    onClick={nextStep}
                    disabled={!canContinue}
                    className="blue-gradient-btn flex items-center gap-2 rounded-xl px-10 py-3 text-sm font-bold uppercase tracking-[0.16em] text-white disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Continue
                    <ArrowRight size={16} />
                  </button>
                ) : (
                  <button
                    onClick={handleCreate}
                    disabled={loading}
                    className="blue-gradient-btn flex items-center gap-2 rounded-xl px-10 py-3 text-sm font-bold uppercase tracking-[0.16em] text-white disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <Check size={16} />
                    {loading ? "Creating..." : "Create Workspace"}
                  </button>
                )}
              </div>
            </div>

            <div className="mt-8 flex items-center justify-center gap-4 text-center text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
              <span className="flex items-center gap-1">
                <Lock size={12} />
                Enterprise Grade Security
              </span>
              <span className="h-1 w-1 rounded-full bg-slate-700" />
              <span className="flex items-center gap-1">
                <Zap size={12} />
                Instant Activation
              </span>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}