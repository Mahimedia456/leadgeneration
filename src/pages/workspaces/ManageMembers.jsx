import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AppShell from "../../layouts/AppShell";
import {
  ArrowLeft,
  Mail,
  Plus,
  Users,
  X,
  Loader2,
} from "lucide-react";
import {
  createInvitationApi,
  getStoredUser,
  getWorkspaceByIdApi,
  getWorkspaceMembersApi,
  listInvitationsApi,
} from "../../lib/api";

export default function ManageMembers() {
  const navigate = useNavigate();
  const { workspaceId } = useParams();
  const user = getStoredUser();

  const [workspace, setWorkspace] = useState(null);
  const [members, setMembers] = useState([]);
  const [invitations, setInvitations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState("");

  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteLoading, setInviteLoading] = useState(false);
  const [inviteError, setInviteError] = useState("");
  const [inviteSuccess, setInviteSuccess] = useState("");

  const [inviteForm, setInviteForm] = useState({
    email: "",
    globalRole: "workspace_user",
    memberRole: "workspace_editor",
  });

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      setPageError("");

      try {
       const [workspaceRes, membersRes, invitationsRes] = await Promise.all([
  getWorkspaceByIdApi(workspaceId),
  getWorkspaceMembersApi(workspaceId),
  listInvitationsApi(workspaceId),
]);

        setWorkspace(workspaceRes.workspace);
        setMembers(membersRes.members || []);
        setInvitations(invitationsRes.invitations || []);
      } catch (err) {
        if (err.statusCode === 403) {
          navigate("/access-denied");
          return;
        }
        setPageError(err.message || "Failed to load members");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [workspaceId, navigate]);

  const pendingInvitations = useMemo(() => {
    return invitations.filter((item) => item.status === "pending");
  }, [invitations]);

  const handleInviteChange = (e) => {
    const { name, value } = e.target;
    setInviteForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSendInvite = async (e) => {
    e.preventDefault();
    setInviteError("");
    setInviteSuccess("");

    const email = inviteForm.email.trim().toLowerCase();

    if (!email) {
      setInviteError("Email is required");
      return;
    }

    setInviteLoading(true);

    try {
      const res = await createInvitationApi({
        email,
        workspaceId,
        globalRole: inviteForm.globalRole,
        memberRole: inviteForm.memberRole,
      });

      setInviteSuccess("Invitation sent successfully.");
      setInviteForm({
        email: "",
        globalRole: "workspace_user",
        memberRole: "workspace_editor",
      });

      setInvitations((prev) => [res.invitation, ...prev]);

      setTimeout(() => {
        setInviteOpen(false);
        setInviteSuccess("");
      }, 1200);
    } catch (err) {
      setInviteError(err.message || "Failed to send invitation");
    } finally {
      setInviteLoading(false);
    }
  };

  if (loading) {
    return (
      <AppShell>
        <div className="app-panel rounded-3xl p-10 text-center text-slate-500 dark:text-slate-400">
          Loading members...
        </div>
      </AppShell>
    );
  }

  if (pageError || !workspace) {
    return (
      <AppShell>
        <div className="rounded-3xl border border-red-200 bg-red-50 p-10 text-center text-red-600 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300">
          {pageError || "Workspace not found"}
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="space-y-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <button
              onClick={() => navigate(`/workspaces/${workspaceId}`)}
              className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-blue-600"
            >
              <ArrowLeft size={16} />
              Back to Workspace
            </button>

            <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">
              Manage Members
            </h1>
            <p className="mt-3 text-slate-500 dark:text-slate-400">
              Workspace: <span className="font-semibold">{workspace.name}</span>
            </p>
          </div>

          {user?.globalRole === "admin" && (
            <button
              onClick={() => {
                setInviteOpen(true);
                setInviteError("");
                setInviteSuccess("");
              }}
              className="blue-gradient-btn inline-flex items-center gap-2 rounded-2xl px-6 py-3 text-sm font-bold text-white"
            >
              <Plus size={18} />
              Invite Member
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
          <div className="space-y-6">
            <div className="app-panel overflow-hidden">
              <div className="border-b border-slate-200 px-6 py-5 dark:border-white/10">
                <h2 className="text-xl font-black text-slate-900 dark:text-white">
                  Active Members
                </h2>
              </div>

              <div className="divide-y divide-slate-200 dark:divide-white/10">
                {!members.length ? (
                  <div className="px-6 py-10 text-center text-slate-500 dark:text-slate-400">
                    No members found.
                  </div>
                ) : (
                  members.map((member) => (
                    <div key={member.id} className="px-6 py-4">
                      <div className="flex items-center justify-between gap-4">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-bold text-slate-900 dark:text-white">
                            {member.user?.full_name || "Unnamed User"}
                          </p>
                          <p className="mt-1 truncate text-xs text-slate-500">
                            {member.user?.email || "-"}
                          </p>
                        </div>

                        <div className="text-right">
                          <p className="text-xs font-bold uppercase tracking-[0.14em] text-blue-500">
                            {member.member_role}
                          </p>
                          <p className="mt-1 text-[11px] text-slate-500">
                            {member.user?.global_role || "-"}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="app-panel overflow-hidden">
              <div className="border-b border-slate-200 px-6 py-5 dark:border-white/10">
                <h2 className="text-xl font-black text-slate-900 dark:text-white">
                  Pending Invitations
                </h2>
              </div>

              <div className="divide-y divide-slate-200 dark:divide-white/10">
                {!pendingInvitations.length ? (
                  <div className="px-6 py-10 text-center text-slate-500 dark:text-slate-400">
                    No pending invitations.
                  </div>
                ) : (
                  pendingInvitations.map((invite) => (
                    <div key={invite.id} className="px-6 py-4">
                      <div className="flex items-center justify-between gap-4">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-bold text-slate-900 dark:text-white">
                            {invite.email}
                          </p>
                          <p className="mt-1 text-xs text-slate-500">
                            Expires: {new Date(invite.expires_at).toLocaleString()}
                          </p>
                        </div>

                        <div className="text-right">
                          <p className="text-xs font-bold uppercase tracking-[0.14em] text-amber-500">
                            pending
                          </p>
                          <p className="mt-1 text-[11px] text-slate-500">
                            {invite.member_role}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="app-panel p-6">
              <div className="mb-4 flex items-center gap-3">
                <Users className="text-blue-500" size={18} />
                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                  Team Summary
                </h3>
              </div>

              <div className="space-y-4">
                <div className="rounded-xl bg-slate-50 p-4 dark:bg-white/[0.03]">
                  <p className="text-sm font-bold text-slate-900 dark:text-white">
                    Active Members
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    {members.length} members assigned
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-4 dark:bg-white/[0.03]">
                  <p className="text-sm font-bold text-slate-900 dark:text-white">
                    Pending Invites
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    {pendingInvitations.length} invitations awaiting signup
                  </p>
                </div>
              </div>
            </div>

            <div className="app-panel p-6">
              <div className="mb-4 flex items-center gap-3">
                <Mail className="text-blue-500" size={18} />
                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                  Invitation Flow
                </h3>
              </div>

              <p className="text-sm leading-7 text-slate-500 dark:text-slate-400">
                New invitations send a signup link directly to the selected user.
                The link opens your app signup screen and the invited email is already locked.
              </p>
            </div>
          </div>
        </div>

        {inviteOpen && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/60 p-4">
            <div className="w-full max-w-lg rounded-[28px] border border-slate-200 bg-white p-6 shadow-2xl dark:border-white/10 dark:bg-[#111318]">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                    Invite Member
                  </h3>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Workspace: {workspace.name}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setInviteOpen(false)}
                  className="rounded-xl p-2 text-slate-500 transition hover:bg-slate-100 dark:hover:bg-white/5"
                >
                  <X size={18} />
                </button>
              </div>

              <form className="space-y-5" onSubmit={handleSendInvite}>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={inviteForm.email}
                    onChange={handleInviteChange}
                    placeholder="user@company.com"
                    className="auth-minimal-input w-full rounded-xl px-4 py-3"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Global Role
                  </label>
                  <select
                    name="globalRole"
                    value={inviteForm.globalRole}
                    onChange={handleInviteChange}
                    className="auth-minimal-input w-full rounded-xl px-4 py-3"
                  >
                    <option value="workspace_user">workspace_user</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Workspace Role
                  </label>
                  <select
                    name="memberRole"
                    value={inviteForm.memberRole}
                    onChange={handleInviteChange}
                    className="auth-minimal-input w-full rounded-xl px-4 py-3"
                  >
                    <option value="workspace_editor">workspace_editor</option>
                  </select>
                </div>

                {inviteError ? (
                  <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300">
                    {inviteError}
                  </div>
                ) : null}

                {inviteSuccess ? (
                  <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-600 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300">
                    {inviteSuccess}
                  </div>
                ) : null}

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setInviteOpen(false)}
                    className="auth-outline-btn rounded-xl px-5 py-3 text-sm font-semibold"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={inviteLoading}
                    className="blue-gradient-btn inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {inviteLoading ? <Loader2 size={16} className="animate-spin" /> : <Mail size={16} />}
                    {inviteLoading ? "Sending..." : "Send Invitation"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}