import { darkTokens, lightTokens, EmailTokens } from './tokens';

export const otpEmailTemplate = (
  name: string,
  otp: string,
  theme: 'dark' | 'light' = 'dark',
): string => {
  const t: EmailTokens = theme === 'dark' ? darkTokens : lightTokens;
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
  <title>Your verification code – CodeSprint AI</title>
</head>
<body style="margin:0;padding:0;background:${t.bodyBg};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:32px 16px;">
    <tr><td align="center">
      <table width="100%" style="max-width:520px;background:${t.cardBg};border-radius:12px;overflow:hidden;border:1px solid ${t.cardBorder};">

        <!-- HEADER with dot grid -->
        <tr>
          <td style="background:${t.headerBg};padding:22px 28px 18px;border-bottom:1px solid ${t.cardBorder};background-image:radial-gradient(circle,${t.dotColor} 1px,transparent 1px);background-size:20px 20px;">
            <table cellpadding="0" cellspacing="0" width="100%">
              <tr>
                <td>
                  <table cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="background:#10b981;border-radius:5px;width:26px;height:26px;text-align:center;vertical-align:middle;">
                        <span style="color:${theme === 'dark' ? '#0b0d12' : '#ffffff'};font-size:12px;font-weight:800;font-family:'Courier New',monospace;">&gt;_</span>
                      </td>
                      <td style="padding-left:8px;font-size:16px;font-weight:700;color:${t.textPrimary};">
                        CodeSprint<span style="color:#10b981;">AI</span>
                      </td>
                    </tr>
                  </table>
                </td>
                <td align="right">
                  <span style="background:${t.badgeBg};border:1px solid ${t.badgeBorder};border-radius:20px;padding:3px 9px;font-size:9px;font-weight:600;color:${t.badgeText};letter-spacing:0.8px;text-transform:uppercase;">Verification</span>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- BODY -->
        <tr>
          <td style="padding:28px;">

            <!-- System online badge -->
            <div style="display:inline-block;background:${t.infoBg};border:1px solid ${t.infoBorder};border-radius:20px;padding:3px 10px;margin-bottom:16px;">
              <span style="display:inline-block;width:6px;height:6px;border-radius:50%;background:#10b981;vertical-align:middle;margin-right:5px;"></span>
              <span style="font-size:10px;font-weight:600;color:${t.infoText};letter-spacing:0.5px;text-transform:uppercase;vertical-align:middle;">System Online</span>
            </div>

            <!-- Heading -->
            <h1 style="margin:0 0 8px;font-size:22px;font-weight:800;color:${t.textPrimary};line-height:1.15;letter-spacing:-0.5px;">
              Your verification<br/>code is ready.
            </h1>
            <p style="margin:0 0 18px;font-size:12px;color:${t.textMuted};">Hello, <span style="color:#10b981;">${name}</span></p>

            <!-- Body text -->
            <p style="margin:0 0 22px;font-size:13px;color:${t.textSecondary};line-height:1.7;">
              Use the code below to complete your verification. This code is valid for 10 minutes — do not share it with anyone.
            </p>

            <!-- OTP Code Block -->
            <div style="margin-bottom:22px;text-align:center;">
              <div style="display:inline-block;background:${t.headerBg};border:2px solid ${t.accent};border-radius:10px;padding:18px 36px;">
                <span style="font-size:36px;font-weight:800;letter-spacing:12px;color:${t.textPrimary};font-family:'Courier New',monospace;">${otp}</span>
              </div>
            </div>

            <!-- Expire badge -->
            <div style="text-align:center;margin-bottom:18px;">
              <div style="display:inline-block;background:${t.infoBg};border:1px solid ${t.infoBorder};border-radius:20px;padding:3px 10px;">
                <span style="font-size:10px;font-weight:600;color:${t.infoText};">&#9201;&nbsp; Valid for 10 minutes</span>
              </div>
            </div>

            <!-- Divider -->
            <hr style="border:none;border-top:1px solid ${t.divider};margin:0 0 18px;"/>

            <!-- Warning box -->
            <div style="background:${t.warnBg};border:1px solid ${t.warnBorder};border-radius:7px;padding:10px 14px;margin-bottom:16px;">
              <p style="margin:0;font-size:12px;color:${t.warnText};line-height:1.5;">
                &#9888;&nbsp; <strong style="color:${t.warnStrong};">Didn't request this?</strong> Someone may be trying to access your account. You can safely ignore this email.
              </p>
            </div>

          </td>
        </tr>

        <!-- FOOTER -->
        <tr>
          <td style="background:${t.footerBg};border-top:1px solid ${t.divider};padding:14px 28px;text-align:center;">
            <p style="margin:0 0 6px;font-size:10px;color:${t.textLink};">
              <a href="#" style="color:${t.textLink};text-decoration:none;margin:0 5px;">Help Center</a>
              <a href="#" style="color:${t.textLink};text-decoration:none;margin:0 5px;">Privacy Policy</a>
              <a href="#" style="color:${t.textLink};text-decoration:none;margin:0 5px;">Unsubscribe</a>
            </p>
            <p style="margin:0;font-size:10px;color:${t.textMuted};">
              &copy; ${new Date().getFullYear()} CodeSprint AI &middot; All rights reserved &middot; Karachi, Pakistan
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
};
