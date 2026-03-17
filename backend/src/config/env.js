import dotenv from "dotenv";

dotenv.config();

function required(name) {
  const value = process.env[name];
  if (!value || !String(value).trim()) {
    throw new Error(`Environment variable ${name} is missing`);
  }
  return String(value).trim();
}

function optional(name, fallback = "") {
  const value = process.env[name];
  if (value === undefined || value === null || value === "") {
    return fallback;
  }
  return String(value).trim();
}

export const env = {
  nodeEnv: optional("NODE_ENV", "development"),
  port: Number(optional("PORT", "4000")),

  appUrl: required("APP_URL"),

  jwtAccessSecret: required("JWT_ACCESS_SECRET"),
  jwtRefreshSecret: required("JWT_REFRESH_SECRET"),
  accessTokenExpiresIn: optional("ACCESS_TOKEN_EXPIRES_IN", "1d"),
  refreshTokenExpiresIn: optional("REFRESH_TOKEN_EXPIRES_IN", "30d"),

  supabaseUrl: required("SUPABASE_URL"),
  supabaseServiceRoleKey: required("SUPABASE_SERVICE_ROLE_KEY"),

  smtpHost: optional("SMTP_HOST", ""),
  smtpPort: Number(optional("SMTP_PORT", "465")),
  smtpSecure: optional("SMTP_SECURE", "true") === "true",
  smtpUser: optional("SMTP_USER", ""),
  smtpPass: optional("SMTP_PASS", ""),
  smtpFrom: optional("SMTP_FROM", ""),

  metaAppId: optional("META_APP_ID", ""),
  metaAppSecret: optional("META_APP_SECRET", ""),
  metaApiVersion: optional("META_API_VERSION", "v25.0"),
  metaRedirectUri: optional(
    "META_REDIRECT_URI",
    "https://leadgeneration-9fbm.vercel.app/api/meta/facebook/callback"
  ),
  metaVerifyToken: optional("META_VERIFY_TOKEN", ""),
};