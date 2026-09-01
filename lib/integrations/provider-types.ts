/**
 * lib/integrations/provider-types.ts
 *
 * Shared types for notification delivery providers.
 * Each provider implements NotificationProvider.
 *
 * Tokens and secrets NEVER leave the server.
 * Raw workbook rows are NEVER transmitted.
 */

export interface NotificationDeliveryInput {
  recipientEmail: string;
  recipientName?: string;
  subject: string;
  /** Plain-text body — no raw workbook content, no credential detail. */
  body: string;
  /** Optional internal link the recipient can follow (requires auth). */
  link?: string;
}

export interface DeliveryResult {
  success: boolean;
  providerMessageId?: string;
  errorCode?: string;
}

export interface NotificationProvider {
  /** Human-readable provider name for logging. */
  readonly name: string;
  /** Whether this provider is currently configured and enabled. */
  isEnabled(): boolean;
  send(input: NotificationDeliveryInput): Promise<DeliveryResult>;
}
