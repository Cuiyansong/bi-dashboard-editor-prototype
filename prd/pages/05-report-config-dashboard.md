# 报表配置 — 仪表板预览与编辑

> **视图：** `topNav=reportConfig` + `configMainView=dashboard`  
> **模块：** 报表配置  
> **生成：** 2026-05-25

## Overview

管理员在「报表配置」中维护仪表板目录，选中仪表板后在主区域**预览**交叉分析看板，并可切换**编辑模式**调整维度指标配置（仍为前端 Mock，不持久化）。

## Layout

```
┌──────────────┬────────────────────────────────────────┐
│ 左侧栏 260px │ 面包屑 + [编辑/完成] 按钮（可配置时）   │
│ Tab:目录|演示│                                        │
│ [+] 新建菜单 │  SelfServiceQueryBoardCard              │
│ 搜索 + 树   │  displayMode: view | configure          │
└──────────────┴────────────────────────────────────────┘
```

## Fields

### 左侧栏（ReportConfigSidebar）

| 字段 | 类型 | 说明 |
|------|------|------|
| 侧栏 Tab | Tab | 「目录」/「演示」（演示 Tab 树内容同目录，原型未区分数据） |
| 搜索 | 文本 | 过滤 REPORT_CONFIG_TREE |
| 新建 (+) | 按钮 | 展开下拉菜单 |

### 新建菜单（CONFIG_ADD_MENU_ITEMS）

| 菜单项 ID | 标签 | 行为 |
|-----------|------|------|
| start-analysis | 开始分析 | 进入编辑模式 `configEditing=true` |
| template-table | 模板建表 | 跳转模板建表页 |
| new-dashboard | 新建仪表板 | 选中 post-evaluation 仪表板并进入编辑 |
| new-folder | 新建目录 | [TBC] 原型未实现 |
| import-template | 导入模板 | [TBC] 原型未实现 |

### 配置树结构

- **模板仪表板：** 5 套市场模板各对应一个 dashboard 节点
- **个人目录：** 「我的交叉分析」（self-service-query 模板）

**默认选中：** `dashboard-report-kpi`（考核分析）

### 主内容区

| 元素 | 条件 | 说明 |
|------|------|------|
| 面包屑 | 有 | `报表配置 / 模板仪表板 / {名称}` |
| 编辑按钮 | context=config 且提供 onEditingChange | 切换 view ↔ configure |
| 交叉分析板 | 模板节点 | 同报表查询，但可编辑 |

## Interactions

### 切换编辑模式

- **触发：** 点击「编辑」
- **行为：** `configEditing=true`，SelfServiceQueryBoardCard 进入 `configure` 模式，维度指标可操作
- **完成：** 点击「完成」退出编辑

### 选择树节点

- **触发：** 点击 dashboard/report 节点
- **行为：** 重置 `configMainView=dashboard`，关闭编辑模式，加载对应预览

### 新建菜单

见上表；「模板建表」跳转 [06-report-config-template-picker.md](./06-report-config-template-picker.md)

### 进入全屏编辑器

- **触发：** [TBC] 原型中报表配置内编辑为就地 configure 模式；从模板建表选模板会调用 `onOpenTemplateEditor` 进入 EditorFrame

## API Dependencies

| API | 状态 | 说明 |
|-----|------|------|
| 配置目录树 | Mock | REPORT_CONFIG_TREE |
| 保存仪表板配置 | 未实现 | 编辑结果仅内存态 |

## Page Relationships

- **From：** 顶栏「报表配置」；模板建表返回
- **To：** 模板建表；仪表板编辑器（经 onOpenTemplateEditor）
- **返回编辑器：** 编辑器显示「← 返回报表配置」

## Business Rules

- post-evaluation 在配置侧仍用 TemplateAnalysisPreviewPage（非查询侧明细表）
- 切换顶栏离开 reportConfig 时重置 configMainView 与 configEditing
