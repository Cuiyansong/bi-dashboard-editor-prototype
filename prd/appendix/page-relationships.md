# 页面关系图

> 生成：2026-05-25

## 应用级导航

```mermaid
flowchart TB
  Start([应用启动]) --> IR[综合报表平台]
  IR -->|选模板 / 模板建表| ED[仪表板编辑器]
  ED -->|返回首页| IR_HOME[平台首页]
  ED -->|返回报表配置| IR_CFG[报表配置]
  IR_HOME --> IR
  IR_CFG --> IR
```

## 综合报表平台 — 顶栏

```mermaid
flowchart LR
  subgraph implemented [已实现]
    HOME[首页]
    RQ[报表查询]
    RC[报表配置]
  end
  subgraph placeholder [占位]
    VC[视图配置]
    BC[基础配置]
    SYS[系统管理]
    ORG[组织管理]
    DL[下载管理]
  end
  NAV[顶栏] --> HOME & RQ & RC & VC & BC & SYS & ORG & DL
```

## 报表查询 — 内容路由

```mermaid
flowchart TD
  RQ[报表查询] --> TREE[左侧目录树]
  TREE -->|模板节点 + post-evaluation| PE[营销后评价明细表]
  TREE -->|模板节点 + 其他| BA[业务分析交叉预览]
  TREE -->|运维节点| OPS[运维通用表格]
  TREE -->|未选中| EMPTY[请选择左侧目录项]
```

## 报表配置 — 内容路由

```mermaid
flowchart TD
  RC[报表配置] --> SIDEBAR[配置侧栏]
  SIDEBAR -->|选仪表板| DASH[仪表板预览/编辑]
  SIDEBAR -->|+ 模板建表| PICK[模板建表]
  SIDEBAR -->|+ 开始分析| DASH_EDIT[编辑模式 configure]
  PICK -->|选模板| ED[仪表板编辑器]
  DASH -->|编辑按钮| DASH_EDIT
```

## 页面跳转参数

| 从 | 到 | 传递参数 |
|----|-----|----------|
| 首页 | 编辑器 | templateIdx, returnNav=home |
| 模板建表 | 编辑器 | templateIdx, returnNav=reportConfig |
| 编辑器 | 平台 | 恢复 integratedInitialNav |
| 报表查询树 | 查询内容 | querySelectedId → 树节点 metadata |

## 数据耦合

| 共享数据 | 使用页面 |
|----------|----------|
| TEMPLATES / MARKET_TEMPLATE_IDS | 首页、模板建表、编辑器、查询/配置树 |
| SelfServiceQueryBoardCard | 查询业务分析、配置仪表板、编辑器全画布 |
| REPORT_QUERY_TREE | 报表查询侧栏 |
| REPORT_CONFIG_TREE | 报表配置侧栏 |

## 默认 landing

| 场景 | 默认值 |
|------|--------|
| 应用启动 view | integratedReport |
| 初始 topNav | home（可受 integratedInitialNav 影响） |
| 查询树选中 | report-post-evaluation-main |
| 配置树选中 | dashboard-report-kpi |
