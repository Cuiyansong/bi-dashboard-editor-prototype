import { figmaAssets } from "./figmaAssets";
import { useCallback, useState, type Ref } from "react";
import {
  CanvasWidget,
  MeasureKey,
  TemplatePreset,
} from "../model/dashboardModel";
import type { TemplateDatasetDef } from "../model/templateDatasets";
import {
  measureValueForWidget,
  seededCohortRows,
  seededKpiPreviewRows,
} from "../model/templateDatasets";
import { cardAccentForIndex } from "./chartAccents";
import type { FieldSlotBindings } from "./ReplicaRightPanel";
import { WidgetBody } from "./canvasWidgets";
import {
  CUSTOMER_FILTER_DEFS,
  filterMixFromState,
  PRODUCT_FILTER_DEFS,
  type CustomerFilterState,
} from "../model/customerFilters";
import { TemplateFilterBar } from "./TemplateFilterBar";
import { WidgetCanvasMoreMenu } from "./WidgetCanvasMoreMenu";
import { ChartFilterToolbar } from "./ChartFilterToolbar";

const c = figmaAssets.canvas;

export type ReplicaCanvasProps = {
  preset: TemplatePreset;
  dataset: TemplateDatasetDef;
  /** 画布主标题（与当前 Tab 名称分开配置、分开渲染，便于单独改文案或样式） */
  pageTitle: string;
  /** 当前 Tab 名称，显示在主标题右侧，字号略小 */
  dashTabLabel?: string;
  activeDashTab: number;
  onDashTab: (i: number) => void;
  widgets: CanvasWidget[];
  selectedId: string | null;
  onSelectWidget: (id: string | null) => void;
  /** 未单独配置时的默认主度量（新拖入块初始值） */
  primaryMeasure: MeasureKey;
  /** 各图表独立主度量 */
  widgetPrimaryMeasureById: Record<string, MeasureKey>;
  /** 各图表独立假数据 seed（仅选中图点「更新」递增） */
  widgetDataSeedById: Record<string, number>;
  /** 指针拖拽时画布高亮（与 HTML5 拖放无关） */
  dragOver: boolean;
  /** 用于指针投放命中检测（屏幕坐标） */
  dropZoneRef?: Ref<HTMLDivElement | null>;
  /** 各画布组件的字段槽绑定（用于「无数据」态） */
  slotBindingsByWidget: Record<string, FieldSlotBindings>;
  /** 看板级筛选（标题下方独立卡片） */
  filterState: CustomerFilterState;
  onFilterChange: (
    filterId: keyof CustomerFilterState,
    value: string[],
  ) => void;
  onFilterQuery: () => void;
  onReorderWidgets?: (fromIndex: number, toIndex: number) => void;
  /** 从卡片「更多」菜单删除组件 */
  onDeleteWidget?: (widgetId: string) => void;
};

function cardMinHeight(w: CanvasWidget): number {
  if (w.replicaLayout === "strategyCohortTable") return 400;
  if (w.replicaLayout === "irisCrossTable") return 260;
  if (w.replicaLayout === "irisLiquid") return 280;
  if (w.replicaLayout === "irisKpis") return 140;
  if (w.replicaLayout === "metricBreakdownTree") return 340;
  if (w.replicaLayout === "insuranceCockpitBoard") return 560;
  if (w.replicaLayout === "compoundQuery") return 220;
  if (w.replicaLayout === "orgProgressBoard") return 220;
  if (w.replicaLayout === "customerTagTable") return 240;
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
  widgetPrimaryMeasureById,
  widgetDataSeedById,
  dragOver,
  dropZoneRef,
  slotBindingsByWidget,
  filterState,
  onFilterChange,
  onFilterQuery,
  onReorderWidgets,
  onDeleteWidget,
}: ReplicaCanvasProps) {
  const dimensionLabels = dataset.dimensions.map((d) => d.label);
  const [reorderHoverIndex, setReorderHoverIndex] = useState<number | null>(
    null,
  );

  const isCustomerBizTemplate = preset?.id === "customer-biz";
  const isProductStoreTemplate = preset?.id === "product-store";

  const handleDragStart = useCallback(
    (index: number) => (e: React.DragEvent) => {
      e.stopPropagation();
      e.dataTransfer.setData("text/bi-widget-idx", String(index));
      e.dataTransfer.effectAllowed = "move";
    },
    [],
  );

  const handleDragEnd = useCallback(() => {
    setReorderHoverIndex(null);
  }, []);

  const handleDragOverIndex = useCallback(
    (index: number) => (e: React.DragEvent) => {
      if (!onReorderWidgets) return;
      e.preventDefault();
      e.dataTransfer.dropEffect = "move";
      setReorderHoverIndex(index);
    },
    [onReorderWidgets],
  );

  const handleDropOnIndex = useCallback(
    (toIndex: number) => (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const raw = e.dataTransfer.getData("text/bi-widget-idx");
      const from = parseInt(raw, 10);
      setReorderHoverIndex(null);
      if (!onReorderWidgets || Number.isNaN(from)) return;
      onReorderWidgets(from, toIndex);
    },
    [onReorderWidgets],
  );

  return (
    <main
      className="relative flex h-full min-h-0 w-[1255px] shrink-0 flex-col overflow-hidden"
      data-figma-node="2:4788"
    >
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-figma-grey-98" />
        <div className="absolute inset-0 overflow-hidden">
          <img
            alt=""
            className="absolute bottom-0 left-0 h-[58.2%] w-full max-w-none object-cover"
            src={c.bgLower}
          />
        </div>
        <div className="absolute inset-0 overflow-hidden">
          <img
            alt=""
            className="absolute left-0 top-0 h-[69.06%] w-full max-w-none object-cover"
            src={c.bgUpper}
          />
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

        <div
          className="min-h-0 flex-1 overflow-auto px-6 pb-4 pt-5"
          onClick={() => onSelectWidget(null)}
        >
          <div className="pb-3 pl-1 pt-1">
            <h1 className="flex flex-wrap items-baseline gap-x-1.5 font-['Inter',sans-serif] leading-[39.2px] text-figma-text">
              <span
                className="text-[28px] font-semibold tracking-tight"
                data-bi-replica-page-title
              >
                {pageTitle}
              </span>
              {dashTabLabel ? (
                <>
                  <span
                    className="text-[22px] font-semibold text-figma-sub/70"
                    aria-hidden
                  >
                    ·
                  </span>
                  <span
                    className="text-[20px] font-medium text-figma-sub"
                    data-bi-replica-page-tab
                  >
                    {dashTabLabel}
                  </span>
                </>
              ) : null}
            </h1>
          </div>
          {isCustomerBizTemplate && (
            <TemplateFilterBar
              values={filterState}
              filters={CUSTOMER_FILTER_DEFS}
              onChange={onFilterChange}
              onQuery={onFilterQuery}
            />
          )}
          {isProductStoreTemplate && (
            <TemplateFilterBar
              values={filterState}
              filters={PRODUCT_FILTER_DEFS}
              onChange={onFilterChange}
              onQuery={onFilterQuery}
            />
          )}
          <div
            className="relative mx-auto grid w-full max-w-[1247px] gap-3 px-1"
            style={{ gridTemplateColumns: "repeat(2, minmax(0, 1fr))" }}
            data-canvas-grid
            onClick={(e) => e.stopPropagation()}
          >
            {widgets.length === 0 ? (
              <div className="col-span-2 flex min-h-[200px] flex-col items-center justify-center rounded-lg border border-dashed border-neutral-300 bg-white/60 py-12 text-center">
                <p className="text-sm font-medium text-figma-text">画布为空</p>
                <p className="mt-2 max-w-sm text-xs text-figma-sub">
                  从左侧「添加图表」打开组件库，拖入图表到此处即可开始搭建
                </p>
              </div>
            ) : null}
            {widgets.map((w, i) => {
              const mk = widgetPrimaryMeasureById[w.id] ?? primaryMeasure;
              const sd = widgetDataSeedById[w.id] ?? 0;
              const filterMix = filterMixFromState(filterState);
              const pct = Math.min(
                100,
                measureValueForWidget(mk, sd, w.id, filterMix),
              );
              const measureLabel =
                dataset.measures.find((m) => m.key === mk)?.label ??
                dataset.measures[0]!.label;
              const otherMeasure =
                dataset.measures.find((m) => m.key !== mk) ??
                dataset.measures[0]!;
              const secondaryMeasureLabel = otherMeasure.label;
              const kpiPreviewRows = seededKpiPreviewRows(
                dataset.kpiPreviewRows,
                preset.id,
                sd,
                w.id,
                filterMix,
              );
              const base = dataset.cohortTrackingRows;
              const cohortRows = base?.length
                ? seededCohortRows(base, sd, w.id, filterMix)
                : undefined;
              const highlightDrop = onReorderWidgets && reorderHoverIndex === i;

              return (
                <div
                  key={w.id}
                  data-widget-index={i}
                  onDragOver={
                    onReorderWidgets ? handleDragOverIndex(i) : undefined
                  }
                  onDragLeave={() => setReorderHoverIndex(null)}
                  onDrop={onReorderWidgets ? handleDropOnIndex(i) : undefined}
                  className={`rounded-lg border bg-white/90 text-left shadow-card backdrop-blur-sm outline-none ring-primary/30 transition focus-visible:ring-2 ${
                    selectedId === w.id
                      ? "border-primary ring-1 ring-primary/30"
                      : "border-border hover:border-neutral-300"
                  } ${highlightDrop ? "ring-2 ring-primary/50" : ""} ${w.colSpan === 2 ? "col-span-2" : ""}`}
                  style={{ minHeight: cardMinHeight(w) }}
                >
                  {onReorderWidgets || onDeleteWidget ? (
                    <div
                      className={`flex items-stretch border-b border-black/[0.06] bg-neutral-50/90 ${onReorderWidgets ? "" : "justify-end"}`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      {onReorderWidgets ? (
                        <div
                          draggable
                          onDragStart={handleDragStart(i)}
                          onDragEnd={handleDragEnd}
                          className="flex min-w-0 flex-1 cursor-grab items-center justify-center gap-1 py-1 text-[10px] text-figma-sub active:cursor-grabbing"
                          title="拖拽排序"
                        >
                          <span className="select-none tracking-tight">⋮⋮</span>
                          <span>拖拽调整顺序</span>
                        </div>
                      ) : null}
                      {onDeleteWidget ? (
                        <WidgetCanvasMoreMenu
                          widgetId={w.id}
                          onDelete={onDeleteWidget}
                        />
                      ) : null}
                    </div>
                  ) : null}
                  <ChartFilterToolbar
                    values={filterState}
                    onChange={onFilterChange}
                  />
                  <div
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
                    className="outline-none ring-primary/30 focus-visible:ring-2"
                  >
                    <WidgetBody
                      w={w}
                      measureKey={mk}
                      dataSeed={sd}
                      filterMix={filterMix}
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
                </div>
              );
            })}
          </div>

          <div className="pointer-events-none absolute bottom-6 right-10 opacity-40">
            <img
              alt=""
              className="h-16 w-auto max-w-[120px] object-contain"
              src={c.watermark}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
