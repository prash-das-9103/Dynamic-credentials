// Server Component — reads AI_ASSISTANT_ENABLED at request time without
// exposing the env var to the client bundle.
import { AppShell } from "@/components/AppShell";
import { AssistantPanel } from "@/components/assistant/AssistantPanel";
import { Info } from "lucide-react";

export default function AssistantPage() {
  // AI_ASSISTANT_ENABLED is a server-side env var. The API route enforces it.
  // We also surface the disabled state in the UI for a clean user experience.
  const isEnabled = process.env.AI_ASSISTANT_ENABLED !== "false";

  return (
    <AppShell
      title="AI Assistant"
      breadcrumb={[
        { label: "Overview", href: "/" },
        { label: "AI Assistant" },
      ]}
    >
      <div className="flex h-full flex-col overflow-hidden">
        {!isEnabled ? (
          <DisabledState />
        ) : (
          <AssistantPanel />
        )}
      </div>
    </AppShell>
  );
}

function DisabledState() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 py-12 text-center">
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-secondary">
        <Info size={18} className="text-muted-foreground" aria-hidden />
      </div>
      <h2 className="mb-2 text-[15px] font-semibold text-foreground">
        AI Assistant is not configured
      </h2>
      <p className="max-w-xs text-[13px] text-muted-foreground leading-relaxed">
        Add the <code className="rounded bg-secondary px-1 py-0.5 text-[12px] font-mono">AI_MODEL</code> and{" "}
        <code className="rounded bg-secondary px-1 py-0.5 text-[12px] font-mono">AI_API_KEY</code> environment
        variables to enable the AI-assisted experience.
      </p>
    </div>
  );
}
