import { NextRequest, NextResponse } from "next/server";
import { requirePermission } from "@/lib/auth/guard";

export const dynamic = "force-dynamic";

const INTEGRATIONS = [
  {
    id: "email",
    name: "Email",
    description: "Send digest notifications and content alerts via email (SMTP or SendGrid).",
    envVarRequired: "EMAIL_SMTP_HOST",
  },
  {
    id: "teams",
    name: "Microsoft Teams",
    description: "Post notifications to a Teams channel via an Incoming Webhook.",
    envVarRequired: "TEAMS_WEBHOOK_URL",
  },
  {
    id: "slack",
    name: "Slack",
    description: "Post notifications to a Slack channel via a Bot token.",
    envVarRequired: "SLACK_BOT_TOKEN",
  },
  {
    id: "webhooks",
    name: "Outbound Webhooks",
    description: "Deliver signed webhook payloads to external endpoints on content events.",
    envVarRequired: "WEBHOOK_SIGNING_SECRET",
  },
  {
    id: "calendar",
    name: "Calendar",
    description: "Surface credential expiry and review deadlines in connected calendars.",
    envVarRequired: "CALENDAR_PROVIDER",
  },
];

export async function GET(request: NextRequest) {
  const { response: authErr } = await requirePermission(request, "system:manage");
  if (authErr) return authErr;

  const integrations = INTEGRATIONS.map((i) => ({
    ...i,
    configured: Boolean(process.env[i.envVarRequired]),
    testStatus: "untested" as const,
    testMessage: process.env[i.envVarRequired]
      ? undefined
      : `Set ${i.envVarRequired} in your environment to activate.`,
  }));

  return NextResponse.json({ integrations });
}
