import { useCallback, useEffect, useMemo, useState } from "react";
import type { CanvasWidget, MeasureKey } from "../model/dashboardModel";
import { BI_FIELD_MIME, parseFieldRef, serializeFieldRef, type FieldRef } from "../model/fieldRef";
import type { TemplateDatasetDef } from "../model/templateDatasets";
import {
  fieldRefKey,
  getFieldSlotsForWidget,
  slotAcceptsField,
  slotBindingHasField,
  slotCanReceiveField,
  slotMaxCount,
  type FieldSlotDef,
} from "./chartFieldSlots";
import { chartKindDisplayName, getChartConfigKind, type ChartConfigKind } from "./chartConfig";
import { DimensionIconBySemantic, DimensionStringIcon, Measure123Icon } from "./FieldTypeIcon";
import type { LeftLibraryItem } from "./leftLibraryCatalog";
import {
  AnalysisTabPanel,
  ChartSwitchDropdown,
  DatasetPaneHeader,
  StyleTabPanel,
} from "./rightPanelMenus";
import type { EditorUiMode } from "./editorUiMode";
import { isComplexEditorMode } from "./editorUiMode";

export type RightEditorTab = "fields" | "style" | "analysis";

export type FieldSlotBindings = Record<string, FieldRef[]>;

export type ReplicaRightPanelProps = {
  tab: RightEditorTab;
  onTab: (t: RightEditorTab) => void;
  selected: CanvasWidget | null;
  dataset: TemplateDatasetDef;
  primaryMeasure: MeasureKey;
  onPrimaryMeasure: (k: MeasureKey) => void;
  /** 当前选中图表的字段槽绑定 */
  slotBindings: FieldSlotBindings;
  onAssignSlot: (slotId: string, field: FieldRef, mode: "append" | "replace") => void;
  onClearSlot: (slotId: string) => void;
  onRemoveSlotField: (slotId: string, index: number) => void;
  /** 当前选中图表的过滤器字段（多选） */
  filterFields: FieldRef[];
  onAddFilterField: (field: FieldRef) => void;
  onRemoveFilterField: (index: number) => void;
  onClearFilterFields: () => void;
  onDataUpdate?: () => void;
  allDatasets: TemplateDatasetDef[];
  usedDatasetTemplateIds: string[];
  onSelectDataPanelDataset: (templateId: string) => void;
  onApplyLibraryChart: (item: LeftLibraryItem) => void;
  uiMode?: EditorUiMode;
  autoUpdate: boolean;
  onAutoUpdateChange: (v: boolean) => void;
};

function fieldAggSuffix(f: FieldRef): string {
  return f.kind === "measure" ? "求和" : "无聚合";
}

/** 槽内已绑定字段：浅底 + 描边 + 图标 + 名称 + 聚合说明 */
function FieldBoundPill({ field, onClear }: { field: FieldRef; onClear: () => void }) {
  const shell =
    field.kind === "measure"
      ? "border-emerald-500/80 bg-emerald-50"
      : field.semantic === "date"
        ? "border-violet-500/75 bg-violet-50"
        : "border-blue-500/80 bg-blue-50";
  const text =
    field.kind === "measure"
      ? "text-emerald-900"
      : field.semantic === "date"
        ? "text-violet-900"
        : "text-blue-900";

  return (
    <div className="flex items-center justify-between gap-2">
      <div className={`flex min-w-0 flex-1 items-center gap-1.5 rounded-md border px-2 py-1 ${shell}`}>
        {field.kind === "measure" ? (
          <Measure123Icon className="!h-4 !min-w-[1.05rem] !text-[9px]" />
        ) : field.semantic === "date" ? (
          <DimensionDateIconPill className={text} />
        ) : (
          <DimensionStringIcon className="!h-4 !min-w-[1.05rem] !rounded !border !border-blue-400/55 !bg-blue-100 !px-1 !text-[9px] !font-bold !uppercase !leading-none !text-blue-900" />
        )}
        <span className={`min-w-0 truncate text-[11px] font-medium leading-snug ${text}`}>
          {field.label}
          <span className="font-normal opacity-90">({fieldAggSuffix(field)})</span>
        </span>
      </div>
      <button type="button" className="shrink-0 text-figma-sub hover:text-red-600" onClick={onClear} title="清除">
        ✕
      </button>
    </div>
  );
}

/** 日期图标在紫色药丸内的紧凑版 */
function DimensionDateIconPill({ className }: { className: string }) {
  return (
    <span
      role="img"
      aria-label="日期维度"
      className={`inline-flex h-4 w-4 shrink-0 items-center justify-center rounded border border-violet-400/55 bg-violet-100 ${className}`}
    >
      <svg width="12" height="12" viewBox="0 0 14 14" fill="none" aria-hidden className="opacity-95">
        <rect x="2" y="3" width="10" height="9" rx="1" stroke="currentColor" strokeWidth="1.2" />
        <path d="M2 6h10" stroke="currentColor" strokeWidth="1.2" />
        <path d="M5 1.5v3M9 1.5v3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    </span>
  );
}

function FieldWellSlot({
  slot,
  fields,
  dragOver,
  dropHint,
  onDragOver,
  onDragLeave,
  onDrop,
  onClearSlot,
  onRemoveAt,
}: {
  slot: FieldSlotDef;
  fields: FieldRef[];
  dragOver: boolean;
  /** 已在数据面板点选字段：该槽可接收时高亮提示 */
  dropHint: boolean;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  onClearSlot: () => void;
  onRemoveAt: (index: number) => void;
}) {
  const multi = slot.multiple && slotMaxCount(slot) > 1;
  const max = slotMaxCount(slot);
  const countBadge =
    slot.showSlotCount || multi || max > 1 ? `${fields.length} / ${max}` : null;
  const showRequiredStar = !slot.optional;
  return (
    <section>
      <div className="mb-2 flex items-center justify-between gap-2">
        <span className="font-medium text-figma-text">
          {showRequiredStar ? <span className="text-red-500">*</span> : null}
          {slot.title}
          {countBadge ? <span className="ml-1 text-[10px] font-normal text-figma-sub">{countBadge}</span> : null}
        </span>
        {multi && fields.length > 0 ? (
          <button type="button" className="shrink-0 text-[10px] text-figma-sub hover:text-primary" onClick={onClearSlot}>
            清空
          </button>
        ) : null}
      </div>
      <div
        className={`relative rounded border border-dashed border-figma-line bg-canvas/80 px-2 py-3 text-[11px] transition ${
          dragOver ? "border-primary bg-blue-50/50 ring-2 ring-primary/40" : ""
        } ${dropHint && !dragOver ? "border-primary/55 bg-primary/[0.07] ring-2 ring-primary/35 shadow-[0_0_0_1px_rgba(22,119,255,0.12)]" : ""}`}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
      >
        {fields.length > 0 ? (
          <div className="space-y-2">
            {fields.map((f, i) => (
              <FieldBoundPill key={`${f.kind}:${f.key}:${i}`} field={f} onClear={() => onRemoveAt(i)} />
            ))}
          </div>
        ) : (
          <div className="text-center text-figma-sub">{slot.emptyPlaceholder ?? "从数据面板拖入字段"}</div>
        )}
      </div>
    </section>
  );
}

function FilterFieldsWell({
  fields,
  dragOver,
  dropHint,
  onDragOver,
  onDragLeave,
  onDrop,
  onRemoveAt,
  onClearAll,
}: {
  fields: FieldRef[];
  dragOver: boolean;
  dropHint: boolean;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  onRemoveAt: (index: number) => void;
  onClearAll: () => void;
}) {
  return (
    <section>
      <div className="mb-2 flex items-center justify-between gap-2">
        <span className="font-medium text-figma-text">过滤器</span>
        {fields.length > 0 ? (
          <button type="button" className="shrink-0 text-[10px] text-figma-sub hover:text-primary" onClick={onClearAll}>
            清空
          </button>
        ) : null}
      </div>
      <div
        className={`rounded border border-dashed border-figma-line bg-canvas/80 px-2 py-3 text-[11px] transition ${
          dragOver ? "border-primary bg-blue-50/50 ring-2 ring-primary/40" : ""
        } ${dropHint && !dragOver ? "border-primary/55 bg-primary/[0.07] ring-2 ring-primary/35" : ""}`}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
      >
        {fields.length > 0 ? (
          <div className="space-y-2">
            {fields.map((f, i) => (
              <FieldBoundPill key={`${f.kind}:${f.key}:${i}`} field={f} onClear={() => onRemoveAt(i)} />
            ))}
          </div>
        ) : (
          <div className="py-3 text-center text-figma-sub">拖拽数据字段至此处</div>
        )}
      </div>
    </section>
  );
}

const FILTER_WELL_MAX = 12;

function FieldsWithSlots({
  chartKind,
  replicaLayout,
  slotBindings,
  pickedField,
  onAssignSlot,
  onClearSlot,
  onRemoveSlotField,
  onConsumePickedField,
}: {
  chartKind: ChartConfigKind;
  replicaLayout?: string;
  slotBindings: FieldSlotBindings;
  pickedField: FieldRef | null;
  onAssignSlot: (slotId: string, field: FieldRef, mode: "append" | "replace") => void;
  onClearSlot: (slotId: string) => void;
  onRemoveSlotField: (slotId: string, index: number) => void;
  /** 成功拖入槽位后清除数据面板的「已选字段」高亮 */
  onConsumePickedField?: () => void;
}) {
  const slots = useMemo(() => getFieldSlotsForWidget(chartKind, replicaLayout), [chartKind, replicaLayout]);
  const [dragSlotId, setDragSlotId] = useState<string | null>(null);

  const handleDragOver = useCallback(
    (slot: FieldSlotDef, e: React.DragEvent) => {
      if (!e.dataTransfer.types.includes(BI_FIELD_MIME)) return;
      e.preventDefault();
      e.dataTransfer.dropEffect = "copy";
      setDragSlotId(slot.id);
    },
    [],
  );

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    const rel = e.relatedTarget;
    if (rel instanceof Node && e.currentTarget.contains(rel)) return;
    setDragSlotId(null);
  }, []);

  const handleDrop = useCallback(
    (slot: FieldSlotDef, e: React.DragEvent) => {
      e.preventDefault();
      setDragSlotId(null);
      const raw = e.dataTransfer.getData(BI_FIELD_MIME);
      const field = parseFieldRef(raw);
      if (!field || !slotAcceptsField(slot, field)) return;
      const current = slotBindings[slot.id] ?? [];
      if (slotBindingHasField(current, field)) return;
      const max = slotMaxCount(slot);
      if (slot.multiple && max > 1) {
        if (current.length >= max) return;
        onAssignSlot(slot.id, field, "append");
      } else {
        onAssignSlot(slot.id, field, "replace");
      }
      onConsumePickedField?.();
    },
    [onAssignSlot, slotBindings, onConsumePickedField],
  );

  return (
    <div className="space-y-4">
      {slots.map((slot) => (
        <FieldWellSlot
          key={slot.id}
          slot={slot}
          fields={slotBindings[slot.id] ?? []}
          dragOver={dragSlotId === slot.id}
          dropHint={!!pickedField && slotCanReceiveField(slot, pickedField, slotBindings)}
          onDragOver={(e) => handleDragOver(slot, e)}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(slot, e)}
          onClearSlot={() => onClearSlot(slot.id)}
          onRemoveAt={(index) => onRemoveSlotField(slot.id, index)}
        />
      ))}
    </div>
  );
}

function ChartConfigColumn({
  tab,
  onTab,
  selected,
  uiMode = "simple",
  slotBindings,
  pickedField,
  onConsumePickedField,
  onAssignSlot,
  onClearSlot,
  onRemoveSlotField,
  filterFields,
  onAddFilterField,
  onRemoveFilterField,
  onClearFilterFields,
  onDataUpdate,
  onApplyLibraryChart,
  autoUpdate,
  onAutoUpdateChange,
}: Pick<
  ReplicaRightPanelProps,
  | "tab"
  | "onTab"
  | "selected"
  | "uiMode"
  | "slotBindings"
  | "onAssignSlot"
  | "onClearSlot"
  | "onRemoveSlotField"
  | "filterFields"
  | "onAddFilterField"
  | "onRemoveFilterField"
  | "onClearFilterFields"
  | "onDataUpdate"
  | "onApplyLibraryChart"
  | "autoUpdate"
  | "onAutoUpdateChange"
> & {
  pickedField: FieldRef | null;
  onConsumePickedField: () => void;
}) {
  const showStyleAnalysisTabs = isComplexEditorMode(uiMode);
  const activeTab = showStyleAnalysisTabs ? tab : "fields";
  const [overFilter, setOverFilter] = useState(false);
  const kind = getChartConfigKind(selected);
  const chartLabel = chartKindDisplayName(kind);
  const filterDropHint = useMemo(() => {
    if (!pickedField || !selected) return false;
    if (selected.replicaLayout === "metricBreakdownTree") return false;
    if (filterFields.length >= FILTER_WELL_MAX) return false;
    if (filterFields.some((f) => fieldRefKey(f) === fieldRefKey(pickedField))) return false;
    return true;
  }, [pickedField, selected, filterFields]);

  const onFilterDragOver = useCallback((e: React.DragEvent) => {
    if (!e.dataTransfer.types.includes(BI_FIELD_MIME)) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
    setOverFilter(true);
  }, []);

  const onFilterDragLeave = useCallback((e: React.DragEvent) => {
    const rel = e.relatedTarget;
    if (rel instanceof Node && e.currentTarget.contains(rel)) return;
    setOverFilter(false);
  }, []);

  const onFilterDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setOverFilter(false);
      const raw = e.dataTransfer.getData(BI_FIELD_MIME);
      const field = parseFieldRef(raw);
      if (!field) return;
      onAddFilterField(field);
      onConsumePickedField();
    },
    [onAddFilterField, onConsumePickedField],
  );

  return (
    <div className="flex min-h-0 min-w-0 flex-[1.15] flex-col border-r border-black/[0.06]">
      <div className="flex shrink-0 items-center justify-between border-b border-black/[0.06] px-3 py-2">
        <span className="truncate text-xs font-semibold text-figma-text">
          {selected?.replicaLayout === "metricBreakdownTree" ? selected?.libraryLabel ?? selected?.title : selected?.title ?? "未选择图表"}
        </span>
        <button type="button" className="shrink-0 text-figma-sub hover:text-figma-text">
          ⚙
        </button>
      </div>
      <ChartSwitchDropdown
        displayLabel={selected?.libraryLabel ?? chartLabel}
        selected={selected}
        onPick={onApplyLibraryChart}
      />
      {showStyleAnalysisTabs ? (
        <div className="flex shrink-0 border-b border-black/[0.06]">
          {(["fields", "style", "analysis"] as const).map((k) => (
            <button
              key={k}
              type="button"
              onClick={() => onTab(k)}
              className={`flex-1 py-2 text-center text-xs ${
                activeTab === k ? "border-b-2 border-primary font-medium text-primary" : "text-figma-sub hover:text-figma-text"
              }`}
            >
              {k === "fields" ? "字段" : k === "style" ? "样式" : "分析"}
            </button>
          ))}
        </div>
      ) : null}
      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <div className="min-h-0 flex-1 overflow-y-auto px-3 py-2 text-xs">
          {activeTab === "fields" && (
            <div className="space-y-4">
              {selected ? (
                <FieldsWithSlots
                  chartKind={kind}
                  replicaLayout={selected.replicaLayout}
                  slotBindings={slotBindings}
                  pickedField={pickedField}
                  onAssignSlot={onAssignSlot}
                  onClearSlot={onClearSlot}
                  onRemoveSlotField={onRemoveSlotField}
                  onConsumePickedField={onConsumePickedField}
                />
              ) : (
                <p className="text-figma-sub">请先在画布中选择图表</p>
              )}
              {selected?.replicaLayout !== "metricBreakdownTree" ? (
                <FilterFieldsWell
                  fields={filterFields}
                  dragOver={overFilter}
                  dropHint={filterDropHint}
                  onDragOver={onFilterDragOver}
                  onDragLeave={onFilterDragLeave}
                  onDrop={onFilterDrop}
                  onRemoveAt={onRemoveFilterField}
                  onClearAll={onClearFilterFields}
                />
              ) : null}
              <label className="flex cursor-pointer items-center gap-2 text-figma-text">
                <input
                  type="checkbox"
                  checked={autoUpdate}
                  onChange={(e) => onAutoUpdateChange(e.target.checked)}
                  className="rounded border-figma-line"
                />
                自动更新
              </label>
            </div>
          )}
          {activeTab === "style" && <StyleTabPanel />}
          {activeTab === "analysis" && <AnalysisTabPanel />}
        </div>
        <div className="shrink-0 border-t border-black/[0.06] p-2">
          <button
            type="button"
            disabled={!selected}
            onClick={() => onDataUpdate?.()}
            className="w-full rounded bg-primary py-2.5 text-xs font-medium text-white hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-45"
          >
            更新
          </button>
        </div>
      </div>
    </div>
  );
}

function DataPaneColumn({
  selected,
  primaryMeasure,
  onPrimaryMeasure,
  dataset,
  allDatasets,
  usedDatasetTemplateIds,
  onSelectDataPanelDataset,
  pickedField,
  onTogglePickField,
  onPickField,
  onClearPickedField,
}: {
  selected: CanvasWidget | null;
  primaryMeasure: MeasureKey;
  onPrimaryMeasure: (k: MeasureKey) => void;
  dataset: TemplateDatasetDef;
  allDatasets: TemplateDatasetDef[];
  usedDatasetTemplateIds: string[];
  onSelectDataPanelDataset: (templateId: string) => void;
  pickedField: FieldRef | null;
  onTogglePickField: (f: FieldRef) => void;
  onPickField: (f: FieldRef) => void;
  onClearPickedField: () => void;
}) {
  const onDragStartDimension = (d: (typeof dataset.dimensions)[0]) => (e: React.DragEvent) => {
    const ref: FieldRef = { kind: "dimension", key: d.key, label: d.label, semantic: d.semantic };
    e.dataTransfer.setData(BI_FIELD_MIME, serializeFieldRef(ref));
    e.dataTransfer.setData("text/plain", d.label);
    e.dataTransfer.effectAllowed = "copy";
    onPickField(ref);
  };

  const onDragStartMeasure = (m: (typeof dataset.measures)[0]) => (e: React.DragEvent) => {
    const ref: FieldRef = { kind: "measure", key: m.key, label: m.label, semantic: "number" };
    e.dataTransfer.setData(BI_FIELD_MIME, serializeFieldRef(ref));
    e.dataTransfer.setData("text/plain", m.label);
    e.dataTransfer.effectAllowed = "copy";
    onPickField(ref);
  };

  return (
    <div className="relative flex min-h-0 min-w-0 flex-1 flex-col">
      <DatasetPaneHeader
        dataset={dataset}
        allDatasets={allDatasets}
        usedTemplateIds={usedDatasetTemplateIds}
        onSelectDataset={onSelectDataPanelDataset}
      />
      <div className="flex shrink-0 items-center gap-2 border-b border-black/[0.06] px-2 py-1.5 text-figma-sub">
        <button type="button" className="rounded p-1 hover:bg-black/[0.04]">
          🔍
        </button>
        <button type="button" className="rounded p-1 hover:bg-black/[0.04]">
          ↻
        </button>
        <button type="button" className="rounded p-1 hover:bg-black/[0.04]">
          ⛁
        </button>
        <button type="button" className="rounded p-1 hover:bg-black/[0.04]">
          ＋
        </button>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto px-3 py-2 text-xs">
        <div className="mb-2 text-[11px] font-medium text-figma-sub">维度</div>
        <div className="mb-3 space-y-1">
          {dataset.dimensions.map((d) => {
            const ref: FieldRef = { kind: "dimension", key: d.key, label: d.label, semantic: d.semantic };
            const picked = pickedField?.kind === "dimension" && pickedField.key === d.key;
            return (
              <div
                key={d.key}
                role="button"
                tabIndex={0}
                draggable
                onDragStart={onDragStartDimension(d)}
                onDragEnd={onClearPickedField}
                onClick={() => onTogglePickField(ref)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onTogglePickField(ref);
                  }
                }}
                className={`flex cursor-grab items-center gap-2 rounded px-1 py-1 hover:bg-black/[0.03] active:cursor-grabbing ${
                  picked ? "bg-primary/10 ring-1 ring-primary/35" : ""
                }`}
              >
                <DimensionIconBySemantic semantic={d.semantic} />
                <span className="select-none text-figma-text">{d.label}</span>
              </div>
            );
          })}
        </div>
        <div className="mb-2 text-[11px] font-medium text-figma-sub">度量</div>
        <div className="space-y-1">
          {dataset.measures.map((m) => {
            const ref: FieldRef = { kind: "measure", key: m.key, label: m.label, semantic: "number" };
            const picked = pickedField?.kind === "measure" && pickedField.key === m.key;
            return (
              <div
                key={m.key}
                role="button"
                tabIndex={0}
                draggable
                onDragStart={onDragStartMeasure(m)}
                onDragEnd={onClearPickedField}
                onClick={() => {
                  onPrimaryMeasure(m.key);
                  onTogglePickField(ref);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onPrimaryMeasure(m.key);
                    onTogglePickField(ref);
                  }
                }}
                className={`flex w-full cursor-grab items-center gap-2 rounded px-1 py-1 text-left hover:bg-black/[0.03] active:cursor-grabbing ${
                  primaryMeasure === m.key ? "bg-blue-50/80" : ""
                } ${picked ? "ring-1 ring-primary/40 ring-offset-1" : ""}`}
              >
                <Measure123Icon />
                <span className="flex-1 select-none text-figma-text">{m.label}</span>
              </div>
            );
          })}
        </div>
        {pickedField && selected ? (
          <div className="mt-3 rounded-md border border-primary/25 bg-primary/[0.06] px-2 py-2 text-[10px] leading-snug text-primary">
            <span className="font-medium">「{pickedField.label}」</span>
            ：左侧字段区中高亮槽位可放置；再次点击同一字段可取消选择。
            <button type="button" className="ml-1 font-medium underline decoration-primary/60 hover:text-primary" onClick={onClearPickedField}>
              取消
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export function ReplicaRightPanel(props: ReplicaRightPanelProps) {
  const [pickedField, setPickedField] = useState<FieldRef | null>(null);

  useEffect(() => {
    setPickedField(null);
  }, [props.selected?.id]);

  const togglePickField = useCallback((f: FieldRef) => {
    setPickedField((p) => (p && fieldRefKey(p) === fieldRefKey(f) ? null : f));
  }, []);

  const pickField = useCallback((f: FieldRef) => {
    setPickedField(f);
  }, []);

  const clearPickedField = useCallback(() => setPickedField(null), []);

  return (
    <aside
      className="flex h-full min-h-0 w-[421px] shrink-0 flex-col border-l border-figma-line bg-white"
      data-figma-node="2:5258"
    >
      <div className="flex min-h-0 min-w-0 flex-1">
        <ChartConfigColumn
          tab={props.tab}
          onTab={props.onTab}
          selected={props.selected}
          uiMode={props.uiMode}
          slotBindings={props.slotBindings}
          pickedField={pickedField}
          onConsumePickedField={clearPickedField}
          onAssignSlot={props.onAssignSlot}
          onClearSlot={props.onClearSlot}
          onRemoveSlotField={props.onRemoveSlotField}
          filterFields={props.filterFields}
          onAddFilterField={props.onAddFilterField}
          onRemoveFilterField={props.onRemoveFilterField}
          onClearFilterFields={props.onClearFilterFields}
          onDataUpdate={props.onDataUpdate}
          onApplyLibraryChart={props.onApplyLibraryChart}
          autoUpdate={props.autoUpdate}
          onAutoUpdateChange={props.onAutoUpdateChange}
        />
        <DataPaneColumn
          selected={props.selected}
          primaryMeasure={props.primaryMeasure}
          onPrimaryMeasure={props.onPrimaryMeasure}
          dataset={props.dataset}
          allDatasets={props.allDatasets}
          usedDatasetTemplateIds={props.usedDatasetTemplateIds}
          onSelectDataPanelDataset={props.onSelectDataPanelDataset}
          pickedField={pickedField}
          onTogglePickField={togglePickField}
          onPickField={pickField}
          onClearPickedField={clearPickedField}
        />
      </div>
    </aside>
  );
}
