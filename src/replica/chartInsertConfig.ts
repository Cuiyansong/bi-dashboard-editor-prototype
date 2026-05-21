import type { WidgetType } from "../model/dashboardModel";
import {
  CUSTOMER_DIMENSION_GROUPS,
  CUSTOMER_INDICATOR_FIELDS,
  PRODUCT_DIMENSION_GROUPS,
  PRODUCT_INDICATOR_FIELDS,
  YOY_FIELDS,
  flattenProductOptions,
} from "./selfServiceQueryConfig";

export type AnalysisMode = "customer" | "product";

export type InsertedChart = {
  id: string;
  type: WidgetType;
  title: string;
  dimensions: string[];
  indicators: string[];
};

export type DimensionGroupForInsert = {
  label: string;
  options: readonly string[];
};

export const CHART_INSERT_TYPES: {
  type: WidgetType;
  label: string;
  hint: string;
}[] = [
  { type: "bar", label: "柱形图", hint: "对比维度下的指标分布" },
  { type: "line", label: "折线图", hint: "观察指标随维度变化趋势" },
  { type: "kpi", label: "指标卡", hint: "突出展示核心指标汇总" },
  { type: "table", label: "明细表", hint: "维度 × 指标交叉明细" },
];

export function getDimensionGroupsForInsert(mode: AnalysisMode): DimensionGroupForInsert[] {
  if (mode === "product") {
    return PRODUCT_DIMENSION_GROUPS.map((g) => ({
      label: g.label,
      options: g.options,
    }));
  }
  return CUSTOMER_DIMENSION_GROUPS.map((g) => ({
    label: g.label,
    options: g.options,
  }));
}

export function getAllDimensionOptions(mode: AnalysisMode): string[] {
  return getDimensionGroupsForInsert(mode).flatMap((g) => [...g.options]);
}

export type DimensionSelections = {
  products: Set<string>;
  tiers: Set<string>;
  cohorts: Set<string>;
  scenarios: Set<string>;
};

export function getDefaultInsertDimensions(
  mode: AnalysisMode,
  selections: DimensionSelections,
): Set<string> {
  if (mode === "product") {
    return new Set(selections.products);
  }
  const out = new Set<string>();
  for (const t of selections.tiers) out.add(t);
  for (const c of selections.cohorts) out.add(c);
  for (const s of selections.scenarios) out.add(s);
  return out;
}

export function getIndicatorOptionsForInsert(mode: AnalysisMode): readonly string[] {
  return mode === "product" ? PRODUCT_INDICATOR_FIELDS : CUSTOMER_INDICATOR_FIELDS;
}

export function getDefaultInsertIndicators(
  mode: AnalysisMode,
  l1Fields: Set<string>,
  l2Fields: Set<string>,
): Set<string> {
  const base = getIndicatorOptionsForInsert(mode);
  const shared = base.filter((f) => l1Fields.has(f) && l2Fields.has(f));
  const yoy = YOY_FIELDS.filter((f) => l2Fields.has(f));
  return new Set([...shared, ...yoy]);
}

export function buildInsertedChartTitle(type: WidgetType, indicators: string[]): string {
  const typeLabel = CHART_INSERT_TYPES.find((t) => t.type === type)?.label ?? "图表";
  const first = indicators[0] ?? "指标";
  return indicators.length > 1 ? `${typeLabel} · ${first} 等` : `${typeLabel} · ${first}`;
}

export function newInsertedChartId(): string {
  return `insert_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
}

/** 产品模式默认全选产品 */
export function defaultProductDimensionSet(): Set<string> {
  return new Set(flattenProductOptions());
}
