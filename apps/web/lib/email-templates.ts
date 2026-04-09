/**
 * Email templates matching the portfolio dark theme.
 * Colors: bg #0a0a0f, surface #141420, border #1e1e2e, accent #00d4aa, text #e8e8f0, muted #8888a8
 */

const COLORS = {
  bg: "#0a0a0f",
  surface: "#141420",
  surfaceAlt: "#0f0f1a",
  border: "#1e1e2e",
  accent: "#00d4aa",
  accentDim: "rgba(0,212,170,0.1)",
  accentBorder: "rgba(0,212,170,0.2)",
  text: "#e8e8f0",
  textSecondary: "#b0b0c8",
  muted: "#6a6a8a",
};

function layout(content: string) {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:${COLORS.bg};font-family:'DM Sans',system-ui,-apple-system,sans-serif">
  <div style="max-width:560px;margin:0 auto;padding:32px 16px">
    <!-- Logo -->
    <div style="text-align:center;margin-bottom:32px">
      <span style="font-size:24px;font-weight:700;color:${COLORS.text};font-family:Georgia,serif">Michael</span><span style="font-size:24px;font-weight:700;color:${COLORS.accent};font-family:Georgia,serif">.</span>
    </div>
    ${content}
    <!-- Footer -->
    <div style="text-align:center;margin-top:32px;padding-top:24px;border-top:1px solid ${COLORS.border}">
      <p style="margin:0 0 8px;font-size:12px;color:${COLORS.muted}">
        <a href="https://michaelpadin.com" style="color:${COLORS.accent};text-decoration:none">michaelpadin.com</a>
        &nbsp;·&nbsp;Cebu, Philippines (UTC+8)
      </p>
      <p style="margin:0;font-size:11px;color:${COLORS.muted}">
        <a href="https://github.com/michael-padin" style="color:${COLORS.muted};text-decoration:none">GitHub</a>
        &nbsp;·&nbsp;
        <a href="https://linkedin.com/in/michael-padin" style="color:${COLORS.muted};text-decoration:none">LinkedIn</a>
      </p>
    </div>
  </div>
</body>
</html>`;
}

function card(content: string) {
  return `<div style="background:${COLORS.surface};border:1px solid ${COLORS.border};border-radius:12px;padding:24px;margin-bottom:16px">${content}</div>`;
}

function label(text: string) {
  return `<p style="margin:0 0 12px;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.08em;color:${COLORS.muted}">${text}</p>`;
}

function row(key: string, value: string) {
  return `<tr>
    <td style="padding:6px 0;color:${COLORS.muted};font-size:13px;width:90px;vertical-align:top">${key}</td>
    <td style="padding:6px 0;color:${COLORS.text};font-size:13px">${value}</td>
  </tr>`;
}

// ── Notification email sent to Michael ────────────────────────
export function contactNotification(data: {
  name: string;
  email: string;
  subject: string;
  message: string;
  type?: string;
  budget?: string;
  aiAssessment?: string;
  ip: string;
}) {
  const { name, email, subject, message, type, budget, aiAssessment, ip } = data;

  return layout(`
    ${card(`
      ${label("New contact from your portfolio")}
      <h2 style="margin:0 0 20px;font-size:20px;font-weight:600;color:${COLORS.text};font-family:Georgia,serif">${name}</h2>
      <table style="width:100%;border-collapse:collapse">
        ${row("Email", `<a href="mailto:${email}" style="color:${COLORS.accent};text-decoration:none">${email}</a>`)}
        ${row("Type", type ?? "Not specified")}
        ${budget ? row("Budget", budget) : ""}
        ${row("Subject", subject)}
      </table>
    `)}

    ${card(`
      ${label("Message")}
      <p style="margin:0;color:${COLORS.textSecondary};font-size:14px;line-height:1.8">${message}</p>
    `)}

    ${
      aiAssessment
        ? `<div style="background:${COLORS.surfaceAlt};border:1px solid ${COLORS.accentBorder};border-radius:12px;padding:20px;margin-bottom:16px">
        ${label("AI Lead Assessment")}
        <p style="margin:0;color:${COLORS.textSecondary};font-size:13px;line-height:1.7">${aiAssessment}</p>
      </div>`
        : ""
    }

    <p style="margin:0;font-size:11px;color:${COLORS.muted};text-align:center">
      Sent from michaelpadin.com · IP: ${ip}
    </p>
  `);
}

// ── Auto-reply sent to the person who contacted ───────────────
export function contactAutoReply(data: { firstName: string; subject: string }) {
  const { firstName, subject } = data;

  return layout(`
    ${card(`
      <h2 style="margin:0 0 20px;font-size:20px;font-weight:600;color:${COLORS.text};font-family:Georgia,serif">
        Thanks for reaching out, ${firstName}!
      </h2>
      <p style="margin:0 0 16px;color:${COLORS.textSecondary};font-size:14px;line-height:1.8">
        I received your message about "<strong style="color:${COLORS.text}">${subject}</strong>" and I'll get back to you within 24 hours.
      </p>
      <p style="margin:0 0 16px;color:${COLORS.textSecondary};font-size:14px;line-height:1.8">
        If you need something urgent, feel free to connect with me directly:
      </p>
      <!-- CTA buttons -->
      <div style="text-align:center;margin:24px 0">
        <a href="https://linkedin.com/in/michael-padin" style="display:inline-block;padding:10px 24px;background:${COLORS.accent};color:${COLORS.bg};font-size:13px;font-weight:600;border-radius:8px;text-decoration:none;margin-right:8px">
          Connect on LinkedIn
        </a>
        <a href="mailto:hello@michaelpadin.com" style="display:inline-block;padding:10px 24px;background:transparent;color:${COLORS.textSecondary};font-size:13px;font-weight:500;border-radius:8px;text-decoration:none;border:1px solid ${COLORS.border}">
          Reply by email
        </a>
      </div>
    `)}

    <div style="text-align:center">
      <p style="margin:0;color:${COLORS.muted};font-size:13px">— Michael</p>
    </div>
  `);
}
