import { figmaAssets } from "./figmaAssets";

const a = figmaAssets.header;

export function ReplicaBiHeader() {
  return (
    <header
      className="flex h-[56px] shrink-0 items-stretch border-b border-figma-line bg-white px-4"
      data-figma-node="2:7282"
    >
      <div className="flex min-w-0 flex-1 items-center gap-2">
        <img src={a.v} alt="" className="h-6 w-6 shrink-0 object-contain" />
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
          <img src={a.v1} alt="" className="h-4 w-4 object-contain" />
        </button>
        <button type="button" className="flex h-8 w-8 shrink-0 items-center justify-center rounded hover:bg-black/[0.04]">
          <img src={a.v2} alt="" className="h-4 w-4 object-contain" />
        </button>
      </div>
      <div className="flex shrink-0 items-center gap-1.5">
        <img src={a.v5} alt="" className="h-4 w-4 shrink-0 object-contain opacity-70" />
        <button type="button" className="rounded px-2 py-1 font-['Inter',sans-serif] text-xs text-[rgba(0,0,0,0.65)] hover:bg-black/[0.04]">
          替换数据集
        </button>
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
          <img src={a.v8} alt="" className="h-4 w-4 object-contain" />
        </button>
      </div>
    </header>
  );
}
