import { useCallback, useMemo, useState } from "react";
import type { CanvasWidget, MeasureKey } from "../model/dashboardModel";
import { BI_FIELD_MIME, parseFieldRef, serializeFieldRef, type FieldRef } from "../model/fieldRef";
import type { TemplateDatasetDef } from "../model/templateDatasets";
import { getFieldSlotsForWidget, slotAcceptsField, type FieldSlotDef } from "./chartFieldSlots";
import { chartKindDisplayName, getChartConfigKind, type ChartConfigKind } from "./chartConfig";
import { DimensionIconBySemantic, DimensionStringIcon, Measure123Icon } from "./FieldTypeIcon";
import type { LeftLibraryItem } from "./leftLibraryCatalog";
import {
  AnalysisTabPanel,
  ChartSwitchDropdown,
  DatasetSwitchPopover,
  StyleTabPanel,
} from "./rightPanelMenus";

export type RightEditorTab = "fields" | "style" | "analysis";

export type FieldSlotBindings = Record<string, FieldRef>;

export type ReplicaRightPanelProps = {
  tab: RightEditorTab;
  onTab: (t: RightEditorTab) => void;
  selected: CanvasWidget | null;
  dataset: TemplateDatasetDef;
  primaryMeasure: MeasureKey;
  onPrimaryMeasure: (k: MeasureKey) => void;
  /** 当前选中图表的字段槽绑定 */
  slotBindings: FieldSlotBindings;
  onAssignSlot: (slotId: string, field: FieldRef) => void;
  onClearSlot: (slotId: string) => void;
  onDataUpdate?: () => void;
  allDatasets: TemplateDatasetDef[];
  activeDatasetTemplateId: string;
  onSelectDataPanelDataset: (templateId: string) => void;
  onApplyLibraryChart: (item: LeftLibraryItem) => void;
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
  bound,
  dragOver,
  onDragOver,
  onDragLeave,
  onDrop,
  onClear,
}: {
  slot: FieldSlotDef;
  bound?: FieldRef;
  dragOver: boolean;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  onClear: () => void;
}) {
  return (
    <section>
      <div className="mb-2 font-medium text-figma-text">{slot.title}</div>
      <div
        className={`relative rounded border border-dashed border-figma-line bg-canvas/80 px-2 py-3 text-[11px] transition ${
          dragOver ? "border-primary bg-blue-50/40 ring-1 ring-primary/25" : ""
        }`}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
      >
        {bound ? <FieldBoundPill field={bound} onClear={onClear} /> : (
          <div className="text-center text-figma-sub">从数据面板拖入字段</div>
        )}
      </div>
    </section>
  );
}

function FieldsWithSlots({
  chartKind,
  replicaLayout,
  slotBindings,
  onAssignSlot,
  onClearSlot,
}: {
  chartKind: ChartConfigKind;
  replicaLayout?: string;
  slotBindings: FieldSlotBindings;
  onAssignSlot: (slotId: string, field: FieldRef) => void;
  onClearSlot: (slotId: string) => void;
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
      onAssignSlot(slot.id, field);
    },
    [onAssignSlot],
  );

  return (
    <div className="space-y-4">
      {slots.map((slot) => (
        <FieldWellSlot
          key={slot.id}
          slot={slot}
          bound={slotBindings[slot.id]}
          dragOver={dragSlotId === slot.id}
          onDragOver={(e) => handleDragOver(slot, e)}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(slot, e)}
          onClear={() => onClearSlot(slot.id)}
        />
      ))}
    </div>
  );
}

function ChartConfigColumn({
  tab,
  onTab,
  selected,
  primaryMeasure,
  dataset,
  slotBindings,
  onAssignSlot,
  onClearSlot,
  onDataUpdate,
  onApplyLibraryChart,
}: Pick<
  ReplicaRightPanelProps,
  | "tab"
  | "onTab"
  | "selected"
  | "primaryMeasure"
  | "dataset"
  | "slotBindings"
  | "onAssignSlot"
  | "onClearSlot"
  | "onDataUpdate"
  | "onApplyLibraryChart"
>) {
  const [autoUpdate, setAutoUpdate] = useState(true);
  const mLabel = dataset.measures.find((m) => m.key === primaryMeasure)?.label ?? "";
  const kind = getChartConfigKind(selected);
  const chartLabel = chartKindDisplayName(kind);

  return (
    <div className="flex min-h-0 min-w-0 flex-[1.15] flex-col border-r border-black/[0.06]">
      <div className="flex shrink-0 items-center justify-between border-b border-black/[0.06] px-3 py-2">
        <span className="truncate text-xs font-semibold text-figma-text">{selected?.title ?? "未选择图表"}</span>
        <button type="button" className="shrink-0 text-figma-sub hover:text-figma-text">
          ⚙
        </button>
      </div>
      <ChartSwitchDropdown
        displayLabel={selected?.libraryLabel ?? chartLabel}
        selected={selected}
        onPick={onApplyLibraryChart}
      />
      <div className="flex shrink-0 border-b border-black/[0.06]">
        {(["fields", "style", "analysis"] as const).map((k) => (
          <button
            key={k}
            type="button"
            onClick={() => onTab(k)}
            className={`flex-1 py-2 text-center text-xs ${
              tab === k ? "border-b-2 border-primary font-medium text-primary" : "text-figma-sub hover:text-figma-text"
            }`}
          >
            {k === "fields" ? "字段" : k === "style" ? "样式" : "分析"}
          </button>
        ))}
      </div>
      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <div className="min-h-0 flex-1 overflow-y-auto px-3 py-2 text-xs">
          {tab === "fields" && (
            <div className="space-y-4">
              <section>
                <div className="mb-2 font-medium text-figma-text">进度指示 / 度量</div>
                <div className="inline-flex rounded-full bg-measure px-2.5 py-1 text-[11px] font-medium text-white">
                  {mLabel}(求和)
                </div>
              </section>
              {selected ? (
                <FieldsWithSlots
                  chartKind={kind}
                  replicaLayout={selected.replicaLayout}
                  slotBindings={slotBindings}
                  onAssignSlot={onAssignSlot}
                  onClearSlot={onClearSlot}
                />
              ) : (
                <p className="text-figma-sub">请先在画布中选择图表</p>
              )}
              <section>
                <div className="mb-2 font-medium text-figma-text">过滤器</div>
                <div className="rounded border border-dashed border-figma-line bg-canvas/80 px-2 py-6 text-center text-[11px] text-figma-sub">
                  拖拽或选择字段至此处
                </div>
              </section>
              <label className="flex cursor-pointer items-center gap-2 text-figma-text">
                <input type="checkbox" checked={autoUpdate} onChange={(e) => setAutoUpdate(e.target.checked)} className="rounded border-figma-line" />
                自动更新
              </label>
            </div>
          )}
          {tab === "style" && <StyleTabPanel />}
          {tab === "analysis" && <AnalysisTabPanel />}
        </div>
        <div className="shrink-0 border-t border-black/[0.06] p-2">
          <button
            type="button"
            onClick={() => onDataUpdate?.()}
            className="w-full rounded bg-primary py-2.5 text-xs font-medium text-white hover:opacity-95"
          >
            更新
          </button>
        </div>
      </div>
    </div>
  );
}

function DataPaneColumn({
  primaryMeasure,
  onPrimaryMeasure,
  dataset,
  allDatasets,
  activeDatasetTemplateId,
  onSelectDataPanelDataset,
}: {
  primaryMeasure: MeasureKey;
  onPrimaryMeasure: (k: MeasureKey) => void;
  dataset: TemplateDatasetDef;
  allDatasets: TemplateDatasetDef[];
  activeDatasetTemplateId: string;
  onSelectDataPanelDataset: (templateId: string) => void;
}) {
  const onDragStartDimension = (d: (typeof dataset.dimensions)[0]) => (e: React.DragEvent) => {
    const ref: FieldRef = { kind: "dimension", key: d.key, label: d.label, semantic: d.semantic };
    e.dataTransfer.setData(BI_FIELD_MIME, serializeFieldRef(ref));
    e.dataTransfer.setData("text/plain", d.label);
    e.dataTransfer.effectAllowed = "copy";
  };

  const onDragStartMeasure = (m: (typeof dataset.measures)[0]) => (e: React.DragEvent) => {
    const ref: FieldRef = { kind: "measure", key: m.key, label: m.label, semantic: "number" };
    e.dataTransfer.setData(BI_FIELD_MIME, serializeFieldRef(ref));
    e.dataTransfer.setData("text/plain", m.label);
    e.dataTransfer.effectAllowed = "copy";
  };

  return (
    <div className="relative flex min-h-0 min-w-0 flex-1 flex-col">
      <DatasetSwitchPopover
        dataset={dataset}
        allDatasets={allDatasets}
        activeTemplateId={activeDatasetTemplateId}
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
          {dataset.dimensions.map((d) => (
            <div
              key={d.key}
              role="button"
              tabIndex={0}
              draggable
              onDragStart={onDragStartDimension(d)}
              className="flex cursor-grab items-center gap-2 rounded px-1 py-1 hover:bg-black/[0.03] active:cursor-grabbing"
            >
              <DimensionIconBySemantic semantic={d.semantic} />
              <span className="select-none text-figma-text">{d.label}</span>
            </div>
          ))}
        </div>
        <div className="mb-2 text-[11px] font-medium text-figma-sub">度量</div>
        <div className="space-y-1">
          {dataset.measures.map((m) => (
            <div
              key={m.key}
              role="button"
              tabIndex={0}
              draggable
              onDragStart={onDragStartMeasure(m)}
              onClick={() => onPrimaryMeasure(m.key)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") onPrimaryMeasure(m.key);
              }}
              className={`flex w-full cursor-grab items-center gap-2 rounded px-1 py-1 text-left hover:bg-black/[0.03] active:cursor-grabbing ${
                primaryMeasure === m.key ? "bg-blue-50/80" : ""
              }`}
            >
              <Measure123Icon />
              <span className="flex-1 select-none text-figma-text">{m.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function ReplicaRightPanel(props: ReplicaRightPanelProps) {
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
          primaryMeasure={props.primaryMeasure}
          dataset={props.dataset}
          slotBindings={props.slotBindings}
          onAssignSlot={props.onAssignSlot}
          onClearSlot={props.onClearSlot}
          onDataUpdate={props.onDataUpdate}
          onApplyLibraryChart={props.onApplyLibraryChart}
        />
        <DataPaneColumn
          primaryMeasure={props.primaryMeasure}
          onPrimaryMeasure={props.onPrimaryMeasure}
          dataset={props.dataset}
          allDatasets={props.allDatasets}
          activeDatasetTemplateId={props.activeDatasetTemplateId}
          onSelectDataPanelDataset={props.onSelectDataPanelDataset}
        />
      </div>
    </aside>
  );
}
