import { createClient } from "@supabase/supabase-js";
import { env } from "../config/env.js";

const supabase = createClient(env.supabaseUrl, env.supabaseServiceRoleKey);

const META_SCOPES = [
  "pages_show_list",
  "pages_read_engagement",
  "pages_manage_metadata",
  "pages_messaging",
  "business_management",
  "leads_retrieval",
  "instagram_basic",
  "instagram_manage_messages",
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

async function syncConnectionAssets({ connectionId, userToken }) {
  const me = await graph("me", {
    fields: "id,name",
    access_token: userToken,
  });

  const accounts = await graph("me/accounts", {
    fields: "id,name,category,access_token,instagram_business_account",
    access_token: userToken,
  });

  const pageItems = accounts.data || [];

  for (const page of pageItems) {
    const pagePayload = {
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

    const igBusinessId = page.instagram_business_account?.id || null;

    if (igBusinessId) {
      try {
        const ig = await graph(String(igBusinessId), {
          fields: "id,username,followers_count,media_count",
          access_token: page.access_token,
        });

        const { error: igUpsertError } = await supabase
          .from("meta_instagram_accounts")
          .upsert(
            {
              connection_id: connectionId,
              page_id: String(page.id),
              ig_user_id: String(ig.id),
              username: ig.username || "",
              followers_count: Number(ig.followers_count || 0),
              media_count: Number(ig.media_count || 0),
              status: "connected",
              last_synced_at: new Date().toISOString(),
            },
            { onConflict: "ig_user_id" }
          );

        if (igUpsertError) throw igUpsertError;
      } catch (_err) {
        // ignore IG detail fetch failures for now
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

    const { data: connection, error: insertError } = await supabase
      .from("meta_connections")
      .insert({
        workspace_id: workspaceId,
        connected_by: userId,
        business_name: null,
        meta_user_name: "Meta User",
        status: "active",
        user_access_token: longLived.access_token,
        token_expires_in: longLived.expires_in || null,
        last_synced_at: new Date().toISOString(),
      })
      .select("*")
      .single();

    if (insertError) throw insertError;

    const synced = await syncConnectionAssets({
      connectionId: connection.id,
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

    const items = (connections || []).map((connection) => {
      const relatedPages = (pages || []).filter(
        (p) => p.connection_id === connection.id
      );
      const relatedIg = (igAccounts || []).filter(
        (i) => i.connection_id === connection.id
      );

      return {
        ...connection,
        meta_pages: [{ count: relatedPages.length }],
        meta_instagram_accounts: [{ count: relatedIg.length }],
        meta_ad_accounts: [{ count: 0 }],
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
      userToken: connection.user_access_token,
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
        connectionIds.length
          ? connectionIds
          : ["00000000-0000-0000-0000-000000000000"]
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
      .eq("page_id", pageId);

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
        connectionIds.length
          ? connectionIds
          : ["00000000-0000-0000-0000-000000000000"]
      )
      .order("created_at", { ascending: false });

    if (error) throw error;

    const pageIds = (accounts || []).map((a) => a.page_id).filter(Boolean);

    const { data: pages, error: pagesError } = await supabase
      .from("meta_pages")
      .select("page_id,page_name")
      .in("page_id", pageIds.length ? pageIds : ["none"]);

    if (pagesError) throw pagesError;

    const pageMap = Object.fromEntries(
      (pages || []).map((p) => [p.page_id, p])
    );

    const items = (accounts || []).map((item) => ({
      ...item,
      meta_pages: pageMap[item.page_id] || null,
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

    if (item.page_id) {
      const { data: pageData, error: pageError } = await supabase
        .from("meta_pages")
        .select("page_id,page_name")
        .eq("page_id", item.page_id)
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