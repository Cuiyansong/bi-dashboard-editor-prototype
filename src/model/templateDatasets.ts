/** 与看板模板绑定的数据集：名称、维度、度量（全中文）及 KPI 预览行 */

import type { DimensionSemantic } from "./fieldRef";

export type MeasureSemantic = "number";

export type DatasetDimensionField = {
  key: string;
  label: string;
  semantic: DimensionSemantic;
};

export type DatasetMeasureField = {
  key: string;
  label: string;
  semantic: MeasureSemantic;
};

/** 客群策略追踪表 mock 行（组件内合并客群列） */
export type CohortTrackingMockRow = {
  cohort: string;
  metric: string;
  open: string;
  close: string;
  /** 展示用，如 +¥220 或 +5.0% */
  delta: string;
  rate: string;
};

export type TemplateDatasetDef = {
  templateId: string;
  datasetName: string;
  dimensions: DatasetDimensionField[];
  measures: DatasetMeasureField[];
  kpiPreviewRows: { label: string; value: string }[];
  cohortTrackingRows?: CohortTrackingMockRow[];
};

export const STRATEGY_COHORT_DEFAULT_ROWS: CohortTrackingMockRow[] = [
  { cohort: "新客群体", metric: "获客成本", open: "¥1200", close: "¥980", delta: "+¥220", rate: "+18.3%" },
  { cohort: "新客群体", metric: "转化率", open: "3.2%", close: "8.2%", delta: "+5.0%", rate: "+156%" },
  { cohort: "高价值老客", metric: "客单价", open: "¥860", close: "¥920", delta: "+¥60", rate: "+7.0%" },
  { cohort: "高价值老客", metric: "复购率", open: "42%", close: "51%", delta: "+9.0%", rate: "+21.4%" },
  { cohort: "高价值老客", metric: "推荐率", open: "12%", close: "18%", delta: "+6.0%", rate: "+50%" },
  { cohort: "高价值老客", metric: "留存率", open: "88%", close: "92%", delta: "+4.0%", rate: "+4.5%" },
  { cohort: "沉睡客群", metric: "复访率", open: "5%", close: "11%", delta: "+6.0%", rate: "+120%" },
  { cohort: "沉睡客群", metric: "唤醒成本", open: "¥210", close: "¥165", delta: "+¥45", rate: "+21.4%" },
  { cohort: "流失风险客群", metric: "流失概率", open: "34%", close: "22%", delta: "-12.0%", rate: "-35.3%" },
  { cohort: "流失风险客群", metric: "挽回投入", open: "¥450", close: "¥380", delta: "+¥70", rate: "+15.6%" },
];

const DATASETS: TemplateDatasetDef[] = [
  {
    templateId: "cockpit",
    datasetName: "驾驶舱风控主题库",
    dimensions: [
      { key: "alert_level", label: "预警等级", semantic: "string" },
      { key: "biz_line", label: "业务条线", semantic: "string" },
      { key: "stat_date", label: "统计日期", semantic: "date" },
    ],
    measures: [
      { key: "alert_cnt", label: "预警单量", semantic: "number" },
      { key: "overdue_amt", label: "逾期金额(万)", semantic: "number" },
      { key: "achieve_rate", label: "目标达成率", semantic: "number" },
      { key: "close_hours", label: "平均闭环时长", semantic: "number" },
    ],
    kpiPreviewRows: [
      { label: "一类预警", value: "73.2" },
      { label: "二类预警", value: "213" },
      { label: "待闭环", value: "277.6" },
    ],
  },
  {
    templateId: "strategy",
    datasetName: "营销策略与客群主题库",
    dimensions: [
      { key: "cohort_name", label: "客群名称", semantic: "string" },
      { key: "metric_name", label: "指标名", semantic: "string" },
      { key: "time_period", label: "时间周期", semantic: "date" },
    ],
    measures: [
      { key: "open_val", label: "指标期初值", semantic: "number" },
      { key: "close_val", label: "指标期末值", semantic: "number" },
    ],
    kpiPreviewRows: [
      { label: "新客策略包", value: "42" },
      { label: "老客经营包", value: "156" },
      { label: "挽回专项", value: "89" },
    ],
    cohortTrackingRows: STRATEGY_COHORT_DEFAULT_ROWS,
  },
  {
    templateId: "report-kpi",
    datasetName: "通报考核主题库",
    dimensions: [
      { key: "period", label: "考核周期", semantic: "date" },
      { key: "dept", label: "部门", semantic: "string" },
      { key: "role", label: "岗位", semantic: "string" },
    ],
    measures: [
      { key: "kpi_score", label: "KPI 得分", semantic: "number" },
      { key: "rank_score", label: "排名加权分", semantic: "number" },
      { key: "actual_val", label: "完成值", semantic: "number" },
      { key: "target_val", label: "目标值", semantic: "number" },
    ],
    kpiPreviewRows: [
      { label: "综合得分", value: "92.4" },
      { label: "排名区间", value: "前 15%" },
      { label: "待改进项", value: "3" },
    ],
  },
  {
    templateId: "post-evaluation",
    datasetName: "后评价数据集",
    dimensions: [{ key: "customer_id", label: "客户号", semantic: "string" }],
    measures: [
      { key: "tenpay", label: "SUM(财付通)", semantic: "number" },
      { key: "alipay", label: "SUM(支付宝)", semantic: "number" },
      { key: "douyin", label: "SUM(抖音)", semantic: "number" },
      { key: "wangmeng", label: "SUM(网盟在线)", semantic: "number" },
      { key: "qiandaibao", label: "SUM(钱袋宝)", semantic: "number" },
      { key: "fufeitong", label: "SUM(付费通)", semantic: "number" },
      { key: "chengfutong", label: "SUM(程付通)", semantic: "number" },
    ],
    kpiPreviewRows: [
      { label: "客户数", value: "3,815" },
      { label: "渠道指标", value: "7" },
      { label: "报表", value: "消费达标享好礼-后评价" },
    ],
  },
  {
    templateId: "iris-demo",
    datasetName: "Iris数据集",
    dimensions: [
      { key: "species", label: "物种", semantic: "string" },
      { key: "sepal", label: "花萼长", semantic: "string" },
      { key: "petal", label: "花瓣宽", semantic: "string" },
    ],
    measures: [
      { key: "sepal_len", label: "sepal_len", semantic: "number" },
      { key: "sepal_wid", label: "sepal_wid", semantic: "number" },
      { key: "petal_len", label: "petal_len", semantic: "number" },
      { key: "petal_wid", label: "petal_wid", semantic: "number" },
    ],
    kpiPreviewRows: [
      { label: "setosa", value: "50" },
      { label: "versicolor", value: "50" },
      { label: "virginica", value: "50" },
    ],
  },
];

const FALLBACK = DATASETS[0]!;

/** 数据面板「切换数据集」列表（含 Iris 演示项） */
export function listRegisteredDatasets(): TemplateDatasetDef[] {
  return DATASETS;
}

export function getDatasetForTemplate(templateId: string): TemplateDatasetDef {
  return DATASETS.find((d) => d.templateId === templateId) ?? FALLBACK;
}

export function defaultPrimaryMeasureKey(templateId: string): string {
  return getDatasetForTemplate(templateId).measures[0]!.key;
}

function u32(n: number): number {
  return n >>> 0;
}

/** 与字符串 + 整数种子混合的 32 位哈希，用于稳定假数据抖动 */
export function dataMixHash(s: string, seed: number): number {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  h ^= seed * 2654435761;
  h = Math.imul(h ^ (h >>> 16), 2246822507);
  h = Math.imul(h ^ (h >>> 13), 3266489909);
  return u32(h);
}

/** 主指标水波等用的百分比感数值，随 `dataSeed` 刷新变化（全局） */
export function measureValue(key: string, dataSeed = 0): number {
  const h = dataMixHash(key, dataSeed);
  return 12 + (h % 86);
}

/** 按图表隔离：混入 widgetId 与筛选条件，区间约 15–94 */
export function measureValueForWidget(
  measureKey: string,
  dataSeed: number,
  widgetId: string,
  filterMix = "",
): number {
  const h = dataMixHash(`${widgetId}|${measureKey}|${filterMix}`, dataSeed);
  return 15 + (h % 80);
}

/** KPI 三格预览：在原始文案基础上按模板与种子做小幅数值抖动；`widgetId` 用于多块图差异化 */
export function seededKpiPreviewRows(
  rows: { label: string; value: string }[],
  templateId: string,
  seed: number,
  widgetId = "",
  filterMix = "",
): { label: string; value: string }[] {
  return rows.map((row, i) => {
    const raw = row.value.trim();
    const h = dataMixHash(`${templateId}:${row.label}:${widgetId}|${filterMix}`, seed + i * 31);
    const jitter = (h % 37) - 18;

    if (/前\s*\d+%|后\s*\d+%|区间/i.test(raw)) return row;
    /** 纯数值型展示才抖动，避免「前 15%」等被误匹配到内部数字 */
    if (!/^[-\d.]/.test(raw)) return row;

    const numMatch = raw.match(/^[-\d.]+/);
    if (!numMatch) return row;
    const n = parseFloat(numMatch[0]);
    if (!Number.isFinite(n)) return row;

    const scale = Math.abs(n) < 25 ? 0.85 : Math.abs(n) * 0.045;
    const next = Math.max(0, n + jitter * scale);

    if (/%/.test(raw)) {
      const decimals = /\.\d/.test(raw) ? 1 : 0;
      return { ...row, value: `${next.toFixed(decimals)}%` };
    }
    if (raw.includes(".")) {
      return { ...row, value: next.toFixed(1) };
    }
    return { ...row, value: String(Math.round(next)) };
  });
}

function jiggleMetricToken(s: string, seed: number, salt: number): string {
  const h = dataMixHash(s, seed + salt);

  const yen = s.match(/¥\s*([\d.]+)/);
  if (yen) {
    const n = parseFloat(yen[1]!);
    if (!Number.isFinite(n)) return s;
    const nn = Math.max(0, n + (h % 61) - 30);
    return s.replace(yen[1]!, String(Math.round(nn)));
  }

  const pctEnd = s.match(/([+-]?[\d.]+)\s*%/);
  if (pctEnd && s.includes("%")) {
    const n = parseFloat(pctEnd[1]!);
    if (!Number.isFinite(n)) return s;
    const nn = n + ((h >> 8) % 21) / 10 - 1;
    const sign = nn > 0 && (s.startsWith("+") || s.startsWith("-") || s.startsWith("△")) ? "+" : "";
    const body = s.replace(/[+-]?[\d.]+\s*%/, `${sign}${Math.abs(nn).toFixed(1)}%`);
    return body;
  }

  return s;
}

/** 策略客群表：期初/期末/变动/变动率在刷新时整体抖动一版 */
export function seededCohortRows(
  rows: CohortTrackingMockRow[],
  seed: number,
  widgetId = "",
  filterMix = "",
): CohortTrackingMockRow[] {
  if (!rows.length) return rows;
  const mixKey = `${widgetId}|${filterMix}`;
  return rows.map((r, i) => ({
    ...r,
    open: jiggleMetricToken(r.open, seed + dataMixHash(mixKey, i), i * 5 + 1),
    close: jiggleMetricToken(r.close, seed + dataMixHash(mixKey, i), i * 5 + 2),
    delta: jiggleMetricToken(r.delta, seed + dataMixHash(mixKey, i), i * 5 + 3),
    rate: jiggleMetricToken(r.rate, seed + dataMixHash(mixKey, i), i * 5 + 4),
  }));
}
