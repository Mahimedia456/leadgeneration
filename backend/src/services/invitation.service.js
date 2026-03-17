import crypto from "crypto";
import { supabase } from "../config/supabase.js";
import { env } from "../config/env.js";
import { hashPassword } from "../utils/password.js";
import { sendMail } from "../lib/mailer.js";
import { addUserToWorkspace } from "./workspace.service.js";
import { invitationEmailTemplate } from "../utils/invitationEmailTemplate.js";

function generateInviteToken() {
  return crypto.randomBytes(32).toString("hex");
}

function isExpired(date) {
  return new Date(date).getTime() < Date.now();
}

export async function createInvitation({
  email,
  workspaceId,
  globalRole = "workspace_user",
  memberRole = "workspace_editor",
  invitedBy,
  expiresInDays = 7,
}) {
  const normalizedEmail = String(email || "").trim().toLowerCase();

  if (!normalizedEmail) {
    throw new Error("Email is required");
  }

  if (!workspaceId) {
    throw new Error("Workspace id is required");
  }

  const { data: workspace, error: workspaceError } = await supabase
    .from("workspaces")
    .select("id, name, slug, status")
    .eq("id", workspaceId)
    .maybeSingle();

  if (workspaceError) throw workspaceError;
  if (!workspace) throw new Error("Workspace not found");
  if (workspace.status !== "active") {
    throw new Error("Workspace is not active");
  }

  const { data: inviter, error: inviterError } = await supabase
    .from("users")
    .select("id, full_name, email")
    .eq("id", invitedBy)
    .maybeSingle();

  if (inviterError) throw inviterError;

  const { data: existingPending, error: existingPendingError } = await supabase
    .from("invitations")
    .select("*")
    .eq("email", normalizedEmail)
    .eq("workspace_id", workspaceId)
    .eq("status", "pending")
    .order("created_at", { ascending: false })
    .limit(1);

  if (existingPendingError) throw existingPendingError;

  const activePending = existingPending?.find(
    (item) => !isExpired(item.expires_at)
  );

  if (activePending) {
    return activePending;
  }

  const inviteToken = generateInviteToken();
  const expiresAt = new Date(
    Date.now() + expiresInDays * 24 * 60 * 60 * 1000
  );

  const { data: invitation, error: invitationError } = await supabase
    .from("invitations")
    .insert({
      email: normalizedEmail,
      workspace_id: workspaceId,
      global_role: globalRole,
      member_role: memberRole,
      invited_by: invitedBy || null,
      invite_token: inviteToken,
      status: "pending",
      expires_at: expiresAt.toISOString(),
    })
    .select(`
      *,
      workspace:workspaces (
        id,
        name,
        slug
      )
    `)
    .single();

  if (invitationError) throw invitationError;

  const inviteUrl = `${env.appUrl}/signup?token=${inviteToken}`;

  try {
    await sendMail({
      to: normalizedEmail,
      subject: `Invitation to join ${workspace.name}`,
      text: `You have been invited to join ${workspace.name}. Open this link: ${inviteUrl}`,
      html: invitationEmailTemplate({
        inviterName: inviter?.full_name || inviter?.email || "Workspace Admin",
        workspaceName: workspace.name,
        inviteUrl,
        expiresAt: expiresAt.toISOString(),
      }),
    });
  } catch (mailError) {
    console.error("Invitation email sending failed:", mailError.message);
  }

  return invitation;
}

export async function getInvitationByToken(inviteToken) {
  if (!inviteToken) {
    throw new Error("Invitation token is required");
  }

  const { data, error } = await supabase
    .from("invitations")
    .select(`
      *,
      workspace:workspaces (
        id,
        name,
        slug,
        meta_business_name,
        status
      ),
      inviter:users!invitations_invited_by_fkey (
        id,
        full_name,
        email
      )
    `)
    .eq("invite_token", inviteToken)
    .maybeSingle();

  if (error) throw error;
  if (!data) throw new Error("Invitation not found");

  if (data.status !== "pending") {
    throw new Error("Invitation is no longer valid");
  }

  if (isExpired(data.expires_at)) {
    await supabase
      .from("invitations")
      .update({ status: "expired" })
      .eq("id", data.id);

    throw new Error("Invitation has expired");
  }

  return data;
}

export async function signupWithInvitation({
  inviteToken,
  fullName,
  password,
}) {
  if (!inviteToken) throw new Error("Invitation token is required");
  if (!fullName || !String(fullName).trim()) {
    throw new Error("Full name is required");
  }
  if (!password || String(password).length < 8) {
    throw new Error("Password must be at least 8 characters");
  }

  const invitation = await getInvitationByToken(inviteToken);
  const email = invitation.email.toLowerCase();

  const { data: existingUser, error: userFetchError } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .maybeSingle();

  if (userFetchError) throw userFetchError;

  let userId;

  if (existingUser) {
    if (existingUser.status === "active" && existingUser.password_hash) {
      throw new Error("User already activated. Please sign in.");
    }

    const passwordHash = await hashPassword(password);

    const { data: updatedUser, error: updateUserError } = await supabase
      .from("users")
      .update({
        full_name: String(fullName).trim(),
        password_hash: passwordHash,
        global_role: invitation.global_role,
        status: "active",
        is_email_verified: true,
        invited_by: invitation.invited_by || existingUser.invited_by,
      })
      .eq("id", existingUser.id)
      .select()
      .single();

    if (updateUserError) throw updateUserError;
    userId = updatedUser.id;
  } else {
    const passwordHash = await hashPassword(password);

    const { data: createdUser, error: createUserError } = await supabase
      .from("users")
      .insert({
        full_name: String(fullName).trim(),
        email,
        password_hash: passwordHash,
        global_role: invitation.global_role,
        status: "active",
        is_email_verified: true,
        invited_by: invitation.invited_by || null,
      })
      .select()
      .single();

    if (createUserError) throw createUserError;
    userId = createdUser.id;
  }

  await addUserToWorkspace({
    userId,
    workspaceId: invitation.workspace_id,
    memberRole: invitation.member_role,
    createdBy: invitation.invited_by || null,
  });

  const { error: invitationUpdateError } = await supabase
    .from("invitations")
    .update({
      status: "accepted",
      accepted_at: new Date().toISOString(),
    })
    .eq("id", invitation.id);

  if (invitationUpdateError) throw invitationUpdateError;

  const { data: user, error: finalUserError } = await supabase
    .from("users")
    .select("id, full_name, email, global_role, status, is_email_verified")
    .eq("id", userId)
    .single();

  if (finalUserError) throw finalUserError;

  return {
    success: true,
    user,
    workspace: invitation.workspace,
  };
}

export async function revokeInvitation(invitationId) {
  if (!invitationId) throw new Error("Invitation id is required");

  const { data, error } = await supabase
    .from("invitations")
    .update({
      status: "revoked",
      revoked_at: new Date().toISOString(),
    })
    .eq("id", invitationId)
    .select()
    .single();

  if (error) throw error;

  return data;
}

export async function listInvitations({ workspaceId = null, status = null } = {}) {
  let query = supabase
    .from("invitations")
    .select(`
      *,
      workspace:workspaces (
        id,
        name,
        slug
      ),
      inviter:users!invitations_invited_by_fkey (
        id,
        full_name,
        email
      )
    `)
    .order("created_at", { ascending: false });

  if (workspaceId) {
    query = query.eq("workspace_id", workspaceId);
  }

  if (status) {
    query = query.eq("status", status);
  }

  const { data, error } = await query;
  if (error) throw error;

  return data || [];
}