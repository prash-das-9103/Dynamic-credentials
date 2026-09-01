import type { SolutionConfig } from "@/data/solution-config";

interface Props {
  config: SolutionConfig;
}

export function SolutionHero({ config }: Props) {
  return (
    <div>
      <div
        className="h-1 w-10 rounded-full"
        style={{ backgroundColor: config.accentColor }}
        aria-hidden="true"
      />
      <h2 className="mt-3 text-[22px] font-semibold text-foreground">{config.name}</h2>
      <p className="mt-1 text-[14px] font-medium text-muted-foreground">{config.tagline}</p>
      <p className="mt-2 max-w-3xl text-[13px] leading-relaxed text-muted-foreground">
        {config.description}
      </p>
    </div>
  );
}
