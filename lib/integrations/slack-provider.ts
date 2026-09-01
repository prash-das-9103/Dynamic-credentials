/**
 * lib/integrations/slack-provider.ts
 *
 * Slack notification provider (Incoming Webhook).
 * Configure via: SLACK_WEBHOOK_URL
 *
 * Raw workbook rows are NEVER transmitted.
 * The webhook URL is server-side only.
 */

import type { NotificationProvider, NotificationDeliveryInput, DeliveryResult } from "./provider-types";

export class SlackProvider implements NotificationProvider {
  readonly name = "slack";

  isEnabled(): boolean {
    return !!process.env.SLACK_WEBHOOK_URL;
  }

  async send(input: NotificationDeliveryInput): Promise<DeliveryResult> {
    if (!this.isEnabled()) {
      console.info(`[slack-provider] disabled — would send: ${input.subject}`);
      return { success: false, errorCode: "PROVIDER_DISABLED" };
    }

    const blocks = [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*${input.subject}*\n${input.body}`,
        },
      },
      ...(input.link
        ? [
            {
              type: "actions",
              elements: [
                {
                  type: "button",
                  text: { type: "plain_text", text: "View" },
                  url: input.link,
                },
              ],
            },
          ]
        : []),
    ];

    try {
      const res = await fetch(process.env.SLACK_WEBHOOK_URL!, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ blocks }),
      });
      if (!res.ok) {
        return { success: false, errorCode: `HTTP_${res.status}` };
      }
      return { success: true };
    } catch (err) {
      console.error("[slack-provider] send error:", (err as Error).message);
      return { success: false, errorCode: "SEND_FAILED" };
    }
  }
}
