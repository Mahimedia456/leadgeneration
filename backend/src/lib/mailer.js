import nodemailer from "nodemailer";
import { env } from "../config/env.js";

export const transporter = nodemailer.createTransport({
  host: env.smtpHost,
  port: env.smtpPort,
  secure: env.smtpSecure,
  auth: {
    user: env.smtpUser,
    pass: env.smtpPass,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

export async function verifyMailer() {
  return transporter.verify();
}

export async function sendMail({ to, subject, html, text }) {
  return transporter.sendMail({
    from: env.smtpFrom,
    to,
    subject,
    text,
    html,
  });
}