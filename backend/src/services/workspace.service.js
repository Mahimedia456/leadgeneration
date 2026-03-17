import { supabase } from "../config/supabase.js";
import { slugify } from "../utils/slug.js";

async function ensureUniqueWorkspaceSlug(name, excludeId = null) {
  const baseSlug = slugify(name);
  let slug = baseSlug || `workspace-${Date.now()}`;
  let counter = 1;

  while (true) {
    let query = supabase.from("workspaces").select("id").eq("slug", slug);

    if (excludeId) {
      query = query.neq("id", excludeId);
    }

    const { data, error } = await query.maybeSingle();

    if (error) throw error;
    if (!data) return slug;

    counter += 1;
    slug = `${baseSlug}-${counter}`;
  }
}

function mapWorkspace(item) {
  if (!item) return null;

  return {
    id: item.id,
    name: item.name,
    slug: item.slug,
    metaBusinessName: item.meta_business_name || "",
    description: item.description || "",
    status: item.status,
    industry: item.industry || "",
    primaryContactEmail: item.primary_contact_email || "",
    logoUrl: item.logo_url || "",
    brandColor: item.brand_color || "#1152d4",
    region: item.region || "",
    timezone: item.timezone || "",
    createdAt: item.created_at,
    updatedAt: item.updated_at,
  };
}

export async function listWorkspacesForUser(user) {
  if (!user?.sub) {
    throw new Error("Authenticated user is required");
  }

  if (user.globalRole === "admin") {
    const { data, error } = await supabase
      .from("workspaces")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    return (data || []).map((item) => ({
      ...mapWorkspace(item),
      memberRole: "admin",
      accessScope: "all",
    }));
  }

  if (user.globalRole === "brand_user") {
    const { data: brandMemberships, error: brandMembershipError } = await supabase
      .from("brand_members")
      .select("brand_id, member_role")
      .eq("user_id", user.sub);

    if (brandMembershipError) throw brandMembershipError;

    const brandIds = (brandMemberships || []).map((item) => item.brand_id);

    if (!brandIds.length) {
      return [];
    }

    const { data: workspaces, error: workspaceError } = await supabase
      .from("workspaces")
      .select("*")
      .in("brand_id", brandIds)
      .order("created_at", { ascending: false });

    if (workspaceError) throw workspaceError;

    return (workspaces || []).map((item) => ({
      ...mapWorkspace(item),
      memberRole: "brand_owner",
      accessScope: "brand",
    }));
  }

  const { data, error } = await supabase
    .from("workspace_members")
    .select(`
      id,
      member_role,
      workspace_id,
      workspace:workspaces (*)
    `)
    .eq("user_id", user.sub)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return (data || [])
    .filter((item) => item.workspace)
    .map((item) => ({
      ...mapWorkspace(item.workspace),
      memberRole: item.member_role,
      accessScope: "assigned",
    }));
}

export async function listAllWorkspaces() {
  const { data, error } = await supabase
    .from("workspaces")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;

  return (data || []).map(mapWorkspace);
}

export async function getWorkspaceById(workspaceId, user) {
  if (!workspaceId) {
    throw new Error("Workspace id is required");
  }

  if (!user?.sub) {
    throw new Error("Authenticated user is required");
  }

  if (user.globalRole === "admin") {
    const { data, error } = await supabase
      .from("workspaces")
      .select("*")
      .eq("id", workspaceId)
      .maybeSingle();

    if (error) throw error;
    if (!data) throw new Error("Workspace not found");

    return {
      ...mapWorkspace(data),
      memberRole: "admin",
    };
  }

  if (user.globalRole === "brand_user") {
    const { data: brandMemberships, error: brandMembershipError } = await supabase
      .from("brand_members")
      .select("brand_id, member_role")
      .eq("user_id", user.sub);

    if (brandMembershipError) throw brandMembershipError;

    const brandIds = (brandMemberships || []).map((item) => item.brand_id);

    if (!brandIds.length) {
      const accessError = new Error("Access denied");
      accessError.statusCode = 403;
      throw accessError;
    }

    const { data: workspace, error: workspaceError } = await supabase
      .from("workspaces")
      .select("*")
      .eq("id", workspaceId)
      .in("brand_id", brandIds)
      .maybeSingle();

    if (workspaceError) throw workspaceError;

    if (!workspace) {
      const accessError = new Error("Access denied");
      accessError.statusCode = 403;
      throw accessError;
    }

    return {
      ...mapWorkspace(workspace),
      memberRole: "brand_owner",
    };
  }

  const { data, error } = await supabase
    .from("workspace_members")
    .select(`
      member_role,
      workspace_id,
      workspace:workspaces (*)
    `)
    .eq("workspace_id", workspaceId)
    .eq("user_id", user.sub)
    .maybeSingle();

  if (error) throw error;

  if (!data?.workspace) {
    const accessError = new Error("Access denied");
    accessError.statusCode = 403;
    throw accessError;
  }

  return {
    ...mapWorkspace(data.workspace),
    memberRole: data.member_role,
  };
}

export async function createWorkspace({
  name,
  metaBusinessName = "",
  description = "",
  industry = "",
  primaryContactEmail = "",
  logoUrl = "",
  brandColor = "#1152d4",
  region = "",
  timezone = "",
  createdBy = null,
}) {
  if (!name || !String(name).trim()) {
    throw new Error("Workspace name is required");
  }

  const slug = await ensureUniqueWorkspaceSlug(name);

  const { data, error } = await supabase
    .from("workspaces")
    .insert({
      name: String(name).trim(),
      slug,
      meta_business_name: metaBusinessName?.trim() || null,
      description: description?.trim() || null,
      industry: industry?.trim() || null,
      primary_contact_email: primaryContactEmail?.trim() || null,
      logo_url: logoUrl?.trim() || null,
      brand_color: brandColor || "#1152d4",
      region: region?.trim() || null,
      timezone: timezone?.trim() || null,
      status: "active",
      created_by: createdBy || null,
    })
    .select("*")
    .single();

  if (error) throw error;

  return mapWorkspace(data);
}

export async function updateWorkspace(workspaceId, payload, user) {
  if (!workspaceId) {
    throw new Error("Workspace id is required");
  }

  if (!user?.sub) {
    throw new Error("Authenticated user is required");
  }

  if (user.globalRole !== "admin") {
    const accessError = new Error("Access denied");
    accessError.statusCode = 403;
    throw accessError;
  }

  const updates = {};

  if (payload.name !== undefined) {
    const name = String(payload.name || "").trim();
    if (!name) {
      throw new Error("Workspace name is required");
    }
    updates.name = name;
    updates.slug = await ensureUniqueWorkspaceSlug(name, workspaceId);
  }

  if (payload.metaBusinessName !== undefined) {
    updates.meta_business_name = payload.metaBusinessName?.trim() || null;
  }

  if (payload.description !== undefined) {
    updates.description = payload.description?.trim() || null;
  }

  if (payload.industry !== undefined) {
    updates.industry = payload.industry?.trim() || null;
  }

  if (payload.primaryContactEmail !== undefined) {
    updates.primary_contact_email = payload.primaryContactEmail?.trim() || null;
  }

  if (payload.logoUrl !== undefined) {
    updates.logo_url = payload.logoUrl?.trim() || null;
  }

  if (payload.brandColor !== undefined) {
    updates.brand_color = payload.brandColor || "#1152d4";
  }

  if (payload.region !== undefined) {
    updates.region = payload.region?.trim() || null;
  }

  if (payload.timezone !== undefined) {
    updates.timezone = payload.timezone?.trim() || null;
  }

  if (payload.status !== undefined) {
    updates.status = payload.status;
  }

  const { data, error } = await supabase
    .from("workspaces")
    .update(updates)
    .eq("id", workspaceId)
    .select("*")
    .single();

  if (error) throw error;

  return mapWorkspace(data);
}

export async function deleteWorkspace(workspaceId, user) {
  if (!workspaceId) {
    throw new Error("Workspace id is required");
  }

  if (!user?.sub) {
    throw new Error("Authenticated user is required");
  }

  if (user.globalRole !== "admin") {
    const accessError = new Error("Access denied");
    accessError.statusCode = 403;
    throw accessError;
  }

  const { error } = await supabase
    .from("workspaces")
    .delete()
    .eq("id", workspaceId);

  if (error) throw error;

  return { success: true };
}

export async function addUserToWorkspace({
  userId,
  workspaceId,
  memberRole = "workspace_editor",
  createdBy = null,
}) {
  if (!userId) throw new Error("User id is required");
  if (!workspaceId) throw new Error("Workspace id is required");

  const { data: existing, error: existingError } = await supabase
    .from("workspace_members")
    .select("id, user_id, workspace_id, member_role")
    .eq("user_id", userId)
    .eq("workspace_id", workspaceId)
    .maybeSingle();

  if (existingError) throw existingError;

  if (existing) {
    return existing;
  }

  const { data, error } = await supabase
    .from("workspace_members")
    .insert({
      user_id: userId,
      workspace_id: workspaceId,
      member_role: memberRole,
      created_by: createdBy || null,
    })
    .select("*")
    .single();

  if (error) throw error;

  return data;
}

export async function listWorkspaceMembers(workspaceId, user) {
  if (!workspaceId) {
    throw new Error("Workspace id is required");
  }

  if (!user?.sub) {
    throw new Error("Authenticated user is required");
  }

  if (user.globalRole !== "admin") {
    const { data: access, error: accessError } = await supabase
      .from("workspace_members")
      .select("id")
      .eq("workspace_id", workspaceId)
      .eq("user_id", user.sub)
      .maybeSingle();

    if (accessError) throw accessError;

    if (!access) {
      const denied = new Error("Access denied");
      denied.statusCode = 403;
      throw denied;
    }
  }

  const { data: memberRows, error: memberError } = await supabase
    .from("workspace_members")
    .select("id, user_id, member_role, created_at")
    .eq("workspace_id", workspaceId)
    .order("created_at", { ascending: false });

  if (memberError) throw memberError;

  const userIds = (memberRows || []).map((row) => row.user_id);

  if (!userIds.length) {
    return [];
  }

  const { data: users, error: usersError } = await supabase
    .from("users")
    .select("id, full_name, email, global_role, status")
    .in("id", userIds);

  if (usersError) throw usersError;

  const usersMap = new Map((users || []).map((u) => [u.id, u]));

  return (memberRows || []).map((row) => ({
    id: row.id,
    member_role: row.member_role,
    created_at: row.created_at,
    user: usersMap.get(row.user_id) || null,
  }));
}