# API 清单

> 生成：2026-05-25  
> **结论：当前原型无真实 API 集成，以下均为根据 UI 行为反推的接口规格（Mock）。**

## 集成状态汇总

| 类别 | 已集成 | Mock | 合计 |
|------|--------|------|------|
| HTTP API | 0 | 全部 | 0 真实端点 |

## 反推 API 规格

### 1. 报表目录

| 名称 | 方法 | 建议路径 | 触发场景 | 状态 |
|------|------|----------|----------|------|
| 查询报表树 | GET | /api/report-query/tree | 进入报表查询 | Mock → REPORT_QUERY_TREE |
| 配置目录树 | GET | /api/report-config/tree | 进入报表配置 | Mock → REPORT_CONFIG_TREE |

### 2. 业务分析 / 交叉查询

| 名称 | 方法 | 建议路径 | 参数 | 状态 |
|------|------|----------|------|------|
| 交叉分析查询 | POST | /api/analysis/pivot | templateId, tab, dimensions[], indicators[], filters | Mock 本地 seed |
| 插入图表数据 | POST | /api/analysis/chart | chartType, dimensions, measures | Mock |

### 3. 营销后评价明细

| 名称 | 方法 | 建议路径 | 参数 | 状态 |
|------|------|----------|------|------|
| 后评价明细 | GET | /api/reports/post-evaluation | dateFrom, dateTo, page, pageSize | Mock → mockPostEvaluationReportData |

**响应字段：** customerId + POST_EVAL_INDICATOR_FIELDS 各数值

### 4. 运维报表

| 名称 | 方法 | 建议路径 | 参数 | 状态 |
|------|------|----------|------|------|
| 订单上传报表 | GET | /api/reports/order-upload | usernameOp, username, dateFrom, dateTo, page | Mock → mockOrderReportData |
| 登录日志 | GET | /api/reports/login-log | [TBC] | 未单独 Mock |
| FTP 导出统计 | GET | /api/reports/ftp-export | [TBC] | 未单独 Mock |

### 5. 仪表板编辑器

| 名称 | 方法 | 建议路径 | 说明 | 状态 |
|------|------|----------|------|------|
| 获取模板 | GET | /api/templates/{id} | 模板元数据+初始 widgets | Mock → TEMPLATES |
| 获取数据集 schema | GET | /api/datasets/{templateId} | 维度/指标字段 | Mock → templateDatasets |
| 保存仪表板 | PUT | /api/dashboards/{id} | widgets, bindings, filters | **未实现** |
| 发布仪表板 | POST | /api/dashboards/{id}/publish | 发布到查询树 | **未实现** |
| 替换数据集 | POST | /api/dashboards/{id}/remap-dataset | targetTemplateId, fieldMap | **未实现** |

### 6. 认证与用户

| 名称 | 方法 | 建议路径 | 状态 |
|------|------|----------|------|
| 当前用户 | GET | /api/me | Mock（顶栏 admin） |
| 登录 | POST | /api/auth/login | **未实现** |

## Mock 检测信号（代码内）

| 信号 | 含义 |
|------|------|
| 静态 TS 常量树 | REPORT_QUERY_TREE / REPORT_CONFIG_TREE |
| seed() 伪随机 | SelfServiceQueryBoardCard 生成 pivot |
| widgetDataSeedById 递增 | 字段变更触发 Mock 刷新 |
| POST_EVAL_REPORT_ROWS 等常量数组 | 固定行数据 |
| 无 fetch/axios 调用 | 全前端原型 |

## 外部资源

| 资源 | 类型 | 路径 |
|------|------|------|
| 模板封面图 | 静态 PNG | /templates/*.png |
| Figma 资产 | 静态 | figmaAssets.ts 引用 |
