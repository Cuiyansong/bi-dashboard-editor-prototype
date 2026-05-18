import { TEMPLATES, type TemplatePreset } from "../model/dashboardModel";
import { HomeHeroBanner, HomeSubtleBackground } from "./HomePageDecor";
import { TemplateMarketThumbnail } from "./TemplateMarketThumbnail";

const HOME_TEMPLATES = TEMPLATES.filter((t) => t.id !== "blank");
const HOME_TITLE_ID = "home-page-title";

export type HomePageProps = {
  onSelectTemplate: (templateIndex: number) => void;
};

function HomeTemplateCard({
  preset,
  descriptionId,
  onSelect,
}: {
  preset: TemplatePreset;
  descriptionId: string;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-describedby={descriptionId}
      className="group flex h-full min-h-0 flex-col overflow-hidden rounded-xl border border-[#E2E8F0] bg-white text-left shadow-sm transition-[border-color,box-shadow] duration-200 hover:border-primary/40 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 motion-reduce:transition-none"
    >
      <div className="flex shrink-0 items-center gap-2.5 border-b border-[#F1F5F9] px-4 py-3">
        <span
          className="h-8 w-1 shrink-0 rounded-full"
          style={{ backgroundColor: preset.accent }}
          aria-hidden
        />
        <h2 className="min-w-0 flex-1 truncate font-['Inter',sans-serif] text-[15px] font-semibold text-[#0F172A] group-hover:text-primary">
          {preset.name}
        </h2>
        <span className="shrink-0 font-['Inter',sans-serif] text-xs font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
          进入 →
        </span>
      </div>

      <div className="flex min-h-0 flex-1 flex-col p-4">
        <div className="flex min-h-[168px] flex-1 overflow-hidden rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-3">
          <TemplateMarketThumbnail preset={preset} size="hero" />
        </div>
        <p id={descriptionId} className="mt-3 line-clamp-2 text-[13px] leading-snug text-[#64748B]">
          {preset.description}
        </p>
      </div>
    </button>
  );
}

export function HomePage({ onSelectTemplate }: HomePageProps) {
  return (
    <div
      className="relative flex h-[918px] w-[1920px] shrink-0 flex-col overflow-hidden rounded-sm border border-figma-line bg-[#F1F5F9] shadow-md"
      data-bi-home
    >
      <main className="relative flex min-h-0 flex-1 flex-col overflow-hidden" aria-labelledby={HOME_TITLE_ID}>
        <HomeSubtleBackground />
        <HomeHeroBanner titleId={HOME_TITLE_ID} />

        <div className="relative z-[1] flex min-h-0 flex-1 flex-col px-10 pb-8 pt-5">
          <div className="mb-4 flex shrink-0 items-baseline justify-between">
            <h2 className="font-['Inter',sans-serif] text-sm font-semibold text-[#0F172A]">业务模板</h2>
            <p className="font-['Inter',sans-serif] text-xs text-[#94A3B8]">共 {HOME_TEMPLATES.length} 套</p>
          </div>

          <div className="grid min-h-0 flex-1 grid-cols-4 grid-rows-1 gap-5">
            {HOME_TEMPLATES.map((preset) => {
              const idx = TEMPLATES.findIndex((t) => t.id === preset.id);
              return (
                <HomeTemplateCard
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
