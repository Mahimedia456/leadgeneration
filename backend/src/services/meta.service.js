import { supabase } from "../config/supabase.js";
import {
  getMetaPages,
  getMetaAdAccounts,
  getPageLeadForms,
  getFormLeads,
} from "../utils/metaClient.js";

function nowIso() {
  return new Date().toISOString();
}

export async function getWorkspaceById(workspaceId) {
  const { data, error } = await supabase
    .from("workspaces")
    .select("id, brand_id, name")
    .eq("id", workspaceId)
    .single();

  if (error) throw error;
  return data;
}

export async function upsertMetaConnection({
  workspaceId,
  connectedBy,
  metaUser,
  businesses,
  accessToken,
  expiresIn,
  scopes,
}) {
  const primaryBusiness =
    Array.isArray(businesses) && businesses.length > 0 ? businesses[0] : null;

  const tokenExpiresAt = expiresIn
    ? new Date(Date.now() + Number(expiresIn) * 1000).toISOString()
    : null;

  const { data, error } = await supabase
    .from("meta_connections")
    .upsert(
      {
        workspace_id: workspaceId,
        connected_by: connectedBy,
        provider: "meta",
        meta_user_id: metaUser.id,
        meta_user_name: metaUser.name || null,
        business_id: primaryBusiness?.id || null,
        business_name: primaryBusiness?.name || null,
        access_token: accessToken,
        token_expires_at: tokenExpiresAt,
        scopes: scopes || [],
        status: "active",
        last_synced_at: nowIso(),
      },
      {
        onConflict: "provider,meta_user_id,workspace_id",
      }
    )
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function syncWorkspaceMetaAssets(connectionId) {
  const { data: connection, error: connectionError } = await supabase
    .from("meta_connections")
    .select("*")
    .eq("id", connectionId)
    .single();

  if (connectionError || !connection) {
    throw new Error("Meta connection not found");
  }

  const userToken = connection.access_token;
  const workspaceId = connection.workspace_id;

  const pagesResponse = await getMetaPages(userToken).catch(() => ({ data: [] }));
  const adAccountsResponse = await getMetaAdAccounts(userToken).catch(() => ({
    data: [],
  }));

  for (const page of pagesResponse.data || []) {
    const { data: savedPage, error: pageError } = await supabase
      .from("meta_pages")
      .upsert(
        {
          connection_id: connection.id,
          workspace_id: workspaceId,
          page_id: page.id,
          page_name: page.name,
          page_category: page.category || null,
          page_access_token: page.access_token || null,
          tasks: page.tasks || [],
          picture_url: page.picture?.data?.url || null,
          status: "connected",
          is_selected: true,
          last_synced_at: nowIso(),
        },
        {
          onConflict: "page_id,workspace_id",
        }
      )
      .select()
      .single();

    if (pageError) throw pageError;

    const igAccount = page.instagram_business_account;

    if (igAccount?.id) {
      const { error: igError } = await supabase
        .from("meta_instagram_accounts")
        .upsert(
          {
            connection_id: connection.id,
            workspace_id: workspaceId,
            page_db_id: savedPage.id,
            ig_user_id: igAccount.id,
            username: igAccount.username || `ig_${igAccount.id}`,
            name: igAccount.name || null,
            profile_picture_url: igAccount.profile_picture_url || null,
            followers_count: Number(igAccount.followers_count || 0),
            follows_count: Number(igAccount.follows_count || 0),
            media_count: Number(igAccount.media_count || 0),
            status: "connected",
            last_synced_at: nowIso(),
          },
          {
            onConflict: "ig_user_id,workspace_id",
          }
        );

      if (igError) throw igError;
    }

    let pageLeadCount = 0;
    const formsResponse = await getPageLeadForms(
      page.id,
      page.access_token
    ).catch(() => ({ data: [] }));

    for (const form of formsResponse.data || []) {
      const { data: savedForm, error: formError } = await supabase
        .from("meta_lead_forms")
        .upsert(
          {
            page_id: savedPage.id,
            workspace_id: workspaceId,
            form_id: form.id,
            form_name: form.name || null,
            status: form.status || "active",
            locale: form.locale || null,
          },
          {
            onConflict: "form_id,workspace_id",
          }
        )
        .select()
        .single();

      if (formError) throw formError;

      const leadsResponse = await getFormLeads(
        form.id,
        page.access_token
      ).catch(() => ({ data: [] }));

      for (const lead of leadsResponse.data || []) {
        pageLeadCount += 1;

        const { error: leadError } = await supabase
          .from("meta_leads")
          .upsert(
            {
              connection_id: connection.id,
              workspace_id: workspaceId,
              page_id: savedPage.id,
              form_id: savedForm.id,
              leadgen_id: lead.id,
              ad_id: lead.ad_id || null,
              ad_name: lead.ad_name || null,
              adset_id: lead.adset_id || null,
              adset_name: lead.adset_name || null,
              campaign_id: lead.campaign_id || null,
              campaign_name: lead.campaign_name || null,
              platform: lead.platform || null,
              raw_payload: lead,
              field_data: lead.field_data || [],
              created_time: lead.created_time || null,
              synced_at: nowIso(),
            },
            {
              onConflict: "leadgen_id,workspace_id",
            }
          );

        if (leadError) throw leadError;
      }
    }

    const { error: pageUpdateError } = await supabase
      .from("meta_pages")
      .update({
        leads_last_24h: pageLeadCount,
        last_synced_at: nowIso(),
      })
      .eq("id", savedPage.id);

    if (pageUpdateError) throw pageUpdateError;
  }

  for (const adAccount of adAccountsResponse.data || []) {
    const { error: adError } = await supabase
      .from("meta_ad_accounts")
      .upsert(
        {
          connection_id: connection.id,
          workspace_id: workspaceId,
          ad_account_id:
            adAccount.account_id ||
            String(adAccount.id || "").replace(/^act_/, ""),
          account_name: adAccount.name || null,
          account_status: adAccount.account_status ?? null,
          currency: adAccount.currency || null,
          timezone_name: adAccount.timezone_name || null,
          amount_spent: Number(adAccount.amount_spent || 0),
          last_synced_at: nowIso(),
        },
        {
          onConflict: "ad_account_id,workspace_id",
        }
      );

    if (adError) throw adError;
  }

  const { error: connectionUpdateError } = await supabase
    .from("meta_connections")
    .update({
      last_synced_at: nowIso(),
      status: "active",
    })
    .eq("id", connection.id);

  if (connectionUpdateError) throw connectionUpdateError;

  return { ok: true };
}

export async function listWorkspaceMetaConnections(workspaceId) {
  const { data, error } = await supabase
    .from("meta_connections")
    .select(`
      *,
      meta_pages(count),
      meta_instagram_accounts(count),
      meta_ad_accounts(count)
    `)
    .eq("workspace_id", workspaceId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function listWorkspaceMetaPages(workspaceId) {
  const { data, error } = await supabase
    .from("meta_pages")
    .select(`
      *,
      meta_instagram_accounts(id, ig_user_id, username),
      meta_lead_forms(id, form_id, form_name)
    `)
    .eq("workspace_id", workspaceId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function getWorkspaceMetaPageDetail(workspaceId, pageId) {
  const { data, error } = await supabase
    .from("meta_pages")
    .select(`
      *,
      meta_instagram_accounts(*),
      meta_lead_forms(*),
      meta_leads(count)
    `)
    .eq("workspace_id", workspaceId)
    .eq("page_id", pageId)
    .single();

  if (error) throw error;
  return data;
}

export async function listWorkspaceInstagramAccounts(workspaceId) {
  const { data, error } = await supabase
    .from("meta_instagram_accounts")
    .select(`
      *,
      meta_pages(id, page_id, page_name)
    `)
    .eq("workspace_id", workspaceId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function getWorkspaceInstagramAccountDetail(workspaceId, accountId) {
  const { data, error } = await supabase
    .from("meta_instagram_accounts")
    .select(`
      *,
      meta_pages(id, page_id, page_name, page_category)
    `)
    .eq("workspace_id", workspaceId)
    .eq("ig_user_id", accountId)
    .single();

  if (error) throw error;
  return data;
}

export async function listWorkspaceMetaLeads(workspaceId) {
  const { data, error } = await supabase
    .from("meta_leads")
    .select(`
      *,
      meta_pages(id, page_id, page_name),
      meta_lead_forms(id, form_id, form_name)
    `)
    .eq("workspace_id", workspaceId)
    .order("created_time", { ascending: false })
    .limit(500);

  if (error) throw error;
  return data || [];
}

export async function disconnectMetaConnection(connectionId, workspaceId) {
  const { error } = await supabase
    .from("meta_connections")
    .delete()
    .eq("id", connectionId)
    .eq("workspace_id", workspaceId);

  if (error) throw error;
  return { ok: true };
}

export async function storeWebhookEvent({
  workspaceId = null,
  connectionId = null,
  object,
  entryId,
  eventType,
  payload,
}) {
  const { error } = await supabase.from("meta_webhook_events").insert({
    workspace_id: workspaceId,
    connection_id: connectionId,
    object,
    entry_id: entryId,
    event_type: eventType,
    payload,
    processed: false,
  });

  if (error) throw error;
  return { ok: true };
}