import { TEMPLATES } from "../../model/dashboardModel";
import { MARKET_TEMPLATES, TemplateMarketCard } from "../TemplateMarketCard";

export type TemplatePickerPanelProps = {
  onBack: () => void;
  onSelectTemplate: (templateIndex: number) => void;
};

export function TemplatePickerPanel({ onBack, onSelectTemplate }: TemplatePickerPanelProps) {
  return (
    <div className="flex h-full min-h-0 flex-col bg-[#F8FAFC]">      <div className="shrink-0 border-b border-[#E5E7EB] bg-white px-5 py-3">
        <div className="mb-2 flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="rounded-md border border-[#E2E8F0] bg-white px-3 py-1.5 text-[12px] text-[#475569] transition hover:border-[#CBD5E1] hover:bg-[#F8FAFC] hover:text-[#2563EB]"
          >
            ← 返回报表配置
          </button>
          <span className="text-[12px] text-[#94A3B8]">报表配置 / 模板建表</span>
        </div>
        <h1 className="text-[18px] font-semibold text-[#0F172A]">选择业务模板，快速搭建数据看板</h1>
        <p className="mt-1 text-[13px] text-[#64748B]">
          从预置模板创建仪表板，创建完成后可在报表配置中继续编辑与发布。
        </p>
      </div>

      <div className="min-h-0 flex-1 overflow-auto p-5">
        <div
          className="mx-auto grid w-full max-w-[1600px] gap-4"
          style={{
            gridTemplateColumns: `repeat(${MARKET_TEMPLATES.length}, minmax(0, 1fr))`,
          }}
        >
          {MARKET_TEMPLATES.map((preset) => {
            const idx = TEMPLATES.findIndex((t) => t.id === preset.id);
            return (
              <TemplateMarketCard
                key={preset.id}
                preset={preset}
                descriptionId={`picker-desc-${preset.id}`}
                onSelect={() => onSelectTemplate(idx)}
                compact
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
