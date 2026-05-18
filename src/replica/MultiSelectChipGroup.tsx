export type MultiSelectChipGroupProps = {
  label: string;
  options: readonly string[];
  selected: string[];
  onChange: (next: string[]) => void;
  size?: "default" | "compact";
  /** fieldset 已提供 legend 时隐藏组内标题 */
  hideLabel?: boolean;
};

export function MultiSelectChipGroup({
  label,
  options,
  selected,
  onChange,
  size = "default",
  hideLabel = false,
}: MultiSelectChipGroupProps) {
  const compact = size === "compact";
  const set = new Set(selected);

  const toggle = (opt: string) => {
    if (set.has(opt)) {
      const next = selected.filter((x) => x !== opt);
      onChange(next.length > 0 ? next : [...options]);
    } else {
      onChange([...selected, opt]);
    }
  };

  const selectAll = () => onChange([...options]);
  const clearAll = () => onChange([options[0]!]);

  return (
    <div className={`flex min-w-0 flex-col ${compact ? "gap-1" : "gap-1.5"}`}>
      <div className={`flex flex-wrap items-center gap-x-2 gap-y-0.5 ${hideLabel ? "justify-end" : ""}`}>
        {hideLabel ? null : (
          <span
            className={`shrink-0 font-['Inter',sans-serif] font-medium text-figma-sub ${
              compact ? "text-[10px]" : "text-xs"
            }`}
          >
            {label}
          </span>
        )}
        <span className={`text-figma-sub/70 ${compact ? "text-[9px]" : "text-[10px]"}`}>
          <button
            type="button"
            className="rounded hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
            aria-label={`${label}全选`}
            onClick={selectAll}
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
            onClick={clearAll}
          >
            重置
          </button>
        </span>
      </div>
      <div className={`flex flex-wrap ${compact ? "gap-1" : "gap-1.5"}`}>
        {options.map((opt) => {
          const active = set.has(opt);
          return (
            <button
              key={opt}
              type="button"
              onClick={() => toggle(opt)}
              className={`rounded-full border font-['Inter',sans-serif] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 ${
                compact ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-1 text-xs"
              } ${
                active
                  ? "border-primary bg-primary/10 font-medium text-primary"
                  : "border-figma-line bg-white text-figma-sub hover:border-primary/40 hover:text-figma-text"
              }`}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}
