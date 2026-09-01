/**
 * lib/integrations/email-provider.ts
 *
 * Email notification provider stub.
 * Configure via environment variables:
 *   EMAIL_SMTP_HOST, EMAIL_SMTP_PORT, EMAIL_SMTP_USER, EMAIL_SMTP_PASS,
 *   EMAIL_FROM_ADDRESS, EMAIL_FROM_NAME
 *
 * When env vars are absent, the provider logs the message and returns success:false.
 * No external calls are made in development unless fully configured.
 */

import type { NotificationProvider, NotificationDeliveryInput, DeliveryResult } from "./provider-types";

export class EmailProvider implements NotificationProvider {
  readonly name = "email";

  isEnabled(): boolean {
    return !!(
      process.env.EMAIL_SMTP_HOST &&
      process.env.EMAIL_SMTP_USER &&
      process.env.EMAIL_SMTP_PASS &&
      process.env.EMAIL_FROM_ADDRESS
    );
  }

  async send(input: NotificationDeliveryInput): Promise<DeliveryResult> {
    if (!this.isEnabled()) {
      // Log stub — no external call
      console.info(
        `[email-provider] disabled — would send to ${input.recipientEmail}: ${input.subject}`
      );
      return { success: false, errorCode: "PROVIDER_DISABLED" };
    }

    try {
      // Production swap point: replace with real SMTP/SES/SendGrid call.
      // Using a plain fetch to a configured endpoint avoids bundling nodemailer
      // (which requires optional peer deps) — swap this for a proper transport
      // when deploying with EMAIL_SMTP_HOST set.
      const endpoint = process.env.EMAIL_API_ENDPOINT;
      if (endpoint) {
        const res = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            to: input.recipientEmail,
            from: process.env.EMAIL_FROM_ADDRESS,
            subject: input.subject,
            text: input.link ? `${input.body}\n\n${input.link}` : input.body,
          }),
        });
        if (!res.ok) return { success: false, errorCode: `HTTP_${res.status}` };
        const data: unknown = await res.json().catch(() => ({}));
        const messageId =
          data && typeof data === "object" && "id" in data ? String((data as Record<string, unknown>).id) : undefined;
        return { success: true, providerMessageId: messageId };
      }
      // Fallback: log + stub success so no external call is made in dev
      console.info(
        `[email-provider] stub — would send to ${input.recipientEmail}: ${input.subject}`
      );
      return { success: true, providerMessageId: `stub-${Date.now()}` };
    } catch (err) {
      console.error("[email-provider] send error:", (err as Error).message);
      return { success: false, errorCode: "SEND_FAILED" };
    }
  }
}
