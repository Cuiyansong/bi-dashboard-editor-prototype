import type { CanvasWidget } from "../model/dashboardModel";
import type { ChartConfigKind } from "./chartConfig";
import { getChartConfigKind } from "./chartConfig";
import type { DimensionSemantic, FieldRef } from "../model/fieldRef";

export type FieldSlotId = string;

/** 与 `EditorFrame` 中 `uid()` 一致：从库拖入的组件 id，用于「无绑定则无数据」等逻辑 */
export function isLibraryDroppedWidgetId(id: string): boolean {
  return /^w_[a-z0-9]{7}$/i.test(id);
}

export type FieldSlotDef = {
  id: FieldSlotId;
  title: string;
  /** 可放入的字段大类 */
  acceptKinds: ("dimension" | "measure")[];
  /** 仅当拖入维度时：允许的形态；不填表示任意维度 */
  dimensionSemantics?: DimensionSemantic[];
  /** 未填满时仍可显示有数据（解除无数据蒙层） */
  optional?: boolean;
  /** 是否允许多个字段（默认 false，等价 maxCount 1） */
  multiple?: boolean;
  /** 多选时上限；仅 multiple 为 true 时生效 */
  maxCount?: number;
  /** 在标题旁展示「已绑 / 上限」计数（如 0/1、1/5） */
  showSlotCount?: boolean;
  /** 空槽占位文案 */
  emptyPlaceholder?: string;
};

const STRATEGY_COHORT_SLOTS: FieldSlotDef[] = [
  { id: "cohortDim", title: "行 · 客群名称", acceptKinds: ["dimension"], dimensionSemantics: ["string"] },
  { id: "metricDim", title: "行 · 指标名", acceptKinds: ["dimension"], dimensionSemantics: ["string"] },
  { id: "openMeasure", title: "指标期初值", acceptKinds: ["measure"] },
  { id: "closeMeasure", title: "指标期末值", acceptKinds: ["measure"] },
];

function slotsForChartKind(kind: ChartConfigKind): FieldSlotDef[] {
  switch (kind) {
    case "pie":
      return [
        { id: "pieAngle", title: "扇区度量", acceptKinds: ["measure"] },
        { id: "pieColor", title: "颜色 / 维度", acceptKinds: ["dimension"] },
        { id: "pieLegend", title: "图例", acceptKinds: ["dimension"], dimensionSemantics: ["string"], optional: true, multiple: true, maxCount: 4 },
      ];
    case "bar":
      return [
        { id: "categoryAxis", title: "维度（类别轴）", acceptKinds: ["dimension"], dimensionSemantics: ["string", "date"] },
        { id: "valueAxis", title: "度量（值轴）", acceptKinds: ["measure"] },
        {
          id: "stackDim",
          title: "堆积 / 分组",
          acceptKinds: ["dimension"],
          dimensionSemantics: ["string"],
          optional: true,
          multiple: true,
          maxCount: 4,
        },
      ];
    case "line":
      return [
        { id: "timeAxis", title: "时间 / 维度轴", acceptKinds: ["dimension"], dimensionSemantics: ["date", "string"] },
        { id: "lineMeasure", title: "度量序列", acceptKinds: ["measure"], multiple: true, maxCount: 3 },
      ];
    case "table":
      return [
        { id: "rowDim", title: "行维度", acceptKinds: ["dimension"] },
        { id: "colDim", title: "列维度", acceptKinds: ["dimension"], optional: true },
        { id: "tableMeasure", title: "度量", acceptKinds: ["measure"] },
      ];
    case "liquid":
      return [
        { id: "liquidMeasure", title: "进度度量", acceptKinds: ["measure"] },
        { id: "liquidTarget", title: "目标值", acceptKinds: ["measure"], optional: true },
      ];
    case "kpi":
      return [
        { id: "kpiMeasure", title: "主指标", acceptKinds: ["measure"] },
        { id: "kpiCompare", title: "同环比", acceptKinds: ["measure"], optional: true },
      ];
    default:
      return [{ id: "generic", title: "字段", acceptKinds: ["dimension", "measure"] }];
  }
}

const IRIS_LIQUID_SLOTS: FieldSlotDef[] = [
  {
    id: "progressMeasures",
    title: "进度指示 / 度量",
    acceptKinds: ["measure"],
    multiple: true,
    maxCount: 5,
    showSlotCount: true,
  },
  { id: "liquidTarget", title: "目标值", acceptKinds: ["measure"], optional: true },
];

const METRIC_BREAKDOWN_SLOTS: FieldSlotDef[] = [
  {
    id: "breakdownDims",
    title: "拆解依据(维度)",
    acceptKinds: ["dimension"],
    dimensionSemantics: ["string", "date"],
    optional: false,
    multiple: true,
    maxCount: 10,
    showSlotCount: true,
    emptyPlaceholder: "拖拽数据字段至此处",
  },
  {
    id: "breakdownMeasure",
    title: "分析度量",
    acceptKinds: ["measure"],
    maxCount: 1,
    showSlotCount: true,
    emptyPlaceholder: "拖拽数据字段至此处",
  },
  {
    id: "breakdownFilter",
    title: "过滤器",
    acceptKinds: ["dimension", "measure"],
    optional: true,
    maxCount: 1,
    showSlotCount: true,
    emptyPlaceholder: "拖拽数据字段至此处",
  },
];

/** 机构进度看板：无必填槽，蒙层仅对库拖入 id 生效 */
const ORG_PROGRESS_BOARD_SLOTS: FieldSlotDef[] = [];

const COMPOUND_QUERY_SLOTS: FieldSlotDef[] = [];

const INSURANCE_COCKPIT_BOARD_SLOTS: FieldSlotDef[] = [];

const CUSTOMER_TAG_TABLE_SLOTS: FieldSlotDef[] = [
  { id: "tagRow", title: "行维度", acceptKinds: ["dimension"], optional: true },
  { id: "tagCol", title: "标签列", acceptKinds: ["dimension"], dimensionSemantics: ["string"], optional: true },
  { id: "tagMeasure", title: "度量", acceptKinds: ["measure"], optional: true },
];

/** 结合图表类型与特殊布局（如策略客群表） */
export function getFieldSlotsForWidget(chartKind: ChartConfigKind, replicaLayout?: string): FieldSlotDef[] {
  if (replicaLayout === "strategyCohortTable") return STRATEGY_COHORT_SLOTS;
  if (replicaLayout === "irisLiquid") return IRIS_LIQUID_SLOTS;
  if (replicaLayout === "metricBreakdownTree") return METRIC_BREAKDOWN_SLOTS;
  if (replicaLayout === "orgProgressBoard") return ORG_PROGRESS_BOARD_SLOTS;
  if (replicaLayout === "compoundQuery") return COMPOUND_QUERY_SLOTS;
  if (replicaLayout === "insuranceCockpitBoard") return INSURANCE_COCKPIT_BOARD_SLOTS;
  if (replicaLayout === "customerTagTable") return CUSTOMER_TAG_TABLE_SLOTS;
  return slotsForChartKind(chartKind);
}

export function fieldRefKey(f: FieldRef): string {
  return `${f.kind}:${f.key}`;
}

export function slotMaxCount(slot: FieldSlotDef): number {
  if (!slot.multiple) return 1;
  return slot.maxCount ?? 8;
}

export function slotAcceptsField(slot: FieldSlotDef, field: FieldRef): boolean {
  if (!slot.acceptKinds.includes(field.kind)) return false;
  if (field.kind === "measure") return true;
  if (!slot.dimensionSemantics?.length) return true;
  const sem = field.semantic as DimensionSemantic;
  if (sem !== "string" && sem !== "date") return false;
  return slot.dimensionSemantics.includes(sem);
}

/** 槽内是否已包含同 key 字段（多选去重） */
export function slotBindingHasField(arr: FieldRef[] | undefined, field: FieldRef): boolean {
  if (!arr?.length) return false;
  const k = fieldRefKey(field);
  return arr.some((x) => fieldRefKey(x) === k);
}

/** 当前字段是否可放入该槽（类型匹配、未满、且非重复 key） */
export function slotCanReceiveField(
  slot: FieldSlotDef,
  field: FieldRef,
  bindings: Record<string, FieldRef[] | undefined>,
): boolean {
  if (!slotAcceptsField(slot, field)) return false;
  const cur = bindings[slot.id] ?? [];
  if (slotBindingHasField(cur, field)) return false;
  const max = slotMaxCount(slot);
  if (slot.multiple && cur.length >= max) return false;
  return true;
}

/** 必填槽是否都已至少绑定一个字段（用于画布「有数据」蒙层） */
export function widgetHasRequiredFieldData(w: CanvasWidget, bindings: Record<string, FieldRef[]> | undefined): boolean {
  if (w.replicaLayout === "metricBreakdownTree") {
    if (!isLibraryDroppedWidgetId(w.id)) return true;
    const b = bindings ?? {};
    return (b.breakdownMeasure?.length ?? 0) > 0 && (b.breakdownDims?.length ?? 0) > 0;
  }
  const kind = getChartConfigKind(w);
  const slots = getFieldSlotsForWidget(kind, w.replicaLayout);
  if (slots.length === 0) return true;
  const b = bindings ?? {};
  return slots.every((s) => {
    if (s.optional) return true;
    return (b[s.id]?.length ?? 0) > 0;
  });
}

/** 槽位列表对应的绑定是否已全部有值（兼容旧语义：每槽至少一个） */
export function areAllFieldSlotsFilledArray(slots: FieldSlotDef[], bindings: Record<string, FieldRef[]>): boolean {
  return slots.every((s) => (bindings[s.id]?.length ?? 0) > 0);
}

/** 全部槽填满（含可选槽） */
export function widgetFieldBindingsComplete(w: CanvasWidget, bindings: Record<string, FieldRef[]> | undefined): boolean {
  const kind = getChartConfigKind(w);
  const slots = getFieldSlotsForWidget(kind, w.replicaLayout);
  if (slots.length === 0) return true;
  return areAllFieldSlotsFilledArray(slots, bindings ?? {});
}
