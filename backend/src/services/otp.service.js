import bcrypt from "bcryptjs";
import { supabase } from "../config/supabase.js";
import { generateOtp } from "../utils/otp.js";

const OTP_EXPIRY_MINUTES = 10;
const MAX_OTP_ATTEMPTS = 5;

export async function createOtp({
  userId = null,
  email,
  purpose,
  expiryMinutes = OTP_EXPIRY_MINUTES,
}) {
  const normalizedEmail = String(email || "").trim().toLowerCase();

  if (!normalizedEmail) {
    throw new Error("Email is required");
  }

  if (!purpose) {
    throw new Error("OTP purpose is required");
  }

  await supabase
    .from("otp_verifications")
    .update({
      consumed_at: new Date().toISOString(),
    })
    .eq("email", normalizedEmail)
    .eq("purpose", purpose)
    .is("consumed_at", null);

  const otp = generateOtp(6);
  const otpHash = await bcrypt.hash(otp, 10);

  const expiresAt = new Date(Date.now() + expiryMinutes * 60 * 1000);

  const { data, error } = await supabase
    .from("otp_verifications")
    .insert({
      user_id: userId,
      email: normalizedEmail,
      otp_hash: otpHash,
      purpose,
      expires_at: expiresAt.toISOString(),
    })
    .select()
    .single();

  if (error) throw error;

  return {
    record: data,
    otp,
    expiresAt: expiresAt.toISOString(),
  };
}

export async function getLatestActiveOtp({ email, purpose }) {
  const normalizedEmail = String(email || "").trim().toLowerCase();

  const { data, error } = await supabase
    .from("otp_verifications")
    .select("*")
    .eq("email", normalizedEmail)
    .eq("purpose", purpose)
    .is("consumed_at", null)
    .order("created_at", { ascending: false })
    .limit(1);

  if (error) throw error;

  return data?.[0] || null;
}

export async function verifyOtp({
  email,
  purpose,
  otp,
  markConsumed = true,
}) {
  const normalizedEmail = String(email || "").trim().toLowerCase();

  if (!normalizedEmail || !purpose || !otp) {
    throw new Error("Email, purpose and otp are required");
  }

  const record = await getLatestActiveOtp({
    email: normalizedEmail,
    purpose,
  });

  if (!record) {
    throw new Error("OTP not found");
  }

  if (record.attempt_count >= MAX_OTP_ATTEMPTS) {
    throw new Error("Maximum OTP attempts exceeded");
  }

  if (record.consumed_at) {
    throw new Error("OTP already used");
  }

  if (new Date(record.expires_at) < new Date()) {
    throw new Error("OTP expired");
  }

  const isValid = await bcrypt.compare(String(otp), record.otp_hash);

  if (!isValid) {
    const { error: updateError } = await supabase
      .from("otp_verifications")
      .update({
        attempt_count: record.attempt_count + 1,
      })
      .eq("id", record.id);

    if (updateError) throw updateError;

    throw new Error("Invalid OTP");
  }

  if (markConsumed) {
    const { error: consumeError } = await supabase
      .from("otp_verifications")
      .update({
        consumed_at: new Date().toISOString(),
      })
      .eq("id", record.id);

    if (consumeError) throw consumeError;
  }

  return {
    success: true,
    record,
  };
}

export async function invalidateOtpById(id) {
  const { error } = await supabase
    .from("otp_verifications")
    .update({
      consumed_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) throw error;

  return { success: true };
}

export async function cleanupExpiredOtps() {
  const now = new Date().toISOString();

  const { error } = await supabase
    .from("otp_verifications")
    .delete()
    .lt("expires_at", now);

  if (error) throw error;

  return { success: true };
}