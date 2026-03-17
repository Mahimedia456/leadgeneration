export function buildMetaOAuthUrl() {
  const appId = import.meta.env.VITE_META_APP_ID;
  const redirectUri = import.meta.env.VITE_META_REDIRECT_URI;

  if (!appId) throw new Error("VITE_META_APP_ID is missing");
  if (!redirectUri) throw new Error("VITE_META_REDIRECT_URI is missing");

  const scopes = [
    "pages_show_list",
    "pages_read_engagement",
    "pages_manage_metadata",
    "pages_messaging",
    "business_management",
    "leads_retrieval",
    "instagram_basic",
    "instagram_manage_messages",
  ];

  const url = new URL("https://www.facebook.com/dialog/oauth");
  url.searchParams.set("client_id", appId);
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", scopes.join(","));

  return url.toString();
}

export function startMetaConnect() {
  window.location.href = buildMetaOAuthUrl();
}