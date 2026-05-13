import type { CanvasWidget } from "../model/dashboardModel";

export type ChartConfigKind =
  | "pie"
  | "liquid"
  | "bar"
  | "line"
  | "table"
  | "kpi"
  | "default";

/** Order matters: avoid e.g. 「环形柱图」matching 环 as pie. */
const LABEL_KEYS: { kind: ChartConfigKind; pattern: RegExp }[] = [
  { kind: "liquid", pattern: /水波|液/ },
  { kind: "table", pattern: /表|交叉|明细|多维|趋势分析|热力图/ },
  { kind: "line", pattern: /线图|面积图|组合图|散点|分面|气泡图(?!地图)/ },
  {
    kind: "bar",
    pattern: /柱|条形|排行|瀑布|子弹|箱形|直方|堆积|百分比|动态条形|环形柱|地图|色彩|飞线|符号|楼宇|词云|时间轴/,
  },
  { kind: "pie", pattern: /饼图|玫瑰图|旭日图|雷达图|矩形树图|漏斗图|对比漏斗|来源去向|桑基图|弧线图/ },
];

export function getChartConfigKind(w: CanvasWidget | null): ChartConfigKind {
  if (!w) return "default";
  const text = `${w.libraryLabel ?? ""} ${w.title}`;
  for (const { kind, pattern } of LABEL_KEYS) {
    if (pattern.test(text)) return kind;
  }
  if (w.type === "liquid") return "liquid";
  if (w.type === "table") return "table";
  if (w.type === "bar") return "bar";
  if (w.type === "line") return "line";
  if (w.type === "kpi") return "kpi";
  return "default";
}

export function chartKindDisplayName(kind: ChartConfigKind): string {
  const map: Record<ChartConfigKind, string> = {
    pie: "饼图",
    liquid: "水波图",
    bar: "柱形图",
    line: "折线图",
    table: "数据表",
    kpi: "指标卡",
    default: "图表",
  };
  return map[kind];
}
