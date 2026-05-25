/** 后评价：消费达标享好礼 — 维度与指标（参考综合报表平台截图） */

export const POST_EVAL_DASHBOARD_TABS = ["消费达标享好礼-后评价"] as const;

export const POST_EVAL_TOTAL_ROWS = 3815;

export const POST_EVAL_CUSTOMER_IDS = [
  "286321937",
  "32944681",
  "285452703",
  "320257731",
  "284064421",
  "320828321",
  "328966449",
  "289714469",
  "287651273",
  "325554437",
  "326031389",
  "288901234",
  "327118902",
  "291005678",
  "324889012",
] as const;

export const POST_EVAL_INDICATOR_FIELDS = [
  "SUM(财付通)",
  "SUM(支付宝)",
  "SUM(抖音)",
  "SUM(网盟在线)",
  "SUM(钱袋宝)",
  "SUM(付费通)",
  "SUM(程付通)",
] as const;

export function getPostEvaluationIndicatorsForTab(_tabLabel: string): readonly string[] {
  return POST_EVAL_INDICATOR_FIELDS;
}

export type CustomerIdUploadState = {
  fileName: string | null;
  rowCount: number;
  customerIds: Set<string>;
};

export function createDefaultCustomerIdUpload(): CustomerIdUploadState {
  return {
    fileName: "客户号清单_20260428.xlsx",
    rowCount: POST_EVAL_TOTAL_ROWS,
    customerIds: new Set(POST_EVAL_CUSTOMER_IDS),
  };
}

export function createEmptyCustomerIdUpload(): CustomerIdUploadState {
  return {
    fileName: null,
    rowCount: 0,
    customerIds: new Set(),
  };
}

export function mockParseCustomerIdExcel(file: File): CustomerIdUploadState {
  return {
    fileName: file.name,
    rowCount: POST_EVAL_TOTAL_ROWS,
    customerIds: new Set(POST_EVAL_CUSTOMER_IDS),
  };
}
