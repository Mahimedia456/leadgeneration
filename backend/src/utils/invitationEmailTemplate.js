export function invitationEmailTemplate({
  inviterName = "Workspace Admin",
  workspaceName = "Workspace",
  inviteUrl,
  expiresAt,
}) {
  return `
  <!doctype html>
  <html>
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Workspace Invitation</title>
    </head>
    <body style="margin:0;padding:0;background:#f4f7fb;font-family:Arial,Helvetica,sans-serif;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f4f7fb;padding:32px 16px;">
        <tr>
          <td align="center">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:620px;background:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 10px 30px rgba(15,23,42,0.08);">
              <tr>
                <td style="background:linear-gradient(135deg,#1d4ed8,#2563eb);padding:30px 32px;text-align:center;">
                  <h1 style="margin:0;color:#ffffff;font-size:28px;line-height:1.2;">Mahimedia Solutions</h1>
                  <p style="margin:8px 0 0;color:rgba(255,255,255,0.92);font-size:14px;">Workspace Invitation</p>
                </td>
              </tr>

              <tr>
                <td style="padding:32px;">
                  <p style="margin:0 0 12px;color:#0f172a;font-size:16px;font-weight:700;">
                    You have been invited
                  </p>

                  <p style="margin:0 0 18px;color:#475569;font-size:14px;line-height:1.75;">
                    <strong>${inviterName}</strong> invited you to join
                    <strong>${workspaceName}</strong>.
                  </p>

                  <p style="margin:0 0 24px;color:#475569;font-size:14px;line-height:1.75;">
                    Click the button below to activate your account and complete setup.
                  </p>

                  <div style="text-align:center;margin:0 0 24px;">
                    <a href="${inviteUrl}" style="display:inline-block;background:#2563eb;color:#ffffff;text-decoration:none;padding:14px 22px;border-radius:12px;font-size:14px;font-weight:700;">
                      Accept Invitation
                    </a>
                  </div>

                  <div style="margin:0 0 22px;padding:16px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:14px;">
                    <p style="margin:0 0 8px;color:#334155;font-size:12px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;">
                      Invitation Link
                    </p>
                    <p style="margin:0;color:#2563eb;font-size:13px;line-height:1.7;word-break:break-all;">
                      ${inviteUrl}
                    </p>
                  </div>

                  <p style="margin:0 0 8px;color:#475569;font-size:14px;line-height:1.7;">
                    This invitation expires on:
                  </p>
                  <p style="margin:0;color:#0f172a;font-size:14px;font-weight:700;">
                    ${new Date(expiresAt).toLocaleString()}
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