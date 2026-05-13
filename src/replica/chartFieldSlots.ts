import type { CanvasWidget } from "../model/dashboardModel";
import type { ChartConfigKind } from "./chartConfig";
import { getChartConfigKind } from "./chartConfig";
import type { DimensionSemantic, FieldRef } from "../model/fieldRef";

export type FieldSlotId = string;

export type FieldSlotDef = {
  id: FieldSlotId;
  title: string;
  /** 可放入的字段大类 */
  acceptKinds: ("dimension" | "measure")[];
  /** 仅当拖入维度时：允许的形态；不填表示任意维度 */
  dimensionSemantics?: DimensionSemantic[];
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
        { id: "pieLegend", title: "图例", acceptKinds: ["dimension"], dimensionSemantics: ["string"] },
      ];
    case "bar":
      return [
        { id: "categoryAxis", title: "维度（类别轴）", acceptKinds: ["dimension"], dimensionSemantics: ["string", "date"] },
        { id: "valueAxis", title: "度量（值轴）", acceptKinds: ["measure"] },
        { id: "stackDim", title: "堆积 / 分组", acceptKinds: ["dimension"], dimensionSemantics: ["string"] },
      ];
    case "line":
      return [
        { id: "timeAxis", title: "时间 / 维度轴", acceptKinds: ["dimension"], dimensionSemantics: ["date", "string"] },
        { id: "lineMeasure", title: "度量序列", acceptKinds: ["measure"] },
      ];
    case "table":
      return [
        { id: "rowDim", title: "行维度", acceptKinds: ["dimension"] },
        { id: "colDim", title: "列维度", acceptKinds: ["dimension"] },
        { id: "tableMeasure", title: "度量", acceptKinds: ["measure"] },
      ];
    case "liquid":
      return [
        { id: "liquidMeasure", title: "进度度量", acceptKinds: ["measure"] },
        { id: "liquidTarget", title: "目标值", acceptKinds: ["measure"] },
      ];
    case "kpi":
      return [
        { id: "kpiMeasure", title: "主指标", acceptKinds: ["measure"] },
        { id: "kpiCompare", title: "同环比", acceptKinds: ["measure"] },
      ];
    default:
      return [{ id: "generic", title: "字段", acceptKinds: ["dimension", "measure"] }];
  }
}

/** 结合图表类型与特殊布局（如策略客群表） */
export function getFieldSlotsForWidget(
  chartKind: ChartConfigKind,
  replicaLayout?: string,
): FieldSlotDef[] {
  if (replicaLayout === "strategyCohortTable") return STRATEGY_COHORT_SLOTS;
  return slotsForChartKind(chartKind);
}

export function slotAcceptsField(slot: FieldSlotDef, field: FieldRef): boolean {
  if (!slot.acceptKinds.includes(field.kind)) return false;
  if (field.kind === "measure") return true;
  if (!slot.dimensionSemantics?.length) return true;
  const sem = field.semantic as DimensionSemantic;
  if (sem !== "string" && sem !== "date") return false;
  return slot.dimensionSemantics.includes(sem);
}

/** 槽位列表对应的绑定是否已全部有值（用于画布「无数据」态） */
export function areAllFieldSlotsFilled(slots: FieldSlotDef[], bindings: Record<string, FieldRef | undefined>): boolean {
  return slots.every((s) => bindings[s.id] != null);
}

export function widgetFieldBindingsComplete(w: CanvasWidget, bindings: Record<string, FieldRef | undefined> | undefined): boolean {
  const kind = getChartConfigKind(w);
  const slots = getFieldSlotsForWidget(kind, w.replicaLayout);
  if (slots.length === 0) return true;
  return areAllFieldSlotsFilled(slots, bindings ?? {});
}
