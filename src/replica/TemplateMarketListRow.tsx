import type { TemplatePreset } from "../model/dashboardModel";
import { TemplateMarketThumbnail } from "./TemplateMarketThumbnail";

export function TemplateMarketListRow({
  preset,
  selected,
  onSelect,
  compactThumbnail,
}: {
  preset: TemplatePreset;
  selected: boolean;
  onSelect: () => void;
  /** 左侧窄栏用更小缩略图 */
  compactThumbnail?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`flex w-full gap-2 rounded-lg border p-2 text-left transition hover:border-primary hover:bg-blue-50/40 ${
        selected ? "border-primary bg-blue-50/50 ring-1 ring-primary/20" : "border-figma-line bg-white"
      }`}
    >
      <div
        className={`pointer-events-none shrink-0 overflow-hidden rounded-md border border-black/[0.06] bg-neutral-50 ${
          compactThumbnail ? "h-[52px] w-[76px]" : "h-[68px] w-[96px]"
        }`}
      >
        <TemplateMarketThumbnail preset={preset} size={compactThumbnail ? "compact" : "default"} />
      </div>
      <div className="min-w-0 flex-1 py-0.5">
        <div className="font-['Inter',sans-serif] text-[12px] font-semibold leading-snug text-figma-text">{preset.name}</div>
        <div className="mt-1 line-clamp-2 text-[10px] leading-relaxed text-figma-sub">{preset.description}</div>
      </div>
    </button>
  );
}
