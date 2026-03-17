import { env } from "../config/env.js";

export async function exchangeMetaCode(req, res, next) {
  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({
        ok: false,
        message: "Meta authorization code is required",
      });
    }

    const tokenUrl = new URL(
      `https://graph.facebook.com/${env.metaApiVersion}/oauth/access_token`
    );

    tokenUrl.searchParams.set("client_id", env.metaAppId);
    tokenUrl.searchParams.set("client_secret", env.metaAppSecret);
    tokenUrl.searchParams.set("redirect_uri", env.metaRedirectUri);
    tokenUrl.searchParams.set("code", code);

    const tokenResponse = await fetch(tokenUrl.toString(), {
      method: "GET",
    });

    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok) {
      return res.status(tokenResponse.status).json({
        ok: false,
        message:
          tokenData?.error?.message || "Failed to exchange Meta authorization code",
        details: tokenData,
      });
    }

    const shortLivedToken = tokenData.access_token;

    const longTokenUrl = new URL(
      `https://graph.facebook.com/${env.metaApiVersion}/oauth/access_token`
    );

    longTokenUrl.searchParams.set("grant_type", "fb_exchange_token");
    longTokenUrl.searchParams.set("client_id", env.metaAppId);
    longTokenUrl.searchParams.set("client_secret", env.metaAppSecret);
    longTokenUrl.searchParams.set("fb_exchange_token", shortLivedToken);

    const longTokenResponse = await fetch(longTokenUrl.toString(), {
      method: "GET",
    });

    const longTokenData = await longTokenResponse.json();

    if (!longTokenResponse.ok) {
      return res.status(longTokenResponse.status).json({
        ok: false,
        message:
          longTokenData?.error?.message || "Failed to exchange long-lived token",
        details: longTokenData,
      });
    }

    const accessToken = longTokenData.access_token;

    const accountsUrl = new URL(
      `https://graph.facebook.com/${env.metaApiVersion}/me/accounts`
    );
    accountsUrl.searchParams.set("fields", "id,name,access_token,instagram_business_account");
    accountsUrl.searchParams.set("access_token", accessToken);

    const accountsResponse = await fetch(accountsUrl.toString(), {
      method: "GET",
    });

    const accountsData = await accountsResponse.json();

    if (!accountsResponse.ok) {
      return res.status(accountsResponse.status).json({
        ok: false,
        message: accountsData?.error?.message || "Failed to fetch pages",
        details: accountsData,
      });
    }

    // TODO: save accessToken / pages / instagram_business_account to DB here

    return res.status(200).json({
      ok: true,
      message: "Meta connected successfully",
      token: {
        accessToken,
        expiresIn: longTokenData.expires_in || null,
      },
      accounts: accountsData?.data || [],
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