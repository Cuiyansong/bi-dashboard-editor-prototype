import type { CanvasWidget } from "../model/dashboardModel";
import type { FieldRef } from "../model/fieldRef";
import type { TemplateDatasetDef } from "../model/templateDatasets";
import { getDatasetForTemplate } from "../model/templateDatasets";
import { getChartConfigKind } from "./chartConfig";
import { getFieldSlotsForWidget } from "./chartFieldSlots";
import type { FieldSlotBindings } from "./ReplicaRightPanel";

function refDim(d: TemplateDatasetDef["dimensions"][number]): FieldRef {
  return { kind: "dimension", key: d.key, label: d.label, semantic: d.semantic };
}

function refMeas(m: TemplateDatasetDef["measures"][number]): FieldRef {
  return { kind: "measure", key: m.key, label: m.label, semantic: "number" };
}

/** 为模板画布上的组件生成初始字段槽绑定（演示数据，与用户拖拽格式一致） */
export function defaultFieldBindingsForWidget(
  w: CanvasWidget,
  presetId: string,
  datasetForPreset: TemplateDatasetDef,
): FieldSlotBindings {
  const layout = w.replicaLayout;
  const kind = getChartConfigKind(w);
  const slots = getFieldSlotsForWidget(kind, layout);
  if (!slots.length) return {};

  const bindingDs =
    layout === "metricBreakdownTree" && presetId === "cockpit" ? getDatasetForTemplate("iris-demo") : datasetForPreset;

  if (layout === "metricBreakdownTree") {
    const ds = bindingDs;
    const dims = ds.dimensions.slice(0, 2);
    const m0 = ds.measures[0];
    if (!m0 || !dims[0]) return {};
    return {
      breakdownDims: dims.map((d) => refDim(d)),
      breakdownMeasure: [refMeas(m0)],
    };
  }

  if (layout === "irisLiquid") {
    const ds = presetId === "cockpit" ? getDatasetForTemplate("iris-demo") : datasetForPreset;
    const ms = ds.measures.slice(0, 2);
    if (!ms.length) return {};
    return { progressMeasures: ms.map(refMeas) };
  }

  if (layout === "strategyCohortTable") {
    const ds = datasetForPreset;
    const d0 = ds.dimensions.find((d) => d.semantic === "string") ?? ds.dimensions[0];
    const d1 = ds.dimensions.find((d) => d.key !== d0?.key && d.semantic === "string") ?? ds.dimensions[1];
    const m0 = ds.measures[0];
    const m1 = ds.measures[1];
    if (!d0 || !m0 || !m1) return {};
    return {
      cohortDim: [refDim(d0)],
      ...(d1 ? { metricDim: [refDim(d1)] } : {}),
      openMeasure: [refMeas(m0)],
      closeMeasure: [refMeas(m1)],
    };
  }

  if (layout === "irisCrossTable") {
    const iris = getDatasetForTemplate("iris-demo");
    const species = iris.dimensions.find((d) => d.key === "species");
    const sepal = iris.dimensions.find((d) => d.key === "sepal");
    const sl = iris.measures.find((m) => m.key === "sepal_len");
    if (!species || !sl) return {};
    const out: FieldSlotBindings = { rowDim: [refDim(species)], tableMeasure: [refMeas(sl)] };
    if (sepal) out.colDim = [refDim(sepal)];
    return out;
  }

  if (layout === "customerTagTable") {
    const ds = datasetForPreset;
    const d0 = ds.dimensions[0];
    const m0 = ds.measures[0];
    if (!d0 || !m0) return {};
    return { tagRow: [refDim(d0)], tagMeasure: [refMeas(m0)] };
  }

  const ds = datasetForPreset;
  const stringDims = ds.dimensions.filter((d) => d.semantic === "string");
  const dateDims = ds.dimensions.filter((d) => d.semantic === "date");
  const m0 = ds.measures[0];
  const m1 = ds.measures[1];
  if (!m0) return {};

  const out: FieldSlotBindings = {};
  for (const s of slots) {
    if (s.id === "categoryAxis" || s.id === "rowDim" || s.id === "tagRow") {
      const d = stringDims[0] ?? ds.dimensions[0];
      if (d) out[s.id] = [refDim(d)];
    } else if (s.id === "timeAxis") {
      const d = dateDims[0] ?? stringDims[0] ?? ds.dimensions[0];
      if (d) out[s.id] = [refDim(d)];
    } else if (
      s.id === "valueAxis" ||
      s.id === "tableMeasure" ||
      s.id === "pieAngle" ||
      s.id === "kpiMeasure" ||
      s.id === "liquidMeasure"
    ) {
      out[s.id] = [refMeas(m0)];
    } else if (s.id === "lineMeasure") {
      out[s.id] = m1 ? [refMeas(m0), refMeas(m1)] : [refMeas(m0)];
    } else if (s.id === "colDim" || s.id === "pieColor") {
      const d = stringDims[1] ?? stringDims[0];
      if (d) out[s.id] = [refDim(d)];
    } else if (s.id === "pieLegend" || s.id === "stackDim") {
      const d = stringDims[0];
      if (d) out[s.id] = [refDim(d)];
    } else if (s.id === "kpiCompare" && m1) {
      out[s.id] = [refMeas(m1)];
    } else if (s.id === "liquidTarget" && m1) {
      out[s.id] = [refMeas(m1)];
    } else if (s.id === "generic") {
      out[s.id] = [refMeas(m0)];
    }
  }
  return out;
}

export function buildDefaultFieldBindingsMap(presetId: string, tabWidgets: CanvasWidget[][]): Record<string, FieldSlotBindings> {
  const ds = getDatasetForTemplate(presetId);
  const out: Record<string, FieldSlotBindings> = {};
  for (const row of tabWidgets) {
    for (const w of row) {
      const b = defaultFieldBindingsForWidget(w, presetId, ds);
      if (Object.keys(b).length) out[w.id] = b;
    }
  }
  return out;
}

export function buildWidgetPrimaryMeasureDefaults(tabWidgets: CanvasWidget[][], presetId: string): Record<string, string> {
  const def = getDatasetForTemplate(presetId).measures[0]!.key;
  const out: Record<string, string> = {};
  for (const row of tabWidgets) {
    for (const w of row) {
      out[w.id] = def;
    }
  }
  return out;
}
