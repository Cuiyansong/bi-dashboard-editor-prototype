# 报表配置 — 模板建表

> **视图：** `topNav=reportConfig` + `configMainView=templatePicker`  
> **模块：** 报表配置  
> **生成：** 2026-05-25

## Overview

从预置业务模板快速创建新仪表板的入口。界面与平台首页模板市场类似，选择后进入**全屏仪表板编辑器**继续搭建。

## Layout

```
┌─────────────────────────────────────────────────────┐
│ [← 返回报表配置]  报表配置 / 模板建表                 │
│ 选择业务模板，快速搭建数据看板                        │
│ 从预置模板创建仪表板，创建完成后可在报表配置中继续编辑   │
├─────────────────────────────────────────────────────┤
│ 5 列模板卡片网格（TemplateMarketCard）               │
└─────────────────────────────────────────────────────┘
```

## Fields

| 元素 | 说明 |
|------|------|
| 返回按钮 | 回到报表配置 dashboard 视图 |
| 标题 | 「选择业务模板，快速搭建数据看板」 |
| 模板卡片 ×5 | 同首页，无 coverOnly 时可含描述 |

## Interactions

### 返回

- **触发：** 点击「← 返回报表配置」
- **行为：** `setConfigMainView("dashboard")`

### 选择模板

- **触发：** 点击模板卡片
- **行为：** `onOpenTemplateEditor(idx, "reportConfig")` → App 进入 EditorFrame，返回目标为报表配置

## API Dependencies

无；模板列表为静态配置。

## Page Relationships

- **From：** 报表配置侧栏「+」→「模板建表」
- **To：** 仪表板编辑器

## Business Rules

- 与首页模板卡片组件复用 TemplateMarketCard
- 进入编辑器后 backLabel 为「← 返回报表配置」
