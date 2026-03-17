import dotenv from "dotenv";

dotenv.config();

function required(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} is missing`);
  }
  return value;
}

export const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT || 4000),

  appUrl: required("APP_URL"),

  jwtAccessSecret: required("JWT_ACCESS_SECRET"),
  jwtRefreshSecret: required("JWT_REFRESH_SECRET"),
  accessTokenExpiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN || "1d",
  refreshTokenExpiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || "30d",

  supabaseUrl: required("SUPABASE_URL"),
  supabaseServiceRoleKey: required("SUPABASE_SERVICE_ROLE_KEY"),

  smtpHost: process.env.SMTP_HOST || "",
  smtpPort: Number(process.env.SMTP_PORT || 465),
  smtpSecure: String(process.env.SMTP_SECURE || "true") === "true",
  smtpUser: process.env.SMTP_USER || "",
  smtpPass: process.env.SMTP_PASS || "",
  smtpFrom: process.env.SMTP_FROM || "",

  metaAppId: process.env.META_APP_ID || "",
  metaAppSecret: process.env.META_APP_SECRET || "",
  metaApiVersion: process.env.META_API_VERSION || "v25.0",
  metaRedirectUri:
    process.env.META_REDIRECT_URI || "http://localhost:4000/api/meta/oauth/callback",
  metaVerifyToken: process.env.META_VERIFY_TOKEN || "",
};