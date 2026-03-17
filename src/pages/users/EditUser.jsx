import { useEffect, useState } from "react";
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
import {
  getBrandsApi,
  getMyWorkspacesApi,
  getStoredUser,
  getUserByIdApi,
  updateUserApi,
} from "../../lib/api";

export default function EditUser() {
  const navigate = useNavigate();
  const { userId } = useParams();
  const currentUser = getStoredUser();

  const [brands, setBrands] = useState([]);
  const [workspaces, setWorkspaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    globalRole: "workspace_user",
    status: "active",
    assignedBrandIds: [],
    assignedWorkspaceIds: [],
    department: "",
    phone: "",
    jobTitle: "",
    bio: "",
    enableDashboard: true,
    enableLeads: true,
    enableCampaigns: false,
    sendInvite: false,
  });

  useEffect(() => {
    let cancelled = false;

    async function loadUser() {
      setLoading(true);
      setError("");

      try {
        const [userRes, brandsRes, workspacesRes] = await Promise.all([
          getUserByIdApi(userId),
          getBrandsApi().catch(() => ({ brands: [] })),
          getMyWorkspacesApi().catch(() => ({ workspaces: [] })),
        ]);

        const user = userRes.user;

        if (!cancelled) {
          setBrands(brandsRes.brands || []);
          setWorkspaces(workspacesRes.workspaces || []);

          setForm({
            fullName: user.fullName || "",
            email: user.email || "",
            globalRole: user.globalRole || "workspace_user",
            status: user.status || "active",
            assignedBrandIds: (user.assignedBrands || []).map((b) => b.id),
            assignedWorkspaceIds: (user.assignedWorkspaces || []).map((w) => w.id),
            department: user.department || "",
            phone: user.phone || "",
            jobTitle: user.jobTitle || "",
            bio: user.bio || "",
            enableDashboard: user.enableDashboard ?? true,
            enableLeads: user.enableLeads ?? true,
            enableCampaigns: user.enableCampaigns ?? false,
            sendInvite: false,
          });
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || "Failed to load user");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadUser();

    return () => {
      cancelled = true;
    };
  }, [userId]);

  const handleChange = (e) => {
    const { name, value, type, checked, options } = e.target;

    if (type === "checkbox") {
      setForm((prev) => ({
        ...prev,
        [name]: checked,
      }));
      return;
    }

    if (e.target.multiple) {
      const values = Array.from(options)
        .filter((opt) => opt.selected)
        .map((opt) => opt.value);

      setForm((prev) => ({
        ...prev,
        [name]: values,
      }));
      return;
    }

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);

    try {
      await updateUserApi(userId, form);
      navigate(`/users/${userId}`);
    } catch (err) {
      setError(err.message || "Failed to update user");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AppShell>
        <div className="app-panel p-8">Loading user...</div>
      </AppShell>
    );
  }

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
            disabled={saving}
            className="blue-gradient-btn inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-white disabled:opacity-60"
          >
            <Save size={16} />
            {saving ? "Saving..." : "Save Changes"}
          </button>
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
                  Access level and scope assignment.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Global Role
                </label>
                <select
                  name="globalRole"
                  value={form.globalRole}
                  onChange={handleChange}
                  className="auth-minimal-input w-full rounded-xl px-4 py-3 text-sm"
                >
                  {currentUser?.globalRole === "admin" && (
                    <option value="admin">admin</option>
                  )}
                  <option value="brand_user">brand_user</option>
                  <option value="workspace_user">workspace_user</option>
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
                  <option value="active">active</option>
                  <option value="pending">pending</option>
                  <option value="inactive">inactive</option>
                </select>
              </div>

              <div className="space-y-2 md:col-span-3">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Assigned Brands
                </label>
                <select
                  multiple
                  name="assignedBrandIds"
                  value={form.assignedBrandIds}
                  onChange={handleChange}
                  className="auth-minimal-input min-h-[140px] w-full rounded-xl px-4 py-3 text-sm"
                >
                  {brands.map((brand) => (
                    <option key={brand.id} value={brand.id}>
                      {brand.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2 md:col-span-3">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Assigned Workspaces
                </label>
                <select
                  multiple
                  name="assignedWorkspaceIds"
                  value={form.assignedWorkspaceIds}
                  onChange={handleChange}
                  className="auth-minimal-input min-h-[140px] w-full rounded-xl px-4 py-3 text-sm"
                >
                  {workspaces.map((workspace) => (
                    <option key={workspace.id} value={workspace.id}>
                      {workspace.name}
                    </option>
                  ))}
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
              disabled={saving}
              className="blue-gradient-btn inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-white disabled:opacity-60"
            >
              <Pencil size={16} />
              {saving ? "Updating..." : "Update User"}
            </button>
          </div>
        </form>
      </div>
    </AppShell>
  );
}