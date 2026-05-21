/**
 * Email templates matching the paper-on-ink spec-sheet system.
 * Cream paper, ink type, oxide-red signal for status and links.
 */

const COLORS = {
  paper: "#f5f1e8",
  paperTint: "#ede5d2",
  paperRule: "#dccaa8",
  ink: "#1d2025",
  ink2: "#4a4a5a",
  ink3: "#7d7a78",
  signal: "#c43a1e",
};

const SANS =
  "'General Sans', ui-sans-serif, -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif";
const MONO = "'Fragment Mono', ui-monospace, SFMono-Regular, Menlo, monospace";

function layout(content: string) {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:${COLORS.paper};font-family:${SANS};color:${COLORS.ink};-webkit-font-smoothing:antialiased">
  <div style="max-width:600px;margin:0 auto;padding:48px 24px">
    <!-- Masthead -->
    <div style="padding-bottom:12px;border-bottom:1px solid ${COLORS.paperRule};font-family:${MONO};font-size:11px;color:${COLORS.ink3};text-transform:uppercase;letter-spacing:0.04em">
      <span>Document</span>
      <span style="color:${COLORS.ink};text-transform:none;margin-left:8px;margin-right:32px">Notice</span>
      <span>From</span>
      <span style="color:${COLORS.ink};text-transform:none;margin-left:8px">michaelpadin.com</span>
    </div>
    ${content}
    <!-- Colophon -->
    <div style="margin-top:48px;padding-top:20px;border-top:1px solid ${COLORS.paperRule};font-family:${MONO};font-size:11px;color:${COLORS.ink3};text-transform:uppercase;letter-spacing:0.04em">
      <a href="https://michaelpadin.com" style="color:${COLORS.ink};text-transform:none;text-decoration:none;border-bottom:1px solid ${COLORS.ink};padding-bottom:1px">michaelpadin.com</a>
      <span style="margin:0 12px">·</span>
      <span>Cebu, PH (UTC+8)</span>
      <span style="margin:0 12px">·</span>
      <a href="https://github.com/michael-padin" style="color:${COLORS.ink3};text-decoration:none">GitHub</a>
      <span style="margin:0 8px">·</span>
      <a href="https://linkedin.com/in/michael-padin" style="color:${COLORS.ink3};text-decoration:none">LinkedIn</a>
    </div>
  </div>
</body>
</html>`;
}

function sectionHeader(num: string, title: string) {
  return `<div style="display:flex;justify-content:space-between;align-items:flex-end;border-bottom:1px solid ${COLORS.paperRule};padding-bottom:8px;margin-top:32px;margin-bottom:16px">
    <span style="font-size:18px;font-weight:500;color:${COLORS.ink};letter-spacing:-0.02em">${title}</span>
    <span style="font-family:${MONO};font-size:11px;color:${COLORS.ink3};text-transform:uppercase;letter-spacing:0.04em">${num}</span>
  </div>`;
}

function fieldRow(label: string, value: string) {
  return `<tr>
    <td style="padding:6px 16px 6px 0;font-family:${MONO};font-size:11px;color:${COLORS.ink3};text-transform:uppercase;letter-spacing:0.04em;width:110px;vertical-align:top;white-space:nowrap">${label}</td>
    <td style="padding:6px 0;color:${COLORS.ink};font-size:14px;vertical-align:top">${value}</td>
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
    <!-- Title -->
    <div style="margin-top:32px">
      <div style="font-family:${MONO};font-size:11px;color:${COLORS.signal};text-transform:uppercase;letter-spacing:0.04em;margin-bottom:8px">
        <span style="display:inline-block;width:6px;height:6px;border-radius:999px;background:${COLORS.signal};margin-right:6px;vertical-align:middle"></span>
        Incoming · Portfolio contact
      </div>
      <div style="font-size:28px;font-weight:500;color:${COLORS.ink};letter-spacing:-0.025em;line-height:1.1">
        ${name}
      </div>
    </div>

    ${sectionHeader("§01", "Sender")}
    <table style="width:100%;border-collapse:collapse">
      ${fieldRow(
        "Email",
        `<a href="mailto:${email}" style="font-family:${MONO};color:${COLORS.ink};text-decoration:none;border-bottom:1px solid ${COLORS.ink};padding-bottom:1px">${email}</a>`,
      )}
      ${fieldRow("Type", type ?? "Not specified")}
      ${budget ? fieldRow("Budget", budget) : ""}
      ${fieldRow("Subject", subject)}
    </table>

    ${sectionHeader("§02", "Message")}
    <p style="margin:0;color:${COLORS.ink2};font-size:15px;line-height:1.65">${message}</p>

    ${
      aiAssessment
        ? `${sectionHeader("§03", "Lead assessment (AI)")}
      <p style="margin:0;color:${COLORS.ink2};font-size:14px;line-height:1.65">${aiAssessment}</p>`
        : ""
    }

    <div style="margin-top:48px;padding-top:16px;border-top:1px solid ${COLORS.paperRule};font-family:${MONO};font-size:11px;color:${COLORS.ink3};text-transform:uppercase;letter-spacing:0.04em">
      Sent from michaelpadin.com · IP ${ip}
    </div>
  `);
}

// ── Auto-reply sent to the person who contacted ───────────────
export function contactAutoReply(data: { firstName: string; subject: string }) {
  const { firstName, subject } = data;

  return layout(`
    <!-- Title -->
    <div style="margin-top:32px">
      <div style="font-family:${MONO};font-size:11px;color:${COLORS.ink3};text-transform:uppercase;letter-spacing:0.04em;margin-bottom:8px">
        Acknowledgement
      </div>
      <div style="font-size:28px;font-weight:500;color:${COLORS.ink};letter-spacing:-0.025em;line-height:1.15;max-width:24ch">
        Got your message, ${firstName}.
      </div>
    </div>

    <div style="margin-top:24px;color:${COLORS.ink2};font-size:15px;line-height:1.65">
      <p style="margin:0 0 16px">
        Your message about <strong style="color:${COLORS.ink}">${subject}</strong> arrived. I read every email personally and reply within ~24 hours on weekdays.
      </p>
      <p style="margin:0 0 16px">
        If it&rsquo;s time-sensitive, the channels below are faster.
      </p>
    </div>

    ${sectionHeader("§01", "Reach")}
    <table style="width:100%;border-collapse:collapse">
      ${fieldRow(
        "Email",
        `<a href="mailto:hello@michaelpadin.com" style="font-family:${MONO};color:${COLORS.ink};text-decoration:none;border-bottom:1px solid ${COLORS.ink};padding-bottom:1px">hello@michaelpadin.com</a>`,
      )}
      ${fieldRow(
        "LinkedIn",
        `<a href="https://linkedin.com/in/michael-padin" style="color:${COLORS.ink2};text-decoration:none;border-bottom:1px solid ${COLORS.ink3};padding-bottom:1px">linkedin.com/in/michael-padin</a>`,
      )}
      ${fieldRow("Reply", "Within ~24h on weekdays")}
      ${fieldRow("Where", "Cebu, PH (UTC+8)")}
    </table>

    <div style="margin-top:40px;color:${COLORS.ink2};font-size:14px">
      &mdash; Michael
    </div>
  `);
}
