import { Resend } from "resend";
import { env } from "../env";

export const emailEnabled = Boolean(env.RESEND_API_KEY && env.ALERT_EMAIL_FROM && env.ALERT_EMAIL_TO);

const resend = env.RESEND_API_KEY ? new Resend(env.RESEND_API_KEY) : null;

export async function sendLowStockAlert(medicines: { name: string; quantity: number }[]) {
  if (!emailEnabled || !resend) {
    console.log("[email] Skipped — Resend is not configured (see .env.example)");
    return;
  }

  const listHtml = medicines.map((m) => `<li>${m.name} — ${m.quantity} left</li>`).join("");

  await resend.emails.send({
    from: env.ALERT_EMAIL_FROM!,
    to: env.ALERT_EMAIL_TO!,
    subject: "Low stock alert — Pharmacy System",
    html: `<p>The following medicines are at or below their reorder level:</p><ul>${listHtml}</ul>`,
  });
}

export async function sendExpiryAlert(medicines: { name: string; expiryDate: Date }[]) {
  if (!emailEnabled || !resend) {
    console.log("[email] Skipped expiry alert — Resend is not configured (see .env.example)");
    return;
  }

  const listHtml = medicines
    .map((m) => `<li>${m.name} — expires on ${new Date(m.expiryDate).toLocaleDateString()}</li>`)
    .join("");

  await resend.emails.send({
    from: env.ALERT_EMAIL_FROM!,
    to: env.ALERT_EMAIL_TO!,
    subject: "Expiry alert — Pharmacy System",
    html: `<p>The following medicines are expired or nearing expiry:</p><ul>${listHtml}</ul>`,
  });
}
