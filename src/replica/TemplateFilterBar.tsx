import { getTemplateFilters } from "../model/templateFilters";

export type TemplateFilterBarProps = {
  templateId: string;
  values: Record<string, string>;
  onChange: (filterId: string, value: string) => void;
  /** 点击「查询」刷新看板假数据（原型） */
  onQuery?: () => void;
};

export function TemplateFilterBar({ templateId, values, onChange, onQuery }: TemplateFilterBarProps) {
  const filters = getTemplateFilters(templateId);
  if (filters.length === 0) return null;

  return (
    <div className="mb-4 px-1">
      <div className="flex w-full max-w-[1247px] flex-wrap items-end justify-between gap-4 rounded-lg border border-black/[0.06] bg-white px-5 py-3.5 shadow-sm">
        <div className="flex min-w-0 flex-1 flex-wrap items-end gap-x-8 gap-y-3">
          {filters.map((f) => (
            <div key={f.id} className="flex min-w-0 flex-col gap-1">
              <span className="font-['Inter',sans-serif] text-xs font-medium text-figma-sub">{f.label}</span>
              <select
                className="h-8 min-w-[168px] max-w-[240px] rounded-md border border-figma-line bg-white px-2.5 font-['Inter',sans-serif] text-xs text-figma-text shadow-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary/25"
                value={values[f.id] ?? f.defaultOption}
                onChange={(e) => onChange(f.id, e.target.value)}
              >
                {f.options.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
        {onQuery ? (
          <button
            type="button"
            className="shrink-0 rounded-md bg-primary px-5 py-2 font-['Inter',sans-serif] text-xs font-medium text-white shadow-sm transition hover:bg-[#2568e6] active:bg-[#1f5bcc]"
            onClick={onQuery}
          >
            查询
          </button>
        ) : null}
      </div>
    </div>
  );
}
