/**
 * 各模板「看板 Tab」独立组件列表（与 {@link TemplatePreset.dashboardTabs} 顺序一一对应）。
 * 全局 widget id 在各 Tab 间唯一，便于字段绑定与选中态。
 *
 * 原版 report-kpi / strategy 看板见 {@link ./templateLegacyPresets.ts}。
 */
import type { CanvasWidget, TemplatePreset } from "./dashboardModel";

function selfServiceQueryTabWidgets(
  prefix: string,
  title: string,
  analysisMode: "assessment" | "benefit" | "postEvaluation",
  tabCount: number,
): CanvasWidget[][] {
  return Array.from({ length: tabCount }, (_, ti) => [
    {
      id: `${prefix}_ssq__t${ti}`,
      type: "table" as const,
      title,
      colSpan: 2,
      replicaLayout: "selfServiceQuery" as const,
      libraryLabel: title,
      analysisMode,
    },
  ]);
}

export const PRESET_TAB_WIDGETS: Record<string, CanvasWidget[][]> = {
  blank: [[]],
  cockpit: [
    [
      {
        id: "cp0_ins",
        type: "kpi",
        title: "银行驾驶舱总览",
        colSpan: 2,
        replicaLayout: "insuranceCockpitBoard",
        libraryLabel: "银行驾驶舱",
      },
      {
        id: "cp0_e",
        type: "kpi",
        title: "指标拆解树",
        colSpan: 2,
        replicaLayout: "metricBreakdownTree",
        libraryLabel: "指标拆解树",
      },
    ],
    [
      { id: "cp1_a", type: "bar", title: "项目里程碑达成", colSpan: 2 },
      { id: "cp1_b", type: "line", title: "进度燃尽趋势", colSpan: 2 },
      { id: "cp1_c", type: "kpi", title: "在研项目数", colSpan: 1 },
      { id: "cp1_d", type: "kpi", title: "延期风险项", colSpan: 1 },
      { id: "cp1_e", type: "table", title: "项目清单", colSpan: 2 },
    ],
    [
      { id: "cp2_a", type: "table", title: "重大事项看板", colSpan: 2 },
      { id: "cp2_b", type: "kpi", title: "待办闭环", colSpan: 1 },
      { id: "cp2_c", type: "kpi", title: "超时预警", colSpan: 1 },
      { id: "cp2_d", type: "bar", title: "事项类型分布", colSpan: 2 },
      { id: "cp2_e", type: "line", title: "事项处理时效", colSpan: 2 },
    ],
  ],
  strategy: selfServiceQueryTabWidgets("st", "效益分析", "benefit", 4),
  "report-kpi": selfServiceQueryTabWidgets("rp", "考核分析", "assessment", 8),
  "post-evaluation": selfServiceQueryTabWidgets("pe", "后评价", "postEvaluation", 1),
};

/** 与模板 Tab 数对齐的初始画布；无定制表时按 Tab 克隆 widgets 并改写 id */
export function getInitialTabWidgets(preset: TemplatePreset): CanvasWidget[][] {
  const custom = PRESET_TAB_WIDGETS[preset.id];
  if (custom && custom.length === preset.dashboardTabs.length) {
    return custom.map((row) => row.map((w) => ({ ...w })));
  }
  return preset.dashboardTabs.map((_, ti) =>
    preset.widgets.map((w) => ({ ...w, id: `${w.id}__t${ti}` })),
  );
}
