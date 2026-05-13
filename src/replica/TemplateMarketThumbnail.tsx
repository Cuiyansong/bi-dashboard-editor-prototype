import type { CanvasWidget, TemplatePreset } from "../model/dashboardModel";

/** 8 列微缩栅格：画布 2 列布局中 colSpan 1 → 占 2 格，colSpan 2 → 占 4 格 */
function gridSpan(w: CanvasWidget): number {
  return w.colSpan === 2 ? 4 : 2;
}

export function TemplateMarketThumbnail({ preset }: { preset: TemplatePreset }) {
  const accent = preset.accent;

  return (
    <div className="mt-2 flex h-16 flex-col overflow-hidden rounded-md border border-black/[0.08] bg-gradient-to-br from-white to-neutral-100 shadow-inner">
      <div className="h-0.5 w-full shrink-0" style={{ backgroundColor: accent }} aria-hidden />
      <div className="min-h-0 flex-1 p-1">
        <div
          className="grid h-full w-full grid-cols-8 gap-0.5"
          style={{
            gridAutoRows: "minmax(0, 1fr)",
            gridAutoFlow: "row",
          }}
        >
          {preset.widgets.map((w) => {
            const span = gridSpan(w);
            return (
              <div
                key={w.id}
                className="relative min-h-[3px] overflow-hidden rounded-[2px] border border-black/[0.06]"
                style={{ gridColumn: `span ${span}` }}
              >
                <div className="absolute inset-0 bg-neutral-200/40" aria-hidden />
                <div className="absolute inset-0" style={{ backgroundColor: accent, opacity: 0.24 }} aria-hidden />
                <TypeHint type={w.type} accent={accent} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/** 极轻量的类型暗示，避免整块色过于单调 */
function TypeHint({ type, accent }: { type: CanvasWidget["type"]; accent: string }) {
  if (type === "bar") {
    return (
      <div className="pointer-events-none absolute inset-x-0.5 bottom-0.5 top-1 flex items-end justify-around gap-px opacity-70">
        {[40, 65, 50, 80, 45, 70, 55].map((h, i) => (
          <div key={i} className="w-px flex-1 rounded-t-[1px]" style={{ height: `${h}%`, backgroundColor: accent, opacity: 0.85 }} />
        ))}
      </div>
    );
  }
  if (type === "line") {
    return (
      <svg className="pointer-events-none absolute inset-0.5 h-[calc(100%-4px)] w-[calc(100%-4px)] opacity-60" viewBox="0 0 40 12" preserveAspectRatio="none">
        <polyline fill="none" stroke={accent} strokeWidth="1.2" points="0,10 8,4 16,7 24,2 32,5 40,3" />
      </svg>
    );
  }
  if (type === "liquid") {
    return (
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 size-[42%] min-h-[6px] min-w-[6px] -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-solid opacity-75"
        style={{ borderColor: accent }}
      />
    );
  }
  if (type === "table") {
    return (
      <div className="pointer-events-none absolute inset-x-0.5 inset-y-0.5 grid grid-cols-2 grid-rows-2 gap-px opacity-55">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-[0.5px]" style={{ backgroundColor: accent, opacity: 0.35 }} />
        ))}
      </div>
    );
  }
  /* kpi */
  return (
    <div
      className="pointer-events-none absolute inset-x-1 inset-y-1 rounded-[1px] opacity-40"
      style={{ backgroundColor: accent }}
    />
  );
}
