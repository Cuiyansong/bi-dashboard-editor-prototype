import type { WidgetType } from "../model/dashboardModel";
import { ASSESSMENT_DIMENSION_GROUPS } from "./assessmentQueryConfig";
import { getBenefitDimensionGroupsForTab, type BenefitDimensionGroup } from "./benefitQueryConfig";
import { POST_EVAL_CUSTOMER_IDS } from "./postEvaluationQueryConfig";
import {
  CUSTOMER_DIMENSION_GROUPS,
  CUSTOMER_INDICATOR_FIELDS,
  PRODUCT_DIMENSION_GROUPS,
  PRODUCT_INDICATOR_FIELDS,
  YOY_FIELDS,
  flattenProductOptions,
  getBaseIndicatorFields,
  type AnalysisMode,
} from "./selfServiceQueryConfig";

export type { AnalysisMode };

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

export function getDimensionGroupsForInsert(
  mode: AnalysisMode,
  dashTabLabel?: string,
): DimensionGroupForInsert[] {
  if (mode === "product") {
    return PRODUCT_DIMENSION_GROUPS.map((g) => ({
      label: g.label,
      options: g.options,
    }));
  }
  if (mode === "assessment") {
    return ASSESSMENT_DIMENSION_GROUPS.map((g) => ({
      label: g.label,
      options: g.options,
    }));
  }
  if (mode === "benefit") {
    return getBenefitDimensionGroupsForTab(dashTabLabel ?? "").map((g) => ({
      label: g.label,
      options: g.options,
    }));
  }
  if (mode === "postEvaluation") {
    return [{ label: "客户号", options: POST_EVAL_CUSTOMER_IDS }];
  }
  return CUSTOMER_DIMENSION_GROUPS.map((g) => ({
    label: g.label,
    options: g.options,
  }));
}

export function getAllDimensionOptions(mode: AnalysisMode, dashTabLabel?: string): string[] {
  return getDimensionGroupsForInsert(mode, dashTabLabel).flatMap((g) => [...g.options]);
}

export type DimensionSelections = {
  products: Set<string>;
  tiers: Set<string>;
  cohorts: Set<string>;
  scenarios: Set<string>;
  provinces: Set<string>;
  branches: Set<string>;
  outlets: Set<string>;
  generic: Record<string, Set<string>>;
  customerIds: Set<string>;
};

export function getDefaultInsertDimensions(
  mode: AnalysisMode,
  selections: DimensionSelections,
  dashTabLabel?: string,
): Set<string> {
  if (mode === "product") {
    return new Set(selections.products);
  }
  if (mode === "postEvaluation") {
    return new Set(selections.customerIds);
  }
  if (mode === "assessment") {
    const out = new Set<string>();
    for (const p of selections.provinces) out.add(p);
    for (const b of selections.branches) out.add(b);
    for (const o of selections.outlets) out.add(o);
    return out;
  }
  if (mode === "benefit") {
    const out = new Set<string>();
    for (const s of Object.values(selections.generic)) {
      for (const v of s) out.add(v);
    }
    return out;
  }
  const out = new Set<string>();
  for (const t of selections.tiers) out.add(t);
  for (const c of selections.cohorts) out.add(c);
  for (const s of selections.scenarios) out.add(s);
  return out;
}

export function getIndicatorOptionsForInsert(
  mode: AnalysisMode,
  dashTabLabel?: string,
): readonly string[] {
  return getBaseIndicatorFields(mode, dashTabLabel);
}

export function getDefaultInsertIndicators(
  mode: AnalysisMode,
  l1Fields: Set<string>,
  l2Fields: Set<string>,
  dashTabLabel?: string,
): Set<string> {
  const base = getIndicatorOptionsForInsert(mode, dashTabLabel);
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

export function initGenericDimensionSelections(
  groups: readonly BenefitDimensionGroup[],
): Record<string, Set<string>> {
  const out: Record<string, Set<string>> = {};
  for (const g of groups) {
    out[g.key] = new Set(g.options);
  }
  return out;
}
