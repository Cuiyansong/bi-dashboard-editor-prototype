/** 七大客群、客户分层 — 全局与图表局部筛选共用 */

export const SEVEN_COHORT_OPTIONS = [
  "代发薪客群",
  "个体经营者客群",
  "养老客群",
  "年轻客群",
  "房贷客群",
  "跨境客群",
  "企业家客群",
] as const;

export const PRODUCT_NAME_OPTIONS = [
  "个人贷款",
  "个人贷记卡",
  "三方存管",
  "个人养老金",
  "社保卡",
  "中银证券",
  "个人大额存单",
  "个人积存金",
  "基金",
  "保险",
  "债券",
  "代销",
  "资管",
  "公募理财",
  "私募理财",
  "家族信托",
] as const;

export const CUST_TIER_OPTIONS = ["大众", "理财", "财富", "私银"] as const;

export const FILTER_ID_SEVEN_COHORTS = "seven_cohorts";
export const FILTER_ID_CUST_TIER = "cust_tier";
export const FILTER_ID_PRODUCT_NAME = "product_name";

export type CustomerFilterId =
  | typeof FILTER_ID_SEVEN_COHORTS
  | typeof FILTER_ID_CUST_TIER
  | typeof FILTER_ID_PRODUCT_NAME;

export type CustomerFilterState = Record<CustomerFilterId, string[]>;

export type CustomerFilterDef = {
  id: CustomerFilterId;
  label: string;
  options: readonly string[];
};

export const CUSTOMER_FILTER_DEFS: CustomerFilterDef[] = [
  {
    id: FILTER_ID_SEVEN_COHORTS,
    label: "七大客群",
    options: SEVEN_COHORT_OPTIONS,
  },
  { id: FILTER_ID_CUST_TIER, label: "客户分层", options: CUST_TIER_OPTIONS },
];

export const PRODUCT_FILTER_DEFS: {
  id: CustomerFilterId;
  label: string;
  options: readonly string[];
}[] = [
  {
    id: FILTER_ID_PRODUCT_NAME,
    label: "产品名称",
    options: PRODUCT_NAME_OPTIONS,
  },
];

export function defaultCustomerFilterState(): CustomerFilterState {
  return {
    [FILTER_ID_SEVEN_COHORTS]: [...SEVEN_COHORT_OPTIONS],
    [FILTER_ID_CUST_TIER]: [...CUST_TIER_OPTIONS],
    [FILTER_ID_PRODUCT_NAME]: [...PRODUCT_NAME_OPTIONS],
  };
}

export function serializeCustomerFilterState(
  state: CustomerFilterState,
): string {
  return CUSTOMER_FILTER_DEFS.map(
    (d) => `${d.id}:${[...(state[d.id] ?? [])].sort().join(",")}`,
  ).join("|");
}

/** 图表假数据哈希用（全局与局部已联动，共用同一状态） */
export function filterMixFromState(state: CustomerFilterState): string {
  return serializeCustomerFilterState(state);
}
