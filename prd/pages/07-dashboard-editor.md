# 仪表板编辑器

> **视图：** `App.view = "editor"`（EditorFrame）  
> **模块：** 仪表板编辑器  
> **生成：** 2026-05-25

## Overview

全屏 BI 仪表板搭建环境。用户基于预置模板，通过**左侧组件库拖拽**、**右侧字段绑定**、**顶部工具条**与**画布 Tab** 组装 KPI、图表、交叉表等组件。支持模板切换、全局筛选、查询条件弹窗、数据集替换等高级能力。

## Layout

### 标准模板布局

```
┌────────────────────────────────────────────────────────────┐
│ 顶栏 ReplicaBiHeader（返回、模板名、保存等）                 │
├──────┬─────────────────────────────────────┬───────────────┤
│ 左栏 │ 工具条 ReplicaToolbar                │ 右栏          │
│ 模板 │ Tab: 仪表板分页                      │ 字段/样式/数据 │
│ 组件 │ ┌─────────────────────────────────┐ │ ReplicaRight  │
│ 库   │ │ 画布 ReplicaCanvas               │ │ Panel         │
│      │ │ （可拖拽排序、选中组件）          │ │               │
│      │ └─────────────────────────────────┘ │               │
└──────┴─────────────────────────────────────┴───────────────┘
```

### 全画布模板（考核/产品/客群/效益/后评价）

- 隐藏左右栏、顶部工具条、全局筛选
- 画布内嵌 SelfServiceQueryBoardCard 占满视口

## Fields

### 顶栏

| 元素 | 说明 |
|------|------|
| 返回 | `onBackToHome`；文案「← 返回首页」或「← 返回报表配置」 |
| 模板标题 | 当前 TEMPLATES[templateIdx].pageTitle / name |
| 模板市场 | 打开模板列表浮层切换模板 |

### 左栏（ReplicaLeftLibrary）

| 面板 | 内容 |
|------|------|
| templates | 模板缩略列表 |
| components | 组件库（KPI、水波图、明细表、柱形图、折线图等） |

### 画布 Tab

| 字段 | 说明 |
|------|------|
| dashboardTabs | 来自模板 preset，如考核分析 8 个 Tab |
| activeDashTab | 当前 Tab 索引 |
| tabWidgets | 每 Tab 下组件数组 |

### 组件（CanvasWidget）

| 属性 | 说明 |
|------|------|
| type | kpi / liquid / table / bar / line |
| title | 组件标题 |
| colSpan | 1 或 2 列 |
| replicaLayout | 高保真布局标识（如 selfServiceQuery、metricBreakdownTree） |
| analysisMode | customer / product / assessment / benefit / postEvaluation |

### 右栏（ReplicaRightPanel）

| Tab | 功能 |
|-----|------|
| fields | 字段槽位绑定（维度/指标拖入） |
| style | 样式配置 |
| data | 数据集与主度量选择 |

### 工具条

| 功能 | 说明 |
|------|------|
| 查询条件 | 打开 QueryConditionModal（simple / composite） |
| 自动更新 | autoUpdate 开关，字段变更时刷新 Mock 数据 |
| 全局筛选 | TemplateFilterBar（非全画布模板） |
| 数据集替换 | GlobalDatasetReplaceModal |

## Interactions

### 从组件库拖入画布

- **触发：** 指针拖拽左栏组件项
- **行为：** 经过阈值后显示 ghost；在画布释放时按 Y 坐标计算插入位置，创建新 widget
- **默认：** 自动生成 id、title、colSpan、replicaLayout 推断

### 选中 / 删除 / 排序组件

- 点击画布组件 → 选中，右栏切至 fields
- 删除、上下 reorder 支持
- 拖拽卡片间 reorder

### 切换模板

- **触发：** 模板市场或左栏选模板
- **行为：** `applyTemplate(idx)` 重置 tabWidgets、fieldBindings、filterState

### 切换仪表板 Tab

- **触发：** 点击 Tab
- **行为：** 切换 activeDashTab，选中该 Tab 第一个组件

### 字段绑定变更

- **触发：** 右栏拖放字段到槽位
- **行为：** 更新 fieldBindingsMap；若 autoUpdate 则 bumpMockData

### 全局筛选变更

- **触发：** TemplateFilterBar 修改客群/层级等
- **行为：** 更新 filterState，所有组件 widgetDataSeed +1 触发 Mock 重算

### 查询条件弹窗

- **触发：** 工具条打开 QueryConditionModal
- **类型：** simple / composite

### 数据集替换

- **触发：** GlobalDatasetReplaceModal 确认
- **行为：** 按 fieldMap 重映射所有 FieldRef

## API Dependencies

| API | 状态 | 说明 |
|-----|------|------|
| 模板/组件定义 | Mock | dashboardModel、leftLibraryCatalog |
| 数据集字段 | Mock | templateDatasets |
| 保存仪表板 | 未实现 | 无持久化 |
| 发布 | 未实现 | — |

## Page Relationships

- **From：** 平台首页选模板；报表配置模板建表；[TBC] 配置树打开编辑器
- **To：** 返回 IntegratedReportPlatform（home 或 reportConfig）
- **Data coupling：** 与报表查询/配置共用 TEMPLATES 定义

## Business Rules

- `isFullCanvasTemplate` 的 5 套模板使用 SelfServiceQueryBoardCard 全屏形态
- 空白模板 index 存在但不在市场展示
- 组件库拖入有 6px 移动阈值防误触
- FILTER_FIELD_MAX = 12 限制筛选字段数

## Widget 类型说明

| type | 默认标题 | 默认列宽 |
|------|----------|----------|
| kpi | 新建指标卡 | 1 |
| liquid | 水波图 | 2 |
| table | 明细表 | 2 |
| bar | 柱形图 | 2 |
| line | 折线图 | 2 |
