import { supabase } from "../config/supabase.js";
import { slugify } from "../utils/slug.js";

async function ensureUniqueBrandSlug(name, excludeId = null) {
  const baseSlug = slugify(name);
  let slug = baseSlug || `brand-${Date.now()}`;
  let counter = 1;

  while (true) {
    let query = supabase.from("brands").select("id").eq("slug", slug);

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

function mapBrand(item) {
  if (!item) return null;

  return {
    id: item.id,
    name: item.name,
    slug: item.slug,
    brandCode: item.brand_code || "",
    industry: item.industry || "",
    website: item.website || "",
    metaBusinessName: item.meta_business_name || "",
    status: item.status || "active",
    description: item.description || "",
    activePages: item.active_pages || 0,
    activeCampaigns: item.active_campaigns || 0,
    annualRevenue: item.annual_revenue || "",
    connectFacebook: Boolean(item.connect_facebook),
    connectInstagram: Boolean(item.connect_instagram),
    logoUrl: item.logo_url || "",
    brandColor: item.brand_color || "#1152d4",
    createdAt: item.created_at,
    updatedAt: item.updated_at,
  };
}

export async function listBrandsForUser(user) {
  if (!user?.sub) throw new Error("Authenticated user is required");

  if (user.globalRole === "admin") {
    const { data, error } = await supabase
      .from("brands")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    return (data || []).map((item) => ({
      ...mapBrand(item),
      memberRole: "admin",
      accessScope: "all",
    }));
  }

  const { data, error } = await supabase
    .from("brand_members")
    .select(`
      id,
      member_role,
      brand:brands (*)
    `)
    .eq("user_id", user.sub)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return (data || [])
    .filter((item) => item.brand)
    .map((item) => ({
      ...mapBrand(item.brand),
      memberRole: item.member_role,
      accessScope: "assigned",
    }));
}

export async function getBrandById(brandId, user) {
  if (!brandId) throw new Error("Brand id is required");
  if (!user?.sub) throw new Error("Authenticated user is required");

  if (user.globalRole === "admin") {
    const { data, error } = await supabase
      .from("brands")
      .select("*")
      .eq("id", brandId)
      .maybeSingle();

    if (error) throw error;
    if (!data) throw new Error("Brand not found");

    return {
      ...mapBrand(data),
      memberRole: "admin",
    };
  }

  const { data, error } = await supabase
    .from("brand_members")
    .select(`
      member_role,
      brand:brands (*)
    `)
    .eq("brand_id", brandId)
    .eq("user_id", user.sub)
    .maybeSingle();

  if (error) throw error;

  if (!data?.brand) {
    const accessError = new Error("Access denied");
    accessError.statusCode = 403;
    throw accessError;
  }

  return {
    ...mapBrand(data.brand),
    memberRole: data.member_role,
  };
}

export async function createBrand(payload, user) {
  if (!user?.sub) throw new Error("Authenticated user is required");
  if (user.globalRole !== "admin") {
    const err = new Error("Access denied");
    err.statusCode = 403;
    throw err;
  }

  const name = String(payload.brandName || payload.name || "").trim();
  if (!name) throw new Error("Brand name is required");

  const slug = await ensureUniqueBrandSlug(name);

  const { data, error } = await supabase
    .from("brands")
    .insert({
      name,
      slug,
      brand_code: payload.brandId?.trim() || null,
      industry: payload.industry?.trim() || null,
      website: payload.website?.trim() || null,
      meta_business_name: payload.metaBusiness?.trim() || null,
      status: String(payload.status || "active").toLowerCase(),
      description: payload.description?.trim() || null,
      active_pages: Number(payload.pages || 0),
      active_campaigns: Number(payload.campaigns || 0),
      annual_revenue: payload.revenue?.trim() || null,
      connect_facebook: payload.connectFacebook ?? true,
      connect_instagram: payload.connectInstagram ?? true,
      created_by: user.sub,
    })
    .select("*")
    .single();

  if (error) throw error;

  await supabase.from("brand_members").insert({
    brand_id: data.id,
    user_id: user.sub,
    member_role: "brand_owner",
    created_by: user.sub,
  });

  return mapBrand(data);
}

export async function updateBrand(brandId, payload, user) {
  if (!brandId) throw new Error("Brand id is required");
  if (!user?.sub) throw new Error("Authenticated user is required");

  if (user.globalRole !== "admin") {
    const accessError = new Error("Access denied");
    accessError.statusCode = 403;
    throw accessError;
  }

  const updates = {};

  if (payload.brandName !== undefined || payload.name !== undefined) {
    const name = String(payload.brandName || payload.name || "").trim();
    if (!name) throw new Error("Brand name is required");
    updates.name = name;
    updates.slug = await ensureUniqueBrandSlug(name, brandId);
  }

  if (payload.brandId !== undefined) updates.brand_code = payload.brandId?.trim() || null;
  if (payload.industry !== undefined) updates.industry = payload.industry?.trim() || null;
  if (payload.website !== undefined) updates.website = payload.website?.trim() || null;
  if (payload.metaBusiness !== undefined) updates.meta_business_name = payload.metaBusiness?.trim() || null;
  if (payload.status !== undefined) updates.status = String(payload.status).toLowerCase();
  if (payload.description !== undefined) updates.description = payload.description?.trim() || null;
  if (payload.pages !== undefined) updates.active_pages = Number(payload.pages || 0);
  if (payload.campaigns !== undefined) updates.active_campaigns = Number(payload.campaigns || 0);
  if (payload.revenue !== undefined) updates.annual_revenue = payload.revenue?.trim() || null;
  if (payload.connectFacebook !== undefined) updates.connect_facebook = Boolean(payload.connectFacebook);
  if (payload.connectInstagram !== undefined) updates.connect_instagram = Boolean(payload.connectInstagram);

  const { data, error } = await supabase
    .from("brands")
    .update(updates)
    .eq("id", brandId)
    .select("*")
    .single();

  if (error) throw error;

  return mapBrand(data);
}

export async function deleteBrand(brandId, user) {
  if (!brandId) throw new Error("Brand id is required");
  if (!user?.sub) throw new Error("Authenticated user is required");

  if (user.globalRole !== "admin") {
    const err = new Error("Access denied");
    err.statusCode = 403;
    throw err;
  }

  const { error } = await supabase
    .from("brands")
    .delete()
    .eq("id", brandId);

  if (error) throw error;

  return { success: true };
}

export async function listBrandWorkspaces(brandId, user) {
  if (!brandId) throw new Error("Brand id is required");
  if (!user?.sub) throw new Error("Authenticated user is required");

  if (user.globalRole !== "admin") {
    const { data: access, error: accessError } = await supabase
      .from("brand_members")
      .select("id")
      .eq("brand_id", brandId)
      .eq("user_id", user.sub)
      .maybeSingle();

    if (accessError) throw accessError;

    if (!access) {
      const err = new Error("Access denied");
      err.statusCode = 403;
      throw err;
    }
  }

  const { data, error } = await supabase
    .from("workspaces")
    .select("*")
    .eq("brand_id", brandId)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data || [];
}