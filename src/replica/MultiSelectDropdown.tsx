import { useEffect, useId, useRef, useState } from "react";

export type MultiSelectDropdownProps = {
  label: string;
  options: readonly string[];
  selected: string[];
  onChange: (next: string[]) => void;
  size?: "default" | "compact";
};

function selectionSummary(selected: string[], options: readonly string[]): string {
  if (selected.length === 0) return "未选";
  if (selected.length === options.length) return "全部";
  if (selected.length <= 2) return selected.join("、");
  return `已选 ${selected.length} 项`;
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      className={`shrink-0 text-figma-sub/80 transition-transform motion-reduce:transition-none ${open ? "rotate-180" : ""}`}
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      aria-hidden
    >
      <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** 通用多选下拉（图表筛选已改用 ChartFilterToolbar + FilterPopover） */
export function MultiSelectDropdown({ label, options, selected, onChange, size = "default" }: MultiSelectDropdownProps) {
  const compact = size === "compact";
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const panelId = useId();
  const set = new Set(selected);
  const summary = selectionSummary(selected, options);

  useEffect(() => {
    if (!open) return;
    const onDocMouse = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onDocKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener("mousedown", onDocMouse);
    document.addEventListener("keydown", onDocKey);
    const t = window.setTimeout(() => {
      panelRef.current?.querySelector<HTMLElement>("input")?.focus();
    }, 0);
    return () => {
      document.removeEventListener("mousedown", onDocMouse);
      document.removeEventListener("keydown", onDocKey);
      window.clearTimeout(t);
    };
  }, [open]);

  const toggle = (opt: string) => {
    if (set.has(opt)) {
      const next = selected.filter((x) => x !== opt);
      onChange(next.length > 0 ? next : [...options]);
    } else {
      onChange([...selected, opt]);
    }
  };

  return (
    <div ref={rootRef} className="relative min-w-0">
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-controls={panelId}
        aria-label={`${label}，${summary}`}
        onClick={(e) => {
          e.stopPropagation();
          setOpen((v) => !v);
        }}
        className={`flex max-w-full items-center gap-1 rounded-md border border-figma-line bg-white font-['Inter',sans-serif] text-figma-text shadow-sm transition-colors transition-shadow hover:border-primary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 ${
          compact ? "h-7 min-w-[108px] max-w-[200px] px-2 text-[10px]" : "h-8 min-w-[140px] max-w-[260px] px-2.5 text-xs"
        }`}
      >
        <span className="shrink-0 text-figma-sub">{label}</span>
        <span className="min-w-0 flex-1 truncate text-left font-medium">{summary}</span>
        <ChevronIcon open={open} />
      </button>

      {open ? (
        <div
          ref={panelRef}
          id={panelId}
          role="dialog"
          aria-label={label}
          className={`absolute left-0 z-50 mt-1 rounded-md border border-figma-line bg-white py-1 shadow-lg ${
            compact ? "min-w-[200px] max-w-[280px]" : "min-w-[220px] max-w-[320px]"
          }`}
          style={{ overscrollBehavior: "contain" }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between border-b border-black/[0.06] px-2.5 py-1.5">
            <span className={`font-medium text-figma-sub ${compact ? "text-[10px]" : "text-xs"}`}>{label}</span>
            <span className={`text-figma-sub/70 ${compact ? "text-[9px]" : "text-[10px]"}`}>
              <button
                type="button"
                className="rounded hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
                aria-label={`${label}全选`}
                onClick={() => onChange([...options])}
              >
                全选
              </button>
              <span className="mx-1" aria-hidden>
                ·
              </span>
              <button
                type="button"
                className="rounded hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
                aria-label={`${label}重置`}
                onClick={() => onChange([options[0]!])}
              >
                重置
              </button>
            </span>
          </div>
          <div className="max-h-[220px] overflow-y-auto py-1">
            {options.map((opt) => {
              const checked = set.has(opt);
              return (
                <label
                  key={opt}
                  className={`flex cursor-pointer items-center gap-2 px-2.5 py-1.5 hover:bg-primary/5 ${
                    compact ? "text-[10px]" : "text-xs"
                  }`}
                >
                  <input
                    type="checkbox"
                    className="size-3.5 shrink-0 accent-primary"
                    checked={checked}
                    onChange={() => toggle(opt)}
                  />
                  <span className={checked ? "font-medium text-figma-text" : "text-figma-sub"}>{opt}</span>
                </label>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}
