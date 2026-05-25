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
  replicaLayout?:
    | "irisKpis"
    | "irisLiquid"
    | "irisCrossTable"
    | "strategyCohortTable"
    | "metricBreakdownTree"
    | "orgProgressBoard"
    | "customerTagTable"
    | "compoundQuery"
    | "insuranceCockpitBoard"
    | "selfServiceQuery";
  /** 自助查询交叉表模式 */
  analysisMode?: "customer" | "product" | "assessment" | "benefit" | "postEvaluation";
}

export interface TemplatePreset {
  id: string;
  name: string;
  /** 画布大标题；缺省用 name */
  pageTitle?: string;
  description: string;
  dashboardTabs: string[];
  widgets: CanvasWidget[];
  /** 首页模板缩略图专用 widgets；不设置时落回 widgets */
  previewWidgets?: CanvasWidget[];
  accent: string;
}

/** 顺序：考核分析、产品分析、客群分析、效益分析、营销后评价 */
export const TEMPLATES: TemplatePreset[] = [
  // {
  //   id: "cockpit",
  //   name: "驾驶舱看板",
  //   pageTitle: "银行驾驶舱",
  //   description: "银行业务总览、KPI 达成、分公司排行与核心指标监控（含指标拆解）",
  //   dashboardTabs: ["首页", "项目进度", "核心信息事项"],
  //   accent: "#1677ff",
  //   widgets: [
  //     { id: "w1", type: "kpi", title: "银行驾驶舱总览", colSpan: 2, replicaLayout: "insuranceCockpitBoard" },
  //     { id: "w2", type: "kpi", title: "指标拆解树", colSpan: 2, replicaLayout: "metricBreakdownTree", libraryLabel: "指标拆解树" },
  //   ],
  // },
  {
    id: "report-kpi",
    name: "考核分析",
    pageTitle: "考核分析",
    description: "机构维度 × 通报指标，按业务线拼装考核交叉分析",
    dashboardTabs: [
      "存款通报",
      "理财销量通报",
      "基金中收通报",
      "保险销售通报",
      "借记卡快捷支付考核",
      "信用卡通报",
      "消费贷款通报",
      "手机银行通报",
    ],
    accent: "#fa8c16",
    widgets: [
      {
        id: "w_assessment",
        type: "table",
        title: "考核分析",
        colSpan: 2,
        replicaLayout: "selfServiceQuery",
        libraryLabel: "考核分析",
        analysisMode: "assessment",
      },
    ],
    previewWidgets: [
      { id: "pv_rk_a", type: "bar", title: "部门排名", colSpan: 2 },
      { id: "pv_rk_b", type: "liquid", title: "达成率", colSpan: 1 },
      { id: "pv_rk_c", type: "kpi", title: "考核得分", colSpan: 1 },
      { id: "pv_rk_d", type: "table", title: "通报明细", colSpan: 2 },
      { id: "pv_rk_e", type: "line", title: "周期趋势", colSpan: 2 },
    ],
  },
  {
    id: "product-analysis",
    name: "产品分析",
    pageTitle: "产品分析",
    description: "存款/理财/基金/信用卡/个贷分类选品，销量与中收等指标交叉分析",
    dashboardTabs: ["交叉分析"],
    accent: "#0EA5E9",
    widgets: [
      {
        id: "w_pa",
        type: "table",
        title: "产品分析",
        colSpan: 2,
        replicaLayout: "selfServiceQuery",
        libraryLabel: "产品分析",
        analysisMode: "product",
      },
    ],
    previewWidgets: [
      { id: "pv_pa_a", type: "kpi", title: "产品总览", colSpan: 2 },
      { id: "pv_pa_b", type: "line", title: "周期趋势", colSpan: 2 },
      { id: "pv_pa_c", type: "table", title: "产品矩阵", colSpan: 2 },
      { id: "pv_pa_d", type: "bar", title: "产品渗透分析", colSpan: 2 },
    ],
  },
  {
    id: "self-service-query",
    name: "客群分析",
    pageTitle: "客群分析",
    description: "客群分层、七大客群与场景客群为维度，业务考核指标自由拼装交叉分析",
    dashboardTabs: ["交叉分析"],
    accent: "#2563EB",
    widgets: [
      {
        id: "w_ssq",
        type: "table",
        title: "客群分析",
        colSpan: 2,
        replicaLayout: "selfServiceQuery",
        libraryLabel: "客群分析",
        analysisMode: "customer",
      },
    ],
    previewWidgets: [
      { id: "pv_ssq_a", type: "kpi", title: "经营收入", colSpan: 1 },
      { id: "pv_ssq_b", type: "kpi", title: "活跃客户", colSpan: 1 },
      { id: "pv_ssq_c", type: "bar", title: "区域收入对比", colSpan: 2 },
      { id: "pv_ssq_d", type: "line", title: "产品渗透趋势", colSpan: 2 },
      { id: "pv_ssq_e", type: "table", title: "客户分层明细", colSpan: 2 },
    ],
  },
  {
    id: "strategy",
    name: "效益分析",
    pageTitle: "效益分析",
    description: "客户/机构/客群/产品 PA 维度，成本收入利润等指标交叉分析",
    dashboardTabs: ["客户PA", "机构PA", "客群PA", "产品PA"],
    accent: "#722ed1",
    widgets: [
      {
        id: "w_benefit",
        type: "table",
        title: "效益分析",
        colSpan: 2,
        replicaLayout: "selfServiceQuery",
        libraryLabel: "效益分析",
        analysisMode: "benefit",
      },
    ],
    previewWidgets: [
      {
        id: "pv_st_a",
        type: "table",
        title: "客群策略全周期追踪看板",
        colSpan: 2,
        replicaLayout: "strategyCohortTable",
      },
      { id: "pv_st_b", type: "kpi", title: "策略命中数", colSpan: 1 },
      { id: "pv_st_c", type: "kpi", title: "覆盖客群", colSpan: 1 },
      { id: "pv_st_d", type: "bar", title: "上线前后对比", colSpan: 2 },
    ],
  },
  {
    id: "post-evaluation",
    name: "营销后评价",
    pageTitle: "营销后评价",
    description: "消费达标享好礼营销后评价：客户号 × 支付渠道 SUM 指标交叉分析",
    dashboardTabs: ["消费达标享好礼-后评价"],
    accent: "#059669",
    widgets: [
      {
        id: "w_pe",
        type: "table",
        title: "营销后评价",
        colSpan: 2,
        replicaLayout: "selfServiceQuery",
        libraryLabel: "营销后评价",
        analysisMode: "postEvaluation",
      },
    ],
    previewWidgets: [
      { id: "pv_pe_a", type: "table", title: "消费达标享好礼", colSpan: 2 },
      { id: "pv_pe_b", type: "bar", title: "渠道汇总", colSpan: 2 },
      { id: "pv_pe_c", type: "kpi", title: "达标客户", colSpan: 1 },
      { id: "pv_pe_d", type: "kpi", title: "合计交易额", colSpan: 1 },
    ],
  },
  {
    id: "blank",
    name: "空模板",
    pageTitle: "未命名看板",
    description: "空白画布，从左侧拖入图表开始搭建",
    dashboardTabs: ["看板 1"],
    accent: "#94a3b8",
    widgets: [],
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
