import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  CanvasWidget,
  MeasureKey,
  TEMPLATES,
  WidgetType,
} from "../model/dashboardModel";
import type { FieldRef } from "../model/fieldRef";
import { defaultFilterState } from "../model/templateFilters";
import { getInitialTabWidgets } from "../model/templateTabWidgets";
import { defaultPrimaryMeasureKey, getDatasetForTemplate, listRegisteredDatasets } from "../model/templateDatasets";
import { ReplicaBiHeader } from "./ReplicaBiHeader";
import { ReplicaCanvas } from "./ReplicaCanvas";
import { figmaAssets } from "./figmaAssets";
import type { LeftLibraryItem } from "./leftLibraryCatalog";
import { ReplicaLeftLibrary } from "./ReplicaLeftLibrary";
import { ReplicaRightPanel, type FieldSlotBindings, type RightEditorTab } from "./ReplicaRightPanel";
import { ReplicaToolbar } from "./ReplicaToolbar";
import { TemplateMarketThumbnail } from "./TemplateMarketThumbnail";

function uid() {
  return `w_${Math.random().toString(36).slice(2, 9)}`;
}

function titleForType(t: WidgetType, dragLabel?: string): string {
  if (dragLabel) return dragLabel;
  const map: Record<WidgetType, string> = {
    kpi: "新建指标卡",
    liquid: "水波图",
    table: "明细表",
    bar: "柱形图",
    line: "折线图",
  };
  return map[t];
}

function colSpanForWidgetType(t: WidgetType): 1 | 2 {
  return t === "liquid" || t === "table" || t === "bar" || t === "line" ? 2 : 1;
}

function inferReplicaLayout(item: LeftLibraryItem): CanvasWidget["replicaLayout"] | undefined {
  if (item.widgetType === "table" && /交叉/.test(item.label)) return "irisCrossTable";
  if (item.widgetType === "liquid") return "irisLiquid";
  if (item.widgetType === "kpi" && /(指标看板|指标趋势|翻牌)/.test(item.label)) return "irisKpis";
  if (item.widgetType === "table" && /(客群|全周期)/.test(item.label)) return "strategyCohortTable";
  return undefined;
}

/** 移动超过该阈值才视为拖拽，避免误触点击 */
const POINTER_DRAG_THRESHOLD_PX = 6;

export function EditorFrame() {
  const [templateIdx, setTemplateIdx] = useState(0);
  const preset = TEMPLATES[templateIdx]!;
  const [dataPanelDatasetId, setDataPanelDatasetId] = useState<string | null>(null);
  const dataset = useMemo(
    () => getDatasetForTemplate(dataPanelDatasetId ?? preset.id),
    [dataPanelDatasetId, preset.id],
  );
  const allDatasets = useMemo(() => listRegisteredDatasets(), []);
  const [activeDashTab, setActiveDashTab] = useState(0);
  const [tabWidgets, setTabWidgets] = useState<CanvasWidget[][]>(() => getInitialTabWidgets(TEMPLATES[0]!));
  const [selectedId, setSelectedId] = useState<string | null>(() => {
    const tw = getInitialTabWidgets(TEMPLATES[0]!);
    return tw[0]?.[0]?.id ?? null;
  });
  const [primaryMeasure, setPrimaryMeasure] = useState<MeasureKey>(() => defaultPrimaryMeasureKey(TEMPLATES[0]!.id));
  const [rightTab, setRightTab] = useState<RightEditorTab>("fields");
  const [marketOpen, setMarketOpen] = useState(false);
  /** 指针从组件库拖向画布时，画布区域高亮 */
  const [canvasPointerOver, setCanvasPointerOver] = useState(false);
  const [fieldBindingsMap, setFieldBindingsMap] = useState<Record<string, FieldSlotBindings>>({});
  const [filterState, setFilterState] = useState<Record<string, string>>(() => defaultFilterState(TEMPLATES[0]!.id));
  /** 假数据刷新代数：递增后画布 KPI / 水波 / 客群表等重新派生 */
  const [mockDataSeed, setMockDataSeed] = useState(0);
  /** 画布投放区 DOM（屏幕坐标 hit-test） */
  const canvasDropZoneRef = useRef<HTMLDivElement | null>(null);
  /** 跟随指针的幽灵：图标 + 名称 */
  const [pointerGhost, setPointerGhost] = useState<null | { x: number; y: number; label: string; spriteClass: string }>(
    null,
  );

  const canvasWidgets = useMemo(() => tabWidgets[activeDashTab] ?? [], [tabWidgets, activeDashTab]);

  const selected = useMemo(() => canvasWidgets.find((w) => w.id === selectedId) ?? null, [canvasWidgets, selectedId]);
  const slotBindings = selectedId ? fieldBindingsMap[selectedId] ?? {} : {};

  useEffect(() => {
    const keys = new Set(dataset.measures.map((m) => m.key));
    setPrimaryMeasure((prev) => (keys.has(prev) ? prev : dataset.measures[0]!.key));
  }, [dataset]);

  useEffect(() => {
    setFilterState(defaultFilterState(preset.id));
  }, [preset.id]);

  useEffect(() => {
    setDataPanelDatasetId(null);
    setMockDataSeed(0);
  }, [preset.id]);

  useEffect(() => {
    const cur = tabWidgets[activeDashTab] ?? [];
    setSelectedId((prev) => (prev && cur.some((w) => w.id === prev) ? prev : cur[0]?.id ?? null));
  }, [activeDashTab, tabWidgets]);

  const applyTemplate = useCallback((idx: number) => {
    const p = TEMPLATES[idx];
    if (!p) return;
    setTemplateIdx(idx);
    const tw = getInitialTabWidgets(p);
    setTabWidgets(tw);
    setSelectedId(tw[0]?.[0]?.id ?? null);
    setActiveDashTab(0);
    setMarketOpen(false);
    setFieldBindingsMap({});
    setMockDataSeed(0);
    setDataPanelDatasetId(null);
  }, []);

  const bumpMockData = useCallback(() => {
    setMockDataSeed((s) => s + 1);
  }, []);

  const onApplyLibraryChart = useCallback(
    (item: LeftLibraryItem) => {
      if (!selectedId) return;
      const layout = inferReplicaLayout(item);
      setTabWidgets((prev) => {
        const next = prev.map((row) => [...row]);
        const row = [...(next[activeDashTab] ?? [])];
        const i = row.findIndex((w) => w.id === selectedId);
        if (i === -1) return prev;
        const { replicaLayout: _drop, ...rest } = row[i]!;
        row[i] = {
          ...rest,
          type: item.widgetType,
          libraryLabel: item.label,
          title: titleForType(item.widgetType, item.label),
          colSpan: colSpanForWidgetType(item.widgetType),
          ...(layout ? { replicaLayout: layout } : {}),
        } as CanvasWidget;
        next[activeDashTab] = row;
        return next;
      });
      setFieldBindingsMap((prev) => ({ ...prev, [selectedId]: {} }));
    },
    [selectedId, activeDashTab],
  );

  const onAssignSlot = useCallback(
    (slotId: string, field: FieldRef) => {
      if (!selectedId) return;
      setFieldBindingsMap((prev) => ({
        ...prev,
        [selectedId]: { ...prev[selectedId], [slotId]: field },
      }));
    },
    [selectedId],
  );

  const onClearSlot = useCallback(
    (slotId: string) => {
      if (!selectedId) return;
      setFieldBindingsMap((prev) => {
        const next = { ...prev[selectedId] };
        delete next[slotId];
        return { ...prev, [selectedId]: next };
      });
    },
    [selectedId],
  );

  const onLibraryPointerDragStart = useCallback(
    (e: React.PointerEvent, widgetType: WidgetType, title: string | undefined, spriteClass: string) => {
    if (e.button !== 0) return;
    e.preventDefault();
    const startX = e.clientX;
    const startY = e.clientY;
    let moved = false;
    const libraryLabel = title;
    const ghostLabel = title ?? titleForType(widgetType);

    const onMove = (ev: PointerEvent) => {
      const dx = ev.clientX - startX;
      const dy = ev.clientY - startY;
      if (dx * dx + dy * dy < POINTER_DRAG_THRESHOLD_PX * POINTER_DRAG_THRESHOLD_PX) return;
      moved = true;
      setPointerGhost({ x: ev.clientX, y: ev.clientY, label: ghostLabel, spriteClass });
      const r = canvasDropZoneRef.current?.getBoundingClientRect();
      const over = !!(
        r &&
        ev.clientX >= r.left &&
        ev.clientX <= r.right &&
        ev.clientY >= r.top &&
        ev.clientY <= r.bottom
      );
      setCanvasPointerOver(over);
    };

    let finished = false;
    const onUp = (ev: PointerEvent) => {
      if (finished) return;
      finished = true;
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
      setPointerGhost(null);
      setCanvasPointerOver(false);
      if (!moved) return;
      const r = canvasDropZoneRef.current?.getBoundingClientRect();
      if (
        !r ||
        ev.clientX < r.left ||
        ev.clientX > r.right ||
        ev.clientY < r.top ||
        ev.clientY > r.bottom
      ) {
        return;
      }
      const nw: CanvasWidget = {
        id: uid(),
        type: widgetType,
        title: titleForType(widgetType, title),
        libraryLabel: libraryLabel ?? title,
        colSpan:
          widgetType === "liquid" || widgetType === "table" || widgetType === "bar" || widgetType === "line" ? 2 : 1,
      };
      setTabWidgets((prev) => {
        const next = prev.map((row) => [...row]);
        const row = [...(next[activeDashTab] ?? [])];
        row.push(nw);
        next[activeDashTab] = row;
        return next;
      });
      setSelectedId(nw.id);
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
  },
  [activeDashTab],
);

  return (
    <div
      className="flex h-[918px] w-[1920px] shrink-0 flex-col overflow-hidden rounded-sm border border-figma-line bg-white shadow-md"
      data-figma-frame="2:4671"
    >
      <ReplicaBiHeader />
      <ReplicaToolbar onOpenTemplateMarket={() => setMarketOpen(true)} />

      <div className="flex min-h-0 flex-1 w-full shrink-0">
        <ReplicaLeftLibrary onLibraryPointerDragStart={onLibraryPointerDragStart} />
        <ReplicaCanvas
          preset={preset}
          dataset={dataset}
          pageTitle={preset.pageTitle ?? preset.name}
          dashTabLabel={preset.dashboardTabs[activeDashTab]}
          activeDashTab={activeDashTab}
          onDashTab={setActiveDashTab}
          widgets={canvasWidgets}
          selectedId={selectedId}
          onSelectWidget={setSelectedId}
          primaryMeasure={primaryMeasure}
          dragOver={canvasPointerOver}
          dropZoneRef={canvasDropZoneRef}
          dataSeed={mockDataSeed}
          slotBindingsByWidget={fieldBindingsMap}
          templateId={preset.id}
          filterState={filterState}
          onFilterChange={(id, v) => setFilterState((s) => ({ ...s, [id]: v }))}
          onFilterQuery={bumpMockData}
        />
        <ReplicaRightPanel
          tab={rightTab}
          onTab={setRightTab}
          selected={selected}
          dataset={dataset}
          primaryMeasure={primaryMeasure}
          onPrimaryMeasure={setPrimaryMeasure}
          slotBindings={slotBindings}
          onAssignSlot={onAssignSlot}
          onClearSlot={onClearSlot}
          onDataUpdate={bumpMockData}
          allDatasets={allDatasets}
          activeDatasetTemplateId={dataset.templateId}
          onSelectDataPanelDataset={setDataPanelDatasetId}
          onApplyLibraryChart={onApplyLibraryChart}
        />
      </div>

      {pointerGhost && (
        <div
          className="pointer-events-none fixed z-[10000] flex w-[52px] flex-col items-center gap-px rounded-lg border border-black/[0.08] bg-white py-1.5 shadow-lg"
          style={{ left: pointerGhost.x + 12, top: pointerGhost.y + 12 }}
        >
          <div className="relative size-[30px] shrink-0 overflow-hidden">
            <img
              alt=""
              src={figmaAssets.leftSprite}
              draggable={false}
              className={`pointer-events-none max-w-none select-none ${pointerGhost.spriteClass}`}
              style={{ WebkitUserDrag: "none" }}
            />
          </div>
          <span className="max-w-[52px] select-none px-0.5 text-center font-['Inter',sans-serif] text-[10.8px] leading-[18.9px] text-figma-sub">
            {pointerGhost.label}
          </span>
        </div>
      )}

      {marketOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="max-h-[90vh] w-full max-w-lg overflow-hidden rounded-lg bg-white shadow-xl">
            <div className="flex items-center justify-between border-b px-4 py-3">
              <span className="text-sm font-semibold">模板市场</span>
              <button type="button" className="text-neutral-400 hover:text-neutral-700" onClick={() => setMarketOpen(false)}>
                ✕
              </button>
            </div>
            <div className="grid gap-3 p-4 sm:grid-cols-2">
              {TEMPLATES.map((t, i) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => applyTemplate(i)}
                  className={`rounded-lg border p-3 text-left text-xs transition hover:border-primary ${
                    templateIdx === i ? "border-primary bg-blue-50/50" : "border-border"
                  }`}
                >
                  <div className="font-semibold text-neutral-900">{t.name}</div>
                  <div className="mt-1 text-[11px] text-neutral-500">{t.description}</div>
                  <TemplateMarketThumbnail preset={t} />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
