/**
 * Email templates in the site's paper / ink / mango palette.
 * Email clients ignore web fonts more often than not, so the stacks fall back
 * to system sans and mono.
 */

const COLORS = {
  paper: "#fbf6ee",
  tint: "#f3ece0",
  rule: "#ddd2c6",
  ink: "#251a15",
  body: "#4c3f39",
  subtle: "#675b54",
  mango: "#eb883b",
  eyebrow: "#994a00",
};

const SANS =
  "'Schibsted Grotesk', ui-sans-serif, -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif";
const MONO = "'Fragment Mono', ui-monospace, SFMono-Regular, Menlo, monospace";

/** Escape visitor-supplied text before it goes into HTML. */
function h(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function layout(content: string) {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:${COLORS.paper};font-family:${SANS};color:${COLORS.ink};-webkit-font-smoothing:antialiased">
  <div style="max-width:600px;margin:0 auto;padding:40px 24px">
    <div style="font-size:13px;font-weight:800;letter-spacing:0.12em;color:${COLORS.ink}">
      MICHAEL PADIN <span style="color:${COLORS.mango};letter-spacing:0">/</span>
    </div>
    ${content}
    <div style="margin-top:40px;padding-top:18px;border-top:1px solid ${COLORS.rule};font-size:13px;color:${COLORS.subtle};line-height:1.6">
      <a href="https://michaelpadin.com" style="color:${COLORS.ink};text-decoration:none;font-weight:600;border-bottom:2px solid ${COLORS.mango}">michaelpadin.com</a>
      &nbsp;·&nbsp; Custom software, Cebu
    </div>
  </div>
</body>
</html>`;
}

function eyebrow(text: string) {
  return `<div style="font-size:12px;font-weight:600;letter-spacing:0.06em;text-transform:uppercase;color:${COLORS.eyebrow};margin-bottom:8px">${text}</div>`;
}

function heading(text: string) {
  return `<h2 style="margin:28px 0 12px;font-size:18px;font-weight:700;color:${COLORS.ink}">${text}</h2>`;
}

function fieldRow(label: string, value: string) {
  return `<tr>
    <td style="padding:8px 16px 8px 0;font-size:13px;color:${COLORS.subtle};width:120px;vertical-align:top;white-space:nowrap;border-bottom:1px solid ${COLORS.rule}">${label}</td>
    <td style="padding:8px 0;color:${COLORS.ink};font-size:15px;font-weight:600;vertical-align:top;border-bottom:1px solid ${COLORS.rule}">${value}</td>
  </tr>`;
}

function link(href: string, text: string) {
  return `<a href="${href}" style="color:${COLORS.ink};text-decoration:none;border-bottom:2px solid ${COLORS.mango}">${text}</a>`;
}

// ── Notification email sent to Michael ────────────────────────
export function contactNotification(data: {
  name: string;
  business?: string;
  email?: string;
  phone?: string;
  role: string;
  needs: string;
  budget?: string;
  /** Already escaped, newlines converted to <br>. */
  message: string;
  aiAssessment?: string;
  ip: string;
}) {
  const { name, business, email, phone, role, needs, budget, message, aiAssessment, ip } = data;

  return layout(`
    <div style="margin-top:32px">
      ${eyebrow("New inquiry")}
      <div style="font-size:28px;font-weight:700;color:${COLORS.ink};letter-spacing:-0.02em;line-height:1.15">
        ${h(name)}${business ? `<span style="color:${COLORS.subtle};font-weight:500"> · ${h(business)}</span>` : ""}
      </div>
    </div>

    <table style="width:100%;border-collapse:collapse;margin-top:20px">
      ${email ? fieldRow("Email", link(`mailto:${h(email)}`, `<span style="font-family:${MONO};font-weight:400">${h(email)}</span>`)) : ""}
      ${phone ? fieldRow("Mobile", link(`tel:${h(phone)}`, `<span style="font-family:${MONO};font-weight:400">${h(phone)}</span>`)) : ""}
      ${fieldRow("Reaching out as", h(role))}
      ${needs ? fieldRow("Needs", h(needs)) : ""}
      ${budget ? fieldRow("Rough budget", h(budget)) : ""}
    </table>

    ${heading("Their business")}
    <p style="margin:0;color:${COLORS.body};font-size:16px;line-height:1.65">${message}</p>

    ${
      aiAssessment
        ? `${heading("Lead assessment (AI)")}
      <p style="margin:0;padding:14px 16px;background:${COLORS.tint};border-radius:12px;color:${COLORS.body};font-size:14px;line-height:1.6">${h(aiAssessment)}</p>`
        : ""
    }

    <p style="margin-top:28px;font-size:12px;color:${COLORS.subtle}">Sent from the contact form · IP ${h(ip)}</p>
  `);
}

// ── Chatbot transcript sent to Michael after each AI exchange ─
export function chatTranscript(data: {
  messages: Array<{ role: string; text: string }>;
  ip: string;
  exchangeCount: number;
  maxExchanges: number;
}) {
  const { messages, ip, exchangeCount, maxExchanges } = data;
  const firstUserMsg = messages.find((m) => m.role === "user")?.text ?? "(no message)";

  const bubbles = messages
    .map((m) => {
      const isUser = m.role === "user";
      const bg = isUser ? COLORS.mango : "#ffffff";
      const align = isUser ? "right" : "left";
      const radius = isUser ? "18px 18px 6px 18px" : "18px 18px 18px 6px";
      return `<div style="text-align:${align};margin-bottom:10px">
        <div style="display:inline-block;max-width:85%;background:${bg};color:${COLORS.ink};border-radius:${radius};padding:10px 14px;font-size:14px;line-height:1.5;text-align:left">${h(m.text).replace(/\n/g, "<br>")}</div>
      </div>`;
    })
    .join("");

  return layout(`
    <div style="margin-top:32px">
      ${eyebrow(`Chat · message ${exchangeCount} of ${maxExchanges}`)}
      <div style="font-size:22px;font-weight:700;color:${COLORS.ink};line-height:1.25;max-width:38ch">
        ${h(firstUserMsg.slice(0, 80))}
      </div>
    </div>
    <div style="margin-top:24px;padding:16px;background:${COLORS.tint};border-radius:18px">${bubbles}</div>
    <p style="margin-top:20px;font-size:12px;color:${COLORS.subtle}">IP ${h(ip)} · ${messages.length} messages</p>
  `);
}

// ── Auto-reply sent to the person who reached out ─────────────
export function contactAutoReply(data: { firstName: string; business?: string }) {
  const { firstName, business } = data;

  return layout(`
    <div style="margin-top:32px">
      <div style="font-size:28px;font-weight:700;color:${COLORS.ink};letter-spacing:-0.02em;line-height:1.15">
        Got your message, ${h(firstName)}.
      </div>
    </div>

    <div style="margin-top:20px;color:${COLORS.body};font-size:16px;line-height:1.65">
      <p style="margin:0 0 14px">
        Thanks for telling me about ${business ? h(business) : "your business"}. I read every message myself and reply within a day, Monday to Friday.
      </p>
      <p style="margin:0 0 14px">
        If it's easier to talk it through, you can ${link("https://cal.com/michael-padin/intro", "book a free 30-minute call")}. Coffee optional.
      </p>
    </div>

    <div style="margin-top:28px;color:${COLORS.body};font-size:16px">Michael</div>
  `);
}
