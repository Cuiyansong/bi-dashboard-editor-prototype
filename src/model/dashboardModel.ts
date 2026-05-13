/** 当前选中主度量字段键，与模板数据集 `measures[].key` 对应 */
export type MeasureKey = string;

export type WidgetType = "kpi" | "liquid" | "table" | "bar" | "line";

export interface CanvasWidget {
  id: string;
  type: WidgetType;
  title: string;
  /** 组件库原始名称，用于右栏图表类型推断与展示 */
  libraryLabel?: string;
  /** grid placement — simple flow for prototype */
  colSpan?: number;
  /** High-fidelity replica layouts（驾驶舱模板演示用） */
  replicaLayout?: "irisKpis" | "irisLiquid" | "irisCrossTable" | "strategyCohortTable";
}

export interface TemplatePreset {
  id: string;
  name: string;
  /** 画布大标题；缺省用 name */
  pageTitle?: string;
  description: string;
  dashboardTabs: string[];
  widgets: CanvasWidget[];
  accent: string;
}

/** 默认第一项：客户经营分析 */
export const TEMPLATES: TemplatePreset[] = [
  {
    id: "customer-biz",
    name: "客户经营分析",
    pageTitle: "客户经营分析",
    description: "经营总览、客户分层与产品渗透占位",
    dashboardTabs: ["经营总览", "客户分层", "产品渗透"],
    accent: "#08979c",
    widgets: [
      { id: "w1", type: "kpi", title: "经营收入", colSpan: 1 },
      { id: "w2", type: "kpi", title: "活跃客户", colSpan: 1 },
      { id: "w3", type: "bar", title: "区域收入对比", colSpan: 2 },
      { id: "w4", type: "line", title: "产品渗透趋势", colSpan: 2 },
      { id: "w5", type: "table", title: "客户分层明细", colSpan: 2 },
    ],
  },
  {
    id: "cockpit",
    name: "驾驶舱看板",
    pageTitle: "驾驶舱看板",
    description: "总览、风险预警与资源达成（含 Iris 高保真演示块）",
    dashboardTabs: ["核心业绩指标", "项目进度", "核心信息事项"],
    accent: "#1677ff",
    widgets: [
      { id: "w1", type: "kpi", title: "Iris 指标", colSpan: 1, replicaLayout: "irisKpis" },
      { id: "w2", type: "liquid", title: "水波图-Iris数据集", colSpan: 1, replicaLayout: "irisLiquid" },
      { id: "w3", type: "line", title: "核心指标趋势", colSpan: 2 },
      { id: "w4", type: "table", title: "风险预警明细", colSpan: 2, replicaLayout: "irisCrossTable" },
    ],
  },
  {
    id: "strategy",
    name: "策略编辑",
    pageTitle: "策略编辑",
    description: "营销策略、规则版本与影响评估",
    dashboardTabs: ["客群策略全周期追踪", "规则与版本", "影响评估"],
    accent: "#722ed1",
    widgets: [
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
    ],
  },
  {
    id: "report-kpi",
    name: "通报与考核",
    pageTitle: "通报与考核",
    description: "通报、KPI 考核与排名视图占位",
    dashboardTabs: ["通报", "KPI 考核", "排名"],
    accent: "#fa8c16",
    widgets: [
      { id: "w1", type: "bar", title: "部门排名", colSpan: 2 },
      { id: "w2", type: "liquid", title: "达成率", colSpan: 1 },
      { id: "w3", type: "kpi", title: "考核得分", colSpan: 1 },
      { id: "w4", type: "table", title: "通报明细", colSpan: 2 },
      { id: "w5", type: "line", title: "周期趋势", colSpan: 2 },
    ],
  },
];

export const LIBRARY_GROUPS: {
  title: string;
  items: { id: string; label: string; widgetType: WidgetType }[];
}[] = [
  {
    title: "官方 · 表格",
    items: [
      { id: "tbl1", label: "明细表", widgetType: "table" },
      { id: "tbl2", label: "交叉表", widgetType: "table" },
    ],
  },
  {
    title: "官方 · 指标",
    items: [
      { id: "k1", label: "指标卡", widgetType: "kpi" },
      { id: "k2", label: "多指标卡", widgetType: "kpi" },
    ],
  },
  {
    title: "官方 · 折线/面积",
    items: [
      { id: "l1", label: "折线图", widgetType: "line" },
      { id: "l2", label: "面积图", widgetType: "line" },
    ],
  },
  {
    title: "官方 · 条形/柱形",
    items: [
      { id: "b1", label: "柱形图", widgetType: "bar" },
      { id: "b2", label: "条形图", widgetType: "bar" },
    ],
  },
];
