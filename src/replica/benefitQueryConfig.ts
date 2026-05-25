import {
  CUSTOMER_DIMENSION_GROUPS,
  PRODUCT_DIMENSION_GROUPS,
} from "./selfServiceQueryConfig";
import {
  ASSESSMENT_DIMENSION_GROUPS,
  ORG_BRANCH_OPTIONS,
  ORG_OUTLET_OPTIONS,
  ORG_PROVINCE_OPTIONS,
} from "./assessmentQueryConfig";

export const BENEFIT_DASHBOARD_TABS = ["客户PA", "机构PA", "客群PA", "产品PA"] as const;

export const BENEFIT_INDICATOR_FIELDS = [
  "成本",
  "收入",
  "利润",
  "产品类型",
  "产品期限",
  "产品利率",
  "产品定价",
  "产品净值表现",
  "收益率",
] as const;

export const CUSTOMER_PA_TIER_OPTIONS = ["大众", "理财", "财富", "私银"] as const;
export const CUSTOMER_PA_LEVEL_OPTIONS = ["普通", "金卡", "白金", "钻石"] as const;
export const CUSTOMER_PA_CHANNEL_OPTIONS = ["柜面", "手机银行", "网银", "第三方"] as const;

export const CUSTOMER_PA_DIMENSION_GROUPS = [
  { key: "tier", label: "客户分层", options: CUSTOMER_PA_TIER_OPTIONS },
  { key: "level", label: "客户等级", options: CUSTOMER_PA_LEVEL_OPTIONS },
  { key: "channel", label: "渠道", options: CUSTOMER_PA_CHANNEL_OPTIONS },
] as const;

export const PRODUCT_PA_CATEGORY_OPTIONS = PRODUCT_DIMENSION_GROUPS.map((g) => g.label);
export const PRODUCT_PA_SUBCATEGORY_OPTIONS = [
  "活期",
  "整存整取",
  "封闭式理财",
  "指数型基金",
  "大白金卡",
  "中银e贷",
] as const;
export const PRODUCT_PA_NAME_OPTIONS = [
  "活期存款",
  "大额存单",
  "现金理财",
  "债券型基金",
  "随心智贷",
] as const;

export const PRODUCT_PA_DIMENSION_GROUPS = [
  { key: "category", label: "产品大类", options: PRODUCT_PA_CATEGORY_OPTIONS },
  { key: "subcategory", label: "产品子类", options: PRODUCT_PA_SUBCATEGORY_OPTIONS },
  { key: "product", label: "产品名称", options: PRODUCT_PA_NAME_OPTIONS },
] as const;

export type BenefitDimensionGroup = {
  key: string;
  label: string;
  options: readonly string[];
};

export function getBenefitDimensionGroupsForTab(tabLabel: string): readonly BenefitDimensionGroup[] {
  switch (tabLabel) {
    case "机构PA":
      return ASSESSMENT_DIMENSION_GROUPS;
    case "客户PA":
      return CUSTOMER_PA_DIMENSION_GROUPS;
    case "客群PA":
      return CUSTOMER_DIMENSION_GROUPS;
    case "产品PA":
      return PRODUCT_PA_DIMENSION_GROUPS;
    default:
      return CUSTOMER_PA_DIMENSION_GROUPS;
  }
}

export function getBenefitIndicatorsForTab(_tabLabel: string): readonly string[] {
  return BENEFIT_INDICATOR_FIELDS;
}

export function flattenBenefitOptions(groups: readonly BenefitDimensionGroup[]): string[] {
  const out: string[] = [];
  for (const g of groups) {
    for (const o of g.options) out.push(o);
  }
  return out;
}

export {
  ORG_PROVINCE_OPTIONS,
  ORG_BRANCH_OPTIONS,
  ORG_OUTLET_OPTIONS,
};
