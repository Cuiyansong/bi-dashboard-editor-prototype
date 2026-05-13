/**
 * 各模板「看板 Tab」独立组件列表（与 {@link TemplatePreset.dashboardTabs} 顺序一一对应）。
 * 全局 widget id 在各 Tab 间唯一，便于字段绑定与选中态。
 */
import type { CanvasWidget, TemplatePreset } from "./dashboardModel";

export const PRESET_TAB_WIDGETS: Record<string, CanvasWidget[][]> = {
  "customer-biz": [
    [
      { id: "cb0_a", type: "kpi", title: "经营收入", colSpan: 1 },
      { id: "cb0_b", type: "kpi", title: "活跃客户", colSpan: 1 },
      { id: "cb0_c", type: "bar", title: "区域收入对比", colSpan: 2 },
      { id: "cb0_d", type: "line", title: "产品渗透趋势", colSpan: 2 },
      { id: "cb0_e", type: "table", title: "客户分层明细", colSpan: 2 },
    ],
    [
      { id: "cb1_a", type: "kpi", title: "战略客户占比", colSpan: 1 },
      { id: "cb1_b", type: "kpi", title: "长尾客户数", colSpan: 1 },
      { id: "cb1_c", type: "bar", title: "分层收入结构", colSpan: 2 },
      { id: "cb1_d", type: "table", title: "分层客户清单", colSpan: 2 },
      { id: "cb1_e", type: "line", title: "分层迁徙趋势", colSpan: 2 },
    ],
    [
      { id: "cb2_a", type: "line", title: "核心产品渗透率", colSpan: 2 },
      { id: "cb2_b", type: "bar", title: "产品持有分布", colSpan: 2 },
      { id: "cb2_c", type: "kpi", title: "渗透达标率", colSpan: 1 },
      { id: "cb2_d", type: "kpi", title: "交叉销售指数", colSpan: 1 },
      { id: "cb2_e", type: "table", title: "产品渗透明细", colSpan: 2 },
    ],
  ],
  cockpit: [
    [
      { id: "cp0_a", type: "kpi", title: "Iris 指标", colSpan: 1, replicaLayout: "irisKpis" },
      { id: "cp0_b", type: "liquid", title: "水波图-Iris数据集", colSpan: 1, replicaLayout: "irisLiquid" },
      { id: "cp0_c", type: "line", title: "核心指标趋势", colSpan: 2 },
      { id: "cp0_d", type: "table", title: "风险预警明细", colSpan: 2, replicaLayout: "irisCrossTable" },
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
  strategy: [
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
  ],
  "report-kpi": [
    [
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
  ],
};

/** 与模板 Tab 数对齐的初始画布；无定制表时按 Tab 克隆 widgets 并改写 id */
export function getInitialTabWidgets(preset: TemplatePreset): CanvasWidget[][] {
  const custom = PRESET_TAB_WIDGETS[preset.id];
  if (custom && custom.length === preset.dashboardTabs.length) {
    return custom.map((row) => row.map((w) => ({ ...w })));
  }
  return preset.dashboardTabs.map((_, ti) => preset.widgets.map((w) => ({ ...w, id: `${w.id}__t${ti}` })));
}