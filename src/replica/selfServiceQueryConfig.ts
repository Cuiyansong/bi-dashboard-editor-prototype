import { CUST_TIER_OPTIONS, SEVEN_COHORT_OPTIONS } from "../model/customerFilters";

/** 产品分析：左侧维度分类 */
export const PRODUCT_DIMENSION_GROUPS = [
  {
    label: "存款产品",
    options: ["活期", "整存整取", "大额存单", "结构性存款"],
  },
  {
    label: "理财产品",
    options: ["封闭式理财", "固定收益类理财", "现金理财"],
  },
  {
    label: "基金产品",
    options: [
      "指数型基金",
      "混合型证券投资基金",
      "债券型基金",
      "纯债类基金",
      "固收+类基金",
      "权益指数类基金",
    ],
  },
  {
    label: "信用卡",
    options: ["大白金卡"],
  },
  {
    label: "个人贷款",
    options: ["中银e贷", "随心智贷", "房贷"],
    subgroups: [
      { label: "消费贷款", options: ["中银e贷", "随心智贷"] },
      { label: "房贷", options: ["房贷"] },
    ],
  },
] as const;

export const PRODUCT_INDICATOR_FIELDS = [
  "销量金额",
  "销售笔数",
  "中收",
  "月均余额",
  "年均余额",
  "交易时间",
  "购买金额",
  "到期日期",
  "存期",
] as const;

export const SCENARIO_COHORT_OPTIONS = ["商户客群", "食堂客群"] as const;

const PRODUCT_CATEGORY_NAMES = PRODUCT_DIMENSION_GROUPS.map((g) => g.label);

/** 客群分析：左侧维度顺序（客群分层 → 七大客群 → 场景客群） */
export const CUSTOMER_DIMENSION_GROUPS = [
  { key: "tier", label: "客群分层", options: CUST_TIER_OPTIONS },
  { key: "cohort", label: "七大客群", options: SEVEN_COHORT_OPTIONS },
  { key: "scenario", label: "场景客群", options: SCENARIO_COHORT_OPTIONS },
] as const;

/** 客群分析：业务考核类指标 */
export const CUSTOMER_INDICATOR_FIELDS = [
  "客户数量",
  "全量金融资产时点余额",
  "全量金融资产月日均余额",
  "全量金融资产年日均余额",
  ...PRODUCT_CATEGORY_NAMES.flatMap((cat) => [
    `${cat}时点余额`,
    `${cat}月日均余额`,
    `${cat}年日均余额`,
  ]),
] as const;

export const YOY_TAB_LABEL = "同环比";
export const YOY_FIELDS = ["同比", "环比", "占比"] as const;

export const INDICATOR_TABS = ["指标"] as const;
export const LEVEL1_TABS = INDICATOR_TABS;
export const LEVEL2_TABS = [YOY_TAB_LABEL, ...INDICATOR_TABS] as const;

export function flattenProductOptions(): string[] {
  const out: string[] = [];
  for (const g of PRODUCT_DIMENSION_GROUPS) {
    for (const o of g.options) out.push(o);
  }
  return out;
}

export function getIndicatorFieldsForTab(
  tabLabel: string,
  mode: "customer" | "product",
): readonly string[] {
  if (tabLabel === YOY_TAB_LABEL) return YOY_FIELDS;
  return mode === "product" ? PRODUCT_INDICATOR_FIELDS : CUSTOMER_INDICATOR_FIELDS;
}

export function orderedSelectedFields(
  selected: Set<string>,
  mode: "customer" | "product",
): string[] {
  const base = mode === "product" ? PRODUCT_INDICATOR_FIELDS : CUSTOMER_INDICATOR_FIELDS;
  return [
    ...base.filter((f) => selected.has(f)),
    ...YOY_FIELDS.filter((f) => selected.has(f)),
  ];
}
