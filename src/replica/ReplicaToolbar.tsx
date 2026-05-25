import { FigmaAssetImage } from "./FigmaAssetImage";
import { figmaAssets } from "./figmaAssets";
import type { EditorUiMode } from "./editorUiMode";
import { isComplexEditorMode } from "./editorUiMode";
import type { LeftRailPanel } from "./ReplicaLeftLibrary";

const t = figmaAssets.toolbar;

const toolbarBtnBase =
  "flex shrink-0 items-center gap-1 rounded px-1.5 py-0.5 font-['Inter',sans-serif] text-sm transition";
/** 当前左栏对应项：蓝色底 + 主色字 */
const toolbarBtnSelected = "border-transparent bg-primary/16 text-primary ring-1 ring-primary/35 shadow-sm";
/** 未选中：白底 + 中性字，与工具栏白底区分用细边框 */
const toolbarBtnIdle = "border border-neutral-200/70 bg-white text-neutral-700 hover:border-neutral-300 hover:bg-neutral-50/90";

export type ReplicaToolbarProps = {
  activeRail: LeftRailPanel;
  onRailChange: (rail: LeftRailPanel) => void;
  uiMode?: EditorUiMode;
};

export function ReplicaToolbar({ activeRail, onRailChange, uiMode = "complex" }: ReplicaToolbarProps) {
  const showToolbarExtras = isComplexEditorMode(uiMode);
  const chips = [t.v2, t.v3, t.v4, t.v5, t.v6, t.v7, t.v8, t.v9, t.v10];

  return (
    <div
      className="relative z-[40] flex h-[40px] w-full shrink-0 items-center justify-between border-b border-figma-line bg-white px-4"
      data-figma-node="2:4674"
    >
      <div className="flex min-w-0 flex-1 items-center gap-1">
        <div className="relative shrink-0">
          <button
            type="button"
            onClick={() => onRailChange("templates")}
            className={`${toolbarBtnBase} ${activeRail === "templates" ? toolbarBtnSelected : toolbarBtnIdle}`}
          >
            <FigmaAssetImage src={t.v} className="h-3.5 w-3.5 object-contain" />
            从模板市场选择
            <span className="text-[10px] opacity-80">{activeRail === "templates" ? "▴" : "▾"}</span>
          </button>
        </div>

        <div className="relative shrink-0">
          <button
            type="button"
            onClick={() => onRailChange("charts")}
            className={`${toolbarBtnBase} ${activeRail === "charts" ? toolbarBtnSelected : toolbarBtnIdle}`}
          >
            <FigmaAssetImage src={t.v} className="h-3.5 w-3.5 object-contain" />
            添加图表
            <span className="text-[10px] opacity-80">{activeRail === "charts" ? "▴" : "▾"}</span>
          </button>
        </div>

        <div className="relative shrink-0">
          <button
            type="button"
            onClick={() => onRailChange("query")}
            className={`${toolbarBtnBase} ${activeRail === "query" ? toolbarBtnSelected : toolbarBtnIdle}`}
          >
            <FigmaAssetImage src={t.v} className="h-3.5 w-3.5 object-contain" />
            添加查询控件
            <span className="text-[10px] opacity-80">{activeRail === "query" ? "▴" : "▾"}</span>
          </button>
        </div>
      </div>

      {showToolbarExtras ? (
        <div className="flex shrink-0 items-center gap-1">
          <span className="mx-1 h-3 w-px bg-figma-line" />
          {chips.slice(0, 5).map((src, i) => (
            <button key={i} type="button" className="flex h-7 w-7 items-center justify-center rounded hover:bg-black/[0.04]">
              <FigmaAssetImage src={src} className="h-3.5 w-3.5 object-contain opacity-80" />
            </button>
          ))}
          <span className="mx-1 h-3 w-px bg-figma-line" />
          <button type="button" className="flex items-center gap-0.5 rounded px-2 py-1 font-['Inter',sans-serif] text-xs text-[rgba(0,0,0,0.65)]">
            100% <span className="text-[10px]">▾</span>
          </button>
          {chips.slice(5).map((src, i) => (
            <button key={`r-${i}`} type="button" className="flex h-7 w-7 items-center justify-center rounded hover:bg-black/[0.04]">
              <FigmaAssetImage src={src} className="h-3.5 w-3.5 object-contain opacity-80" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
