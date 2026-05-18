import {
  CUSTOMER_FILTER_DEFS,
  type CustomerFilterId,
  type CustomerFilterState,
} from "./customerFilters";

const SHORT_LABELS: Record<CustomerFilterId, string> = {
  seven_cohorts: "客群",
  cust_tier: "分层",
};

/** 工具条触发器摘要：全选为「全部」，否则「客群 3 · 分层 2」 */
export function customerFilterToolbarSummary(state: CustomerFilterState): string {
  const parts: string[] = [];
  for (const def of CUSTOMER_FILTER_DEFS) {
    const selected = state[def.id] ?? [];
    if (selected.length === def.options.length) continue;
    parts.push(`${SHORT_LABELS[def.id]} ${selected.length}`);
  }
  return parts.length === 0 ? "全部" : parts.join(" · ");
}

export function isCustomerFilterFullySelected(state: CustomerFilterState): boolean {
  return CUSTOMER_FILTER_DEFS.every((def) => (state[def.id] ?? []).length === def.options.length);
}
