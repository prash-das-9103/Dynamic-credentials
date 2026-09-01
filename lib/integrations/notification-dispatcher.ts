/**
 * lib/integrations/notification-dispatcher.ts
 *
 * Fan-out dispatcher: creates an in-app notification and delivers
 * to each configured external channel.
 *
 * Idempotency: uses notification dedupeKey + markChannelDelivered to
 * prevent duplicate deliveries even if the dispatcher is called twice.
 *
 * Quiet hours: delivery to external channels is suppressed between
 * NOTIFICATION_QUIET_HOURS_START and NOTIFICATION_QUIET_HOURS_END (local UTC).
 * In-app notifications are always created regardless of quiet hours.
 *
 * Empty digests: only dispatch when there is meaningful content.
 */

import {
  createNotification,
  markChannelDelivered,
  type CreateNotificationParams,
  type DeliveryChannel,
} from "@/lib/stores/notification-store";
import { EmailProvider } from "./email-provider";
import { TeamsProvider } from "./teams-provider";
import { SlackProvider } from "./slack-provider";

// ─── Quiet hours ──────────────────────────────────────────────────────────────

function isQuietHours(): boolean {
  const start = parseInt(process.env.NOTIFICATION_QUIET_HOURS_START ?? "22", 10);
  const end = parseInt(process.env.NOTIFICATION_QUIET_HOURS_END ?? "7", 10);
  const hour = new Date().getUTCHours();
  if (start < end) {
    return hour >= start && hour < end;
  }
  // Spans midnight
  return hour >= start || hour < end;
}

// ─── Providers ────────────────────────────────────────────────────────────────

const emailProvider = new EmailProvider();
const teamsProvider = new TeamsProvider();
const slackProvider = new SlackProvider();

// ─── Dispatcher ───────────────────────────────────────────────────────────────

export interface DispatchInput extends CreateNotificationParams {
  recipientEmail?: string;
  recipientName?: string;
}

/**
 * Dispatch a notification to all requested channels.
 * Creates the in-app notification first (always), then fans out to external channels.
 * Returns the created notification ID.
 */
export async function dispatchNotification(input: DispatchInput): Promise<string> {
  // Always create in-app notification
  const notification = createNotification({
    userId: input.userId,
    type: input.type,
    title: input.title,
    message: input.message,
    entityType: input.entityType,
    entityId: input.entityId,
    link: input.link,
    priority: input.priority,
    expiresAt: input.expiresAt,
    deliveryChannels: input.deliveryChannels,
    dedupeKey: input.dedupeKey,
  });

  // External channel delivery
  if (notification.deliveredChannels.includes("in-app") === false) {
    markChannelDelivered(notification.id, "in-app");
  }

  const shouldDeliverExternal = !isQuietHours() || input.priority === "urgent";

  for (const channel of input.deliveryChannels) {
    if (channel === "in-app") continue;
    if (notification.deliveredChannels.includes(channel)) continue; // already delivered
    if (!shouldDeliverExternal) continue;

    const deliveryInput = {
      recipientEmail: input.recipientEmail ?? "",
      recipientName: input.recipientName,
      subject: input.title,
      body: input.message,
      link: input.link,
    };

    let result = { success: false };
    if (channel === "email") result = await emailProvider.send(deliveryInput);
    if (channel === "teams") result = await teamsProvider.send(deliveryInput);
    if (channel === "slack") result = await slackProvider.send(deliveryInput);

    if (result.success) {
      markChannelDelivered(notification.id, channel as DeliveryChannel);
    }
  }

  return notification.id;
}
