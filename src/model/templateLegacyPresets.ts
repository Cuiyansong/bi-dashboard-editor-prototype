/**
 * 考核分析 / 效益分析 — 改造前原版看板备份
 *
 * ## 如何恢复原版多组件看板
 *
 * 1. 在 `dashboardModel.ts` 中，将 `report-kpi` / `strategy` 的
 *    `dashboardTabs` 与 `widgets` 改回下方 `LEGACY_*_WIDGETS` / `LEGACY_*_DASHBOARD_TABS`。
 * 2. 在 `templateTabWidgets.ts` 中，将 `PRESET_TAB_WIDGETS["report-kpi"]` /
 *    `PRESET_TAB_WIDGETS["strategy"]` 指回 `LEGACY_*_TAB_WIDGETS`。
 * 3. 在 `EditorFrame.tsx` 的 `isFullCanvasTemplate` 中移除 `"report-kpi"` 与 `"strategy"`。
 * 4. 重启 dev 服务并刷新页面。
 */
import type { CanvasWidget } from "./dashboardModel";

export const LEGACY_REPORT_KPI_DASHBOARD_TABS = ["通报报表", "考核报表"] as const;

export const LEGACY_REPORT_KPI_WIDGETS: CanvasWidget[] = [
  { id: "w1", type: "bar", title: "部门排名", colSpan: 2 },
  { id: "w2", type: "liquid", title: "达成率", colSpan: 1 },
  { id: "w3", type: "kpi", title: "考核得分", colSpan: 1 },
  { id: "w4", type: "table", title: "通报明细", colSpan: 2 },
  { id: "w5", type: "line", title: "周期趋势", colSpan: 2 },
];

export const LEGACY_REPORT_KPI_TAB_WIDGETS: CanvasWidget[][] = [
  [
    {
      id: "rp0_org",
      type: "table",
      title: "各机构进度与达成",
      colSpan: 2,
      replicaLayout: "orgProgressBoard",
    },
    { id: "rp0_a", type: "bar", title: "部门排名", colSpan: 2 },
    { id: "rp0_b", type: "liquid", title: "达成率", colSpan: 1 },
    { id: "rp0_c", type: "kpi", title: "考核得分", colSpan: 1 },
    { id: "rp0_d", type: "table", title: "通报明细", colSpan: 2 },
    { id: "rp0_e", type: "line", title: "周期趋势", colSpan: 2 },
  ],
  [
    { id: "rp1_a", type: "kpi", title: "KPI 综合得分", colSpan: 1 },
    { id: "rp1_b", type: "kpi", title: "指标达标率", colSpan: 1 },
    { id: "rp1_c", type: "bar", title: "指标对比分析", colSpan: 2 },
    { id: "rp1_d", type: "line", title: "得分走势", colSpan: 2 },
    { id: "rp1_e", type: "table", title: "指标拆解明细", colSpan: 2 },
  ],
  [
    { id: "rp2_a", type: "bar", title: "支行考核排名", colSpan: 2 },
    { id: "rp2_b", type: "table", title: "个人绩效榜单", colSpan: 2 },
    { id: "rp2_c", type: "kpi", title: "前30%人数", colSpan: 1 },
    { id: "rp2_d", type: "kpi", title: "待提升人数", colSpan: 1 },
    { id: "rp2_e", type: "line", title: "排名变动趋势", colSpan: 2 },
  ],
];

export const LEGACY_STRATEGY_DASHBOARD_TABS = ["客户PA", "机构PA", "客群PA", "客层PA"] as const;

export const LEGACY_STRATEGY_WIDGETS: CanvasWidget[] = [
  {
    id: "w_cohort",
    type: "table",
    title: "客群策略全周期追踪看板",
    colSpan: 2,
    replicaLayout: "strategyCohortTable",
  },
  { id: "w1", type: "kpi", title: "策略命中数", colSpan: 1 },
  { id: "w2", type: "kpi", title: "覆盖客群", colSpan: 1 },
  { id: "w3", type: "table", title: "规则列表", colSpan: 2 },
  { id: "w4", type: "bar", title: "上线前后对比", colSpan: 2 },
];

export const LEGACY_STRATEGY_TAB_WIDGETS: CanvasWidget[][] = [
  [
    {
      id: "st0_a",
      type: "table",
      title: "客群策略全周期追踪看板",
      colSpan: 2,
      replicaLayout: "strategyCohortTable",
    },
    { id: "st0_b", type: "kpi", title: "策略命中数", colSpan: 1 },
    { id: "st0_c", type: "kpi", title: "覆盖客群", colSpan: 1 },
    { id: "st0_d", type: "table", title: "规则列表", colSpan: 2 },
    { id: "st0_e", type: "bar", title: "上线前后对比", colSpan: 2 },
  ],
  [
    { id: "st1_a", type: "table", title: "规则版本对照", colSpan: 2 },
    { id: "st1_b", type: "bar", title: "规则命中排行", colSpan: 2 },
    { id: "st1_c", type: "line", title: "版本迭代趋势", colSpan: 2 },
    { id: "st1_d", type: "kpi", title: "生效规则数", colSpan: 1 },
    { id: "st1_e", type: "kpi", title: "灰度比例", colSpan: 1 },
  ],
  [
    { id: "st2_a", type: "line", title: "影响面趋势", colSpan: 2 },
    { id: "st2_b", type: "bar", title: "客群影响分布", colSpan: 2 },
    { id: "st2_c", type: "kpi", title: "预估增收", colSpan: 1 },
    { id: "st2_d", type: "kpi", title: "风险敞口", colSpan: 1 },
    { id: "st2_e", type: "table", title: "影响评估明细", colSpan: 2 },
  ],
];
