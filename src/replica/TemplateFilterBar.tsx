import { CUSTOMER_FILTER_DEFS, type CustomerFilterState } from "../model/customerFilters";
import { GlobalFilterDimensionPanel } from "./GlobalFilterDimensionPanel";

export type TemplateFilterBarProps = {
  values: CustomerFilterState;
  onChange: (filterId: keyof CustomerFilterState, value: string[]) => void;
  onQuery?: () => void;
};

/** 看板级全局筛选：紧凑平铺（仍为多选芯片，不占过多纵向空间） */
export function TemplateFilterBar({ values, onChange, onQuery }: TemplateFilterBarProps) {
  return (
    <div className="mb-3 px-1">
      <section
        aria-label="全局筛选"
        className="w-full max-w-[1247px] rounded-lg border border-[#DBEAFE] bg-[#F8FAFC] px-3 py-2.5"
      >
        <div className="mb-2 flex items-center justify-between gap-2 border-b border-[#DBEAFE] pb-2">
          <h2 className="font-['Inter',sans-serif] text-xs font-semibold text-[#1E3A8A]">全局筛选</h2>
          {onQuery ? (
            <button
              type="button"
              className="shrink-0 rounded-md bg-primary px-3.5 py-1 font-['Inter',sans-serif] text-[11px] font-medium text-white transition-colors hover:bg-[#2568e6] active:bg-[#1f5bcc] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
              onClick={onQuery}
            >
              查询
            </button>
          ) : null}
        </div>

        <div className="flex flex-col gap-2.5">
          {CUSTOMER_FILTER_DEFS.map((f, i) => (
            <GlobalFilterDimensionPanel
              key={f.id}
              id={f.id}
              label={f.label}
              options={f.options}
              selected={values[f.id] ?? [...f.options]}
              onChange={(next) => onChange(f.id, next)}
              showDivider={i < CUSTOMER_FILTER_DEFS.length - 1}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
