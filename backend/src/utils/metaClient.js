import { env } from "../config/env.js";

const META_API_VERSION = env.metaApiVersion || "v25.0";
const META_GRAPH_BASE = `https://graph.facebook.com/${META_API_VERSION}`;

function buildUrl(path, query = {}) {
  const url = new URL(`${META_GRAPH_BASE}${path}`);

  for (const [key, value] of Object.entries(query)) {
    if (value === undefined || value === null || value === "") continue;
    url.searchParams.set(key, String(value));
  }

  return url;
}

export async function metaFetch(
  path,
  { method = "GET", token, query = {}, body } = {}
) {
  const url = buildUrl(path, {
    ...query,
    ...(token ? { access_token: token } : {}),
  });

  const response = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok || data?.error) {
    const err = new Error(
      data?.error?.message || `Meta API request failed with ${response.status}`
    );
    err.status = response.status;
    err.details = data;
    throw err;
  }

  return data;
}

export async function exchangeCodeForShortToken(code) {
  const url = new URL("https://graph.facebook.com/v25.0/oauth/access_token");
  url.searchParams.set("client_id", env.metaAppId);
  url.searchParams.set("client_secret", env.metaAppSecret);
  url.searchParams.set("redirect_uri", env.metaRedirectUri);
  url.searchParams.set("code", code);

  const response = await fetch(url);
  const data = await response.json().catch(() => ({}));

  if (!response.ok || data?.error) {
    throw new Error(data?.error?.message || "Failed to exchange Meta auth code");
  }

  return data;
}

export async function exchangeShortForLongLivedUserToken(shortToken) {
  const url = new URL("https://graph.facebook.com/v25.0/oauth/access_token");
  url.searchParams.set("grant_type", "fb_exchange_token");
  url.searchParams.set("client_id", env.metaAppId);
  url.searchParams.set("client_secret", env.metaAppSecret);
  url.searchParams.set("fb_exchange_token", shortToken);

  const response = await fetch(url);
  const data = await response.json().catch(() => ({}));

  if (!response.ok || data?.error) {
    throw new Error(
      data?.error?.message || "Failed to exchange Meta long-lived token"
    );
  }

  return data;
}

export async function getMetaMe(userToken) {
  return metaFetch("/me", {
    token: userToken,
    query: {
      fields: "id,name",
    },
  });
}

export async function getMetaPermissions(userToken) {
  return metaFetch("/me/permissions", {
    token: userToken,
  });
}

export async function getMetaBusinesses(userToken) {
  return metaFetch("/me/businesses", {
    token: userToken,
    query: {
      fields: "id,name",
      limit: 200,
    },
  });
}

export async function getMetaPages(userToken) {
  return metaFetch("/me/accounts", {
    token: userToken,
    query: {
      fields: [
        "id",
        "name",
        "category",
        "tasks",
        "access_token",
        "picture{url}",
        "instagram_business_account{id,username,name,profile_picture_url,followers_count,follows_count,media_count}",
      ].join(","),
      limit: 200,
    },
  });
}

export async function getMetaAdAccounts(userToken) {
  return metaFetch("/me/adaccounts", {
    token: userToken,
    query: {
      fields:
        "id,account_id,name,account_status,currency,timezone_name,amount_spent",
      limit: 200,
    },
  });
}

export async function getPageLeadForms(pageId, pageAccessToken) {
  return metaFetch(`/${pageId}/leadgen_forms`, {
    token: pageAccessToken,
    query: {
      fields: "id,name,status,locale",
      limit: 200,
    },
  });
}

export async function getFormLeads(formId, pageAccessToken) {
  return metaFetch(`/${formId}/leads`, {
    token: pageAccessToken,
    query: {
      fields: [
        "id",
        "created_time",
        "field_data",
        "ad_id",
        "ad_name",
        "adset_id",
        "adset_name",
        "campaign_id",
        "campaign_name",
        "platform",
      ].join(","),
      limit: 500,
    },
  });
}