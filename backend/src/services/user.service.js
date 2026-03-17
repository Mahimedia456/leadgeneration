import { supabase } from "../config/supabase.js";

function makeError(message, statusCode = 400) {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
}

function assertAuthenticated(user) {
  if (!user?.sub) {
    throw makeError("Authenticated user is required", 401);
  }
}

function assertAdmin(user) {
  assertAuthenticated(user);

  if (user.globalRole !== "admin") {
    throw makeError("Access denied", 403);
  }
}

function assertAdminOrBrandUser(user) {
  assertAuthenticated(user);

  if (!["admin", "brand_user"].includes(user.globalRole)) {
    throw makeError("Access denied", 403);
  }
}

function normalizeUser(row) {
  if (!row) return null;

  return {
    id: row.id,
    fullName: row.full_name,
    email: row.email,
    globalRole: row.global_role,
    status: row.status,
    createdAt: row.created_at || null,
    assignedBrands: (row.brand_members || [])
      .map((item) => item?.brands)
      .filter(Boolean)
      .map((brand) => ({
        id: brand.id,
        name: brand.name,
      })),
    assignedWorkspaces: (row.workspace_members || [])
      .map((item) => item?.workspaces)
      .filter(Boolean)
      .map((workspace) => ({
        id: workspace.id,
        name: workspace.name,
      })),
  };
}

async function getUsersByIds(userIds = []) {
  const ids = [...new Set((userIds || []).filter(Boolean))];
  if (!ids.length) return [];

  const { data, error } = await supabase
    .from("users")
    .select(`
      id,
      full_name,
      email,
      global_role,
      status,
      created_at,
      brand_members:brand_members!brand_members_user_id_fkey (
        brand_id,
        brands (
          id,
          name
        )
      ),
      workspace_members:workspace_members!workspace_members_user_id_fkey (
        workspace_id,
        workspaces (
          id,
          name
        )
      )
    `)
    .in("id", ids)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return (data || []).map(normalizeUser);
}

/* ===============================
   LIST USERS
================================ */

export async function listUsersForUser(user) {
  assertAuthenticated(user);

  /* ---------- ADMIN ---------- */
  if (user.globalRole === "admin") {
    const { data, error } = await supabase
      .from("users")
      .select(`
        id,
        full_name,
        email,
        global_role,
        status,
        created_at,
        brand_members:brand_members!brand_members_user_id_fkey (
          brand_id,
          brands (
            id,
            name
          )
        ),
        workspace_members:workspace_members!workspace_members_user_id_fkey (
          workspace_id,
          workspaces (
            id,
            name
          )
        )
      `)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return (data || []).map(normalizeUser);
  }

  /* ---------- BRAND USER ---------- */
  if (user.globalRole === "brand_user") {
    const { data: myBrandMemberships, error: myBrandMembershipsError } =
      await supabase
        .from("brand_members")
        .select("brand_id")
        .eq("user_id", user.sub);

    if (myBrandMembershipsError) throw myBrandMembershipsError;

    const brandIds = (myBrandMemberships || [])
      .map((item) => item.brand_id)
      .filter(Boolean);

    if (!brandIds.length) return [];

    const { data: visibleBrandMembers, error: visibleBrandMembersError } =
      await supabase
        .from("brand_members")
        .select("user_id")
        .in("brand_id", brandIds);

    if (visibleBrandMembersError) throw visibleBrandMembersError;

    const userIds = (visibleBrandMembers || [])
      .map((item) => item.user_id)
      .filter(Boolean);

    return await getUsersByIds(userIds);
  }

  /* ---------- WORKSPACE USER ---------- */
  const { data: myWorkspaceMemberships, error: myWorkspaceMembershipsError } =
    await supabase
      .from("workspace_members")
      .select("workspace_id")
      .eq("user_id", user.sub);

  if (myWorkspaceMembershipsError) throw myWorkspaceMembershipsError;

  const workspaceIds = (myWorkspaceMemberships || [])
    .map((item) => item.workspace_id)
    .filter(Boolean);

  if (!workspaceIds.length) return [];

  const { data: visibleWorkspaceMembers, error: visibleWorkspaceMembersError } =
    await supabase
      .from("workspace_members")
      .select("user_id")
      .in("workspace_id", workspaceIds);

  if (visibleWorkspaceMembersError) throw visibleWorkspaceMembersError;

  const userIds = (visibleWorkspaceMembers || [])
    .map((item) => item.user_id)
    .filter(Boolean);

  return await getUsersByIds(userIds);
}

/* ===============================
   GET USER DETAIL
================================ */

export async function getUserById(userId, currentUser) {
  assertAuthenticated(currentUser);

  const users = await getUsersByIds([userId]);
  return users[0] || null;
}

/* ===============================
   CREATE USER
================================ */

export async function createUser(payload, currentUser) {
  assertAdminOrBrandUser(currentUser);

  const { fullName, email, password, globalRole } = payload || {};

  if (!fullName?.trim()) {
    throw makeError("Full name is required");
  }

  if (!email?.trim()) {
    throw makeError("Email is required");
  }

  if (!password?.trim()) {
    throw makeError("Password is required");
  }

  const { data, error } = await supabase
    .from("users")
    .insert({
      full_name: fullName.trim(),
      email: email.trim().toLowerCase(),
      password_hash: password,
      global_role: globalRole || "workspace_user",
      status: "active",
    })
    .select(`
      id,
      full_name,
      email,
      global_role,
      status,
      created_at,
      brand_members:brand_members!brand_members_user_id_fkey (
        brand_id,
        brands (
          id,
          name
        )
      ),
      workspace_members:workspace_members!workspace_members_user_id_fkey (
        workspace_id,
        workspaces (
          id,
          name
        )
      )
    `)
    .single();

  if (error) throw error;

  return normalizeUser(data);
}

/* ===============================
   UPDATE USER
================================ */

export async function updateUser(userId, payload, currentUser) {
  assertAdminOrBrandUser(currentUser);

  const updates = {};

  if (payload?.fullName !== undefined) {
    updates.full_name = payload.fullName;
  }

  if (payload?.globalRole !== undefined) {
    updates.global_role = payload.globalRole;
  }

  if (payload?.status !== undefined) {
    updates.status = payload.status;
  }

  if (!Object.keys(updates).length) {
    throw makeError("No fields provided for update");
  }

  const { data, error } = await supabase
    .from("users")
    .update(updates)
    .eq("id", userId)
    .select(`
      id,
      full_name,
      email,
      global_role,
      status,
      created_at,
      brand_members:brand_members!brand_members_user_id_fkey (
        brand_id,
        brands (
          id,
          name
        )
      ),
      workspace_members:workspace_members!workspace_members_user_id_fkey (
        workspace_id,
        workspaces (
          id,
          name
        )
      )
    `)
    .single();

  if (error) throw error;

  return normalizeUser(data);
}

/* ===============================
   DELETE USER
================================ */

export async function deleteUser(userId, currentUser) {
  assertAdmin(currentUser);

  if (!userId) {
    throw makeError("User ID is required");
  }

  if (currentUser.sub === userId) {
    throw makeError("You cannot delete your own account", 400);
  }

  const { error } = await supabase
    .from("users")
    .delete()
    .eq("id", userId);

  if (error) throw error;

  return {
    success: true,
    message: "User deleted successfully",
  };
}