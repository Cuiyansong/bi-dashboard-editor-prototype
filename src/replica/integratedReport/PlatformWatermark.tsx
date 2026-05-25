import { PLATFORM_WATERMARK } from "./integratedReportConfig";

export function PlatformWatermark() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden opacity-[0.07]"
    >
      <span className="rotate-[-24deg] whitespace-nowrap text-[36px] font-semibold text-[#64748B]">
        {PLATFORM_WATERMARK}
      </span>
    </div>
  );
}
