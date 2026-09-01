/**
 * lib/integrations/teams-provider.ts
 *
 * Microsoft Teams notification provider (Incoming Webhook).
 * Configure via: TEAMS_WEBHOOK_URL
 *
 * Raw workbook rows are NEVER transmitted.
 * The webhook URL is server-side only — never exposed to the browser.
 */

import type { NotificationProvider, NotificationDeliveryInput, DeliveryResult } from "./provider-types";

export class TeamsProvider implements NotificationProvider {
  readonly name = "teams";

  isEnabled(): boolean {
    return !!process.env.TEAMS_WEBHOOK_URL;
  }

  async send(input: NotificationDeliveryInput): Promise<DeliveryResult> {
    if (!this.isEnabled()) {
      console.info(`[teams-provider] disabled — would send: ${input.subject}`);
      return { success: false, errorCode: "PROVIDER_DISABLED" };
    }

    const payload = {
      "@type": "MessageCard",
      "@context": "http://schema.org/extensions",
      summary: input.subject,
      title: input.subject,
      text: input.body,
      ...(input.link
        ? {
            potentialAction: [
              {
                "@type": "OpenUri",
                name: "View",
                targets: [{ os: "default", uri: input.link }],
              },
            ],
          }
        : {}),
    };

    try {
      const res = await fetch(process.env.TEAMS_WEBHOOK_URL!, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        return { success: false, errorCode: `HTTP_${res.status}` };
      }
      return { success: true };
    } catch (err) {
      console.error("[teams-provider] send error:", (err as Error).message);
      return { success: false, errorCode: "SEND_FAILED" };
    }
  }
}
