import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AppShell from "../../layouts/AppShell";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CloudUpload,
  Lock,
  Zap,
  X,
  UserPlus,
  Trash2,
  Save,
} from "lucide-react";

const stepLabels = ["Basic Info", "Brand Assets", "Team Access", "Review"];

const initialTeam = [
  { name: "Sarah Chen", email: "sarah.c@acme.com", role: "Owner" },
  { name: "James Wilson", email: "j.wilson@acme.com", role: "Editor" },
  { name: "Elena Rodriguez", email: "elena.r@acme.com", role: "Viewer" },
];

export default function EditWorkspace() {
  const navigate = useNavigate();
  const { workspaceId = "WS-1001" } = useParams();
  const [step, setStep] = useState(1);

  const [form, setForm] = useState({
    name: "Acme Enterprise Solutions",
    industry: "Technology & Software",
    email: "admin@enterprise.com",
    logo: "",
    color: "#1152d4",
    description:
      "Global operations management workspace for our primary engineering and marketing departments.",
    region: "North America (Virginia)",
    timezone: "(GMT-05:00) Eastern Time (US & Canada)",
    slug: "solutions",
  });

  const [team, setTeam] = useState(initialTeam);
  const [memberName, setMemberName] = useState("");
  const [memberEmail, setMemberEmail] = useState("");
  const [memberRole, setMemberRole] = useState("Viewer");

  const canContinue = useMemo(() => {
    if (step === 1) {
      return form.name.trim() && form.email.trim() && form.slug.trim();
    }
    return true;
  }, [step, form]);

  const updateField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const addMember = () => {
    if (!memberName.trim() || !memberEmail.trim()) return;

    const exists = team.some(
      (item) => item.email.toLowerCase() === memberEmail.trim().toLowerCase()
    );
    if (exists) return;

    setTeam((prev) => [
      ...prev,
      {
        name: memberName.trim(),
        email: memberEmail.trim(),
        role: memberRole,
      },
    ]);

    setMemberName("");
    setMemberEmail("");
    setMemberRole("Viewer");
  };

  const removeMember = (email) => {
    setTeam((prev) => prev.filter((item) => item.email !== email));
  };

  const nextStep = () => {
    if (!canContinue) return;
    if (step < 4) setStep((prev) => prev + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep((prev) => prev - 1);
  };

  const handleSave = () => {
    navigate(`/workspaces/${workspaceId}`);
  };

  return (
    <AppShell>
      <div className="-mx-8 -my-8 min-h-[calc(100vh-140px)] bg-[#0f1115] text-slate-100">
        <div className="relative flex min-h-[calc(100vh-140px)] w-full flex-col overflow-x-hidden">
          <header className="sticky top-0 z-30 border-b border-blue-500/10 bg-[rgba(22,24,28,0.7)] px-6 py-4 backdrop-blur-xl lg:px-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => navigate(`/workspaces/${workspaceId}`)}
                  className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white"
                >
                  <ArrowLeft size={20} />
                </button>

                <div>
                  <p className="text-xl font-black uppercase tracking-tight text-white">
                    Nexus Enterprise
                  </p>
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                    Workspace Editor
                  </p>
                </div>
              </div>

              <button
                onClick={() => navigate(`/workspaces/${workspaceId}`)}
                className="rounded-xl p-2 text-slate-500 transition hover:bg-white/[0.04] hover:text-white"
              >
                <X size={22} />
              </button>
            </div>
          </header>

          <main className="flex-1 px-6 py-12 lg:px-10">
            <div className="mx-auto max-w-5xl">
              <div className="mb-10 text-center">
                <h1 className="text-4xl font-black tracking-tighter text-white lg:text-5xl">
                  Edit Workspace
                </h1>
                <p className="mt-4 text-lg text-slate-400">
                  Update your collaborative environment, brand presence, and team
                  access.
                </p>
              </div>

              <nav className="relative mb-12 flex items-center justify-between">
                <div className="absolute left-0 top-5 h-0.5 w-full bg-slate-800" />

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
                        className={`text-center text-[11px] font-bold uppercase tracking-[0.18em] ${
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
                          Industry
                        </label>
                        <select
                          value={form.industry}
                          onChange={(e) => updateField("industry", e.target.value)}
                          className="w-full rounded-xl border border-blue-500/20 bg-[#0f1115] px-4 py-3 text-white outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
                        >
                          <option>Technology & Software</option>
                          <option>Finance & Fintech</option>
                          <option>Healthcare</option>
                          <option>Manufacturing</option>
                          <option>Media & Entertainment</option>
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

                      <div>
                        <label className="mb-2 block text-sm font-bold uppercase tracking-[0.16em] text-slate-400">
                          Workspace URL
                        </label>

                        <div className="flex overflow-hidden rounded-xl border border-blue-500/20 bg-white/5">
                          <span className="inline-flex items-center border-r border-blue-500/20 px-4 text-sm text-slate-500">
                            acme.app/
                          </span>
                          <input
                            type="text"
                            value={form.slug}
                            onChange={(e) => updateField("slug", e.target.value)}
                            placeholder="workspace-slug"
                            className="w-full bg-transparent px-4 py-3 text-white outline-none placeholder:text-slate-600"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <label className="mb-2 block text-sm font-bold uppercase tracking-[0.16em] text-slate-400">
                          Workspace Logo
                        </label>

                        <div className="flex h-32 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-blue-500/30 bg-blue-500/5 transition hover:bg-blue-500/10">
                          <CloudUpload className="mb-2 text-blue-500" size={28} />
                          <p className="text-sm font-medium text-slate-300">
                            Click or drag to replace logo
                          </p>
                          <p className="mt-1 text-[10px] uppercase tracking-[0.16em] text-slate-500">
                            PNG, SVG up to 5MB
                          </p>
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

                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => updateField("color", "#94a3b8")}
                              className="h-4 w-4 rounded-full bg-slate-400"
                            />
                            <button
                              type="button"
                              onClick={() => updateField("color", "#10b981")}
                              className="h-4 w-4 rounded-full bg-emerald-500"
                            />
                            <button
                              type="button"
                              onClick={() => updateField("color", "#4f46e5")}
                              className="h-4 w-4 rounded-full bg-indigo-600"
                            />
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
                        onChange={(e) =>
                          updateField("description", e.target.value)
                        }
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
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-8">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                      <input
                        type="text"
                        placeholder="Member name"
                        value={memberName}
                        onChange={(e) => setMemberName(e.target.value)}
                        className="rounded-xl border border-blue-500/20 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 placeholder:text-slate-600"
                      />

                      <input
                        type="email"
                        placeholder="Member email"
                        value={memberEmail}
                        onChange={(e) => setMemberEmail(e.target.value)}
                        className="rounded-xl border border-blue-500/20 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 placeholder:text-slate-600"
                      />

                      <select
                        value={memberRole}
                        onChange={(e) => setMemberRole(e.target.value)}
                        className="rounded-xl border border-blue-500/20 bg-[#0f1115] px-4 py-3 text-white outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
                      >
                        <option>Owner</option>
                        <option>Administrator</option>
                        <option>Editor</option>
                        <option>Viewer</option>
                      </select>

                      <button
                        onClick={addMember}
                        className="blue-gradient-btn flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold text-white"
                      >
                        <UserPlus size={16} />
                        Add Member
                      </button>
                    </div>

                    <div className="overflow-hidden rounded-2xl border border-blue-500/10">
                      <table className="w-full text-left">
                        <thead className="bg-white/[0.03]">
                          <tr>
                            <th className="px-6 py-4 text-[11px] font-black uppercase tracking-[0.16em] text-slate-400">
                              Name
                            </th>
                            <th className="px-6 py-4 text-[11px] font-black uppercase tracking-[0.16em] text-slate-400">
                              Email
                            </th>
                            <th className="px-6 py-4 text-[11px] font-black uppercase tracking-[0.16em] text-slate-400">
                              Role
                            </th>
                            <th className="px-6 py-4 text-right text-[11px] font-black uppercase tracking-[0.16em] text-slate-400">
                              Action
                            </th>
                          </tr>
                        </thead>

                        <tbody className="divide-y divide-white/5">
                          {team.map((member) => (
                            <tr key={member.email}>
                              <td className="px-6 py-4 font-bold text-white">
                                {member.name}
                              </td>
                              <td className="px-6 py-4 text-slate-400">
                                {member.email}
                              </td>
                              <td className="px-6 py-4 text-slate-300">
                                {member.role}
                              </td>
                              <td className="px-6 py-4 text-right">
                                <button
                                  onClick={() => removeMember(member.email)}
                                  className="rounded-xl p-2 text-rose-500 transition hover:bg-rose-500/10"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </td>
                            </tr>
                          ))}

                          {!team.length && (
                            <tr>
                              <td
                                colSpan={4}
                                className="px-6 py-8 text-center text-sm text-slate-500"
                              >
                                No team members added yet.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {step === 4 && (
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
                          Industry
                        </p>
                        <p className="mt-2 text-xl font-black text-white">
                          {form.industry}
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
                          Workspace URL
                        </p>
                        <p className="mt-2 text-base font-bold text-white">
                          acme.app/{form.slug || "—"}
                        </p>
                      </div>

                      <div className="rounded-2xl border border-blue-500/10 bg-white/[0.03] p-5">
                        <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                          Region
                        </p>
                        <p className="mt-2 text-base font-bold text-white">
                          {form.region}
                        </p>
                      </div>

                      <div className="rounded-2xl border border-blue-500/10 bg-white/[0.03] p-5">
                        <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                          Timezone
                        </p>
                        <p className="mt-2 text-base font-bold text-white">
                          {form.timezone}
                        </p>
                      </div>

                      <div className="rounded-2xl border border-blue-500/10 bg-white/[0.03] p-5 md:col-span-2">
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

                    <div className="rounded-2xl border border-blue-500/10 bg-white/[0.03] p-5">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                          Team Access
                        </p>
                        <span className="rounded-full bg-blue-500/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-blue-500">
                          {team.length} Members
                        </span>
                      </div>

                      <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
                        {team.map((member) => (
                          <div
                            key={member.email}
                            className="rounded-xl border border-white/5 bg-black/10 p-4"
                          >
                            <p className="font-bold text-white">{member.name}</p>
                            <p className="mt-1 text-sm text-slate-400">
                              {member.email}
                            </p>
                            <p className="mt-2 text-xs font-black uppercase tracking-[0.14em] text-blue-500">
                              {member.role}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                <div className="mt-8 flex items-center justify-between border-t border-blue-500/10 pt-6">
                  <button
                    onClick={
                      step === 1
                        ? () => navigate(`/workspaces/${workspaceId}`)
                        : prevStep
                    }
                    className="rounded-xl px-8 py-3 text-sm font-bold uppercase tracking-[0.16em] text-slate-500 transition hover:text-white"
                  >
                    {step === 1 ? "Cancel" : "Back"}
                  </button>

                  {step < 4 ? (
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
                      onClick={handleSave}
                      className="blue-gradient-btn flex items-center gap-2 rounded-xl px-10 py-3 text-sm font-bold uppercase tracking-[0.16em] text-white"
                    >
                      <Save size={16} />
                      Save Changes
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
    </AppShell>
  );
}