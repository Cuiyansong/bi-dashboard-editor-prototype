import { FigmaAssetImage } from "./FigmaAssetImage";
import { figmaAssets } from "./figmaAssets";

const a = figmaAssets.header;

export function ReplicaBiHeader({
  onBackToHome,
  backLabel,
}: {
  onBackToHome?: () => void;
  backLabel?: string;
}) {
  return (
    <header
      className="flex h-[56px] shrink-0 items-stretch border-b border-figma-line bg-white px-4"
      data-figma-node="2:7282"
    >
      <div className="flex min-w-0 flex-1 items-center gap-2">
        {onBackToHome ? (
          <button
            type="button"
            onClick={onBackToHome}
            className="shrink-0 rounded border border-figma-line px-2.5 py-1 font-['Inter',sans-serif] text-xs text-figma-sub hover:border-primary hover:text-primary"
          >
            {backLabel ?? "← 返回首页"}
          </button>
        ) : null}
        <FigmaAssetImage src={a.v} className="h-6 w-6 shrink-0 object-contain" />
        <div className="min-w-0">
          <div className="truncate font-['Inter',sans-serif] text-sm font-medium leading-tight text-figma-text">
            创建模板功能
          </div>
          <div className="truncate font-['Inter',sans-serif] text-[11px] leading-tight text-figma-sub">
            仅在当前页面有效
          </div>
        </div>
        <span className="mx-1 h-4 w-px shrink-0 bg-figma-line" />
        <button type="button" className="flex h-8 w-8 shrink-0 items-center justify-center rounded hover:bg-black/[0.04]">
          <FigmaAssetImage src={a.v1} className="h-4 w-4 object-contain" />
        </button>
        <button type="button" className="flex h-8 w-8 shrink-0 items-center justify-center rounded hover:bg-black/[0.04]">
          <FigmaAssetImage src={a.v2} className="h-4 w-4 object-contain" />
        </button>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <button type="button" className="rounded px-2 py-1 font-['Inter',sans-serif] text-xs text-[rgba(0,0,0,0.65)] hover:bg-black/[0.04]">
          页面设置
        </button>
        <button
          type="button"
          className="rounded border border-primary bg-white px-3 py-1 font-['Inter',sans-serif] text-xs font-medium text-primary hover:bg-figma-azure-8"
        >
          预览
        </button>
        <button
          type="button"
          className="rounded border border-primary bg-white px-3 py-1 font-['Inter',sans-serif] text-xs font-medium text-primary hover:bg-figma-azure-8"
        >
          保存
        </button>
        <button
          type="button"
          className="rounded px-4 py-1.5 font-['Inter',sans-serif] text-xs font-medium text-white"
          style={{ background: "#2E74FF" }}
        >
          保存并发布
        </button>
        <button type="button" className="flex h-8 w-8 items-center justify-center rounded hover:bg-black/[0.04]">
          <FigmaAssetImage src={a.v8} className="h-4 w-4 object-contain" />
        </button>
      </div>
    </header>
  );
}
