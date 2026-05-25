import { TEMPLATES } from "../../model/dashboardModel";
import { MARKET_TEMPLATES, TemplateMarketCard } from "../TemplateMarketCard";
import type { IntegratedTopNavId } from "./integratedReportConfig";
import { PlatformHeroBanner } from "./PlatformHeroBanner";

const PLATFORM_HOME_TITLE_ID = "integrated-platform-home-title";

export type IntegratedReportHomePageProps = {
  onSelectTemplate: (templateIndex: number, fromNav: IntegratedTopNavId) => void;
};

export function IntegratedReportHomePage({ onSelectTemplate }: IntegratedReportHomePageProps) {
  return (
    <div className="relative flex h-full min-h-0 flex-col overflow-hidden bg-[#F8FAFC]">
      <PlatformHeroBanner titleId={PLATFORM_HOME_TITLE_ID} />

      <div className="relative z-[1] flex min-h-0 flex-1 flex-col overflow-hidden">
        <div className="flex shrink-0 items-center justify-between gap-4 px-5 pt-4">
          <div>
            <h2 className="font-['Inter',sans-serif] text-sm font-semibold text-[#0F172A]">业务模板</h2>
            <p className="mt-0.5 font-['Inter',sans-serif] text-xs text-[#64748B]">
              选择模板进入编辑器，或在侧栏查看已发布报表
            </p>
          </div>
          <p className="shrink-0 font-['Inter',sans-serif] text-xs text-[#94A3B8]">共 {MARKET_TEMPLATES.length} 套</p>
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
                  descriptionId={`platform-home-desc-${preset.id}`}
                  onSelect={() => onSelectTemplate(idx, "home")}
                  compact
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
