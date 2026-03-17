import crypto from "crypto";
import {
  exchangeCodeForShortToken,
  exchangeShortForLongLivedUserToken,
  getMetaMe,
  getMetaPermissions,
  getMetaBusinesses,
} from "../utils/metaClient.js";
import {
  getWorkspaceById,
  upsertMetaConnection,
  syncWorkspaceMetaAssets,
  listWorkspaceMetaConnections,
  listWorkspaceMetaPages,
  getWorkspaceMetaPageDetail,
  listWorkspaceInstagramAccounts,
  getWorkspaceInstagramAccountDetail,
  listWorkspaceMetaLeads,
  disconnectMetaConnection,
  storeWebhookEvent,
} from "../services/meta.service.js";
import { env } from "../config/env.js";

function getUserId(req) {
  const id = req.user?.sub || req.user?.id;
  if (!id) throw new Error("Unauthorized");
  return id;
}

function getWorkspaceId(req) {
  const workspaceId =
    req.params.workspaceId || req.query.workspace_id || req.body.workspace_id;

  if (!workspaceId) {
    throw new Error("workspace_id is required");
  }

  return workspaceId;
}

export async function getMetaOAuthUrl(req, res) {
  try {
    getUserId(req);
    const workspaceId = getWorkspaceId(req);

    await getWorkspaceById(workspaceId);

    const stateRaw = JSON.stringify({
      workspace_id: workspaceId,
      nonce: crypto.randomBytes(12).toString("hex"),
    });

    const state = Buffer.from(stateRaw).toString("base64url");

    const scopes = [
      "pages_show_list",
      "pages_read_engagement",
      "pages_manage_metadata",
      "pages_messaging",
      "instagram_basic",
      "instagram_manage_messages",
      "ads_read",
      "ads_management",
      "business_management",
      "leads_retrieval",
    ];

    const url = new URL("https://www.facebook.com/v25.0/dialog/oauth");
    url.searchParams.set("client_id", env.metaAppId);
    url.searchParams.set("redirect_uri", env.metaRedirectUri);
    url.searchParams.set("response_type", "code");
    url.searchParams.set("scope", scopes.join(","));
    url.searchParams.set("state", state);

    return res.json({ ok: true, url: url.toString() });
  } catch (error) {
    return res.status(400).json({ ok: false, message: error.message });
  }
}

export async function handleMetaOAuthCallback(req, res) {
  try {
    const code = req.query.code;
    const state = req.query.state;

    if (!code) {
      throw new Error("Missing Meta auth code");
    }

    let workspaceId = null;

    if (state) {
      try {
        const decoded = JSON.parse(
          Buffer.from(state, "base64url").toString("utf8")
        );
        workspaceId = decoded.workspace_id || null;
      } catch {
        workspaceId = null;
      }
    }

    const shortToken = await exchangeCodeForShortToken(code);
    const longToken = await exchangeShortForLongLivedUserToken(
      shortToken.access_token
    );

    const me = await getMetaMe(longToken.access_token);
    const permissions = await getMetaPermissions(longToken.access_token).catch(
      () => ({ data: [] })
    );
    const businesses = await getMetaBusinesses(longToken.access_token).catch(
      () => ({ data: [] })
    );

    const payload = Buffer.from(
      JSON.stringify({
        workspace_id: workspaceId,
        access_token: longToken.access_token,
        expires_in: longToken.expires_in,
        me,
        permissions: permissions.data || [],
        businesses: businesses.data || [],
      })
    ).toString("base64url");

    return res.redirect(
      `${env.appUrl}/meta-connections/finish?payload=${payload}`
    );
  } catch (error) {
    return res.redirect(
      `${env.appUrl}/meta-connections?status=error&message=${encodeURIComponent(
        error.message
      )}`
    );
  }
}

export async function completeMetaConnection(req, res) {
  try {
    const userId = getUserId(req);
    const workspaceId = getWorkspaceId(req);

    await getWorkspaceById(workspaceId);

    const { access_token, expires_in, me, permissions, businesses } = req.body;

    if (!access_token) throw new Error("access_token is required");
    if (!me?.id) throw new Error("Meta user data is required");

    const grantedScopes = (permissions || [])
      .filter((item) => item.status === "granted")
      .map((item) => item.permission);

    const connection = await upsertMetaConnection({
      workspaceId,
      connectedBy: userId,
      metaUser: me,
      businesses: businesses || [],
      accessToken: access_token,
      expiresIn: expires_in,
      scopes: grantedScopes,
    });

    await syncWorkspaceMetaAssets(connection.id);

    return res.json({ ok: true, connection });
  } catch (error) {
    return res.status(400).json({ ok: false, message: error.message });
  }
}

export async function syncMetaConnection(req, res) {
  try {
    getUserId(req);
    const workspaceId = getWorkspaceId(req);
    const { connectionId } = req.params;

    if (!connectionId) throw new Error("connectionId is required");

    await getWorkspaceById(workspaceId);
    await syncWorkspaceMetaAssets(connectionId);

    return res.json({ ok: true });
  } catch (error) {
    return res.status(400).json({ ok: false, message: error.message });
  }
}

export async function getConnections(req, res) {
  try {
    getUserId(req);
    const workspaceId = getWorkspaceId(req);
    const items = await listWorkspaceMetaConnections(workspaceId);
    return res.json({ ok: true, items });
  } catch (error) {
    return res.status(400).json({ ok: false, message: error.message });
  }
}

export async function getPages(req, res) {
  try {
    getUserId(req);
    const workspaceId = getWorkspaceId(req);
    const items = await listWorkspaceMetaPages(workspaceId);
    return res.json({ ok: true, items });
  } catch (error) {
    return res.status(400).json({ ok: false, message: error.message });
  }
}

export async function getPageDetail(req, res) {
  try {
    getUserId(req);
    const workspaceId = getWorkspaceId(req);
    const { pageId } = req.params;
    const item = await getWorkspaceMetaPageDetail(workspaceId, pageId);
    return res.json({ ok: true, item });
  } catch (error) {
    return res.status(400).json({ ok: false, message: error.message });
  }
}

export async function getInstagramAccounts(req, res) {
  try {
    getUserId(req);
    const workspaceId = getWorkspaceId(req);
    const items = await listWorkspaceInstagramAccounts(workspaceId);
    return res.json({ ok: true, items });
  } catch (error) {
    return res.status(400).json({ ok: false, message: error.message });
  }
}

export async function getInstagramAccountDetail(req, res) {
  try {
    getUserId(req);
    const workspaceId = getWorkspaceId(req);
    const { accountId } = req.params;
    const item = await getWorkspaceInstagramAccountDetail(
      workspaceId,
      accountId
    );
    return res.json({ ok: true, item });
  } catch (error) {
    return res.status(400).json({ ok: false, message: error.message });
  }
}

export async function getLeads(req, res) {
  try {
    getUserId(req);
    const workspaceId = getWorkspaceId(req);
    const items = await listWorkspaceMetaLeads(workspaceId);
    return res.json({ ok: true, items });
  } catch (error) {
    return res.status(400).json({ ok: false, message: error.message });
  }
}

export async function removeConnection(req, res) {
  try {
    getUserId(req);
    const workspaceId = getWorkspaceId(req);
    const { connectionId } = req.params;
    await disconnectMetaConnection(connectionId, workspaceId);
    return res.json({ ok: true });
  } catch (error) {
    return res.status(400).json({ ok: false, message: error.message });
  }
}

export async function verifyMetaWebhook(req, res) {
  const mode = req.query["hub.mode"];
  const verifyToken = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && verifyToken === env.metaVerifyToken) {
    return res.status(200).send(challenge);
  }

  return res.sendStatus(403);
}

export async function receiveMetaWebhook(req, res) {
  try {
    const body = req.body || {};
    const entries = Array.isArray(body.entry) ? body.entry : [];

    for (const entry of entries) {
      await storeWebhookEvent({
        object: body.object || "page",
        entryId: entry.id || null,
        eventType: entry?.changes?.[0]?.field || null,
        payload: entry,
      });
    }

    return res.status(200).json({ ok: true });
  } catch (error) {
    return res.status(500).json({ ok: false, message: error.message });
  }
}