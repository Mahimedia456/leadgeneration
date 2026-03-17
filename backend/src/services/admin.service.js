import { supabase } from "../config/supabase.js";

function assertAdmin(user) {
  if (!user?.sub) {
    throw new Error("Authenticated user is required");
  }

  if (user.globalRole !== "admin") {
    const err = new Error("Access denied");
    err.statusCode = 403;
    throw err;
  }
}

export async function getRolesPermissions(currentUser) {
  assertAdmin(currentUser);

  const { data, error } = await supabase
    .from("role_permissions")
    .select("*")
    .order("role", { ascending: true });

  if (error) throw error;

  return data || [];
}

export async function updateRolePermissions({
  currentUser,
  role,
  permissions,
}) {
  assertAdmin(currentUser);

  if (!role) {
    throw new Error("Role is required");
  }

  if (!Array.isArray(permissions)) {
    throw new Error("Permissions must be an array");
  }

  const { data: existing, error: existingError } = await supabase
    .from("role_permissions")
    .select("*")
    .eq("role", role)
    .maybeSingle();

  if (existingError) throw existingError;

  if (existing) {
    const { data, error } = await supabase
      .from("role_permissions")
      .update({
        permissions,
        updated_at: new Date().toISOString(),
      })
      .eq("role", role)
      .select("*")
      .single();

    if (error) throw error;
    return data;
  }

  const { data, error } = await supabase
    .from("role_permissions")
    .insert({
      role,
      permissions,
    })
    .select("*")
    .single();

  if (error) throw error;

  return data;
}