import type { CustomerFilterState } from "../model/customerFilters";
import { customerFilterToolbarSummary, isCustomerFilterFullySelected } from "../model/customerFilterSummary";
import { FilterPopover } from "./FilterPopover";
import { FilterSummaryTrigger } from "./FilterSummaryTrigger";

export type ChartFilterToolbarProps = {
  values: CustomerFilterState;
  onChange: (filterId: keyof CustomerFilterState, value: string[]) => void;
};

/** 图表卡片顶栏：单入口筛选 Popover，与全局筛选联动 */
export function ChartFilterToolbar({ values, onChange }: ChartFilterToolbarProps) {
  const summary = customerFilterToolbarSummary(values);
  const isAll = isCustomerFilterFullySelected(values);

  return (
    <section
      className="flex items-center border-b border-black/[0.06] bg-neutral-50/90 px-3 py-1.5"
      aria-label="图表筛选"
      onClick={(e) => e.stopPropagation()}
      onKeyDown={(e) => e.stopPropagation()}
    >
      <FilterPopover
        values={values}
        onChange={onChange}
        trigger={({ open, panelId, onToggle, triggerRef }) => (
          <FilterSummaryTrigger
            open={open}
            panelId={panelId}
            summary={summary}
            isAllSelected={isAll}
            triggerRef={triggerRef}
            onClick={(e) => {
              e.stopPropagation();
              onToggle();
            }}
          />
        )}
      />
    </section>
  );
}
