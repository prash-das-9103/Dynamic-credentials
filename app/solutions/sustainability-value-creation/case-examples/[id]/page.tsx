import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { CASE_EXAMPLES } from "@/data/case-examples";
import { CaseExampleSlide } from "@/components/solutions/CaseExampleSlide";

export function generateStaticParams() {
  return CASE_EXAMPLES.map((example) => ({ id: example.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const example = CASE_EXAMPLES.find((e) => e.id === id);
  return { title: example ? `${example.titleAccent} – ${example.titleRest}` : "Case Example" };
}

export default async function CaseExamplePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const example = CASE_EXAMPLES.find((e) => e.id === id);
  if (!example) notFound();

  return (
    <div style={{ minHeight: "100vh", background: "#1a1a1a", padding: "24px" }}>
      <div className="mx-auto flex max-w-5xl flex-col gap-4">
        <Link
          href="/solutions/sustainability-value-creation"
          className="inline-flex items-center gap-1.5 text-[12px] font-medium text-white/70 transition-colors hover:text-white"
        >
          <ArrowLeft size={13} aria-hidden="true" />
          Back to Sustainability Value Creation
        </Link>
        <CaseExampleSlide example={example} />
      </div>
    </div>
  );
}
