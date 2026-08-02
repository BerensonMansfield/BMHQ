import { currency } from "@/lib/format";

type Stage = { id: string; name: string; count: number; total: number };

/**
 * Open pipeline by stage. One series, so bar length carries the magnitude and
 * every bar wears the same accent hue — a gradient here would encode nothing.
 * Values ride the bar ends, which is also what keeps the chart readable at the
 * accent's contrast against the surface.
 */
export function PipelineChart({ stages }: { stages: Stage[] }) {
  const max = Math.max(...stages.map((stage) => stage.total), 1);

  return (
    <div className="flex flex-col gap-3">
      {stages.map((stage) => (
        <div key={stage.id} className="grid grid-cols-[8rem_1fr] items-center gap-4">
          <div className="min-w-0">
            <p className="truncate text-sm">{stage.name}</p>
            <p className="text-xs text-muted">
              {stage.count} {stage.count === 1 ? "deal" : "deals"}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div
              className="h-5 min-w-0.5 rounded-r-[4px] bg-accent"
              style={{ width: `${Math.max((stage.total / max) * 100, 1)}%` }}
              role="img"
              aria-label={`${stage.name}: ${currency.format(stage.total)}`}
            />
            <span className="shrink-0 text-sm tabular-nums text-muted">
              {currency.format(stage.total)}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
