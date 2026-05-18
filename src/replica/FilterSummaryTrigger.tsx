import type { RefObject } from "react";

function ChevronDown({ className }: { className?: string }) {
  return (
    <svg className={className} width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
      <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export type FilterSummaryTriggerProps = {
  open: boolean;
  panelId: string;
  summary: string;
  isAllSelected: boolean;
  triggerRef: RefObject<HTMLButtonElement | null>;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  /** 按钮前缀文案，默认「筛选」 */
  label?: string;
  size?: "compact" | "default";
};

export function FilterSummaryTrigger({
  open,
  panelId,
  summary,
  isAllSelected,
  triggerRef,
  onClick,
  label = "筛选",
  size = "compact",
}: FilterSummaryTriggerProps) {
  const compact = size === "compact";

  return (
    <button
      ref={triggerRef}
      type="button"
      aria-expanded={open}
      aria-haspopup="dialog"
      aria-controls={panelId}
      aria-label={`${label}，当前${summary}`}
      onClick={onClick}
      className={`inline-flex min-w-0 items-center gap-1.5 rounded-md border border-figma-line bg-white font-['Inter',sans-serif] text-figma-text shadow-sm transition-colors transition-shadow hover:border-primary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 ${
        compact ? "h-7 px-2.5 text-xs" : "h-8 px-3 text-xs"
      }`}
    >
      <span className="font-medium text-figma-sub">{label}</span>
      <span
        className={`rounded px-1.5 py-0.5 text-[10px] font-medium tabular-nums ${
          isAllSelected ? "bg-neutral-100 text-figma-sub" : "bg-primary/10 text-primary"
        }`}
      >
        {summary}
      </span>
      <ChevronDown
        className={`shrink-0 text-figma-sub transition-transform motion-reduce:transition-none ${open ? "rotate-180" : ""}`}
      />
    </button>
  );
}
