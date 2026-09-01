/**
 * lib/integrations/webhook-provider.ts
 *
 * Outbound webhook delivery with HMAC-SHA256 signing.
 * Webhook endpoints are administrator-controlled (stored in integration settings).
 *
 * Configure via:
 *   WEBHOOK_SECRET — used to sign every payload
 *   WEBHOOK_ENDPOINT_URL — delivery target
 *
 * Payloads contain only safe summary data — no raw workbook rows, no credentials text.
 * The secret never appears in delivery logs.
 */

import { createHmac } from "crypto";

export interface WebhookPayload {
  eventType: string;
  timestamp: string;
  entityType?: string;
  entityId?: string;
  summary: string;
}

export interface WebhookDeliveryResult {
  success: boolean;
  statusCode?: number;
  errorCode?: string;
}

/**
 * Sign a payload string with HMAC-SHA256.
 * Returns "sha256=<hex>" compatible with GitHub webhook signature style.
 */
export function signWebhookPayload(body: string): string {
  const secret = process.env.WEBHOOK_SECRET;
  if (!secret) return "";
  return "sha256=" + createHmac("sha256", secret).update(body).digest("hex");
}

export function isWebhookEnabled(): boolean {
  return !!(process.env.WEBHOOK_SECRET && process.env.WEBHOOK_ENDPOINT_URL);
}

export async function deliverWebhook(
  payload: WebhookPayload
): Promise<WebhookDeliveryResult> {
  if (!isWebhookEnabled()) {
    console.info(`[webhook-provider] disabled — would deliver: ${payload.eventType}`);
    return { success: false, errorCode: "PROVIDER_DISABLED" };
  }

  const body = JSON.stringify(payload);
  const signature = signWebhookPayload(body);

  try {
    const res = await fetch(process.env.WEBHOOK_ENDPOINT_URL!, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Signature-256": signature,
        "X-Timestamp": payload.timestamp,
      },
      body,
    });
    return { success: res.ok, statusCode: res.status };
  } catch (err) {
    console.error("[webhook-provider] delivery error:", (err as Error).message);
    return { success: false, errorCode: "DELIVERY_FAILED" };
  }
}
