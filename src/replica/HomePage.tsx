import { TEMPLATES } from "../model/dashboardModel";
import type { IntegratedTopNavId } from "./integratedReport/integratedReportConfig";
import { HomeHeroBanner, HomeSubtleBackground } from "./HomePageDecor";
import { MARKET_TEMPLATES, TemplateMarketCard } from "./TemplateMarketCard";

const HOME_TITLE_ID = "home-page-title";

export type HomePageProps = {
  onSelectTemplate: (templateIndex: number) => void;
  onOpenIntegratedReport?: (nav: IntegratedTopNavId) => void;
};

function IntegratedPlatformEntryCard({
  onOpen,
}: {
  onOpen: (nav: IntegratedTopNavId) => void;
}) {
  return (
    <section
      aria-label="综合报表平台"
      className="mb-4 shrink-0 overflow-hidden rounded-xl border border-[#CBD5E1] bg-white shadow-sm"
    >
      <div className="flex items-stretch">
        <div
          aria-hidden
          className="relative w-[280px] shrink-0 border-r border-[#E2E8F0] bg-[#1F2937] p-4"
        >
          <div className="mb-2 flex items-center gap-2">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded bg-[#2563EB] text-[11px] font-bold text-white">
              W
            </span>
            <span className="text-[13px] font-semibold text-white">综合报表平台</span>
          </div>
          <div className="space-y-1 rounded border border-[#374151] bg-[#111827] p-2">
            <div className="h-2 w-3/4 rounded bg-[#374151]" />
            <div className="h-2 w-full rounded bg-[#2563EB]/40" />
            <div className="h-2 w-5/6 rounded bg-[#374151]" />
            <div className="mt-2 grid grid-cols-3 gap-1">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-6 rounded border border-[#374151] bg-[#1F2937]" />
              ))}
            </div>
          </div>
        </div>

        <div className="flex min-w-0 flex-1 flex-col justify-center px-6 py-4">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-[#64748B]">企业报表</p>
          <h2 className="mt-1 font-['Inter',sans-serif] text-[22px] font-semibold text-[#0F172A]">
            综合报表平台
          </h2>
          <p className="mt-1.5 max-w-xl text-[13px] leading-relaxed text-[#64748B]">
            报表查询、报表配置、视图与权限管理；支持订单报表查询与仪表板新建发布。
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => onOpen("reportQuery")}
              className="rounded-lg bg-[#2563EB] px-4 py-2 text-[13px] font-medium text-white hover:bg-[#1D4ED8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]/40"
            >
              报表查询
            </button>
            <button
              type="button"
              onClick={() => onOpen("reportConfig")}
              className="rounded-lg border border-[#CBD5E1] bg-white px-4 py-2 text-[13px] font-medium text-[#334155] hover:bg-[#F8FAFC] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]/30"
            >
              报表配置
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export function HomePage({ onSelectTemplate, onOpenIntegratedReport }: HomePageProps) {
  return (
    <div
      className="relative flex h-[918px] w-[1920px] shrink-0 flex-col overflow-hidden rounded-sm border border-figma-line bg-[#F1F5F9] shadow-md"
      data-bi-home
    >
      <main className="relative flex min-h-0 flex-1 flex-col overflow-hidden" aria-labelledby={HOME_TITLE_ID}>
        <HomeSubtleBackground />
        <HomeHeroBanner titleId={HOME_TITLE_ID} />

        <div className="relative z-[1] flex min-h-0 flex-1 flex-col overflow-hidden px-10 pb-6 pt-4">
          {onOpenIntegratedReport ? (
            <IntegratedPlatformEntryCard onOpen={onOpenIntegratedReport} />
          ) : null}

          <div className="mb-3 flex shrink-0 items-center justify-between gap-4">
            <h2 className="font-['Inter',sans-serif] text-sm font-semibold text-[#0F172A]">业务模板</h2>
            <p className="font-['Inter',sans-serif] text-xs text-[#94A3B8]">共 {MARKET_TEMPLATES.length} 套</p>
          </div>

          <div
            className="mx-auto grid min-h-0 w-full max-w-[1640px] flex-1 grid-rows-1 gap-4 overflow-hidden"
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
                  descriptionId={`home-desc-${preset.id}`}
                  onSelect={() => onSelectTemplate(idx)}
                />
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
