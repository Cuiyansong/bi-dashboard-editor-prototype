import { figmaAssets } from "./figmaAssets";
import { LEFT_LIBRARY_CATALOG } from "./leftLibraryCatalog";
import type { WidgetType } from "../model/dashboardModel";

const sprite = figmaAssets.leftSprite;
const ui = figmaAssets.leftUi;

export type ReplicaLeftLibraryProps = {
  /** 指针按下并开始拖拽组件库项（不依赖 HTML5 DnD，避免内置浏览器/图片幽灵问题） */
  onLibraryPointerDragStart: (
    e: React.PointerEvent,
    widgetType: WidgetType,
    title: string | undefined,
    spriteClass: string,
  ) => void;
};

export function ReplicaLeftLibrary({ onLibraryPointerDragStart }: ReplicaLeftLibraryProps) {
  return (
    <div
      className="flex h-full min-h-0 w-[244px] shrink-0 flex-col border-r border-figma-line bg-white"
      data-figma-node="2:7361"
    >
      <div className="sticky top-0 z-[2] shrink-0 bg-white">
        <div className="flex h-10 items-center justify-between border-b border-black/[0.06] pl-5 pr-3">
          <div className="relative font-['Inter',sans-serif] text-sm font-medium text-figma-text">
            官方
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
          {LEFT_LIBRARY_CATALOG.map((sec) => (
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
        </div>
      </div>
    </div>
  );
}
