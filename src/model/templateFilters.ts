/** 看板级筛选：按模板 id 渲染，原型为下拉占位 */

export type TemplateFilterDef = {
  id: string;
  label: string;
  options: string[];
  defaultOption: string;
};

export type TemplateFiltersPreset = {
  templateId: string;
  filters: TemplateFilterDef[];
};

const PRESETS: TemplateFiltersPreset[] = [
  {
    templateId: "customer-biz",
    filters: [
      { id: "time", label: "时间", options: ["近7天", "近30天", "本季度"], defaultOption: "近30天" },
      { id: "region", label: "区域", options: ["全部", "华东", "华北", "华南"], defaultOption: "全部" },
    ],
  },
  {
    templateId: "cockpit",
    filters: [
      { id: "time", label: "统计时间", options: ["今日", "本周", "本月", "本季度"], defaultOption: "本月" },
      { id: "org", label: "机构", options: ["全辖", "一级分行", "直属支行", "网点"], defaultOption: "全辖" },
    ],
  },
  {
    templateId: "strategy",
    filters: [
      { id: "time_period", label: "时间周期", options: ["近7天", "近30天", "本季度", "本年"], defaultOption: "近30天" },
      { id: "org", label: "机构", options: ["全辖", "华东", "华北"], defaultOption: "全辖" },
    ],
  },
  {
    templateId: "report-kpi",
    filters: [
      { id: "time", label: "统计时间", options: ["本月", "上季度", "本年", "近12月"], defaultOption: "本月" },
      { id: "org", label: "机构", options: ["全辖", "一部", "二部", "直属"], defaultOption: "全辖" },
      { id: "kpi_scope", label: "考核范围", options: ["全部岗位", "管理岗", "销售岗"], defaultOption: "全部岗位" },
    ],
  },
];

const EMPTY: TemplateFiltersPreset = { templateId: "_", filters: [] };

export function getTemplateFilters(templateId: string): TemplateFilterDef[] {
  return PRESETS.find((p) => p.templateId === templateId)?.filters ?? EMPTY.filters;
}

export function defaultFilterState(templateId: string): Record<string, string> {
  const out: Record<string, string> = {};
  for (const f of getTemplateFilters(templateId)) {
    out[f.id] = f.defaultOption;
  }
  return out;
}
