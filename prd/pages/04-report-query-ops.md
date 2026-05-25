# 报表查询 — 系统运维报表

> **视图：** `topNav=reportQuery` + 非模板关联树节点  
> **模块：** 报表查询  
> **生成：** 2026-05-25

## Overview

左侧树「系统运维」目录下的运维类报表（登录日志、订单上传、FTP 导出、操作日志等）。统一使用**通用表格查询页**（OrderReportQueryPage），支持用户名与更新时间筛选。

## Layout

与营销后评价页类似：Tab 标签 + 筛选条 + 表格 + 底部分页信息。

## Fields

### 筛选区

| 字段 | 类型 | 必填 | 默认 | 选项/说明 |
|------|------|------|------|-----------|
| 用户名 | 文本 | 否 | 空 | 前置运算符下拉 |
| 用户名运算符 | 下拉 | 是 | 包含 | 包含 / 等于 / 开头是 |
| update_time（起） | date | 否 | 空 | 开始日期 |
| update_time（止） | date | 否 | 空 | 结束日期 |

### 操作按钮

| 按钮 | 行为 |
|------|------|
| 查询 | 原型无后端调用 |
| 重置 | 清空用户名、日期、运算符恢复「包含」 |

### 表格列

由 `ORDER_REPORT_COLUMNS` 定义（订单报表示例列：用户名、文件名、状态、update_time 等）。

## 运维报表清单

| 树节点 ID | 报表名称 |
|-----------|----------|
| login-log | 登陆用户的所有登陆日志 |
| order-upload-report | 文件上传-订单报表 |
| ftp-export | FTP导出统计 |
| op-log | 操作日志 |
| map-data | 地图数据 |
| test-page | 测试页面 |

## Interactions

### 重置

- **触发：** 点击「重置」
- **行为：** `handleReset()` 恢复筛选默认值

### 查询

- **触发：** 点击「查询」
- **行为：** 无网络请求，表格始终展示 `ORDER_REPORT_ROWS` Mock 数据

## API Dependencies

| API | 状态 | 说明 |
|-----|------|------|
| 运维报表查询 | Mock | 应按报表类型分接口；原型共用一套 Mock 行 |

**Mock 来源：** `mockOrderReportData.ts`

## Page Relationships

- **From：** 报表查询 → 系统运维 → 任意叶子节点
- **To：** 无
- **区分：** 无 `templateId` 的树节点走本页，有 templateId 走业务分析或后评价专用页

## Business Rules

- 总计条数展示 `ORDER_REPORT_TOTAL`
- 水印同其他报表页
