import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AppShell from "../../layouts/AppShell";
import {
  ArrowLeft,
  UserPlus,
  Mail,
  Shield,
  Briefcase,
  Save,
  Pencil,
} from "lucide-react";

export default function EditUser() {
  const navigate = useNavigate();
  const { userId } = useParams();

  const [form, setForm] = useState({
    fullName: "Liam Wilson",
    email: "liam.w@nexus-labs.com",
    userId: userId || "USR-1001",
    role: "Global Admin",
    status: "Active",
    brand: "Nexus Labs",
    department: "Operations",
    phone: "+1 555 100 001",
    jobTitle: "Global Admin",
    bio: "Enterprise platform administrator managing brand workspaces and user controls.",
    enableDashboard: true,
    enableLeads: true,
    enableCampaigns: true,
    sendInvite: false,
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
    navigate(`/users/${form.userId}`);
  };

  return (
    <AppShell>
      <div className="mx-auto max-w-5xl space-y-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <button
              onClick={() => navigate(`/users/${userId}`)}
              className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-blue-600 dark:text-slate-400"
            >
              <ArrowLeft size={16} />
              Back to User Detail
            </button>

            <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">
              Edit User
            </h1>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Update profile, role assignment, and system access for this user.
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
                <UserPlus size={20} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  Basic Information
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Identity and contact information.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Full Name
                </label>
                <input
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  className="auth-minimal-input w-full rounded-xl px-4 py-3 text-sm"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  User ID
                </label>
                <input
                  name="userId"
                  value={form.userId}
                  onChange={handleChange}
                  className="auth-minimal-input w-full rounded-xl px-4 py-3 text-sm"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Email
                </label>
                <div className="relative">
                  <Mail
                    size={16}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    className="auth-minimal-input w-full rounded-xl py-3 pl-11 pr-4 text-sm"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Phone
                </label>
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  className="auth-minimal-input w-full rounded-xl px-4 py-3 text-sm"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Job Title
                </label>
                <input
                  name="jobTitle"
                  value={form.jobTitle}
                  onChange={handleChange}
                  className="auth-minimal-input w-full rounded-xl px-4 py-3 text-sm"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Department
                </label>
                <input
                  name="department"
                  value={form.department}
                  onChange={handleChange}
                  className="auth-minimal-input w-full rounded-xl px-4 py-3 text-sm"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Bio
                </label>
                <textarea
                  name="bio"
                  value={form.bio}
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
                <Shield size={20} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  Role & Assignment
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Access level and workspace assignment.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Role
                </label>
                <select
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  className="auth-minimal-input w-full rounded-xl px-4 py-3 text-sm"
                >
                  <option>Global Admin</option>
                  <option>Brand Editor</option>
                  <option>Viewer</option>
                  <option>Compliance Officer</option>
                  <option>Developer</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Assigned Brand
                </label>
                <select
                  name="brand"
                  value={form.brand}
                  onChange={handleChange}
                  className="auth-minimal-input w-full rounded-xl px-4 py-3 text-sm"
                >
                  <option>Nexus Labs</option>
                  <option>Vortex Global</option>
                  <option>Horizon Corp</option>
                  <option>Aether Dynamics</option>
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
                  <option>Pending</option>
                  <option>Inactive</option>
                </select>
              </div>
            </div>
          </section>

          <section className="app-panel rounded-[2rem] p-8">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-500">
                <Briefcase size={20} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  Access Modules
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Enabled system modules for this user.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {[
                ["enableDashboard", "Dashboard Access", "Analytics and summary widgets"],
                ["enableLeads", "Leads Access", "Lead listing and actions"],
                ["enableCampaigns", "Campaign Access", "Campaign creation and review"],
                ["sendInvite", "Send Invite Again", "Resend invite email after update"],
              ].map(([name, title, desc]) => (
                <label
                  key={name}
                  className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white/70 px-5 py-4 dark:border-white/10 dark:bg-white/[0.03]"
                >
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">{title}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{desc}</p>
                  </div>
                  <input
                    type="checkbox"
                    name={name}
                    checked={form[name]}
                    onChange={handleChange}
                    className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                </label>
              ))}
            </div>
          </section>

          <div className="flex flex-col gap-3 border-t border-slate-200 pt-6 dark:border-white/10 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => navigate(`/users/${userId}`)}
              className="auth-outline-btn rounded-xl px-6 py-3 text-sm font-semibold"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="blue-gradient-btn inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-white"
            >
              <Pencil size={16} />
              Update User
            </button>
          </div>
        </form>
      </div>
    </AppShell>
  );
}