import crypto from "crypto";
import { supabase } from "../config/supabase.js";
import { comparePassword, hashPassword } from "../utils/password.js";
import { signAccessToken } from "../utils/jwt.js";
import { createOtp, verifyOtp as verifyOtpRecord } from "./otp.service.js";
import { sendMail } from "../lib/mailer.js";
import { listWorkspacesForUser } from "./workspace.service.js";
import { otpEmailTemplate } from "../utils/emailTemplates.js";

function sha256(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

export async function loginUser({ email, password }) {
  const normalizedEmail = String(email || "").trim().toLowerCase();

  const { data: user, error } = await supabase
    .from("users")
    .select("*")
    .eq("email", normalizedEmail)
    .maybeSingle();

  if (error) throw error;
  if (!user) throw new Error("Invalid email or password");
  if (user.status !== "active") throw new Error("Account is not active");
  if (!user.password_hash) throw new Error("Password not set");

  const ok = await comparePassword(password, user.password_hash);
  if (!ok) throw new Error("Invalid email or password");

  const accessToken = signAccessToken({
    sub: user.id,
    email: user.email,
    globalRole: user.global_role,
  });

  const rawRefreshToken = crypto.randomBytes(48).toString("hex");
  const refreshTokenHash = sha256(rawRefreshToken);

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 30);

  const { error: refreshError } = await supabase.from("refresh_tokens").insert({
    user_id: user.id,
    token_hash: refreshTokenHash,
    expires_at: expiresAt.toISOString(),
  });

  if (refreshError) throw refreshError;

  await supabase
    .from("users")
    .update({ last_login_at: new Date().toISOString() })
    .eq("id", user.id);

  return {
    user: {
      id: user.id,
      fullName: user.full_name,
      email: user.email,
      globalRole: user.global_role,
    },
    accessToken,
    refreshToken: rawRefreshToken,
  };
}

export async function sendForgotPasswordOtp({ email }) {
  const normalizedEmail = String(email || "").trim().toLowerCase();

  if (!normalizedEmail) {
    throw new Error("Email is required");
  }

  const { data: user, error } = await supabase
    .from("users")
    .select("id, email, full_name")
    .eq("email", normalizedEmail)
    .maybeSingle();

  if (error) throw error;

  // user requested explicit error if email does not exist
  if (!user) {
    const notFoundError = new Error("No account found with this email");
    notFoundError.statusCode = 404;
    throw notFoundError;
  }

  const { otp } = await createOtp({
    userId: user.id,
    email: normalizedEmail,
    purpose: "forgot_password",
    expiryMinutes: 10,
  });

  await sendMail({
    to: normalizedEmail,
    subject: "Your password reset OTP",
    text: `Your password reset OTP is ${otp}. It expires in 10 minutes.`,
    html: otpEmailTemplate({
      appName: "LeadGen",
      otp,
      expiresMinutes: 10,
    }),
  });

  return { success: true };
}

export async function verifyForgotPasswordOtp({ email, otp }) {
  const normalizedEmail = String(email || "").trim().toLowerCase();

  await verifyOtpRecord({
    email: normalizedEmail,
    purpose: "forgot_password",
    otp,
    markConsumed: true,
  });

  return {
    success: true,
    email: normalizedEmail,
  };
}

export async function resetPassword({ email, newPassword }) {
  const normalizedEmail = String(email || "").trim().toLowerCase();

  if (!newPassword || String(newPassword).length < 8) {
    throw new Error("Password must be at least 8 characters");
  }

  const newHash = await hashPassword(newPassword);

  const { data: user, error: userError } = await supabase
    .from("users")
    .select("id")
    .eq("email", normalizedEmail)
    .maybeSingle();

  if (userError) throw userError;
  if (!user) throw new Error("User not found");

  const { error } = await supabase
    .from("users")
    .update({
      password_hash: newHash,
      status: "active",
      is_email_verified: true,
    })
    .eq("email", normalizedEmail);

  if (error) throw error;

  return { success: true };
}

export async function getUserWorkspaces(user) {
  return listWorkspacesForUser(user);
}