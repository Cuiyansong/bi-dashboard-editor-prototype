import { MARKET_TEMPLATE_IDS, TEMPLATES } from "../../model/dashboardModel";

export type IntegratedTopNavId =
  | "home"
  | "reportQuery"
  | "reportConfig"
  | "viewConfig"
  | "basicConfig"
  | "system"
  | "org"
  | "download";

export type IntegratedTopNavItem = {
  id: IntegratedTopNavId;
  label: string;
  hasDropdown?: boolean;
  badge?: number;
};

export const INTEGRATED_TOP_NAV: IntegratedTopNavItem[] = [
  { id: "home", label: "首页" },
  { id: "reportQuery", label: "报表查询" },
  { id: "reportConfig", label: "报表配置" },
  { id: "viewConfig", label: "视图配置" },
  { id: "basicConfig", label: "基础配置", hasDropdown: true },
  { id: "system", label: "系统管理", hasDropdown: true },
  { id: "org", label: "组织管理" },
  { id: "download", label: "下载管理", badge: 3 },
];

export type ReportTreeNodeKind = "folder" | "dashboard" | "report";

export type ReportTreeNode = {
  id: string;
  label: string;
  kind?: ReportTreeNodeKind;
  templateId?: string;
  dashTabLabel?: string;
  children?: ReportTreeNode[];
};

function templateById(id: string) {
  const t = TEMPLATES.find((x) => x.id === id);
  if (!t) throw new Error(`Unknown template: ${id}`);
  return t;
}

function buildQueryReportId(templateId: string, tabIndex: number): string {
  if (templateId === "post-evaluation" && tabIndex === 0) return "report-post-evaluation-main";
  return `report-${templateId}-${tabIndex}`;
}

/** 首页业务模板卡片 → 报表查询默认选中的首个报表叶子 id */
export function getDefaultQueryReportIdForTemplate(templateId: string): string {
  return buildQueryReportId(templateId, 0);
}

function buildBusinessQueryTree(): ReportTreeNode[] {
  return MARKET_TEMPLATE_IDS.map((templateId) => {
    const t = templateById(templateId);
    return {
      id: `folder-query-${templateId}`,
      label: t.name,
      kind: "folder" as const,
      children: t.dashboardTabs.map((tab, i) => ({
        id: buildQueryReportId(templateId, i),
        label: tab,
        kind: "report" as const,
        templateId,
        dashTabLabel: tab,
      })),
    };
  });
}

const OPS_QUERY_TREE: ReportTreeNode[] = [
  {
    id: "folder-sys-log",
    label: "系统日志",
    kind: "folder",
    children: [{ id: "login-log", label: "登陆用户的所有登陆日志", kind: "report" }],
  },
  {
    id: "folder-upload",
    label: "文件上传",
    kind: "folder",
    children: [{ id: "order-upload-report", label: "文件上传-订单报表", kind: "report" }],
  },
  {
    id: "folder-export",
    label: "数据导出",
    kind: "folder",
    children: [{ id: "ftp-export", label: "FTP导出统计", kind: "report" }],
  },
  {
    id: "folder-ops",
    label: "运维",
    kind: "folder",
    children: [
      { id: "op-log", label: "操作日志", kind: "report" },
      { id: "map-data", label: "地图数据", kind: "report" },
      { id: "test-page", label: "测试页面", kind: "report" },
    ],
  },
];

/** 报表查询左侧树（层级） */
export const REPORT_QUERY_TREE: ReportTreeNode[] = [
  {
    id: "folder-business-reports",
    label: "业务分析报表",
    kind: "folder",
    children: buildBusinessQueryTree(),
  },
  {
    id: "folder-ops-admin",
    label: "系统运维",
    kind: "folder",
    children: OPS_QUERY_TREE,
  },
];

/** 报表配置左侧树（层级） */
export const REPORT_CONFIG_TREE: ReportTreeNode[] = [
  {
    id: "folder-templates",
    label: "模板仪表板",
    kind: "folder",
    children: MARKET_TEMPLATE_IDS.map((templateId) => {
      const t = templateById(templateId);
      return {
        id: `dashboard-${templateId}`,
        label: t.name,
        kind: "dashboard" as const,
        templateId,
        dashTabLabel: t.dashboardTabs[0],
      };
    }),
  },
  {
    id: "folder-personal",
    label: "个人目录",
    kind: "folder",
    children: [
      {
        id: "dashboard-personal-cohort",
        label: "我的交叉分析",
        kind: "dashboard",
        templateId: "self-service-query",
        dashTabLabel: "交叉分析",
      },
    ],
  },
];

export const DEFAULT_QUERY_REPORT_ID = "report-post-evaluation-main";
export const DEFAULT_CONFIG_DASHBOARD_ID = "dashboard-report-kpi";

export const PLATFORM_WATERMARK =
  "张静(jing.zhang007) 2025-05-25 12:21:26 超级管理员 admin";

export function findReportTreeLabel(id: string, nodes: ReportTreeNode[]): string | null {
  for (const n of nodes) {
    if (n.id === id) return n.label;
    if (n.children) {
      const found = findReportTreeLabel(id, n.children);
      if (found) return found;
    }
  }
  return null;
}

export function findReportTreeNode(id: string, nodes: ReportTreeNode[]): ReportTreeNode | null {
  for (const n of nodes) {
    if (n.id === id) return n;
    if (n.children) {
      const found = findReportTreeNode(id, n.children);
      if (found) return found;
    }
  }
  return null;
}

export function collectExpandableIds(nodes: ReportTreeNode[]): string[] {
  const out: string[] = [];
  for (const n of nodes) {
    if (n.children?.length) {
      out.push(n.id);
      out.push(...collectExpandableIds(n.children));
    }
  }
  return out;
}

export function filterReportTree(nodes: ReportTreeNode[], query: string): ReportTreeNode[] {
  const q = query.trim();
  if (!q) return nodes;
  const walk = (list: ReportTreeNode[]): ReportTreeNode[] =>
    list
      .map((n) => {
        if (n.label.includes(q)) return n;
        if (n.children) {
          const kids = walk(n.children);
          if (kids.length) return { ...n, children: kids };
        }
        return null;
      })
      .filter(Boolean) as ReportTreeNode[];
  return walk(nodes);
}

export const CONFIG_ADD_MENU_ITEMS = [
  { id: "start-analysis", label: "开始分析" },
  { id: "template-table", label: "模板建表" },
  { id: "new-dashboard", label: "新建仪表板" },
  { id: "new-folder", label: "新建目录" },
  { id: "import-template", label: "导入模板" },
] as const;

export type ConfigAddMenuId = (typeof CONFIG_ADD_MENU_ITEMS)[number]["id"];

export type ConfigMainView = "dashboard" | "templatePicker";
