import { createClient } from "@supabase/supabase-js";
import { env } from "../config/env.js";

const supabase = createClient(env.supabaseUrl, env.supabaseServiceRoleKey);

const META_SCOPES = [
  "pages_show_list",
  "pages_read_engagement",
  "pages_read_user_content",
  "pages_manage_metadata",
  "pages_messaging",
  "business_management",
  "leads_retrieval",
  "instagram_basic",
  "instagram_manage_messages",
  "instagram_manage_insights",
  "instagram_manage_comments",
  "ads_read",
  "ads_management",
];

function getUserId(req) {
  return req.user?.sub || req.user?.id || null;
}

function buildOAuthUrl() {
  const url = new URL("https://www.facebook.com/dialog/oauth");
  url.searchParams.set("client_id", env.metaAppId);
  url.searchParams.set("redirect_uri", env.metaRedirectUri);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", META_SCOPES.join(","));
  return url.toString();
}

function normalizeAdAccountId(adAccountId) {
  if (!adAccountId) return "";
  const raw = String(adAccountId).trim();
  return raw.startsWith("act_") ? raw : `act_${raw}`;
}

function normalizeTextArray(value) {
  if (!value) return [];
  if (Array.isArray(value)) {
    return value.map((x) => String(x).trim()).filter(Boolean);
  }
  return String(value)
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean);
}

async function graph(path, params = {}) {
  const url = new URL(`https://graph.facebook.com/${env.metaApiVersion}/${path}`);

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(key, String(value));
    }
  });

  const response = await fetch(url.toString());
  const data = await response.json();

  if (!response.ok) {
    const error = new Error(data?.error?.message || "Meta request failed");
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

async function exchangeForLongLivedToken(code) {
  const shortLived = await graph("oauth/access_token", {
    client_id: env.metaAppId,
    client_secret: env.metaAppSecret,
    redirect_uri: env.metaRedirectUri,
    code,
  });

  const longLived = await graph("oauth/access_token", {
    grant_type: "fb_exchange_token",
    client_id: env.metaAppId,
    client_secret: env.metaAppSecret,
    fb_exchange_token: shortLived.access_token,
  });

  return longLived;
}

async function getUserConnections(userId) {
  const { data, error } = await supabase
    .from("meta_connections")
    .select("*")
    .eq("connected_by", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
}

async function getSelectedConnection({ userId, connectionId = "" }) {
  const connections = await getUserConnections(userId);

  if (!connections.length) {
    const error = new Error("No Meta connection found. Connect Meta first.");
    error.status = 404;
    throw error;
  }

  if (connectionId) {
    const found = connections.find((item) => item.id === connectionId);
    if (!found) {
      const error = new Error("Meta connection not found for this user.");
      error.status = 404;
      throw error;
    }
    return found;
  }

  return connections[0];
}

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

async function assertBrandAccess(user, brandId) {
  const brandIds = await getAccessibleBrandIds(user);

  if (!brandIds.includes(brandId)) {
    const err = new Error("Access denied for selected brand.");
    err.status = 403;
    throw err;
  }
}

async function syncConnectionAssets({ connectionId, workspaceId, userToken }) {
  const me = await graph("me", {
    fields: "id,name",
    access_token: userToken,
  });

  const accounts = await graph("me/accounts", {
    fields: "id,name,category,access_token,instagram_business_account",
    access_token: userToken,
  });

  console.log("META /me/accounts response:");
  console.log(JSON.stringify(accounts.data || [], null, 2));

  const pageItems = accounts.data || [];

  for (const page of pageItems) {
    const pagePayload = {
      workspace_id: workspaceId,
      connection_id: connectionId,
      page_id: String(page.id),
      page_name: page.name || "Facebook Page",
      page_category: page.category || "Facebook Page",
      page_access_token: page.access_token || "",
      status: "connected",
      last_synced_at: new Date().toISOString(),
    };

    const { error: pageUpsertError } = await supabase
      .from("meta_pages")
      .upsert(pagePayload, { onConflict: "page_id" });

    if (pageUpsertError) throw pageUpsertError;

    const { data: savedPage, error: savedPageError } = await supabase
      .from("meta_pages")
      .select("id,page_id,page_name")
      .eq("page_id", String(page.id))
      .single();

    if (savedPageError) throw savedPageError;

    const igBusinessId = page.instagram_business_account?.id || null;

    console.log("PAGE:", page.name, "| PAGE ID:", page.id, "| IG ID:", igBusinessId);

    if (igBusinessId) {
      try {
        const ig = await graph(String(igBusinessId), {
          fields: "id,username,followers_count,media_count",
          access_token: page.access_token,
        });

        console.log("IG details fetched:", ig);

        const igPayload = {
          workspace_id: workspaceId,
          connection_id: connectionId,
          page_db_id: savedPage.id,
          ig_user_id: String(ig.id),
          username: ig.username || "",
          followers_count: Number(ig.followers_count || 0),
          media_count: Number(ig.media_count || 0),
          status: "connected",
          last_synced_at: new Date().toISOString(),
        };

        const { error: igUpsertError } = await supabase
          .from("meta_instagram_accounts")
          .upsert(igPayload, { onConflict: "ig_user_id" });

        if (igUpsertError) throw igUpsertError;

        console.log("IG account saved successfully:", ig.id);
      } catch (err) {
        console.error("IG fetch/upsert failed for page:", page.id);
        console.error("IG business id:", igBusinessId);
        console.error("IG error:", err?.message || err);
      }
    }
  }

  const { error: connectionUpdateError } = await supabase
    .from("meta_connections")
    .update({
      meta_user_id: String(me.id),
      meta_user_name: me.name || "Meta User",
      status: "active",
      last_synced_at: new Date().toISOString(),
    })
    .eq("id", connectionId);

  if (connectionUpdateError) throw connectionUpdateError;

  return { me, pages: pageItems };
}

async function fetchAllGraphPages(path, params = {}) {
  let after = null;
  const all = [];

  while (true) {
    const data = await graph(path, {
      ...params,
      after,
    });

    all.push(...(data.data || []));

    after = data?.paging?.cursors?.after || null;
    if (!after) break;
  }

  return all;
}

async function fetchMetaAdAccountsByConnection(connection) {
  const accessToken = connection.user_access_token;

  if (!accessToken) {
    const error = new Error("Meta user access token missing. Reconnect Meta.");
    error.status = 400;
    throw error;
  }

  const adAccounts = await fetchAllGraphPages("me/adaccounts", {
    fields: [
      "id",
      "account_id",
      "name",
      "account_status",
      "currency",
      "timezone_name",
      "business",
    ].join(","),
    access_token: accessToken,
    limit: 100,
  });

  return adAccounts.map((item) => ({
    id: item.id,
    account_id: item.account_id,
    ad_account_id: item.id || (item.account_id ? `act_${item.account_id}` : ""),
    name: item.name || "Meta Ad Account",
    account_status: item.account_status ?? null,
    currency: item.currency || "",
    timezone_name: item.timezone_name || "",
    business: item.business || null,
    connection_id: connection.id,
  }));
}

async function fetchMetaCampaigns({ connection, adAccountId }) {
  const accessToken = connection.user_access_token;

  if (!accessToken) {
    const error = new Error("Meta user access token missing. Reconnect Meta.");
    error.status = 400;
    throw error;
  }

  const normalizedAdAccountId = normalizeAdAccountId(adAccountId);

  return fetchAllGraphPages(`${normalizedAdAccountId}/campaigns`, {
    fields: [
      "id",
      "name",
      "status",
      "objective",
      "buying_type",
      "daily_budget",
      "lifetime_budget",
      "start_time",
      "stop_time",
      "created_time",
      "updated_time",
    ].join(","),
    access_token: accessToken,
    limit: 200,
  });
}

async function fetchMetaAdSets({ connection, adAccountId }) {
  const accessToken = connection.user_access_token;

  if (!accessToken) {
    const error = new Error("Meta user access token missing. Reconnect Meta.");
    error.status = 400;
    throw error;
  }

  const normalizedAdAccountId = normalizeAdAccountId(adAccountId);

  return fetchAllGraphPages(`${normalizedAdAccountId}/adsets`, {
    fields: [
      "id",
      "name",
      "status",
      "campaign_id",
      "daily_budget",
      "lifetime_budget",
      "targeting",
      "optimization_goal",
      "start_time",
      "end_time",
      "created_time",
      "updated_time",
    ].join(","),
    access_token: accessToken,
    limit: 200,
  });
}

function mapMetaCampaignToAppRow(metaCampaign, brandId, userId, adAccountId) {
  const platform = ["Facebook", "Instagram"];
  const dailyBudget = Number(metaCampaign.daily_budget || 0) / 100;
  const lifetimeBudget = Number(metaCampaign.lifetime_budget || 0) / 100;

  return {
    brand_id: brandId,
    created_by: userId,
    updated_by: userId,
    name: metaCampaign.name || "Meta Campaign",
    objective: metaCampaign.objective || "Lead Generation",
    status: String(metaCampaign.status || "draft").toLowerCase(),
    platform,
    region: "",
    budget: lifetimeBudget || dailyBudget || 0,
    budget_type: lifetimeBudget > 0 ? "lifetime" : "daily",
    start_date: metaCampaign.start_time
      ? new Date(metaCampaign.start_time).toISOString().slice(0, 10)
      : null,
    end_date: metaCampaign.stop_time
      ? new Date(metaCampaign.stop_time).toISOString().slice(0, 10)
      : null,
    audience: "",
    description: "",
    source: "meta",
    meta_campaign_id: String(metaCampaign.id),
    impressions: 0,
    reach: 0,
    clicks: 0,
    leads: 0,
    spend: 0,
    meta_ad_account_id: normalizeAdAccountId(adAccountId),
  };
}

function mapMetaAdSetToAppRow(metaAdSet, localCampaignId, userId) {
  const dailyBudget = Number(metaAdSet.daily_budget || 0) / 100;
  const lifetimeBudget = Number(metaAdSet.lifetime_budget || 0) / 100;

  const targeting = metaAdSet.targeting || {};
  const placements = [];

  if (Array.isArray(targeting.publisher_platforms)) {
    placements.push(...targeting.publisher_platforms);
  }
  if (Array.isArray(targeting.facebook_positions)) {
    placements.push(...targeting.facebook_positions);
  }
  if (Array.isArray(targeting.instagram_positions)) {
    placements.push(...targeting.instagram_positions);
  }

  return {
    campaign_id: localCampaignId,
    created_by: userId,
    updated_by: userId,
    name: metaAdSet.name || "Meta Ad Set",
    status: String(metaAdSet.status || "draft").toLowerCase(),
    budget: lifetimeBudget || dailyBudget || 0,
    budget_type: lifetimeBudget > 0 ? "lifetime" : "daily",
    audience: JSON.stringify(targeting || {}),
    placements: normalizeTextArray(placements),
    optimization_goal: metaAdSet.optimization_goal || "",
    start_date: metaAdSet.start_time
      ? new Date(metaAdSet.start_time).toISOString().slice(0, 10)
      : null,
    end_date: metaAdSet.end_time
      ? new Date(metaAdSet.end_time).toISOString().slice(0, 10)
      : null,
    meta_adset_id: String(metaAdSet.id),
    impressions: 0,
    reach: 0,
    clicks: 0,
    leads: 0,
    spend: 0,
  };
}

async function upsertCampaignByMetaId(payload) {
  const { data: existing, error: existingError } = await supabase
    .from("campaigns")
    .select("id, meta_campaign_id")
    .eq("brand_id", payload.brand_id)
    .eq("meta_campaign_id", payload.meta_campaign_id)
    .maybeSingle();

  if (existingError) throw existingError;

  if (existing?.id) {
    const updatePayload = { ...payload };
    delete updatePayload.created_by;

    const { data, error } = await supabase
      .from("campaigns")
      .update(updatePayload)
      .eq("id", existing.id)
      .select("id, meta_campaign_id")
      .single();

    if (error) throw error;
    return data;
  }

  const { data, error } = await supabase
    .from("campaigns")
    .insert(payload)
    .select("id, meta_campaign_id")
    .single();

  if (error) throw error;
  return data;
}

async function upsertAdSetByMetaId(payload) {
  const { data: existing, error: existingError } = await supabase
    .from("ad_sets")
    .select("id, meta_adset_id")
    .eq("campaign_id", payload.campaign_id)
    .eq("meta_adset_id", payload.meta_adset_id)
    .maybeSingle();

  if (existingError) throw existingError;

  if (existing?.id) {
    const updatePayload = { ...payload };
    delete updatePayload.created_by;

    const { data, error } = await supabase
      .from("ad_sets")
      .update(updatePayload)
      .eq("id", existing.id)
      .select("id, meta_adset_id")
      .single();

    if (error) throw error;
    return data;
  }

  const { data, error } = await supabase
    .from("ad_sets")
    .insert(payload)
    .select("id, meta_adset_id")
    .single();

  if (error) throw error;
  return data;
}

export async function getMetaOAuthUrl(_req, res, next) {
  try {
    if (!env.metaAppId || !env.metaRedirectUri) {
      return res.status(500).json({
        message: "Meta app configuration is incomplete",
      });
    }

    return res.status(200).json({
      ok: true,
      url: buildOAuthUrl(),
    });
  } catch (error) {
    next(error);
  }
}

export async function exchangeMetaCode(req, res, next) {
  try {
    const userId = getUserId(req);
    const { code, workspaceId } = req.body || {};

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!workspaceId) {
      return res.status(400).json({ message: "workspaceId is required" });
    }

    if (!code) {
      return res.status(400).json({ message: "Meta authorization code is required" });
    }

    const longLived = await exchangeForLongLivedToken(code);

    const me = await graph("me", {
      fields: "id,name",
      access_token: longLived.access_token,
    });

    const { data: existingConnection, error: existingError } = await supabase
      .from("meta_connections")
      .select("*")
      .eq("workspace_id", workspaceId)
      .eq("meta_user_id", String(me.id))
      .single();

    if (existingError && existingError.code !== "PGRST116") {
      throw existingError;
    }

    let connection = null;

    if (existingConnection) {
      const { data: updatedConnection, error: updateError } = await supabase
        .from("meta_connections")
        .update({
          connected_by: userId,
          meta_user_name: me.name || "Meta User",
          business_name: me.name || null,
          status: "active",
          access_token: longLived.access_token,
          user_access_token: longLived.access_token,
          token_expires_in: longLived.expires_in || null,
          last_synced_at: new Date().toISOString(),
        })
        .eq("id", existingConnection.id)
        .select("*")
        .single();

      if (updateError) throw updateError;
      connection = updatedConnection;
    } else {
      const { data: insertedConnection, error: insertError } = await supabase
        .from("meta_connections")
        .insert({
          workspace_id: workspaceId,
          connected_by: userId,
          meta_user_id: String(me.id),
          meta_user_name: me.name || "Meta User",
          business_name: me.name || null,
          status: "active",
          access_token: longLived.access_token,
          user_access_token: longLived.access_token,
          token_expires_in: longLived.expires_in || null,
          last_synced_at: new Date().toISOString(),
        })
        .select("*")
        .single();

      if (insertError) throw insertError;
      connection = insertedConnection;
    }

    const synced = await syncConnectionAssets({
      connectionId: connection.id,
      workspaceId,
      userToken: longLived.access_token,
    });

    return res.status(200).json({
      ok: true,
      message: "Meta connected successfully",
      connectionId: connection.id,
      metaUser: synced.me,
      pages: synced.pages,
    });
  } catch (error) {
    next(error);
  }
}

export async function getMetaConnections(req, res, next) {
  try {
    const userId = getUserId(req);

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { data: connections, error } = await supabase
      .from("meta_connections")
      .select("*")
      .eq("connected_by", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;

    const { data: pages, error: pagesError } = await supabase
      .from("meta_pages")
      .select("*");

    if (pagesError) throw pagesError;

    const { data: igAccounts, error: igError } = await supabase
      .from("meta_instagram_accounts")
      .select("*");

    if (igError) throw igError;

    let adAccounts = [];
    try {
      const { data: metaAdAccounts, error: metaAdAccountsError } = await supabase
        .from("meta_ad_accounts")
        .select("*");

      if (metaAdAccountsError && metaAdAccountsError.code !== "42P01") {
        throw metaAdAccountsError;
      }

      adAccounts = metaAdAccounts || [];
    } catch {
      adAccounts = [];
    }

    const items = (connections || []).map((connection) => {
      const relatedPages = (pages || []).filter((p) => p.connection_id === connection.id);
      const relatedIg = (igAccounts || []).filter((i) => i.connection_id === connection.id);
      const relatedAdAccounts = (adAccounts || []).filter((a) => a.connection_id === connection.id);

      return {
        ...connection,
        meta_pages: [{ count: relatedPages.length }],
        meta_instagram_accounts: [{ count: relatedIg.length }],
        meta_ad_accounts: [{ count: relatedAdAccounts.length }],
      };
    });

    return res.status(200).json({ ok: true, items });
  } catch (error) {
    next(error);
  }
}

export async function syncMetaConnection(req, res, next) {
  try {
    const { connectionId } = req.params;
    const userId = getUserId(req);

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { data: connection, error } = await supabase
      .from("meta_connections")
      .select("*")
      .eq("id", connectionId)
      .eq("connected_by", userId)
      .single();

    if (error) throw error;

    if (!connection) {
      return res.status(404).json({ message: "Meta connection not found" });
    }

    await syncConnectionAssets({
      connectionId: connection.id,
      workspaceId: connection.workspace_id,
      userToken: connection.user_access_token || connection.access_token,
    });

    return res.status(200).json({
      ok: true,
      message: "Meta connection synced successfully",
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteMetaConnection(req, res, next) {
  try {
    const { connectionId } = req.params;
    const userId = getUserId(req);

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { data: connection, error: connectionError } = await supabase
      .from("meta_connections")
      .select("id")
      .eq("id", connectionId)
      .eq("connected_by", userId)
      .single();

    if (connectionError) throw connectionError;

    if (!connection) {
      return res.status(404).json({ message: "Meta connection not found" });
    }

    const { error: deleteIgError } = await supabase
      .from("meta_instagram_accounts")
      .delete()
      .eq("connection_id", connectionId);

    if (deleteIgError) throw deleteIgError;

    const { error: deletePagesError } = await supabase
      .from("meta_pages")
      .delete()
      .eq("connection_id", connectionId);

    if (deletePagesError) throw deletePagesError;

    try {
      const { error: deleteAdAccountsError } = await supabase
        .from("meta_ad_accounts")
        .delete()
        .eq("connection_id", connectionId);

      if (deleteAdAccountsError && deleteAdAccountsError.code !== "42P01") {
        throw deleteAdAccountsError;
      }
    } catch (err) {
      if (err?.code !== "42P01") throw err;
    }

    const { error: deleteConnectionError } = await supabase
      .from("meta_connections")
      .delete()
      .eq("id", connectionId);

    if (deleteConnectionError) throw deleteConnectionError;

    return res.status(200).json({
      ok: true,
      message: "Meta connection removed",
    });
  } catch (error) {
    next(error);
  }
}

export async function getMetaPages(req, res, next) {
  try {
    const userId = getUserId(req);

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { data: connections, error: connectionsError } = await supabase
      .from("meta_connections")
      .select("id")
      .eq("connected_by", userId);

    if (connectionsError) throw connectionsError;

    const connectionIds = (connections || []).map((item) => item.id);

    const { data: pages, error } = await supabase
      .from("meta_pages")
      .select("*")
      .in(
        "connection_id",
        connectionIds.length ? connectionIds : ["00000000-0000-0000-0000-000000000000"]
      )
      .order("created_at", { ascending: false });

    if (error) throw error;

    const items = (pages || []).map((page) => ({
      ...page,
      leads_last_24h: 0,
    }));

    return res.status(200).json({ ok: true, items });
  } catch (error) {
    next(error);
  }
}

export async function getMetaPageDetail(req, res, next) {
  try {
    const { pageId } = req.params;
    const userId = getUserId(req);

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { data: page, error } = await supabase
      .from("meta_pages")
      .select("*")
      .eq("page_id", pageId)
      .single();

    if (error) throw error;

    if (!page) {
      return res.status(404).json({ message: "Meta page not found" });
    }

    const { data: connection, error: connectionError } = await supabase
      .from("meta_connections")
      .select("id, connected_by")
      .eq("id", page.connection_id)
      .eq("connected_by", userId)
      .single();

    if (connectionError) throw connectionError;

    if (!connection) {
      return res.status(404).json({ message: "Meta page not found" });
    }

    const { data: igAccounts, error: igError } = await supabase
      .from("meta_instagram_accounts")
      .select("*")
      .eq("page_db_id", page.id);

    if (igError) throw igError;

    const item = {
      ...page,
      meta_leads: [{ count: 0 }],
      meta_lead_forms: [],
      meta_instagram_accounts: igAccounts || [],
    };

    return res.status(200).json({ ok: true, item });
  } catch (error) {
    next(error);
  }
}

export async function getMetaInstagramAccounts(req, res, next) {
  try {
    const userId = getUserId(req);

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { data: connections, error: connectionsError } = await supabase
      .from("meta_connections")
      .select("id")
      .eq("connected_by", userId);

    if (connectionsError) throw connectionsError;

    const connectionIds = (connections || []).map((item) => item.id);

    const { data: accounts, error } = await supabase
      .from("meta_instagram_accounts")
      .select("*")
      .in(
        "connection_id",
        connectionIds.length ? connectionIds : ["00000000-0000-0000-0000-000000000000"]
      )
      .order("created_at", { ascending: false });

    if (error) throw error;

    const pageDbIds = (accounts || []).map((a) => a.page_db_id).filter(Boolean);

    const { data: pages, error: pagesError } = await supabase
      .from("meta_pages")
      .select("id,page_id,page_name")
      .in("id", pageDbIds.length ? pageDbIds : ["00000000-0000-0000-0000-000000000000"]);

    if (pagesError) throw pagesError;

    const pageMap = Object.fromEntries((pages || []).map((p) => [p.id, p]));

    const items = (accounts || []).map((item) => ({
      ...item,
      meta_pages: pageMap[item.page_db_id] || null,
    }));

    return res.status(200).json({ ok: true, items });
  } catch (error) {
    next(error);
  }
}

export async function getMetaInstagramDetail(req, res, next) {
  try {
    const { accountId } = req.params;
    const userId = getUserId(req);

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { data: item, error } = await supabase
      .from("meta_instagram_accounts")
      .select("*")
      .eq("ig_user_id", accountId)
      .single();

    if (error) throw error;

    if (!item) {
      return res.status(404).json({ message: "Instagram account not found" });
    }

    const { data: connection, error: connectionError } = await supabase
      .from("meta_connections")
      .select("id, connected_by")
      .eq("id", item.connection_id)
      .eq("connected_by", userId)
      .single();

    if (connectionError) throw connectionError;

    if (!connection) {
      return res.status(404).json({ message: "Instagram account not found" });
    }

    let page = null;

    if (item.page_db_id) {
      const { data: pageData, error: pageError } = await supabase
        .from("meta_pages")
        .select("id,page_id,page_name")
        .eq("id", item.page_db_id)
        .single();

      if (pageError && pageError.code !== "PGRST116") throw pageError;
      page = pageData || null;
    }

    return res.status(200).json({
      ok: true,
      item: {
        ...item,
        meta_pages: page,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function getMetaAdAccounts(req, res, next) {
  try {
    const userId = getUserId(req);
    const { connectionId = "" } = req.query;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const connection = await getSelectedConnection({ userId, connectionId });
    const items = await fetchMetaAdAccountsByConnection(connection);

    try {
      for (const item of items) {
        const payload = {
          connection_id: connection.id,
          workspace_id: connection.workspace_id,
          ad_account_id: item.ad_account_id,
          account_id: String(item.account_id || ""),
          name: item.name,
          account_status: item.account_status,
          currency: item.currency,
          timezone_name: item.timezone_name,
          business_name: item.business?.name || null,
          raw_json: item,
          last_synced_at: new Date().toISOString(),
        };

        const { error } = await supabase
          .from("meta_ad_accounts")
          .upsert(payload, { onConflict: "ad_account_id" });

        if (error && error.code !== "42P01") {
          throw error;
        }
      }
    } catch (err) {
      if (err?.code !== "42P01") throw err;
    }

    return res.status(200).json({
      ok: true,
      items,
      connectionId: connection.id,
    });
  } catch (error) {
    next(error);
  }
}

export async function getMetaAdAccountCampaigns(req, res, next) {
  try {
    const userId = getUserId(req);
    const { adAccountId } = req.params;
    const { connectionId = "" } = req.query;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const connection = await getSelectedConnection({ userId, connectionId });
    const items = await fetchMetaCampaigns({
      connection,
      adAccountId,
    });

    return res.status(200).json({
      ok: true,
      items,
      adAccountId: normalizeAdAccountId(adAccountId),
      connectionId: connection.id,
    });
  } catch (error) {
    next(error);
  }
}

export async function getMetaAdAccountAdSets(req, res, next) {
  try {
    const userId = getUserId(req);
    const { adAccountId } = req.params;
    const { connectionId = "" } = req.query;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const connection = await getSelectedConnection({ userId, connectionId });
    const items = await fetchMetaAdSets({
      connection,
      adAccountId,
    });

    return res.status(200).json({
      ok: true,
      items,
      adAccountId: normalizeAdAccountId(adAccountId),
      connectionId: connection.id,
    });
  } catch (error) {
    next(error);
  }
}

export async function syncMetaAdAccountCampaigns(req, res, next) {
  try {
    const userId = getUserId(req);
    const { adAccountId } = req.params;
    const { brandId, connectionId = "" } = req.body || {};

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!brandId) {
      return res.status(400).json({ message: "brandId is required" });
    }

    await assertBrandAccess(req.user, brandId);

    const connection = await getSelectedConnection({ userId, connectionId });

    const metaCampaigns = await fetchMetaCampaigns({
      connection,
      adAccountId,
    });

    const metaAdSets = await fetchMetaAdSets({
      connection,
      adAccountId,
    });

    const localCampaignMap = new Map();

    for (const metaCampaign of metaCampaigns) {
      const payload = mapMetaCampaignToAppRow(
        metaCampaign,
        brandId,
        req.user?.sub || req.user?.id,
        adAccountId
      );

      const saved = await upsertCampaignByMetaId(payload);
      localCampaignMap.set(String(metaCampaign.id), saved.id);
    }

    let adSetCount = 0;

    for (const metaAdSet of metaAdSets) {
      const localCampaignId = localCampaignMap.get(String(metaAdSet.campaign_id));
      if (!localCampaignId) continue;

      const payload = mapMetaAdSetToAppRow(
        metaAdSet,
        localCampaignId,
        req.user?.sub || req.user?.id
      );

      await upsertAdSetByMetaId(payload);
      adSetCount += 1;
    }

    return res.status(200).json({
      ok: true,
      message: "Meta campaigns and ad sets synced successfully",
      summary: {
        campaigns: metaCampaigns.length,
        adSets: adSetCount,
        adAccountId: normalizeAdAccountId(adAccountId),
        brandId,
        connectionId: connection.id,
      },
    });
  } catch (error) {
    next(error);
  }
}

export function verifyMetaWebhook(req, res) {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === env.metaVerifyToken) {
    return res.status(200).send(challenge);
  }

  return res.sendStatus(403);
}

export function receiveMetaWebhook(req, res) {
  console.log("META WEBHOOK:", JSON.stringify(req.body, null, 2));
  return res.status(200).send("EVENT_RECEIVED");
}