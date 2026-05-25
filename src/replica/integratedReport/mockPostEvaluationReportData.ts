import { POST_EVAL_CUSTOMER_IDS, POST_EVAL_INDICATOR_FIELDS } from "../postEvaluationQueryConfig";

export type PostEvaluationReportRow = {
  customerId: string;
  values: Record<(typeof POST_EVAL_INDICATOR_FIELDS)[number], number | null>;
};

function seed(id: string, field: string): number {
  let h = 2166136261;
  const s = `${id}|${field}`;
  for (let i = 0; i < s.length; i++) {
    h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  }
  return ((h >>> 0) % 10000) / 100;
}

/** 与截图一致的演示行 + 扩展 mock */
export const POST_EVAL_REPORT_ROWS: PostEvaluationReportRow[] = [
  {
    customerId: "286321937",
    values: {
      "SUM(财付通)": 56.65,
      "SUM(支付宝)": null,
      "SUM(抖音)": null,
      "SUM(网盟在线)": null,
      "SUM(钱袋宝)": null,
      "SUM(付费通)": null,
      "SUM(程付通)": null,
    },
  },
  {
    customerId: "32944681",
    values: {
      "SUM(财付通)": 3559.41,
      "SUM(支付宝)": 168,
      "SUM(抖音)": null,
      "SUM(网盟在线)": null,
      "SUM(钱袋宝)": null,
      "SUM(付费通)": null,
      "SUM(程付通)": null,
    },
  },
  ...POST_EVAL_CUSTOMER_IDS.filter((id) => id !== "286321937" && id !== "32944681").map(
    (customerId) => ({
      customerId,
      values: Object.fromEntries(
        POST_EVAL_INDICATOR_FIELDS.map((f, i) => {
          const s = seed(customerId, f);
          if (s < 0.12) return [f, null];
          return [f, Math.round(s * (i + 1) * 1200) / 100];
        }),
      ) as PostEvaluationReportRow["values"],
    }),
  ),
];

export const POST_EVAL_TOTAL_ROWS = 3815;
export const POST_EVAL_PAGE_SIZE = 100;
