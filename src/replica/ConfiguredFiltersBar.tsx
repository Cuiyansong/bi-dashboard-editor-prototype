import { formatFilterTag, type FieldFilterCondition } from "../model/queryFieldFilters";

export type ConfiguredFiltersBarProps = {
  filters: FieldFilterCondition[];
  onRemove: (id: string) => void;
};

export function ConfiguredFiltersBar({ filters, onRemove }: ConfiguredFiltersBarProps) {
  if (filters.length === 0) return null;

  return (
    <section
      aria-label="已配置筛选条件"
      className="rounded-lg border border-[#DBEAFE] bg-[#F8FAFC] px-3 py-2"
    >
      <div className="mb-1.5 flex items-center gap-2">
        <h3 className="text-[11px] font-semibold text-[#1E3A8A]">筛选条件</h3>
        <span className="text-[10px] tabular-nums text-[#64748B]">{filters.length} 条</span>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {filters.map((f) => (
          <span
            key={f.id}
            className="inline-flex max-w-full items-center gap-1 rounded-md border border-[#BFDBFE] bg-white px-2 py-1 text-[11px] text-[#1E40AF]"
          >
            <span className="truncate">{formatFilterTag(f)}</span>
            <button
              type="button"
              aria-label={`移除筛选 ${formatFilterTag(f)}`}
              onClick={() => onRemove(f.id)}
              className="shrink-0 rounded px-0.5 text-[#64748B] hover:bg-[#FEE2E2] hover:text-[#DC2626]"
            >
              ×
            </button>
          </span>
        ))}
      </div>
    </section>
  );
}
