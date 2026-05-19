import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  CanvasWidget,
  MeasureKey,
  TEMPLATES,
  WidgetType,
} from "../model/dashboardModel";
import type { FieldRef } from "../model/fieldRef";
import type { CustomerFilterState } from "../model/customerFilters";
import { defaultFilterState } from "../model/templateFilters";
import { getInitialTabWidgets } from "../model/templateTabWidgets";
import { defaultPrimaryMeasureKey, getDatasetForTemplate, listRegisteredDatasets } from "../model/templateDatasets";
import { ReplicaBiHeader } from "./ReplicaBiHeader";
import { DEFAULT_EDITOR_UI_MODE, type EditorUiMode } from "./editorUiMode";
import { ReplicaCanvas } from "./ReplicaCanvas";
import { figmaAssets } from "./figmaAssets";
import type { LeftLibraryItem } from "./leftLibraryCatalog";
import { ReplicaLeftLibrary, type LeftRailPanel } from "./ReplicaLeftLibrary";
import { fieldRefKey } from "./chartFieldSlots";
import { ReplicaRightPanel, type FieldSlotBindings, type RightEditorTab } from "./ReplicaRightPanel";
import { QueryConditionModal } from "./QueryConditionModal";
import { GlobalDatasetReplaceModal, remapFieldRefWithMap } from "./GlobalDatasetReplaceModal";
import { ReplicaToolbar } from "./ReplicaToolbar";
import { TemplateMarketListRow } from "./TemplateMarketListRow";
import { buildDefaultFieldBindingsMap, buildWidgetPrimaryMeasureDefaults, defaultFieldBindingsForWidget } from "./defaultFieldBindings";

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
  if (item.widgetType === "kpi" && /指标拆解/.test(item.label)) return "metricBreakdownTree";
  /** 若类型推断曾偏差，仍按名称纠正为拆解树 / 进度水波 */
  if (/指标拆解/.test(item.label)) return "metricBreakdownTree";
  if (/进度条|水波/.test(item.label)) return "irisLiquid";
  return undefined;
}

/** 移动超过该阈值才视为拖拽，避免误触点击 */
const POINTER_DRAG_THRESHOLD_PX = 6;

const FILTER_FIELD_MAX = 12;

const BLANK_TEMPLATE_INDEX = TEMPLATES.findIndex((t) => t.id === "blank");

/** 根据指针 Y 与各卡片垂直中线，决定库拖入插入下标（中线之上插入其前，否则继续向下） */
function computeLibraryDropInsertIndex(ev: PointerEvent, dropZone: HTMLElement | null, listLen: number): number {
  if (!dropZone || listLen <= 0) return 0;
  const cards = Array.from(dropZone.querySelectorAll<HTMLElement>("[data-widget-index]")).sort(
    (a, b) => Number(a.getAttribute("data-widget-index") ?? 0) - Number(b.getAttribute("data-widget-index") ?? 0),
  );
  if (cards.length === 0) return 0;
  for (let i = 0; i < cards.length; i++) {
    const rect = cards[i]!.getBoundingClientRect();
    const midY = rect.top + rect.height / 2;
    if (ev.clientY < midY) return i;
  }
  return listLen;
}

function initialEditorCanvasState(templateIndex: number) {
  const p = TEMPLATES[templateIndex] ?? TEMPLATES[0]!;
  const tw = getInitialTabWidgets(p);
  return {
    tabWidgets: tw,
    fieldBindingsMap: buildDefaultFieldBindingsMap(p.id, tw),
    widgetPrimaryMeasureById: buildWidgetPrimaryMeasureDefaults(tw, p.id),
    firstWidgetId: tw[0]?.[0]?.id ?? null,
  };
}

export type EditorFrameProps = {
  initialTemplateIdx?: number;
  onBackToHome?: () => void;
};

export function EditorFrame({ initialTemplateIdx = 0, onBackToHome }: EditorFrameProps) {
  const startIdx = Math.min(Math.max(0, initialTemplateIdx), TEMPLATES.length - 1);
  const _initCanvas = useMemo(() => initialEditorCanvasState(startIdx), [startIdx]);
  const [templateIdx, setTemplateIdx] = useState(startIdx);
  const preset = TEMPLATES[templateIdx]!;
  const [dataPanelDatasetId, setDataPanelDatasetId] = useState<string | null>(null);
  const dataset = useMemo(
    () => getDatasetForTemplate(dataPanelDatasetId ?? preset.id),
    [dataPanelDatasetId, preset.id],
  );
  const allDatasets = useMemo(() => listRegisteredDatasets(), []);
  const [activeDashTab, setActiveDashTab] = useState(0);
  const [tabWidgets, setTabWidgets] = useState<CanvasWidget[][]>(() => _initCanvas.tabWidgets);
  const [selectedId, setSelectedId] = useState<string | null>(_initCanvas.firstWidgetId);
  const [primaryMeasure, setPrimaryMeasure] = useState<MeasureKey>(() =>
    defaultPrimaryMeasureKey(TEMPLATES[startIdx]!.id),
  );
  const [rightTab, setRightTab] = useState<RightEditorTab>("fields");
  const [marketOpen, setMarketOpen] = useState(false);
  const [datasetReplaceOpen, setDatasetReplaceOpen] = useState(false);
  const [leftRailPanel, setLeftRailPanel] = useState<LeftRailPanel>("templates");
  const [queryModalOpen, setQueryModalOpen] = useState(false);
  const [queryModalKind, setQueryModalKind] = useState<"simple" | "composite">("simple");
  const [uiMode, setUiMode] = useState<EditorUiMode>(DEFAULT_EDITOR_UI_MODE);
  const [autoUpdate, setAutoUpdate] = useState(true);

  useEffect(() => {
    if (uiMode === "simple" && rightTab !== "fields") {
      setRightTab("fields");
    }
  }, [uiMode, rightTab]);

  /** 指针从组件库拖向画布时，画布区域高亮 */
  const [canvasPointerOver, setCanvasPointerOver] = useState(false);
  const [fieldBindingsMap, setFieldBindingsMap] = useState<Record<string, FieldSlotBindings>>(() => _initCanvas.fieldBindingsMap);
  const [filterFieldsByWidgetId, setFilterFieldsByWidgetId] = useState<Record<string, FieldRef[]>>({});
  const [widgetPrimaryMeasureById, setWidgetPrimaryMeasureById] = useState<Record<string, MeasureKey>>(
    () => _initCanvas.widgetPrimaryMeasureById,
  );
  const [widgetDataSeedById, setWidgetDataSeedById] = useState<Record<string, number>>({});
  const [filterState, setFilterState] = useState<CustomerFilterState>(() => defaultFilterState());
  /** 画布投放区 DOM（屏幕坐标 hit-test） */
  const canvasDropZoneRef = useRef<HTMLDivElement | null>(null);
  /** 跟随指针的幽灵：图标 + 名称 */
  const [pointerGhost, setPointerGhost] = useState<null | { x: number; y: number; label: string; spriteClass: string }>(
    null,
  );

  const canvasWidgets = useMemo(() => tabWidgets[activeDashTab] ?? [], [tabWidgets, activeDashTab]);
  const canvasWidgetsRef = useRef<CanvasWidget[]>([]);
  canvasWidgetsRef.current = canvasWidgets;

  /** 自助查询模板使用全画布形态：隐藏左右栏、顶部工具条、全局筛选与图表自带工具栏 */
  const isFullCanvasTemplate = preset.id === "self-service-query";

  const selected = useMemo(() => canvasWidgets.find((w) => w.id === selectedId) ?? null, [canvasWidgets, selectedId]);
  const slotBindings = selectedId ? fieldBindingsMap[selectedId] ?? {} : {};
  const filterFieldsForSelected = selectedId ? filterFieldsByWidgetId[selectedId] ?? [] : [];

  useEffect(() => {
    if (selectedId) setRightTab("fields");
  }, [selectedId]);
  const dataPanelPrimaryMeasure = useMemo(
    () =>
      selectedId ? (widgetPrimaryMeasureById[selectedId] ?? defaultPrimaryMeasureKey(preset.id)) : primaryMeasure,
    [selectedId, widgetPrimaryMeasureById, primaryMeasure, preset.id],
  );

  const usedDatasetTemplateIds = useMemo(
    () => (preset.id === "cockpit" ? ["cockpit", "iris-demo"] : [preset.id]),
    [preset.id],
  );

  const templateToolbarEntries = useMemo(() => TEMPLATES.map((t, idx) => ({ name: t.name, idx })), []);

  useEffect(() => {
    const keys = new Set(dataset.measures.map((m) => m.key));
    const fallback = dataset.measures[0]!.key;
    setPrimaryMeasure((prev) => (keys.has(prev) ? prev : fallback));
    setWidgetPrimaryMeasureById((pm) => {
      let changed = false;
      const next = { ...pm };
      for (const id of Object.keys(next)) {
        if (!keys.has(next[id]!)) {
          next[id] = fallback;
          changed = true;
        }
      }
      return changed ? next : pm;
    });
  }, [dataset]);

  useEffect(() => {
    setFilterState(defaultFilterState(preset.id));
  }, [preset.id]);

  useEffect(() => {
    setDataPanelDatasetId(null);
    setWidgetDataSeedById({});
  }, [preset.id]);

  useEffect(() => {
    const cur = tabWidgets[activeDashTab] ?? [];
    setSelectedId((prev) => (prev && cur.some((w) => w.id === prev) ? prev : cur[0]?.id ?? null));
  }, [activeDashTab, tabWidgets]);

  const applyDatasetReplace = useCallback(
    (targetTemplateId: string, fieldMap: Record<string, string>) => {
      const target = getDatasetForTemplate(targetTemplateId);
      setDataPanelDatasetId(targetTemplateId);
      const mapOne = (f: FieldRef) => remapFieldRefWithMap(f, target, fieldMap);
      setFieldBindingsMap((prev) => {
        const next: Record<string, FieldSlotBindings> = {};
        for (const [wid, slots] of Object.entries(prev)) {
          const slotsNext: FieldSlotBindings = {};
          for (const [sk, arr] of Object.entries(slots)) {
            slotsNext[sk] = (arr ?? []).map(mapOne);
          }
          next[wid] = slotsNext;
        }
        return next;
      });
      setFilterFieldsByWidgetId((prev) => {
        const next: Record<string, FieldRef[]> = {};
        for (const [wid, arr] of Object.entries(prev)) {
          next[wid] = (arr ?? []).map(mapOne);
        }
        return next;
      });
      setPrimaryMeasure((pm) => {
        const m0 = dataset.measures.find((m) => m.key === pm);
        const mapped = mapOne({ kind: "measure", key: pm, label: m0?.label ?? pm, semantic: "number" });
        return mapped.key as MeasureKey;
      });
      setWidgetPrimaryMeasureById((wip) => {
        const n = { ...wip };
        for (const wid of Object.keys(n)) {
          const k = n[wid]!;
          const m0 = dataset.measures.find((m) => m.key === k);
          n[wid] = mapOne({ kind: "measure", key: k, label: m0?.label ?? k, semantic: "number" }).key as MeasureKey;
        }
        return n;
      });
      setDatasetReplaceOpen(false);
    },
    [dataset],
  );

  const applyTemplate = useCallback((idx: number) => {
    const p = TEMPLATES[idx];
    if (!p) return;
    setTemplateIdx(idx);
    const tw = getInitialTabWidgets(p);
    setTabWidgets(tw);
    setSelectedId(tw[0]?.[0]?.id ?? null);
    setActiveDashTab(0);
    setMarketOpen(false);
    setFieldBindingsMap(buildDefaultFieldBindingsMap(p.id, tw));
    setFilterFieldsByWidgetId({});
    setWidgetDataSeedById({});
    setWidgetPrimaryMeasureById(buildWidgetPrimaryMeasureDefaults(tw, p.id));
    setFilterState(defaultFilterState(p.id));
    setDataPanelDatasetId(null);
  }, []);

  const bumpMockData = useCallback(() => {
    if (!selectedId) return;
    setWidgetDataSeedById((s) => ({ ...s, [selectedId]: (s[selectedId] ?? 0) + 1 }));
  }, [selectedId]);

  const bumpAllWidgetMockData = useCallback(() => {
    setWidgetDataSeedById((prev) => {
      const next = { ...prev };
      for (const w of canvasWidgets) {
        next[w.id] = (next[w.id] ?? 0) + 1;
      }
      return next;
    });
  }, [canvasWidgets]);

  const onCustomerFilterChange = useCallback(
    (filterId: keyof CustomerFilterState, value: string[]) => {
      setFilterState((s) => ({ ...s, [filterId]: value }));
      setWidgetDataSeedById((prev) => {
        const next = { ...prev };
        for (const w of canvasWidgetsRef.current) {
          next[w.id] = (next[w.id] ?? 0) + 1;
        }
        return next;
      });
    },
    [],
  );

  const maybeAutoUpdate = useCallback(() => {
    if (autoUpdate) bumpMockData();
  }, [autoUpdate, bumpMockData]);

  const onReorderWidgets = useCallback(
    (fromIndex: number, toIndex: number) => {
      if (fromIndex === toIndex) return;
      setTabWidgets((prev) => {
        const next = prev.map((r) => [...r]);
        const row = [...(next[activeDashTab] ?? [])];
        if (fromIndex < 0 || fromIndex >= row.length || toIndex < 0 || toIndex >= row.length) return prev;
        const [item] = row.splice(fromIndex, 1);
        let insertAt = toIndex;
        if (fromIndex < toIndex) insertAt -= 1;
        insertAt = Math.max(0, Math.min(insertAt, row.length));
        row.splice(insertAt, 0, item!);
        next[activeDashTab] = row;
        return next;
      });
    },
    [activeDashTab],
  );

  const onDeleteWidget = useCallback(
    (widgetId: string) => {
      setTabWidgets((prev) => {
        const next = prev.map((row) => [...row]);
        const row = [...(next[activeDashTab] ?? [])];
        const idx = row.findIndex((w) => w.id === widgetId);
        if (idx === -1) return prev;
        row.splice(idx, 1);
        next[activeDashTab] = row;
        return next;
      });
      setSelectedId((cur) => (cur === widgetId ? null : cur));
      setFieldBindingsMap((prev) => {
        const n = { ...prev };
        delete n[widgetId];
        return n;
      });
      setFilterFieldsByWidgetId((prev) => {
        const n = { ...prev };
        delete n[widgetId];
        return n;
      });
      setWidgetPrimaryMeasureById((prev) => {
        const n = { ...prev };
        delete n[widgetId];
        return n;
      });
      setWidgetDataSeedById((prev) => {
        const n = { ...prev };
        delete n[widgetId];
        return n;
      });
    },
    [activeDashTab],
  );

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
      setFilterFieldsByWidgetId((prev) => {
        const next = { ...prev };
        delete next[selectedId];
        return next;
      });
    },
    [selectedId, activeDashTab],
  );

  const onAssignSlot = useCallback(
    (slotId: string, field: FieldRef, mode: "append" | "replace") => {
      if (!selectedId) return;
      setFieldBindingsMap((prev) => {
        const cur = { ...(prev[selectedId] ?? {}) };
        const prevArr = cur[slotId] ?? [];
        cur[slotId] = mode === "append" ? [...prevArr, field] : [field];
        return { ...prev, [selectedId]: cur };
      });
    },
    [selectedId],
  );

  const onRemoveSlotField = useCallback((slotId: string, index: number) => {
    if (!selectedId) return;
    setFieldBindingsMap((prev) => {
      const cur = { ...(prev[selectedId] ?? {}) };
      const arr = [...(cur[slotId] ?? [])];
      arr.splice(index, 1);
      if (arr.length) cur[slotId] = arr;
      else delete cur[slotId];
      return { ...prev, [selectedId]: cur };
    });
  }, [selectedId]);

  const onClearSlot = useCallback(
    (slotId: string) => {
      if (!selectedId) return;
      setFieldBindingsMap((prev) => {
        const next = { ...(prev[selectedId] ?? {}) };
        delete next[slotId];
        return { ...prev, [selectedId]: next };
      });
    },
    [selectedId],
  );

  const onAddFilterField = useCallback(
    (field: FieldRef) => {
      if (!selectedId) return;
      const fk = fieldRefKey(field);
      setFilterFieldsByWidgetId((prev) => {
        const cur = prev[selectedId] ?? [];
        if (cur.some((x) => fieldRefKey(x) === fk)) return prev;
        if (cur.length >= FILTER_FIELD_MAX) return prev;
        return { ...prev, [selectedId]: [...cur, field] };
      });
    },
    [selectedId],
  );

  const onRemoveFilterField = useCallback(
    (index: number) => {
      if (!selectedId) return;
      setFilterFieldsByWidgetId((prev) => {
        const cur = [...(prev[selectedId] ?? [])];
        cur.splice(index, 1);
        const next = { ...prev };
        if (cur.length) next[selectedId] = cur;
        else delete next[selectedId];
        return next;
      });
    },
    [selectedId],
  );

  const onClearFilterFields = useCallback(() => {
    if (!selectedId) return;
    setFilterFieldsByWidgetId((prev) => {
      const next = { ...prev };
      delete next[selectedId];
      return next;
    });
  }, [selectedId]);

  const onPrimaryMeasureFromPanel = useCallback(
    (k: MeasureKey) => {
      if (selectedId) setWidgetPrimaryMeasureById((pm) => ({ ...pm, [selectedId]: k }));
      else setPrimaryMeasure(k);
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
      const libItem: LeftLibraryItem = { label: ghostLabel, spriteClass, widgetType };
      const layout = inferReplicaLayout(libItem);
      const nw: CanvasWidget = {
        id: uid(),
        type: widgetType,
        title: titleForType(widgetType, title),
        libraryLabel: libraryLabel ?? title,
        colSpan:
          widgetType === "liquid" || widgetType === "table" || widgetType === "bar" || widgetType === "line" ? 2 : 1,
        ...(layout ? { replicaLayout: layout } : {}),
      };
      const insertAt = computeLibraryDropInsertIndex(ev, canvasDropZoneRef.current, canvasWidgetsRef.current.length);
      setTabWidgets((prev) => {
        const next = prev.map((row) => [...row]);
        const row = [...(next[activeDashTab] ?? [])];
        const at = Math.min(Math.max(0, insertAt), row.length);
        row.splice(at, 0, nw);
        next[activeDashTab] = row;
        return next;
      });
      setSelectedId(nw.id);
      setWidgetPrimaryMeasureById((pm) => ({ ...pm, [nw.id]: defaultPrimaryMeasureKey(preset.id) }));
      setWidgetDataSeedById((s) => ({ ...s, [nw.id]: 0 }));
      setFieldBindingsMap((prev) => ({
        ...prev,
        [nw.id]: defaultFieldBindingsForWidget(nw, preset.id, dataset),
      }));
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
  },
  [activeDashTab, dataset, preset.id],
);

  return (
    <div
      className="flex h-[918px] w-[1920px] shrink-0 flex-col overflow-hidden rounded-sm border border-figma-line bg-white shadow-md"
      data-figma-frame="2:4671"
    >
      <ReplicaBiHeader uiMode={uiMode} onUiModeChange={setUiMode} onBackToHome={onBackToHome} />
      {!isFullCanvasTemplate ? (
        <ReplicaToolbar activeRail={leftRailPanel} onRailChange={setLeftRailPanel} uiMode={uiMode} />
      ) : null}

      <div className="flex min-h-0 flex-1 w-full shrink-0">
        {!isFullCanvasTemplate ? (
          <ReplicaLeftLibrary
            panel={leftRailPanel}
            templates={TEMPLATES}
            currentTemplateIdx={templateIdx}
            templateEntries={templateToolbarEntries}
            blankTemplateIndex={BLANK_TEMPLATE_INDEX}
            onApplyTemplate={applyTemplate}
            onOpenTemplateMarketFull={() => setMarketOpen(true)}
            onOpenDatasetReplace={() => setDatasetReplaceOpen(true)}
            onOpenQueryConditionModal={(kind) => {
              setQueryModalKind(kind);
              setQueryModalOpen(true);
            }}
            onLibraryPointerDragStart={onLibraryPointerDragStart}
          />
        ) : null}
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
          widgetPrimaryMeasureById={widgetPrimaryMeasureById}
          widgetDataSeedById={widgetDataSeedById}
          dragOver={canvasPointerOver}
          dropZoneRef={canvasDropZoneRef}
          slotBindingsByWidget={fieldBindingsMap}
          filterState={filterState}
          onFilterChange={onCustomerFilterChange}
          onFilterQuery={bumpAllWidgetMockData}
          onReorderWidgets={isFullCanvasTemplate ? undefined : onReorderWidgets}
          onDeleteWidget={isFullCanvasTemplate ? undefined : onDeleteWidget}
          hideGlobalFilterBar={isFullCanvasTemplate}
          hideWidgetToolbar={isFullCanvasTemplate}
        />
        {!isFullCanvasTemplate ? (
          <ReplicaRightPanel
            tab={rightTab}
            onTab={setRightTab}
            uiMode={uiMode}
            selected={selected}
            dataset={dataset}
            primaryMeasure={dataPanelPrimaryMeasure}
            onPrimaryMeasure={onPrimaryMeasureFromPanel}
            slotBindings={slotBindings}
            onAssignSlot={onAssignSlot}
            onClearSlot={onClearSlot}
            onRemoveSlotField={onRemoveSlotField}
            filterFields={filterFieldsForSelected}
            onAddFilterField={onAddFilterField}
            onRemoveFilterField={onRemoveFilterField}
            onClearFilterFields={onClearFilterFields}
            onDataUpdate={bumpMockData}
            allDatasets={allDatasets}
            usedDatasetTemplateIds={usedDatasetTemplateIds}
            onSelectDataPanelDataset={setDataPanelDatasetId}
            onApplyLibraryChart={onApplyLibraryChart}
            autoUpdate={autoUpdate}
            onAutoUpdateChange={setAutoUpdate}
          />
        ) : null}
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

      <QueryConditionModal
        open={queryModalOpen}
        datasetName={dataset.datasetName}
        chartTitles={canvasWidgets.map((w) => w.title)}
        onClose={() => setQueryModalOpen(false)}
        onConfirm={() => {
          if (queryModalKind !== "composite") return;
          const nw: CanvasWidget = {
            id: uid(),
            type: "kpi",
            title: "复合式查询",
            libraryLabel: "复合式查询",
            colSpan: 2,
            replicaLayout: "compoundQuery",
          };
          setTabWidgets((prev) => {
            const next = prev.map((row) => [...row]);
            const row = [...(next[activeDashTab] ?? [])];
            row.push(nw);
            next[activeDashTab] = row;
            return next;
          });
          setSelectedId(nw.id);
          setWidgetPrimaryMeasureById((pm) => ({ ...pm, [nw.id]: primaryMeasure }));
          setWidgetDataSeedById((s) => ({ ...s, [nw.id]: 0 }));
        }}
      />

      <GlobalDatasetReplaceModal
        open={datasetReplaceOpen}
        onClose={() => setDatasetReplaceOpen(false)}
        sourceDataset={dataset}
        allDatasets={allDatasets}
        usedCount={1}
        onConfirm={applyDatasetReplace}
      />

      {marketOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 p-4"
          role="dialog"
          aria-modal="true"
        >
            <div className="flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-lg bg-white shadow-xl">
            <div className="flex items-center justify-between border-b px-4 py-3">
              <span className="text-sm font-semibold">模板市场</span>
              <button type="button" className="text-neutral-400 hover:text-neutral-700" onClick={() => setMarketOpen(false)}>
                ✕
              </button>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto p-4">
              <div className="flex flex-col gap-3">
                {TEMPLATES.map((t, i) => (
                  <TemplateMarketListRow
                    key={t.id}
                    preset={t}
                    selected={templateIdx === i}
                    onSelect={() => applyTemplate(i)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
