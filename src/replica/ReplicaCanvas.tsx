import { figmaAssets } from "./figmaAssets";
import { useMemo, type Ref } from "react";
import { CanvasWidget, MeasureKey, TemplatePreset } from "../model/dashboardModel";
import type { TemplateDatasetDef } from "../model/templateDatasets";
import { measureValue, seededCohortRows, seededKpiPreviewRows } from "../model/templateDatasets";
import { cardAccentForIndex } from "./chartAccents";
import type { FieldSlotBindings } from "./ReplicaRightPanel";
import { WidgetBody } from "./canvasWidgets";
import { TemplateFilterBar } from "./TemplateFilterBar";

const c = figmaAssets.canvas;

export type ReplicaCanvasProps = {
  preset: TemplatePreset;
  dataset: TemplateDatasetDef;
  pageTitle: string;
  /** 当前 Tab 副标题（如 Tab 名称），与 pageTitle 组合展示 */
  dashTabLabel?: string;
  activeDashTab: number;
  onDashTab: (i: number) => void;
  widgets: CanvasWidget[];
  selectedId: string | null;
  onSelectWidget: (id: string | null) => void;
  primaryMeasure: MeasureKey;
  /** 指针拖拽时画布高亮（与 HTML5 拖放无关） */
  dragOver: boolean;
  /** 用于指针投放命中检测（屏幕坐标） */
  dropZoneRef?: Ref<HTMLDivElement | null>;
  /** 点击「更新」递增，驱动画布假数据刷新 */
  dataSeed: number;
  /** 各画布组件的字段槽绑定（用于「无数据」态） */
  slotBindingsByWidget: Record<string, FieldSlotBindings>;
  /** 看板级筛选（标题下方独立卡片） */
  templateId: string;
  filterState: Record<string, string>;
  onFilterChange: (filterId: string, value: string) => void;
  onFilterQuery: () => void;
};

function cardMinHeight(w: CanvasWidget): number {
  if (w.replicaLayout === "strategyCohortTable") return 400;
  if (w.replicaLayout === "irisCrossTable") return 260;
  if (w.replicaLayout === "irisLiquid") return 280;
  if (w.replicaLayout === "irisKpis") return 140;
  if (w.type === "liquid") return 220;
  if (w.type === "table") return 160;
  return 96;
}

export function ReplicaCanvas({
  preset,
  dataset,
  pageTitle,
  dashTabLabel,
  activeDashTab,
  onDashTab,
  widgets,
  selectedId,
  onSelectWidget,
  primaryMeasure,
  dragOver,
  dropZoneRef,
  dataSeed,
  slotBindingsByWidget,
  templateId,
  filterState,
  onFilterChange,
  onFilterQuery,
}: ReplicaCanvasProps) {
  const pct = Math.min(100, measureValue(primaryMeasure, dataSeed));
  const measureLabel = dataset.measures.find((m) => m.key === primaryMeasure)?.label ?? dataset.measures[0]!.label;
  const secondaryMeasureLabel = dataset.measures[1]?.label ?? dataset.measures[0]!.label;
  const dimensionLabels = dataset.dimensions.map((d) => d.label);
  const kpiPreviewRows = useMemo(
    () => seededKpiPreviewRows(dataset.kpiPreviewRows, preset.id, dataSeed),
    [dataset.kpiPreviewRows, preset.id, dataSeed],
  );
  const cohortRows = useMemo(() => {
    const base = dataset.cohortTrackingRows;
    if (!base?.length) return undefined;
    return seededCohortRows(base, dataSeed);
  }, [dataset.cohortTrackingRows, dataSeed]);

  return (
    <main
      className="relative flex h-full min-h-0 w-[1255px] shrink-0 flex-col overflow-hidden"
      data-figma-node="2:4788"
    >
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-figma-grey-98" />
        <div className="absolute inset-0 overflow-hidden">
          <img alt="" className="absolute bottom-0 left-0 h-[58.2%] w-full max-w-none object-cover" src={c.bgLower} />
        </div>
        <div className="absolute inset-0 overflow-hidden">
          <img alt="" className="absolute left-0 top-0 h-[69.06%] w-full max-w-none object-cover" src={c.bgUpper} />
        </div>
      </div>

      <div
        ref={dropZoneRef}
        className={`relative z-[1] flex min-h-0 flex-1 flex-col ${dragOver ? "ring-2 ring-inset ring-primary/50" : ""}`}
      >
        <div className="flex h-9 shrink-0 items-center gap-2 border-b border-figma-line bg-white/90 px-3 backdrop-blur-sm">
          <div className="flex min-w-0 flex-1 items-center gap-1 overflow-x-auto">
            {preset.dashboardTabs.map((t, i) => (
              <button
                key={t}
                type="button"
                onClick={() => onDashTab(i)}
                className={`shrink-0 rounded-t px-3 py-1.5 font-['Inter',sans-serif] text-xs ${
                  activeDashTab === i
                    ? "border border-b-0 border-figma-line bg-canvas font-medium text-primary"
                    : "text-[rgba(0,0,0,0.65)] hover:bg-neutral-50"
                }`}
              >
                {t}
              </button>
            ))}
            <button
              type="button"
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded text-figma-sub hover:bg-black/[0.04]"
              title="新建看板"
            >
              +
            </button>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-auto px-6 pb-4 pt-5" onClick={() => onSelectWidget(null)}>
          <div className="pb-3 pl-1 pt-1">
            <h1 className="font-['Inter',sans-serif] text-[28px] font-semibold leading-[39.2px] text-figma-text">
              {pageTitle}
              {dashTabLabel ? (
                <span className="text-[20px] font-medium text-figma-sub"> · {dashTabLabel}</span>
              ) : null}
            </h1>
          </div>

          <TemplateFilterBar
            templateId={templateId}
            values={filterState}
            onChange={onFilterChange}
            onQuery={onFilterQuery}
          />

          <div
            className="relative mx-auto grid w-full max-w-[1247px] gap-3 px-1"
            style={{ gridTemplateColumns: "repeat(2, minmax(0, 1fr))" }}
            onClick={(e) => e.stopPropagation()}
          >
            {widgets.map((w, i) => (
              <div
                key={w.id}
                role="button"
                tabIndex={0}
                onClick={(ev) => {
                  ev.stopPropagation();
                  onSelectWidget(w.id);
                }}
                onKeyDown={(ev) => {
                  if (ev.key === "Enter" || ev.key === " ") {
                    ev.preventDefault();
                    onSelectWidget(w.id);
                  }
                }}
                className={`rounded-lg border bg-white/90 text-left shadow-card backdrop-blur-sm outline-none ring-primary/30 transition focus-visible:ring-2 ${
                  selectedId === w.id ? "border-primary ring-1 ring-primary/30" : "border-border hover:border-neutral-300"
                } ${w.colSpan === 2 ? "col-span-2" : ""}`}
                style={{ minHeight: cardMinHeight(w) }}
              >
                <WidgetBody
                  w={w}
                  measureLabel={measureLabel}
                  secondaryMeasureLabel={secondaryMeasureLabel}
                  dimensionLabels={dimensionLabels}
                  kpiPreviewRows={kpiPreviewRows}
                  cohortRows={cohortRows}
                  pct={pct}
                  accent={cardAccentForIndex(i, activeDashTab)}
                  slotBindings={slotBindingsByWidget[w.id] ?? {}}
                />
              </div>
            ))}
          </div>

          <div className="pointer-events-none absolute bottom-6 right-10 opacity-40">
            <img alt="" className="h-16 w-auto max-w-[120px] object-contain" src={c.watermark} />
          </div>
        </div>
      </div>
    </main>
  );
}
