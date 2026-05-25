import { TEMPLATES, type TemplatePreset } from "../model/dashboardModel";
import { TemplateMarketThumbnail } from "./TemplateMarketThumbnail";

export type TemplateMarketCardProps = {
  preset: TemplatePreset;
  descriptionId: string;
  onSelect: () => void;
  compact?: boolean;
  /** 平台首页：缩略图区随栅格等高伸缩 */
  fillHeight?: boolean;
  /** 缩略图区背景示意（参考页模块顶图） */
  coverImageUrl?: string;
};

export function TemplateMarketCard({
  preset,
  descriptionId,
  onSelect,
  compact = false,
  fillHeight = false,
  coverImageUrl,
}: TemplateMarketCardProps) {
  return (
    <div
      onClick={onSelect}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect();
        }
      }}
      aria-describedby={descriptionId}
      className="group flex h-full min-h-0 cursor-pointer flex-col overflow-hidden rounded-xl border border-[#E2E8F0] bg-white text-left shadow-sm transition-[border-color,box-shadow] duration-200 hover:border-primary/40 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 motion-reduce:transition-none"
    >
      <div className="flex shrink-0 items-center gap-2.5 border-b border-[#F1F5F9] px-4 py-3">
        <span
          className="h-8 w-1 shrink-0 rounded-full"
          style={{ backgroundColor: preset.accent }}
          aria-hidden
        />
        <h2
          className={`min-w-0 flex-1 truncate font-['Inter',sans-serif] font-semibold text-[#0F172A] group-hover:text-primary ${
            compact ? "text-[16px]" : "text-[20px]"
          }`}
        >
          {preset.name}
        </h2>
        <span className="shrink-0 font-['Inter',sans-serif] text-xs font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
          进入 →
        </span>
      </div>

      <div className={`flex min-h-0 flex-1 flex-col ${compact ? "p-2.5" : "p-3"}`}>
        <div
          className={`relative flex overflow-hidden rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] ${
            fillHeight
              ? "min-h-0 flex-1 p-2"
              : compact
                ? "min-h-[100px] p-2"
                : "min-h-[120px] p-2"
          }`}
        >
          {coverImageUrl ? (
            <img
              src={coverImageUrl}
              alt=""
              className="absolute inset-0 h-full w-full object-cover opacity-35"
              aria-hidden
            />
          ) : null}
          <div className="relative flex min-h-0 w-full flex-1">
            <TemplateMarketThumbnail preset={preset} size="hero" />
          </div>
        </div>
        <p
          id={descriptionId}
          className={`shrink-0 line-clamp-2 leading-snug text-[#64748B] ${compact ? "mt-1.5 text-[11px]" : "mt-2 text-[12px]"}`}
        >
          {preset.description}
        </p>
      </div>
    </div>
  );
}

export const MARKET_TEMPLATES = TEMPLATES.filter((t) => t.id !== "blank");
