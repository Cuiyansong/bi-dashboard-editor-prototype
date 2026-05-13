import type { DimensionSemantic } from "../model/fieldRef";

/** 文本维度 — Str */
export function DimensionStringIcon({ className = "" }: { className?: string }) {
  return (
    <span
      role="img"
      aria-label="文本维度"
      title="文本维度"
      className={`inline-flex h-5 min-w-[1.35rem] shrink-0 items-center justify-center rounded bg-primary/15 px-1 text-[9px] font-bold uppercase leading-none text-primary ${className}`}
    >
      Str
    </span>
  );
}

/** 日期维度 */
export function DimensionDateIcon({ className = "" }: { className?: string }) {
  return (
    <span
      role="img"
      aria-label="日期维度"
      title="日期维度"
      className={`inline-flex h-5 w-5 shrink-0 items-center justify-center rounded bg-amber-500/15 text-amber-800 ${className}`}
    >
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden className="opacity-90">
        <rect x="2" y="3" width="10" height="9" rx="1" stroke="currentColor" strokeWidth="1.2" />
        <path d="M2 6h10" stroke="currentColor" strokeWidth="1.2" />
        <path d="M5 1.5v3M9 1.5v3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    </span>
  );
}

export function DimensionIconBySemantic({ semantic, className = "" }: { semantic: DimensionSemantic; className?: string }) {
  return semantic === "date" ? <DimensionDateIcon className={className} /> : <DimensionStringIcon className={className} />;
}

/** 度量 — 123（浅绿底 + 深绿字，与字段槽药丸风格一致） */
export function Measure123Icon({ className = "" }: { className?: string }) {
  return (
    <span
      role="img"
      aria-label="度量"
      title="度量"
      className={`inline-flex h-5 min-w-[1.35rem] shrink-0 items-center justify-center rounded border border-emerald-500/65 bg-emerald-100 px-1 text-[10px] font-bold tabular-nums leading-none text-emerald-900 ${className}`}
    >
      123
    </span>
  );
}

/** @deprecated 使用 DimensionIconBySemantic */
export function DimensionFieldIcon(props: { className?: string }) {
  return <DimensionStringIcon {...props} />;
}

/** @deprecated 使用 Measure123Icon */
export function MeasureFieldIcon(props: { className?: string }) {
  return <Measure123Icon {...props} />;
}
