export function otpEmailTemplate({ appName = "LeadGen", otp, expiresMinutes = 10 }) {
  return `
  <!doctype html>
  <html>
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>${appName} OTP</title>
    </head>
    <body style="margin:0;padding:0;background:#f4f7fb;font-family:Arial,Helvetica,sans-serif;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f4f7fb;padding:32px 16px;">
        <tr>
          <td align="center">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:600px;background:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 10px 30px rgba(15,23,42,0.08);">
              <tr>
                <td style="background:linear-gradient(135deg,#1d4ed8,#2563eb);padding:28px 32px;text-align:center;">
                  <h1 style="margin:0;color:#ffffff;font-size:28px;line-height:1.2;">Mahimedia Solutions</h1>
                  <p style="margin:8px 0 0;color:rgba(255,255,255,0.9);font-size:14px;">Password Reset Verification</p>
                </td>
              </tr>

              <tr>
                <td style="padding:32px;">
                  <p style="margin:0 0 16px;color:#0f172a;font-size:16px;font-weight:700;">Your verification code</p>
                  <p style="margin:0 0 24px;color:#475569;font-size:14px;line-height:1.7;">
                    Use the 6-digit code below to continue resetting your password.
                    This code will expire in ${expiresMinutes} minutes.
                  </p>

                  <div style="margin:0 0 24px;text-align:center;">
                    <div style="display:inline-block;background:#eff6ff;border:1px solid #bfdbfe;border-radius:16px;padding:18px 28px;">
                      <span style="font-size:34px;line-height:1;letter-spacing:10px;font-weight:800;color:#1d4ed8;">
                        ${otp}
                      </span>
                    </div>
                  </div>

                  <p style="margin:0 0 10px;color:#334155;font-size:14px;line-height:1.7;">
                    If you did not request this code, you can safely ignore this email.
                  </p>

                  <p style="margin:0;color:#94a3b8;font-size:12px;line-height:1.7;">
                    For security reasons, never share this code with anyone.
                  </p>
                </td>
              </tr>

              <tr>
                <td style="border-top:1px solid #e2e8f0;padding:20px 32px;text-align:center;">
                  <p style="margin:0;color:#94a3b8;font-size:12px;">
                    © 2025 Mahimedia Solutions. All rights reserved.
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
  </html>
  `;
}