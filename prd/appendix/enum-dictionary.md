# 枚举与常量字典

> 生成：2026-05-25

## 顶栏导航 IntegratedTopNavId

| 值 | 标签 | 说明 |
|----|------|------|
| home | 首页 | 模板市场 |
| reportQuery | 报表查询 | 带查询态 pill 样式 |
| reportConfig | 报表配置 | |
| viewConfig | 视图配置 | 占位 |
| basicConfig | 基础配置 | hasDropdown |
| system | 系统管理 | hasDropdown |
| org | 组织管理 | 占位 |
| download | 下载管理 | badge=3 |

## 报表树节点类型 ReportTreeNodeKind

| 值 | 说明 |
|----|------|
| folder | 文件夹，可展开 |
| dashboard | 仪表板（配置树） |
| report | 报表叶子（查询树） |

## 配置新建菜单 ConfigAddMenuId

| ID | 标签 |
|----|------|
| start-analysis | 开始分析 |
| template-table | 模板建表 |
| new-dashboard | 新建仪表板 |
| new-folder | 新建目录 |
| import-template | 导入模板 |

## 配置主视图 ConfigMainView

| 值 | 说明 |
|----|------|
| dashboard | 仪表板预览/编辑 |
| templatePicker | 模板建表 |

## 应用视图 AppView

| 值 | 说明 |
|----|------|
| integratedReport | 综合报表平台 |
| editor | 仪表板编辑器 |

## 组件类型 WidgetType

| 值 | 中文 |
|----|------|
| kpi | 指标卡 |
| liquid | 水波图 |
| table | 明细表/交叉表 |
| bar | 柱形图 |
| line | 折线图 |

## 分析模式 analysisMode

| 值 | 模板 | 说明 |
|----|------|------|
| assessment | 考核分析 | 机构×通报指标 |
| product | 产品分析 | 产品维度交叉 |
| customer | 客群分析 | 客群分层交叉 |
| benefit | 效益分析 | PA 维度成本收入 |
| postEvaluation | 营销后评价 | 客户号×支付渠道 |

## 高保真布局 replicaLayout

| 值 | 用途 |
|----|------|
| selfServiceQuery | 自助交叉分析主布局 |
| irisKpis | KPI 看板 |
| irisLiquid | 水波进度 |
| irisCrossTable | 交叉表 |
| strategyCohortTable | 客群策略追踪 |
| metricBreakdownTree | 指标拆解树 |
| insuranceCockpitBoard | 驾驶舱 [注释模板] |
| orgProgressBoard | 机构进度 |
| customerTagTable | 客户标签表 |
| compoundQuery | 复合查询 |
| selfServiceQuery | 自助查询 |

## 市场模板 ID MARKET_TEMPLATE_IDS

```
report-kpi → product-analysis → self-service-query → strategy → post-evaluation
```

## 平台水印

```
张静(jing.zhang007) 2025-05-25 12:21:26 超级管理员 admin
```
（PLATFORM_WATERMARK 常量，演示用）

## 订单报表用户名运算符

| 选项 |
|------|
| 包含 |
| 等于 |
| 开头是 |

## 编辑器 UI 模式 EditorUiMode

| 值 | 说明 |
|----|------|
| complex | 当前固定为 complex 模式 |

## 右栏 Tab RightEditorTab

| 值 | 说明 |
|----|------|
| fields | 字段绑定 |
| style | 样式 |
| data | 数据 |

## 左栏面板 LeftRailPanel

| 值 | 说明 |
|----|------|
| templates | 模板列表 |
| components | 组件库 |
