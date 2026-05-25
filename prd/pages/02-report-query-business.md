# 报表查询 — 业务分析报表

> **视图：** `topNav=reportQuery` + 模板关联树节点（非 post-evaluation）  
> **模块：** 报表查询  
> **生成：** 2026-05-25

## Overview

用户在「报表查询」模块左侧树中选择**业务分析报表**下的任意仪表板 Tab（考核分析各通报、产品/客群/效益交叉分析等），右侧展示对应模板的**交叉分析看板只读预览**。

## Layout

```
┌──────────┬──────────────────────────────────────────┐
│ 左侧树   │ 面包屑：报表查询 / 业务分析报表 / {Tab}   │
│ 240px    ├──────────────────────────────────────────┤
│ 搜索框   │                                          │
│ 目录树   │  SelfServiceQueryBoardCard（view 模式）   │
│          │  — 维度/指标选择 + 交叉表 + 图表插入区     │
└──────────┴──────────────────────────────────────────┘
```

## Fields

### 左侧栏（ReportQuerySidebar）

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| 搜索 | 文本 | 否 | placeholder「搜索名称关键字」，过滤树节点 |
| 树节点 | 树形列表 | — | 两级：业务分析报表 → 模板 → Tab 报表 |

**默认选中：** `report-post-evaluation-main`（营销后评价主报表；若选其他业务节点则切换内容）

**业务分析树结构（摘要）：**

- 考核分析 → 8 个子 Tab（存款通报、理财销量通报、…）
- 产品分析 → 交叉分析
- 客群分析 → 交叉分析
- 效益分析 → 客户PA / 机构PA / 客群PA / 产品PA
- 营销后评价 → 消费达标享好礼-后评价（见独立页面文档）

### 主内容区（TemplateAnalysisPreviewPage）

| 区域 | 说明 |
|------|------|
| 面包屑 | `报表查询 / 业务分析报表 / {Tab名称}` |
| 交叉分析板 | 只读模式 `displayMode=view` |

### 交叉分析板内字段（因 analysisMode 而异）

共性结构（SelfServiceQueryBoardCard）：

| 区域 | 字段类型 | 说明 |
|------|----------|------|
| 一级 Tab | Tab 切换 | 如考核分析的 8 个通报类型 |
| 二级 Tab | Tab 切换 | 部分模板有（如客群 L1/L2） |
| 维度选择 | 多选/下拉 | 机构、产品、客群等维度组 |
| 指标选择 | 多选 | 业务指标字段 |
| 同比开关 | 复选 | 部分模式支持 YOY |
| 客户号上传 | Excel 上传面板 | 营销后评价模式 |
| 交叉表 | 表格 | 维度 × 指标 pivot 展示 |
| 图表插入 | 图表画廊 | 插入柱/线/饼等（Mock 渲染） |

各 `analysisMode` 维度/指标配置见 `selfServiceQueryConfig`、`assessmentQueryConfig`、`benefitQueryConfig` 等。

## Interactions

### 选择树节点

- **触发：** 点击叶子节点（kind=report）
- **行为：** 若节点关联 `templateId` 且非 post-evaluation 专用页，渲染 TemplateAnalysisPreviewPage
- **空选：** 显示「请选择左侧目录项」

### 树搜索

- **触发：** 输入搜索关键字
- **行为：** 过滤 REPORT_QUERY_TREE，保留名称匹配节点及其祖先

### 树展开/折叠

- **触发：** 点击文件夹节点箭头
- **行为：** 切换 expandedIds

### 交叉分析板（只读）

- 查询模式下维度/指标控件可展示但**以预览为主**；数据为本地算法生成的 Mock pivot
- 不显示「编辑」按钮（仅 config 上下文才有）

## API Dependencies

| API | 方法 | 状态 | 说明 |
|-----|------|------|------|
| 报表目录树 | — | Mock | `REPORT_QUERY_TREE` 静态配置 |
| 交叉分析数据 | — | Mock | `SelfServiceQueryBoardCard` 内 seed 算法生成 |
| 图表数据 | — | Mock | ChartInsertSection 本地渲染 |

## Page Relationships

- **From：** 顶栏「报表查询」；默认打开营销后评价节点（可切换至其他业务节点）
- **To：** 无（查询只读）；顶栏可切至报表配置/首页
- **Data coupling：** 与报表配置共用同一套模板定义（TEMPLATES）

## Business Rules

- `isTemplateLinkedNode(node)` 为 true 且 `templateId !== post-evaluation` 特殊路径时走本页
- post-evaluation 在查询侧使用独立表格页（ReportQueryReplicaPage），见 [03-report-query-post-evaluation.md](./03-report-query-post-evaluation.md)
- 水印叠加于内容区
