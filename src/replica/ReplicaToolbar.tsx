import { figmaAssets } from "./figmaAssets";

const t = figmaAssets.toolbar;

export type ReplicaToolbarProps = {
  onOpenTemplateMarket: () => void;
};

export function ReplicaToolbar({ onOpenTemplateMarket }: ReplicaToolbarProps) {
  const chips = [t.v2, t.v3, t.v4, t.v5, t.v6, t.v7, t.v8, t.v9, t.v10];

  return (
    <div
      className="flex h-[40px] w-full shrink-0 items-center justify-between border-b border-figma-line bg-white px-4"
      data-figma-node="2:4674"
    >
      <div className="flex min-w-0 flex-1 items-center gap-2">
        <button
          type="button"
          className="flex shrink-0 items-center gap-1 rounded px-1 py-0.5 font-['Inter',sans-serif] text-sm text-primary"
          style={{ background: "rgba(46,116,255,0.08)" }}
        >
          <img src={t.v} alt="" className="h-3.5 w-3.5 object-contain" />
          添加图表
          <img src={t.v1} alt="" className="h-3 w-3 object-contain opacity-70" />
        </button>
        <button
          type="button"
          className="flex shrink-0 items-center gap-1 rounded px-1 py-0.5 font-['Inter',sans-serif] text-sm text-[rgba(0,0,0,0.65)] hover:bg-black/[0.04]"
        >
          <span className="text-xs opacity-80">◇</span>
          添加查询控件
          <span className="text-[10px] opacity-70">▾</span>
        </button>
        <button
          type="button"
          className="ml-1 shrink-0 rounded border border-primary bg-white px-2 py-1 font-['Inter',sans-serif] text-xs font-medium text-primary hover:bg-figma-azure-8"
          onClick={onOpenTemplateMarket}
        >
          从模板市场选择
        </button>
      </div>
      <div className="flex shrink-0 items-center gap-1">
        <span className="mx-1 h-3 w-px bg-figma-line" />
        {chips.slice(0, 5).map((src, i) => (
          <button
            key={i}
            type="button"
            className="flex h-7 w-7 items-center justify-center rounded hover:bg-black/[0.04]"
          >
            <img src={src} alt="" className="h-3.5 w-3.5 object-contain opacity-80" />
          </button>
        ))}
        <span className="mx-1 h-3 w-px bg-figma-line" />
        <button
          type="button"
          className="flex items-center gap-0.5 rounded px-2 py-1 font-['Inter',sans-serif] text-xs text-[rgba(0,0,0,0.65)]"
        >
          100% <span className="text-[10px]">▾</span>
        </button>
        {chips.slice(5).map((src, i) => (
          <button
            key={`r-${i}`}
            type="button"
            className="flex h-7 w-7 items-center justify-center rounded hover:bg-black/[0.04]"
          >
            <img src={src} alt="" className="h-3.5 w-3.5 object-contain opacity-80" />
          </button>
        ))}
      </div>
    </div>
  );
}
