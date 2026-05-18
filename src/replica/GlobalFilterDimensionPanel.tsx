import type { CustomerFilterId } from "../model/customerFilters";

export type GlobalFilterDimensionPanelProps = {
  id: CustomerFilterId;
  label: string;
  options: readonly string[];
  selected: string[];
  onChange: (next: string[]) => void;
  /** 与下一维度之间的分隔线 */
  showDivider?: boolean;
};

/** 全局筛选：紧凑平铺（单行标签 + 芯片，适合看板顶栏） */
export function GlobalFilterDimensionPanel({
  id,
  label,
  options,
  selected,
  onChange,
  showDivider = false,
}: GlobalFilterDimensionPanelProps) {
  const set = new Set(selected);
  const useGrid = options.length <= 4;

  const toggle = (opt: string) => {
    if (set.has(opt)) {
      const next = selected.filter((x) => x !== opt);
      onChange(next.length > 0 ? next : [...options]);
    } else {
      onChange([...selected, opt]);
    }
  };

  return (
    <fieldset
      data-filter-dimension={id}
      className={`min-w-0 border-0 p-0 ${showDivider ? "border-b border-[#DBEAFE] pb-2.5" : ""}`}
    >
      <div className="flex flex-wrap items-start gap-x-3 gap-y-1.5">
        <div className="flex w-[76px] shrink-0 flex-col gap-0.5 pt-0.5">
          <legend className="font-['Inter',sans-serif] text-xs font-semibold leading-tight text-[#1E3A8A]">
            {label}
          </legend>
          <span className="font-['Inter',sans-serif] text-[10px] tabular-nums text-figma-sub">
            {selected.length}/{options.length}
          </span>
        </div>

        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-x-2 gap-y-1.5">
          <div className="flex shrink-0 items-center gap-1 text-[10px] text-figma-sub">
            <button
              type="button"
              className="rounded px-1.5 py-0.5 transition-colors hover:bg-primary/10 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
              aria-label={`${label}全选`}
              onClick={() => onChange([...options])}
            >
              全选
            </button>
            <span aria-hidden>·</span>
            <button
              type="button"
              className="rounded px-1.5 py-0.5 transition-colors hover:bg-primary/10 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
              aria-label={`${label}重置`}
              onClick={() => onChange([options[0]!])}
            >
              重置
            </button>
          </div>

          <div
            className={
              useGrid
                ? "grid flex-1 grid-cols-4 gap-1"
                : "flex min-w-0 flex-1 flex-wrap gap-1"
            }
            role="group"
            aria-label={label}
          >
            {options.map((opt) => {
              const active = set.has(opt);
              return (
                <button
                  key={opt}
                  type="button"
                  aria-pressed={active}
                  onClick={() => toggle(opt)}
                  className={`min-w-0 cursor-pointer font-['Inter',sans-serif] text-[11px] leading-tight transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35 ${
                    useGrid
                      ? "rounded px-2 py-1 text-center"
                      : "rounded px-2 py-1"
                  } ${
                    active
                      ? "bg-primary font-medium text-white"
                      : "bg-white text-figma-text ring-1 ring-inset ring-[#DBEAFE] hover:bg-[#EFF6FF]"
                  }`}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </fieldset>
  );
}
