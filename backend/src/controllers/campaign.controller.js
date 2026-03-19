import { supabase } from "../config/supabase.js";

async function getAccessibleBrandIds(user) {
  if (!user?.sub) return [];

  if (user.globalRole === "admin" || user.global_role === "admin") {
    const { data, error } = await supabase.from("brands").select("id");
    if (error) throw error;
    return (data || []).map((item) => item.id);
  }

  const { data, error } = await supabase
    .from("brand_members")
    .select("brand_id")
    .eq("user_id", user.sub);

  if (error) throw error;
  return (data || []).map((item) => item.brand_id);
}

function mapCampaignRow(row) {
  const clicks = Number(row.clicks || 0);
  const impressions = Number(row.impressions || 0);
  const spend = Number(row.spend || 0);
  const leads = Number(row.leads || 0);

  return {
    id: row.id,
    brandId: row.brand_id,
    brandName: row.brands?.name || "",
    name: row.name,
    objective: row.objective || "",
    status: row.status || "draft",
    platform: row.platform || [],
    region: row.region || "",
    budget: Number(row.budget || 0),
    budgetType: row.budget_type || "daily",
    startDate: row.start_date,
    endDate: row.end_date,
    audience: row.audience || "",
    description: row.description || "",
    source: row.source || "meta",
    metaCampaignId: row.meta_campaign_id || "",
    metaAdAccountId: row.meta_ad_account_id || "",
    impressions,
    reach: Number(row.reach || 0),
    clicks,
    leads,
    spend,
    ctr: impressions > 0 ? Number(((clicks / impressions) * 100).toFixed(2)) : 0,
    cpl: leads > 0 ? Number((spend / leads).toFixed(2)) : 0,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapAdSetRow(row) {
  const clicks = Number(row.clicks || 0);
  const impressions = Number(row.impressions || 0);
  const spend = Number(row.spend || 0);
  const leads = Number(row.leads || 0);

  return {
    id: row.id,
    campaignId: row.campaign_id,
    campaignName: row.campaigns?.name || "",
    name: row.name,
    status: row.status || "draft",
    budget: Number(row.budget || 0),
    budgetType: row.budget_type || "daily",
    audience: row.audience || "",
    placements: row.placements || [],
    optimizationGoal: row.optimization_goal || "",
    startDate: row.start_date,
    endDate: row.end_date,
    metaAdsetId: row.meta_adset_id || "",
    impressions,
    reach: Number(row.reach || 0),
    clicks,
    leads,
    spend,
    ctr: impressions > 0 ? Number(((clicks / impressions) * 100).toFixed(2)) : 0,
    cpl: leads > 0 ? Number((spend / leads).toFixed(2)) : 0,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function listCampaigns(req, res) {
  try {
    const brandIds = await getAccessibleBrandIds(req.user);

    if (!brandIds.length) {
      return res.json({
        stats: {
          totalCampaigns: 0,
          active: 0,
          paused: 0,
          draft: 0,
          totalSpend: 0,
          totalLeads: 0,
          avgCpl: 0,
        },
        campaigns: [],
      });
    }

    const { brandId = "", q = "", status = "", objective = "" } = req.query;

    let query = supabase
      .from("campaigns")
      .select(`
        *,
        brands ( id, name )
      `)
      .in("brand_id", brandIds)
      .order("created_at", { ascending: false });

    if (brandId) query = query.eq("brand_id", brandId);
    if (status) query = query.eq("status", status);
    if (objective) query = query.eq("objective", objective);
    if (q) {
      query = query.or(`name.ilike.%${q}%,objective.ilike.%${q}%,region.ilike.%${q}%`);
    }

    const { data, error } = await query;
    if (error) throw error;

    const campaigns = (data || []).map(mapCampaignRow);

    const totalSpend = campaigns.reduce((sum, item) => sum + item.spend, 0);
    const totalLeads = campaigns.reduce((sum, item) => sum + item.leads, 0);

    return res.json({
      stats: {
        totalCampaigns: campaigns.length,
        active: campaigns.filter((item) => item.status === "active").length,
        paused: campaigns.filter((item) => item.status === "paused").length,
        draft: campaigns.filter((item) => item.status === "draft").length,
        totalSpend,
        totalLeads,
        avgCpl: totalLeads > 0 ? Number((totalSpend / totalLeads).toFixed(2)) : 0,
      },
      campaigns,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      message: error.message || "Failed to fetch campaigns.",
    });
  }
}

export async function getCampaignDetail(req, res) {
  try {
    const { id } = req.params;
    const brandIds = await getAccessibleBrandIds(req.user);

    const { data, error } = await supabase
      .from("campaigns")
      .select(`
        *,
        brands ( id, name )
      `)
      .eq("id", id)
      .single();

    if (error || !data) {
      return res.status(404).json({ message: "Campaign not found." });
    }

    if (!brandIds.includes(data.brand_id)) {
      return res.status(403).json({ message: "Access denied." });
    }

    const { data: adSetRows, error: adSetError } = await supabase
      .from("ad_sets")
      .select(`
        *,
        campaigns ( id, name )
      `)
      .eq("campaign_id", id)
      .order("created_at", { ascending: false });

    if (adSetError) throw adSetError;

    return res.json({
      campaign: mapCampaignRow(data),
      adSets: (adSetRows || []).map(mapAdSetRow),
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      message: error.message || "Failed to fetch campaign detail.",
    });
  }
}

export async function listAdSets(req, res) {
  try {
    const brandIds = await getAccessibleBrandIds(req.user);
    const { campaignId = "", q = "", status = "" } = req.query;

    if (!brandIds.length) {
      return res.json({ adSets: [] });
    }

    const { data: campaigns, error: campaignsError } = await supabase
      .from("campaigns")
      .select("id")
      .in("brand_id", brandIds);

    if (campaignsError) throw campaignsError;

    let campaignIds = (campaigns || []).map((item) => item.id);

    if (campaignId) {
      campaignIds = campaignIds.filter((id) => id === campaignId);
    }

    if (!campaignIds.length) {
      return res.json({ adSets: [] });
    }

    let query = supabase
      .from("ad_sets")
      .select(`
        *,
        campaigns ( id, name )
      `)
      .in("campaign_id", campaignIds)
      .order("created_at", { ascending: false });

    if (status) query = query.eq("status", status);
    if (q) {
      query = query.or(`name.ilike.%${q}%,optimization_goal.ilike.%${q}%,audience.ilike.%${q}%`);
    }

    const { data, error } = await query;
    if (error) throw error;

    return res.json({
      adSets: (data || []).map(mapAdSetRow),
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      message: error.message || "Failed to fetch ad sets.",
    });
  }
}

export async function deleteCampaign(req, res) {
  try {
    const { id } = req.params;
    const brandIds = await getAccessibleBrandIds(req.user);

    const { data: existing, error: findError } = await supabase
      .from("campaigns")
      .select("id, brand_id")
      .eq("id", id)
      .single();

    if (findError || !existing) {
      return res.status(404).json({ message: "Campaign not found." });
    }

    if (!brandIds.includes(existing.brand_id)) {
      return res.status(403).json({ message: "Access denied." });
    }

    const { error } = await supabase.from("campaigns").delete().eq("id", id);
    if (error) throw error;

    return res.json({
      success: true,
      message: "Campaign removed from local synced records.",
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      message: error.message || "Failed to delete campaign.",
    });
  }
}