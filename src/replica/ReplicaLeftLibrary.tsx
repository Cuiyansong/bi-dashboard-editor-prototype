import { figmaAssets } from "./figmaAssets";
import { LEFT_LIBRARY_CATALOG } from "./leftLibraryCatalog";
import type { TemplatePreset, WidgetType } from "../model/dashboardModel";
import { TemplateMarketListRow } from "./TemplateMarketListRow";

const sprite = figmaAssets.leftSprite;
const ui = figmaAssets.leftUi;

export type LeftRailPanel = "charts" | "templates" | "query";

export type ReplicaLeftLibraryProps = {
  panel: LeftRailPanel;
  templates: readonly TemplatePreset[];
  currentTemplateIdx: number;
  templateEntries: { name: string; idx: number }[];
  /** `TEMPLATES` 中「空模板」的下标，无则传 -1 */
  blankTemplateIndex: number;
  onApplyTemplate: (idx: number) => void;
  onOpenTemplateMarketFull: () => void;
  onOpenDatasetReplace: () => void;
  onOpenQueryConditionModal: (kind: "simple" | "composite") => void;
  /** 指针按下并开始拖拽组件库项（不依赖 HTML5 DnD，避免内置浏览器/图片幽灵问题） */
  onLibraryPointerDragStart: (
    e: React.PointerEvent,
    widgetType: WidgetType,
    title: string | undefined,
    spriteClass: string,
  ) => void;
};

const railTitles: Record<LeftRailPanel, string> = {
  charts: "官方",
  templates: "模板市场",
  query: "查询控件",
};

export function ReplicaLeftLibrary({
  panel,
  templates,
  currentTemplateIdx,
  templateEntries,
  blankTemplateIndex,
  onApplyTemplate,
  onOpenTemplateMarketFull,
  onOpenDatasetReplace,
  onOpenQueryConditionModal,
  onLibraryPointerDragStart,
}: ReplicaLeftLibraryProps) {
  const title = railTitles[panel];

  return (
    <div
      className="flex h-full min-h-0 w-[244px] shrink-0 flex-col border-r border-figma-line bg-white"
      data-figma-node="2:7361"
    >
      <div className="sticky top-0 z-[2] shrink-0 bg-white">
        <div className="flex h-10 items-center justify-between border-b border-black/[0.06] pl-5 pr-3">
          <div className="relative font-['Inter',sans-serif] text-sm font-medium text-figma-text">
            {title}
            <div
              className="absolute -bottom-px left-0 right-0 h-0.5 rounded-full bg-gradient-to-r from-[#5959ff] to-[#5aacff]"
              data-figma-node="2:7379"
            />
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              className="flex h-[22px] w-[22px] items-center justify-center rounded p-1 hover:bg-black/[0.04]"
            >
              <img src={ui.v} alt="" className="h-3.5 w-3.5 object-contain" draggable={false} />
            </button>
            <button
              type="button"
              className="flex h-[22px] w-[22px] items-center justify-center rounded p-1 hover:bg-black/[0.04]"
            >
              <img src={ui.v1} alt="" className="h-3.5 w-3.5 object-contain" draggable={false} />
            </button>
            <button
              type="button"
              className="flex h-[22px] w-[22px] items-center justify-center rounded p-1 hover:bg-black/[0.04]"
            >
              <img src={ui.v2} alt="" className="h-3.5 w-3.5 object-contain" draggable={false} />
            </button>
          </div>
        </div>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden" data-node-id="2:7393">
        <div className="flex flex-col gap-3 px-3 pb-40 pt-1">
          {panel === "charts" &&
            LEFT_LIBRARY_CATALOG.map((sec) => (
              <div key={sec.title} className="flex flex-col gap-1">
                <div className="font-['Inter',sans-serif] text-xs font-normal leading-5 text-figma-text">{sec.title}</div>
                <div className="grid w-[227px] grid-cols-4 gap-y-2">
                  {sec.items.map((it) => (
                    <div
                      key={`${sec.title}-${it.label}`}
                      role="button"
                      tabIndex={0}
                      onPointerDown={(e) => onLibraryPointerDragStart(e, it.widgetType, it.label, it.spriteClass)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                        }
                      }}
                      className="flex w-[52px] cursor-grab touch-none select-none flex-col items-center gap-[1px] rounded px-1 py-1 outline-none ring-primary/30 focus-visible:ring-2 active:cursor-grabbing hover:bg-figma-azure-6"
                    >
                      <div className="relative size-[30px] shrink-0 overflow-hidden">
                        <img
                          alt=""
                          src={sprite}
                          draggable={false}
                          className={`pointer-events-none max-w-none select-none ${it.spriteClass}`}
                          style={{ WebkitUserDrag: "none" }}
                        />
                      </div>
                      <span className="max-w-[52px] select-none text-center font-['Inter',sans-serif] text-[10.8px] leading-[18.9px] text-figma-sub">
                        {it.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}

          {panel === "templates" && (
            <div className="flex flex-col gap-2.5">
              <button
                type="button"
                onClick={() => onOpenDatasetReplace()}
                className="w-full rounded-lg border border-primary/35 bg-primary/[0.06] px-2 py-2 text-center text-[11px] font-semibold text-primary shadow-sm transition hover:bg-primary/10"
              >
                替换模板数据集
              </button>
              <div className="text-xs font-semibold text-figma-text">模板市场</div>
              <div className="flex flex-col gap-2">
                {templateEntries
                  .filter((e) => templates[e.idx]?.id !== "blank")
                  .map((e) => {
                    const preset = templates[e.idx];
                    if (!preset) return null;
                    return (
                      <TemplateMarketListRow
                        key={preset.id}
                        preset={preset}
                        selected={currentTemplateIdx === e.idx}
                        compactThumbnail
                        onSelect={() => onApplyTemplate(e.idx)}
                      />
                    );
                  })}
              </div>
              <button
                type="button"
                className="w-full rounded border border-dashed border-primary/40 py-1.5 text-[11px] font-medium text-primary hover:bg-primary/5"
                onClick={() => onOpenTemplateMarketFull()}
              >
                更多模板…
              </button>
              {blankTemplateIndex >= 0 ? (
                <button
                  type="button"
                  onClick={() => onApplyTemplate(blankTemplateIndex)}
                  className="w-full rounded-lg border border-neutral-200 bg-white px-2 py-2.5 text-center text-[11px] font-medium text-figma-text transition hover:border-primary/40 hover:bg-neutral-50"
                >
                  空模板
                </button>
              ) : null}
            </div>
          )}

          {panel === "query" && (
            <div className="flex flex-col overflow-hidden rounded-lg border border-figma-line bg-white">
              <div className="border-b border-black/[0.06] bg-neutral-50 px-3 py-2 text-xs font-medium text-figma-text">查询控件</div>
              <div className="grid grid-cols-2 gap-3 p-3">
                <button
                  type="button"
                  onClick={() => onOpenQueryConditionModal("simple")}
                  className="flex flex-col items-center gap-2 rounded border border-figma-line bg-white p-3 text-center text-xs transition hover:border-primary hover:bg-blue-50/40"
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded border border-black/[0.08] bg-neutral-50 text-2xl text-primary">
                    🔍
                  </span>
                  <span>查询控件</span>
                </button>
                <button
                  type="button"
                  onClick={() => onOpenQueryConditionModal("composite")}
                  className="flex flex-col items-center gap-2 rounded border border-figma-line bg-white p-3 text-center text-xs transition hover:border-primary hover:bg-blue-50/40"
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded border border-black/[0.08] bg-neutral-50 text-2xl text-primary">
                    🌿
                  </span>
                  <span>复合式查询控件</span>
                </button>
              </div>
              <div className="flex items-start gap-2 border-t border-black/[0.06] bg-neutral-50/80 px-3 py-2 text-[11px] text-figma-sub">
                <span className="shrink-0 opacity-70">ⓘ</span>
                <span>
                  您还可以通过 <span className="font-medium text-primary">过滤器</span> 等进行页面内的数据筛选。
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
